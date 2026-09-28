import { getCookie, setCookie } from '@tanstack/react-start/server'

const COOKIE = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  path: '/',
} as const

type Token = {
  access_token: string
  refresh_token: string
  expires_in: number
}

/** The only place either session cookie is written. */
export function writeSession(token: Token) {
  setCookie('wa', token.access_token, { ...COOKIE, maxAge: token.expires_in })
  setCookie('wr', token.refresh_token, { ...COOKIE, maxAge: 60 * 60 * 24 * 30 })
}

/** Same attributes as the write, so the browser matches and drops them. */
export function clearSession() {
  for (const name of ['wa', 'wr']) setCookie(name, '', { ...COOKIE, maxAge: 0 })
}

export type UserInfo = {
  sub: string
  name?: string
  preferred_username?: string
  picture?: string
  email?: string
  email_verified?: boolean
}

export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getCookie('wr')
  if (!refreshToken) return null

  const response = await fetch(`${process.env.WHOP_API_ORIGIN}/oauth/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.APP_ID!,
        client_secret: process.env.APP_SECRET ?? '',
      refresh_token: refreshToken,
    }),
  })
  if (!response.ok) return null

  const token = (await response.json()) as Token
  writeSession(token)
  return token.access_token
}

async function fetchUserinfo(accessToken: string): Promise<UserInfo | null> {
  const response = await fetch(`${process.env.WHOP_API_ORIGIN}/oauth/userinfo`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      // Keeps the header above: otherwise the platform replaces it and answers
      // for the company rather than this visitor.
      'x-whop-inject-key': 'none',
    },
  })
  if (!response.ok) return null
  return (await response.json()) as UserInfo
}

/** The signed-in visitor, or null. Refreshes once if the token has expired. */
export async function currentUser(): Promise<UserInfo | null> {
  let accessToken = getCookie('wa')
  if (!accessToken) accessToken = (await refreshAccessToken()) ?? undefined
  if (!accessToken) return null

  const profile = await fetchUserinfo(accessToken)
  if (profile) return profile

  const retried = await refreshAccessToken()
  return retried ? await fetchUserinfo(retried) : null
}

async function accessLevel(userId: string, resourceId: string) {
  const response = await fetch(`${process.env.WHOP_API_ORIGIN}/api/v1/users/${userId}/access/${resourceId}`, {
    headers: { Authorization: `Bearer ${process.env.WHOP_API_KEY}` },
  })
  if (!response.ok) {
    const t = await response.text()
    console.error('[access] check failed', response.status, resourceId, t)
    ;(globalThis as any).__accessFail = `${response.status} ${t.slice(0, 150)}`
    return { has_access: false, access_level: 'no_access' as const }
  }
  return (await response.json()) as { has_access: boolean; access_level: string }
}

/** Whether the signed-in visitor holds an active/trialing membership on this product. */
export async function hasActiveProductAccess(userId: string, productId: string) {
  const { has_access } = await accessLevel(userId, productId)
  return has_access
}

/** Whether the signed-in visitor holds access to any of these products. */
export async function hasAnyActiveProductAccess(userId: string, productIds: string[]) {
  for (const productId of productIds) {
    if (await hasActiveProductAccess(userId, productId)) return true
  }
  return false
}

/** Whether the signed-in visitor is a customer or admin of this business. */
export async function companyAccessLevel(userId: string, companyId: string) {
  const { access_level } = await accessLevel(userId, companyId)
  return access_level
}

/**
 * Gate: signed in AND (holding access to at least one of these products, OR
 * an admin of the given business previewing their own gated content).
 */
export async function requireAnyPurchase(productIds: string[], companyId?: string) {
  const user = await currentUser()
  if (!user) return { ok: false, reason: 'signed_out' } as const

  if (await hasAnyActiveProductAccess(user.sub, productIds)) return { ok: true, user } as const

  if (companyId && (await companyAccessLevel(user.sub, companyId)) === 'admin') {
    return { ok: true, user } as const
  }

  return { ok: false, reason: 'no_access', detail: (globalThis as any).__accessFail ?? 'none' } as const
}
