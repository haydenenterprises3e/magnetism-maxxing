import { createServerFn } from '@tanstack/react-start'
import { env } from 'cloudflare:workers'

import { companyAccessLevel, currentUser, requireAnyPurchase } from '../lib/session'

const COMPANY_ID = 'biz_jdcD3rL9FLYsxy'

const KV_NAMESPACE_ID = '964c724c36d84bd083d681f7a8d3fc4d'

function cfCreds() {
  const e = env as unknown as { CF_API_TOKEN?: string; CF_ACCOUNT_ID?: string }
  const token = e.CF_API_TOKEN ?? process.env.CF_API_TOKEN
  const accountId = e.CF_ACCOUNT_ID ?? process.env.CF_ACCOUNT_ID
  if (!token || !accountId) throw new Error('Missing CF_API_TOKEN or CF_ACCOUNT_ID')
  return { token, accountId }
}

function kvBaseUrl(accountId: string) {
  return `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${KV_NAMESPACE_ID}`
}

/**
 * Retries a request on HTTP 429 (Cloudflare API rate limit: 1,200 requests
 * per 5 minutes per token) with exponential backoff, so a brief burst gets
 * smoothed out instead of failing outright.
 */
async function fetchWithRetry(url: string, init: RequestInit, retries = 2): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, init)
    if (res.status !== 429 || attempt >= retries) return res
    const waitMs = 300 * 2 ** attempt
    await new Promise((resolve) => setTimeout(resolve, waitMs))
  }
}

/**
 * Minimal shape of the Workers runtime edge cache (`caches.default`).
 * Defined locally so this compiles regardless of which ambient Cache types
 * are configured, and read defensively in case it's ever unavailable.
 */
type MinimalCache = {
  match: (request: Request) => Promise<Response | undefined>
  put: (request: Request, response: Response) => Promise<void>
}

function edgeCache(): MinimalCache | undefined {
  return (globalThis as unknown as { caches?: { default?: MinimalCache } }).caches?.default
}

const CACHE_TTL_SECONDS = 5

/**
 * Wraps a read in a short-lived edge cache. This is the main defense against
 * the Cloudflare API rate limit: without it, every page view re-hits the
 * REST API for every public feed. A few seconds of staleness is an
 * acceptable trade-off for not falling over under real traffic.
 */
async function cachedRead<T>(cacheName: string, compute: () => Promise<T>): Promise<T> {
  const cache = edgeCache()
  const request = new Request(`https://community-kv-cache.internal/${cacheName}`)
  if (cache) {
    try {
      const hit = await cache.match(request)
      if (hit) return (await hit.json()) as T
    } catch {
      // Cache API isn't supported in this hosting environment (e.g. Whop's
      // dynamically-loaded workers). Fall through to computing uncached.
    }
  }
  const value = await compute()
  if (cache) {
    try {
      const response = new Response(JSON.stringify(value), {
        headers: { 'Cache-Control': `max-age=${CACHE_TTL_SECONDS}`, 'Content-Type': 'application/json' },
      })
      await cache.put(request, response)
    } catch {
      // Same as above — caching is best-effort only.
    }
  }
  return value
}

type KVNamespace = {
  get: (key: string) => Promise<string | null>
  getMany: (keys: string[]) => Promise<Record<string, string | null>>
  put: (key: string, value: string) => Promise<void>
  delete: (key: string) => Promise<void>
  list: (opts?: { prefix?: string }) => Promise<{ keys: { name: string }[] }>
}

