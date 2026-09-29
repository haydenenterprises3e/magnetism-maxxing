import { createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie } from '@tanstack/react-start/server'

import { ASCENDING_PRODUCT_ID, findPaidMembership } from '../lib/membership'
import { currentUser, hasActiveProductAccess } from '../lib/session'
import { serverWhop } from '../lib/whopClient'
import { lessonVersion } from '../lib/lessonVersions'

const DONE_COOKIE = 'hp_done'
const DONE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

/** `${trackSlug}__${lessonSlug}` keys the caller has marked complete. */
async function readCompletedKeys(userId: string) {
  const membership = await findPaidMembership(userId).catch((e: any) => { console.error('LOOKUP_FAIL', e?.status, e?.message); return null })
  if (membership) {
    const raw = membership.metadata?.completed_lessons
    const keys = new Set(Array.isArray(raw) ? (raw as unknown[]).map(String) : [])
    for (const k of (getCookie(DONE_COOKIE) ?? '').split(',').filter(Boolean)) keys.add(k)
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
  .validator((input: { key: string }) => {
    if (typeof input?.key !== 'string' || !/^[a-z0-9-]+(__[a-z0-9-]+){1,2}$/.test(input.key) || input.key.length > 120) throw new Error('bad key')
    return input
  })
  .handler(async ({ data }): Promise<ProgressState> => {
    const user = await currentUser()
    if (!user) return { signedIn: false }
    const hasAscending = await hasActiveProductAccess(user.sub, ASCENDING_PRODUCT_ID).catch((e: any) => { console.error('FAIL_ACCESS', e?.status, e?.message); throw e })
    const { keys, membershipId, metadata } = await readCompletedKeys(user.sub)
    keys.add(data.key)
    const version = lessonVersion(data.key)
    if (version > 1) keys.add(`${data.key}@v${version}`)
    const completed = [...keys]

    if (membershipId) {
      try {
        await serverWhop().memberships.update({ id: membershipId, metadata: { ...metadata, completed_lessons: completed } })
      } catch (e: any) {
        console.error('PROGRESS_SAVE_FAIL', e?.status, e?.message)
      }
    }
    setCookie(DONE_COOKIE, completed.join(','), {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: DONE_COOKIE_MAX_AGE,
    })

    return { signedIn: true, hasAscending, completed }
  })
