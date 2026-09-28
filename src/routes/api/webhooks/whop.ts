import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import { unwrapWebhook, WebhookVerificationError } from '@whop/sdk/helpers'
import { syncMembershipFromWebhook, type MembershipWebhookData } from '../../../lib/membership'

type WhopWebhookEvent = {
  type: string
  data: unknown
}

function webhookSecret(): string | undefined {
  const e = env as unknown as { WHOP_WEBHOOK_SECRET?: string }
  return e.WHOP_WEBHOOK_SECRET ?? process.env.WHOP_WEBHOOK_SECRET
}

export const Route = createFileRoute('/api/webhooks/whop')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // IMPORTANT: read the raw text, never request.json() — the signature
        // covers the exact bytes Whop sent, and re-serializing breaks verification.
        const rawBody = await request.text()

        const headers: Record<string, string> = {}
        request.headers.forEach((value, key) => {
          headers[key] = value
        })

        let event: WhopWebhookEvent
        try {
          event = unwrapWebhook<WhopWebhookEvent>(rawBody, {
            headers,
            key: webhookSecret(),
          })
        } catch (err) {
          if (err instanceof WebhookVerificationError) {
            console.error('[webhook] signature verification failed', err instanceof Error ? err.message : err)
            return new Response('Invalid signature', { status: 400 })
          }
          console.error('[webhook] verification error', err)
          return new Response('Verification error', { status: 400 })
        }

        // Signature is verified past this point — event.data can be trusted
        // as genuinely coming from Whop.
        switch (event.type) {
          case 'payment.succeeded': {
            console.log('[webhook] payment.succeeded', event.data)
            break
          }
          case 'membership.activated': {
            await syncMembershipFromWebhook(event.data as MembershipWebhookData)
            break
          }
          case 'membership.deactivated': {
            await syncMembershipFromWebhook(event.data as MembershipWebhookData)
            break
          }
          default: {
            console.log('[webhook] unhandled event', event.type)
          }
        }

        // Ack quickly so Whop doesn't retry/backoff.
        return new Response('ok', { status: 200 })
      },
    },
  },
})