function kv(): KVNamespace {
  return {
    async get(key: string) {
      const { token, accountId } = cfCreds()
      const res = await fetchWithRetry(`${kvBaseUrl(accountId)}/values/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 404) return null
      if (!res.ok) throw new Error(`KV get failed (${res.status})`)
      return await res.text()
    },
    async getMany(keys: string[]) {
      if (keys.length === 0) return {}
      const { token, accountId } = cfCreds()
      const result: Record<string, string | null> = {}
      // The bulk endpoint accepts at most 100 keys, and counts as ONE
      // request against the rate limit regardless of how many keys.
      for (let i = 0; i < keys.length; i += 100) {
        const chunk = keys.slice(i, i + 100)
        const res = await fetchWithRetry(`${kvBaseUrl(accountId)}/bulk/get`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ keys: chunk, type: 'text' }),
        })
        if (!res.ok) throw new Error(`KV bulk get failed (${res.status})`)
        const json = (await res.json()) as { result: { values: Record<string, string | null> } }
        Object.assign(result, json.result.values)
      }
      return result
    },
    async put(key: string, value: string) {
      const { token, accountId } = cfCreds()
      const res = await fetchWithRetry(`${kvBaseUrl(accountId)}/values/${encodeURIComponent(key)}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'text/plain' },
        body: value,
      })
      if (!res.ok) throw new Error(`KV put failed (${res.status})`)
    },
    async delete(key: string) {
      const { token, accountId } = cfCreds()
      const res = await fetchWithRetry(`${kvBaseUrl(accountId)}/values/${encodeURIComponent(key)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error(`KV delete failed (${res.status})`)
    },
    async list(opts?: { prefix?: string }) {
      const { token, accountId } = cfCreds()
      const url = new URL(`${kvBaseUrl(accountId)}/keys`)
      if (opts?.prefix) url.searchParams.set('prefix', opts.prefix)
      const res = await fetchWithRetry(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error(`KV list failed (${res.status})`)
      const json = (await res.json()) as { result: { name: string }[] }
      return { keys: json.result }
    },
  }
}

/**
 * Fetches every key under a prefix and parses its JSON value using ONE list
 * call plus ONE batched bulk-get call, instead of one GET per key. This is
 * the fix for the N+1 pattern that was driving up REST API call volume.
 */
async function listParsed<T>(prefix: string): Promise<T[]> {
  const { keys } = await kv().list({ prefix })
  const values = await kv().getMany(keys.map((k) => k.name))
  const items: T[] = []
  for (const key of keys) {
    const raw = values[key.name]
    if (raw) items.push(JSON.parse(raw))
  }
  return items
}

/**
 * Very basic per-user submission throttle so one member can't spam a public
 * endpoint. Resets on cold start and is per-isolate, not global — this is
 * deliberately simple first-line abuse protection, not a hardened limiter.
 */
const recentSubmissions = new Map<string, number[]>()

function enforceRateLimit(userId: string, maxPerWindow = 5, windowMs = 60_000) {
  const now = Date.now()
  const recent = (recentSubmissions.get(userId) ?? []).filter((t) => now - t < windowMs)
  if (recent.length >= maxPerWindow) {
    throw new Error('Too many submissions — please wait a minute and try again.')
  }
  recent.push(now)
  recentSubmissions.set(userId, recent)
}

const COMMUNITY_PRODUCT_ID = 'prod_JYWg9jHMiYBQE'

/** True for Ascending buyers and company admins; false for everyone else. */
async function hasCommunityAccess(): Promise<boolean> {
  const user = await currentUser()
  if (!user) return false
  if ((await companyAccessLevel(user.sub, COMPANY_ID)) === 'admin') return true
  const guard = await requireAnyPurchase([COMMUNITY_PRODUCT_ID], COMPANY_ID)
  return guard.ok
}

async function requireAdmin() {
  const user = await currentUser()
  if (!user) throw new Error('Not signed in')
  const level = await companyAccessLevel(user.sub, COMPANY_ID)
  if (level !== 'admin') throw new Error('Not authorized')
  return user
}

export type DirectMessage = {
  id: string
  userId: string
  userName: string
  message: string
  createdAt: number
}

export type GroupMessage = {
  id: string
  userId: string
  userName: string
  message: string
  createdAt: number
  status: 'pending' | 'approved'
}

export type Announcement = {
  id: string
  message: string
  link?: string
  createdAt: number
}

export type TrialSubmission = {
  id: string
  userId: string
  userName: string
  videoLink: string
  note: string
  createdAt: number
}

/** Any signed-in Ascending member can send a direct message to the team. */
export const sendDirectMessage = createServerFn({ method: 'POST' })
  .validator((input: { message: string }) => input)
  .handler(async ({ data }) => {
    const user = await currentUser()
    if (!user) throw new Error('Not signed in')
    if (!(await hasCommunityAccess())) throw new Error('Not authorized')
    enforceRateLimit(user.sub)

    const id = crypto.randomUUID()
    const entry: DirectMessage = {
      id,
      userId: user.sub,
      userName: user.name ?? user.preferred_username ?? 'Member',
      message: data.message.slice(0, 2000),
      createdAt: Date.now(),
    }
    await kv().put(`dm:${entry.createdAt}:${id}`, JSON.stringify(entry))
    return { ok: true }
  })

/** Admin-only: every direct message ever sent, newest first. */
export const listDirectMessages = createServerFn({ method: 'GET' }).handler(async () => {
  await requireAdmin()
  const messages = await listParsed<DirectMessage>('dm:')
  return messages.sort((a, b) => b.createdAt - a.createdAt)
})

/** Admin-only: permanently delete a direct message once read/handled. */
export const deleteDirectMessage = createServerFn({ method: 'POST' })
  .validator((input: { key: string }) => input)
  .handler(async ({ data }) => {
    await requireAdmin()
    await kv().delete(data.key)
    return { ok: true }
  })

/** Any signed-in Ascending member can submit a group-discussion message — it starts pending. */
export const submitGroupMessage = createServerFn({ method: 'POST' })
  .validator((input: { message: string }) => input)
  .handler(async ({ data }) => {
    const user = await currentUser()
    if (!user) throw new Error('Not signed in')
    if (!(await hasCommunityAccess())) throw new Error('Not authorized')
    enforceRateLimit(user.sub)

    const id = crypto.randomUUID()
    const entry: GroupMessage = {
      id,
      userId: user.sub,
      userName: user.name ?? user.preferred_username ?? 'Member',
      message: data.message.slice(0, 2000),
      createdAt: Date.now(),
      status: 'pending',
    }
    await kv().put(`pending:${entry.createdAt}:${id}`, JSON.stringify(entry))
    return { ok: true }
  })

/** Admin-only: every message awaiting approval, oldest first. */
export const listPendingMessages = createServerFn({ method: 'GET' }).handler(async () => {
  await requireAdmin()
  const messages = await listParsed<GroupMessage>('pending:')
  return messages.sort((a, b) => a.createdAt - b.createdAt)
})

/** Admin-only: approve a pending message — moves it into the public approved list. */
export const approveGroupMessage = createServerFn({ method: 'POST' })
  .validator((input: { key: string }) => input)
  .handler(async ({ data }) => {
    await requireAdmin()
    const raw = await kv().get(data.key)
    if (!raw) return { ok: false }
    const entry: GroupMessage = { ...JSON.parse(raw), status: 'approved' }
    await kv().put(`approved:${entry.createdAt}:${entry.id}`, JSON.stringify(entry))
    await kv().delete(data.key)
    return { ok: true }
  })

/** Admin-only: reject and permanently delete a pending message. */
export const rejectGroupMessage = createServerFn({ method: 'POST' })
  .validator((input: { key: string }) => input)
  .handler(async ({ data }) => {
    await requireAdmin()
    await kv().delete(data.key)
    return { ok: true }
  })

/** Admin-only: post a message (e.g. a rewritten DM) directly into the live group feed. */
export const postAdminMessage = createServerFn({ method: 'POST' })
  .validator((input: { message: string }) => input)
  .handler(async ({ data }) => {
    const admin = await requireAdmin()
    const id = crypto.randomUUID()
    const entry: GroupMessage = {
      id,
      userId: admin.sub,
      userName: 'Team',
      message: data.message.slice(0, 2000),
      createdAt: Date.now(),
      status: 'approved',
    }
    await kv().put(`approved:${entry.createdAt}:${id}`, JSON.stringify(entry))
    return { ok: true }
  })

/** Everyone with access to the Community page can see approved messages. */
export const listApprovedMessages = createServerFn({ method: 'GET' }).handler(async () => {
  const user = await currentUser()
  if (!user) return []
  if (!(await hasCommunityAccess())) return []
  const messages = await cachedRead('approved-messages', () => listParsed<GroupMessage>('approved:'))
  return messages.sort((a, b) => b.createdAt - a.createdAt)
})

/** Admin-only: post a new announcement to the public Announcements feed. */
export const postAnnouncement = createServerFn({ method: 'POST' })
  .validator((input: { message: string; link?: string }) => input)
  .handler(async ({ data }) => {
    await requireAdmin()
    const id = crypto.randomUUID()
    const entry: Announcement = {
      id,
      message: data.message.slice(0, 2000),
      link: data.link?.trim() ? data.link.trim().slice(0, 500) : undefined,
      createdAt: Date.now(),
    }
    await kv().put(`announcement:${entry.createdAt}:${id}`, JSON.stringify(entry))
    return { ok: true }
  })

/** Everyone with access to the Community page can see announcements. */
export const listAnnouncements = createServerFn({ method: 'GET' }).handler(async () => {
  const user = await currentUser()
  if (!user) return []
  if (!(await hasCommunityAccess())) return []
  const messages = await cachedRead('announcements', () => listParsed<Announcement>('announcement:'))
  return messages.sort((a, b) => b.createdAt - a.createdAt)
})

/** Any signed-in Ascending member can submit a Trial: an unlisted video link + note for admin review. */
export const submitTrial = createServerFn({ method: 'POST' })
  .validator((input: { videoLink: string; note: string }) => input)
  .handler(async ({ data }) => {
    const user = await currentUser()
    if (!user) throw new Error('Not signed in')
    if (!(await hasCommunityAccess())) throw new Error('Not authorized')
    enforceRateLimit(user.sub)

    const id = crypto.randomUUID()
    const entry: TrialSubmission = {
      id,
      userId: user.sub,
      userName: user.name ?? user.preferred_username ?? 'Member',
      videoLink: data.videoLink.trim().slice(0, 500),
      note: data.note.slice(0, 2000),
      createdAt: Date.now(),
    }
    await kv().put(`trial:${entry.createdAt}:${id}`, JSON.stringify(entry))
    return { ok: true }
  })

/** Admin-only: permanently delete a Trial submission once reviewed. */
export const deleteTrial = createServerFn({ method: 'POST' })
  .validator((input: { key: string }) => input)
  .handler(async ({ data }) => {
    await requireAdmin()
    await kv().delete(data.key)
    return { ok: true }
  })

/** Admin-only: every Trial submission ever sent, newest first. */
export const listTrials = createServerFn({ method: 'GET' }).handler(async () => {
  await requireAdmin()
  const submissions = await listParsed<TrialSubmission>('trial:')
  return submissions.sort((a, b) => b.createdAt - a.createdAt)
})


