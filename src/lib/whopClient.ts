import { WhopClient } from '@whop/sdk'

let client: WhopClient | null = null

/**
 * Server-side Whop client. The real Authorization header (the app's own
 * company key) is attached at the network edge on the way out — the token
 * passed here is never actually sent.
 */
export function serverWhop(): WhopClient {
  if (!client) {
    client = new WhopClient({
      token: process.env.WHOP_API_KEY ?? '',
      baseUrl: `${process.env.WHOP_API_ORIGIN ?? 'https://api.whop.com'}/api/v1`,
    })
  }
  return client
}
