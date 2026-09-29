import { createServerFn } from '@tanstack/react-start'

import { findDeeperLesson, isDeeperRankUnlocked } from '../lib/deeperKnowledge'
import { computeOverallRank, findLesson, isRankUnlocked } from '../lib/pathData'
import { requireAnyPurchase } from '../lib/session'
import { getProgress } from './progress'

const STARTER_PRODUCT_ID = 'prod_gLMGkps62VudF'
const ASCENDING_PRODUCT_ID = 'prod_JYWg9jHMiYBQE'
const COMPANY_ID = 'biz_jdcD3rL9FLYsxy'

const PLAN_PRODUCT_IDS: Record<string, string> = {
  starter: STARTER_PRODUCT_ID,
  ascending: ASCENDING_PRODUCT_ID,
}

// Lesson text lives only here, behind a membership check. It is imported
// inside the handler so it never ships in the public browser code.
export const getModuleText = createServerFn({ method: 'GET' })
  .validator((d: { plan: string; track: string; lesson: string }) => d)
  .handler(async ({ data }) => {
    const productId = PLAN_PRODUCT_IDS[data.plan]
    if (!productId) return { ok: false as const }

    const guard = await requireAnyPurchase([productId], COMPANY_ID)
    if (!guard.ok) return { ok: false as const }

    const found = findLesson(data.track, data.lesson)
    if (!found) return { ok: false as const }
    if (found.lesson.tier === 'ascending' && data.plan !== 'ascending') return { ok: false as const }

    const progress = await getProgress()
    const completed = new Set(progress.signedIn ? progress.completed : [])
    const hasAscending = progress.signedIn ? progress.hasAscending : false
    if (!isRankUnlocked(found.track, found.lesson.rank, completed, hasAscending)) return { ok: false as const }

    const { LESSON_CONTENT } = await import('../lib/lessonContent')
    return {
      ok: true as const,
      content: LESSON_CONTENT[`${found.track.slug}__${found.lesson.slug}`] ?? '',
    }
  })

export const getDeeperText = createServerFn({ method: 'GET' })
  .validator((d: { section: string; lesson: string }) => d)
  .handler(async ({ data }) => {
    const guard = await requireAnyPurchase([ASCENDING_PRODUCT_ID], COMPANY_ID)
    if (!guard.ok) return { ok: false as const }

    const found = findDeeperLesson(data.section, data.lesson)
    if (!found) return { ok: false as const }

    const progress = await getProgress()
    const completed = new Set(progress.signedIn ? progress.completed : [])
    const hasAscending = progress.signedIn ? progress.hasAscending : false
    const { currentRank } = computeOverallRank(completed, hasAscending)
    if (!isDeeperRankUnlocked(found.module.rank, currentRank)) return { ok: false as const }

    const loadBodies = async (slug: string): Promise<string[]> => {
      switch (slug) {
        case 'hidden-history':
          return (await import('../lib/deeperContent/hiddenHistory')).HIDDEN_HISTORY_BODIES
        case 'esoteric-perception':
          return (await import('../lib/deeperContent/esotericPerception')).ESOTERIC_PERCEPTION_BODIES
        case 'universal-law':
          return (await import('../lib/deeperContent/universalLaw')).UNIVERSAL_LAW_BODIES
        case 'modern-systems':
          return (await import('../lib/deeperContent/modernSystems')).MODERN_SYSTEMS_BODIES
        default:
          return []
      }
    }

    const bodies = await loadBodies(found.section.slug)
    const index = found.section.modules.findIndex((m) => m.slug === found.module.slug)
    // module.content already holds the public header, ending in the "---" divider.
    return { ok: true as const, content: `${found.module.content}${(bodies[index] ?? '').trim()}` }
  })
