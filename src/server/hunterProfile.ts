import { createServerFn } from '@tanstack/react-start'

import { ASCENDING_PRODUCT_ID, STARTER_PRODUCT_ID } from '../lib/membership'
import { computeOverallRank, type OverallRank } from '../lib/pathData'
import { companyAccessLevel, currentUser, hasActiveProductAccess } from '../lib/session'
import { getProgress } from './progress'

const COMPANY_ID = 'biz_jdcD3rL9FLYsxy'

export type HunterProfile =
  | { signedIn: false }
  | ({ signedIn: true; name: string; hasAscending: boolean; pathHref: string | null } & OverallRank)

/**
 * Where this visitor's actual curriculum lives, or null if they hold no
 * membership and aren't an admin previewing their own gated content.
 * Ascending members (and admins, who see the superset for review) land on
 * the full 120-module path; Starter-only members land on their 110.
 */
async function resolvePathHref(userId: string, hasAscending: boolean, hasStarter: boolean) {
  if (hasAscending) return '/path/ascending'
  if (hasStarter) return '/path/starter'
  const isAdmin = (await companyAccessLevel(userId, COMPANY_ID)) === 'admin'
  return isAdmin ? '/path/ascending' : null
}

/**
 * Rank is earned only by actually completing modules (see computeOverallRank)
 * — there is no click-to-earn XP action anywhere in this system.
 */
export const getHunterProfile = createServerFn({ method: 'GET' }).handler(async (): Promise<HunterProfile> => {
  const user = await currentUser()
  if (!user) return { signedIn: false }

  const [hasAscending, hasStarter, progress] = await Promise.all([
    hasActiveProductAccess(user.sub, ASCENDING_PRODUCT_ID),
    hasActiveProductAccess(user.sub, STARTER_PRODUCT_ID),
    getProgress(),
  ])

  const completed = new Set(progress.signedIn ? progress.completed : [])
  const pathHref = await resolvePathHref(user.sub, hasAscending, hasStarter)

  return {
    signedIn: true,
    name: user.preferred_username ?? user.name ?? 'Hunter',
    hasAscending,
    pathHref,
    ...computeOverallRank(completed, hasAscending),
  }
})
