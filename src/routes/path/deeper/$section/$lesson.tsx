import { useEffect, useState } from 'react'
import { createFileRoute, notFound, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import ReactMarkdown from 'react-markdown'

import { deeperKey, findDeeperLesson, isDeeperRankUnlocked } from '../../../../lib/deeperKnowledge'
import { computeOverallRank } from '../../../../lib/pathData'
import { completionState } from '../../../../lib/lessonVersions'
import { requireAnyPurchase } from '../../../../lib/session'
import { getProgress, markLessonComplete } from '../../../../server/progress'
import { getDeeperText } from '../../../../server/lessonText'

const ASCENDING_PRODUCT_ID = 'prod_JYWg9jHMiYBQE'
const COMPANY_ID = 'biz_jdcD3rL9FLYsxy'

const checkAccess = createServerFn({ method: 'GET' }).handler(() =>
  requireAnyPurchase([ASCENDING_PRODUCT_ID], COMPANY_ID),
)

export const Route = createFileRoute('/path/deeper/$section/$lesson')({
  head: () => ({
    meta: [{ title: 'Magnetism Maxxing — Deeper Knowledge' }],
  }),
  beforeLoad: async ({ location }) => {
    const guard = await checkAccess()
    if (guard.ok) return

    if (guard.reason === 'signed_out') {
      throw redirect({
        href: `/api/oauth/login?redirect_to=${encodeURIComponent(location.href)}`,
      })
    }
    throw redirect({ to: '/' })
  },
  loader: async ({ params }) => {
    const found = findDeeperLesson(params.section, params.lesson)
    if (!found) throw notFound()

    const progress = await getProgress()
    const completed = new Set(progress.signedIn ? progress.completed : [])
    const hasAscending = progress.signedIn ? progress.hasAscending : false
    const { currentRank } = computeOverallRank(completed, hasAscending)
    if (!isDeeperRankUnlocked(found.module.rank, currentRank)) {
      throw redirect({ href: '/path/ascending#deeper-knowledge' })
    }

    const text = await getDeeperText({ data: { section: params.section, lesson: params.lesson } })
    if (!text.ok) throw redirect({ href: '/path/ascending#deeper-knowledge' })

    const key = deeperKey(found.section.slug, found.module.slug)
    return {
      section: {
        letter: found.section.letter,
        title: found.section.title,
        slug: found.section.slug,
      },
      module: { ...found.module, content: text.content },
      key,
      isDone: completionState(completed, key) === 'current',
      isUpdated: completionState(completed, key) === 'updated',
    }
  },
  component: DeeperModulePage,
})

function DeeperModulePage() {
  const { section, module, key, isDone: initialDone, isUpdated: initialUpdated } = Route.useLoaderData()
  const backHref = '/path/ascending#deeper-knowledge'
  const [isDone, setIsDone] = useState(initialDone)
  const [isUpdated, setIsUpdated] = useState(initialUpdated)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    document.title = `Magnetism Maxxing — ${module.name}`
  }, [module.name])

  async function handleComplete() {
    if (saving || isDone) return
    setSaving(true)
    try {
      const result = await markLessonComplete({ data: { key } })
      if (result.signedIn) {
        const st = completionState(new Set(result.completed), key)
        setIsDone(st === 'current')
        setIsUpdated(st === 'updated')
        window.whop?.track('module:completed', { track: `deeper-${section.slug}`, lesson: module.slug })
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="path-page">
      <div className="wrap" style={{ maxWidth: 760 }}>
        <nav>
          <div className="logo">
            MAGNETISM MAXXING<span>.</span>
          </div>
          <a href={backHref} className="rank-pill" style={{ textDecoration: 'none' }}>
            ← Deeper Knowledge
          </a>
        </nav>

        <div className="module-meta">
          <span className="track-tag">DEEPER KNOWLEDGE</span>
          <span className="track-tag">SECTION {section.letter}</span>
          <span className={`rank-tag rank-tag-${module.rank.toLowerCase()}`}>RANK {module.rank}</span>
          <span className="tier-tag">ASCENDING</span>
        </div>

        <div className={`module-body${isDone ? ' body-gold' : isUpdated ? ' body-purple' : ''}`}>
          <ReactMarkdown>{module.content}</ReactMarkdown>
        </div>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 40 }}>
          {isDone ? (
            <span className="btn-primary quiz-submit" style={{ display: 'inline-block', cursor: 'default' }}>
              ✓ Completed
            </span>
          ) : (
            <button type="button" className="btn-primary quiz-submit" onClick={handleComplete} disabled={saving}>
              {saving ? 'Saving…' : isUpdated ? 'Updated · Mark Complete Again' : 'Mark Complete'}
            </button>
          )}
          <a href={backHref} className="btn-ghost quiz-submit" style={{ display: 'inline-block' }}>
            ← Back to Deeper Knowledge
          </a>
        </div>
      </div>
    </div>
  )
}
