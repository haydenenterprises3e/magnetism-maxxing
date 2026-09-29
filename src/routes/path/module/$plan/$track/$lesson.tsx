import { useEffect, useMemo, useState } from 'react'
import { createFileRoute, notFound, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import ReactMarkdown from 'react-markdown'

import { QuizRunner } from '../../../../../components/QuizRunner'
import { findLesson, isRankUnlocked, lessonKey } from '../../../../../lib/pathData'
import { parseQuiz } from '../../../../../lib/quizParser'
import { completionState } from '../../../../../lib/lessonVersions'
import { requireAnyPurchase } from '../../../../../lib/session'
import { getProgress, markLessonComplete } from '../../../../../server/progress'
import { getModuleText } from '../../../../../server/lessonText'

const STARTER_PRODUCT_ID = 'prod_gLMGkps62VudF'
const ASCENDING_PRODUCT_ID = 'prod_JYWg9jHMiYBQE'
const COMPANY_ID = 'biz_jdcD3rL9FLYsxy'

const PLAN_PRODUCT_IDS: Record<string, string> = {
  starter: STARTER_PRODUCT_ID,
  ascending: ASCENDING_PRODUCT_ID,
}

const checkAccess = createServerFn({ method: 'GET' })
  .validator((plan: string) => plan)
  .handler(({ data: plan }) => {
    const productId = PLAN_PRODUCT_IDS[plan]
    return requireAnyPurchase(productId ? [productId] : [], COMPANY_ID)
  })

export const Route = createFileRoute('/path/module/$plan/$track/$lesson')({
  head: () => ({
    meta: [{ title: 'Magnetism Maxxing — Module' }],
  }),
  beforeLoad: async ({ params, location }) => {
    if (!PLAN_PRODUCT_IDS[params.plan]) throw notFound()

    const guard = await checkAccess({ data: params.plan })
    if (guard.ok) return

    if (guard.reason === 'signed_out') {
      throw redirect({
        href: `/api/oauth/login?redirect_to=${encodeURIComponent(location.href)}`,
      })
    }
    throw redirect({ to: '/' })
  },
  loader: async ({ params }) => {
    const found = findLesson(params.track, params.lesson)
    if (!found) throw notFound()

    // Starter never includes Ascending-tier (S-Rank) modules, even by direct link.
    if (found.lesson.tier === 'ascending' && params.plan !== 'ascending') {
      throw redirect({ href: `/path/${params.plan}` })
    }

    const progress = await getProgress()
    const completed = new Set(progress.signedIn ? progress.completed : [])
    const hasAscending = progress.signedIn ? progress.hasAscending : false

    // Enforce the rank gate server-side too — not just hidden in the tracker UI.
    if (!isRankUnlocked(found.track, found.lesson.rank, completed, hasAscending)) {
      throw redirect({ href: `/path/${params.plan}` })
    }

    const key = lessonKey(found.track.slug, found.lesson.slug)
    const text = await getModuleText({ data: { plan: params.plan, track: params.track, lesson: params.lesson } })
    if (!text.ok) throw redirect({ href: `/path/${params.plan}` })
    return {
      track: found.track,
      lesson: { ...found.lesson, content: text.content },
      plan: params.plan,
      key,
      isDone: completionState(completed, key) === 'current',
      isUpdated: completionState(completed, key) === 'updated',
    }
  },
  component: ModulePage,
})

function ModulePage() {
  const { track, lesson, plan, key, isDone: initialDone, isUpdated: initialUpdated } = Route.useLoaderData()
  const backHref = `/path/${plan}`
  const [isDone, setIsDone] = useState(initialDone)
  const [isUpdated, setIsUpdated] = useState(initialUpdated)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    document.title = `Magnetism Maxxing — ${lesson.name}`
  }, [lesson.name])

  const hasContent = lesson.content.trim().length > 0
  const quiz = useMemo(() => (lesson.isTest ? parseQuiz(lesson.content) : null), [lesson])

  async function handleComplete() {
    if (saving || isDone) return
    setSaving(true)
    try {
      const result = await markLessonComplete({ data: { key } })
      if (result.signedIn) {
        const st = completionState(new Set(result.completed), key)
        setIsDone(st === 'current')
        setIsUpdated(st === 'updated')
        window.whop?.track('module:completed', { track: track.slug, lesson: lesson.slug, rank: lesson.rank })
      }
    } catch (err) {
      window.alert('Could not save: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setSaving(false)
    }
  }

  function handleQuizFinish(score: number, total: number) {
    window.whop?.track('module:quiz_finished', { track: track.slug, lesson: lesson.slug, rank: lesson.rank, score, total })
    void handleComplete()
  }

  return (
    <div className="path-page">
      <div className="wrap" style={{ maxWidth: 760 }}>
        <nav>
          <div className="logo">
            MAGNETISM MAXXING<span>.</span>
          </div>
          <a href={backHref} className="rank-pill" style={{ textDecoration: 'none' }}>
            ← Back to Your Path
          </a>
        </nav>

        <div className="module-meta">
          <span className="track-tag">{track.title.toUpperCase()}</span>
          <span className={`rank-tag rank-tag-${lesson.rank.toLowerCase()}`}>RANK {lesson.rank}</span>
          {lesson.isTest && <span className="track-tag module-test-tag">TEST</span>}
        </div>

        <div className={`module-body${isDone ? ' body-gold' : isUpdated ? ' body-purple' : ''}`}>
          {quiz ? (
            <>
              {quiz.intro && <ReactMarkdown>{quiz.intro}</ReactMarkdown>}
              <QuizRunner questions={quiz.questions} scoringNote={quiz.scoringNote} onFinish={handleQuizFinish} />
            </>
          ) : hasContent ? (
            <ReactMarkdown>{lesson.content}</ReactMarkdown>
          ) : (
            <>
              <h1 className="module-title">{lesson.name}</h1>
              <p className="module-placeholder">This module's content is being written and will appear here soon.</p>
            </>
          )}
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
            ← Back to Your Path
          </a>
        </div>
      </div>
    </div>
  )
}
