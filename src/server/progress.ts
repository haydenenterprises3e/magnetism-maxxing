import { createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie } from '@tanstack/react-start/server'

import { ASCENDING_PRODUCT_ID, findPaidMembership } from '../lib/membership'
import { currentUser, hasActiveProductAccess } from '../lib/session'
import { serverWhop } from '../lib/whopClient'

const DONE_COOKIE = 'hp_done'
const DONE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

/** `${trackSlug}__${lessonSlug}` keys the caller has marked complete. */
async function readCompletedKeys(userId: string) {
  const membership = await findPaidMembership(userId)
  if (membership) {
    const raw = membership.metadata?.completed_lessons
    const keys = new Set(Array.isArray(raw) ? (raw as unknown[]).map(String) : [])
    return { keys, membershipId: membership.id as string | null, metadata: membership.metadata ?? {} }
  }
  const raw = getCookie(DONE_COOKIE) ?? ''
  const keys = new Set(raw.split(',').filter(Boolean))
  return { keys, membershipId: null as string | null, metadata: {} as Record<string, unknown> }
}

export type ProgressState =
  | { signedIn: false }
  | { signedIn: true; hasAscending: boolean; completed: string[] }

export const getProgress = createServerFn({ method: 'GET' }).handler(async (): Promise<ProgressState> => {
  const user = await currentUser()
  if (!user) return { signedIn: false }

  const hasAscending = await hasActiveProductAccess(user.sub, ASCENDING_PRODUCT_ID)
  const { keys } = await readCompletedKeys(user.sub)
  return { signedIn: true, hasAscending, completed: [...keys] }
})

export const markLessonComplete = createServerFn({ method: 'POST' })
  .validator((input: { key: string }) => input)
  .handler(async ({ data }): Promise<ProgressState> => {
    const user = await currentUser()
    if (!user) return { signedIn: false }

    const hasAscending = await hasActiveProductAccess(user.sub, ASCENDING_PRODUCT_ID)
    const { keys, membershipId, metadata } = await readCompletedKeys(user.sub)
    keys.add(data.key)
    const completed = [...keys]

    if (membershipId) {
      const client = serverWhop()
      await client.memberships.update({ id: membershipId, metadata: { ...metadata, completed_lessons: completed } })
    } else {
      setCookie(DONE_COOKIE, completed.join(','), {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: DONE_COOKIE_MAX_AGE,
      })
    }

    return { signedIn: true, hasAscending, completed }
  })
