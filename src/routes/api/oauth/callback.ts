import { createFileRoute } from '@tanstack/react-router'
import { getCookie, setCookie } from '@tanstack/react-start/server'

import { writeSession } from '../../../lib/session'

export const Route = createFileRoute('/api/oauth/callback')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const code = url.searchParams.get('code')
        const state = url.searchParams.get('state')
        const verifier = getCookie('oauth_verifier')
        const expectedState = getCookie('oauth_state')
        const returnTo = getCookie('oauth_return') ?? '/'

        for (const name of ['oauth_verifier', 'oauth_state', 'oauth_nonce', 'oauth_return']) {
          setCookie(name, '', { path: '/', maxAge: 0 })
        }

        if (!code || !state || !verifier || state !== expectedState) {
          console.error('[oauth] callback rejected', {
            hasCode: !!code,
            hasState: !!state,
            hasVerifierCookie: !!verifier,
            stateMatches: state === expectedState,
            whopError: url.searchParams.get('error'),
            whopErrorDescription: url.searchParams.get('error_description'),
          })
          return new Response(null, {
            status: 302,
            headers: { Location: '/?error=auth_failed&why=rejected' },
          })
        }

        const response = await fetch(`${process.env.WHOP_API_ORIGIN}/oauth/token`, {
          method: 'POST',
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: process.env.APP_ID!,
        client_secret: process.env.APP_SECRET ?? '',
            code,
            code_verifier: verifier,
            redirect_uri: `${url.origin}/api/oauth/callback`,
          }),
        })

        if (!response.ok) {
          const errText = await response.text()
          console.error('[oauth] token exchange failed', response.status, errText)
          return new Response(null, {
            status: 302,
            headers: { Location: `/?error=auth_failed&why=token_${response.status}&detail=${encodeURIComponent(errText.slice(0, 200))}` },
          })
        }

        const token = (await response.json()) as {
          access_token: string
          refresh_token: string
          expires_in: number
        }

        writeSession(token)

        return new Response(null, { status: 302, headers: { Location: returnTo } })
      },
    },
  },
})
