import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { TrackAccordion } from '../../components/TrackAccordion'
import { computeOverallRank, lessonKey, RANK_TITLES, TRACKS } from '../../lib/pathData'
import { requireAnyPurchase } from '../../lib/session'
import { getProgress } from '../../server/progress'

const STARTER_PRODUCT_ID = 'prod_gLMGkps62VudF'
const COMPANY_ID = 'biz_jdcD3rL9FLYsxy'

const checkAccess = createServerFn({ method: 'GET' }).handler(() =>
  requireAnyPurchase([STARTER_PRODUCT_ID], COMPANY_ID),
)

export const Route = createFileRoute('/path/starter')({
  head: () => ({
    meta: [{ title: 'Magnetism Maxxing — Your Path (Starter)' }],
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
  loader: async () => {
    const progress = await getProgress()
    return { progress }
  },
  component: StarterPathPage,
})

function PathVeinBackground() {
  return (
    <div className="vein-layer">
      <svg viewBox="0 0 1440 1600" preserveAspectRatio="xMidYMin slice">
        <path className="vein-path" d="M100,0 C160,140 60,260 140,420 C210,560 90,700 180,860" />
        <path className="vein-path" d="M1340,60 C1280,220 1400,340 1320,520" />
        <path className="vein-path" d="M700,0 C660,160 760,280 700,460 C650,620 750,780 700,960" />
      </svg>
    </div>
  )
}

function StarterPathPage() {
  const { progress } = Route.useLoaderData()

  const completed = new Set(progress.signedIn ? progress.completed : [])
  const hasAscending = progress.signedIn ? progress.hasAscending : false

  // Rank is earned only by actually completing modules — never by any click-to-earn action.
  const { currentRank: rank } = computeOverallRank(completed, hasAscending)
  const rankTitle = RANK_TITLES[rank] ?? 'INITIATE'

  // Starter grants every Starter-tier module (110 of the 120) — overall
  // progress is measured against what this plan actually unlocks.
  const accessibleLessons = TRACKS.flatMap((t) => t.lessons.filter((l) => l.tier === 'starter'))
  const doneCount = TRACKS.reduce(
    (sum, t) => sum + t.lessons.filter((l) => l.tier === 'starter' && completed.has(lessonKey(t.slug, l.slug))).length,
    0,
  )
  const overallProgressPct = accessibleLessons.length > 0 ? Math.round((doneCount / accessibleLessons.length) * 100) : 0

  return (
    <div className="path-page">
      <PathVeinBackground />
      <div className="wrap">
        <nav>
          <div className="logo">
            MAGNETISM MAXXING<span>.</span>
          </div>
          <div className="rank-pill">
            RANK: {rank} — {rankTitle}
          </div>
        </nav>

        <div className="welcome-panel">
          <div className="welcome-eyebrow">SYSTEM MESSAGE — STARTER</div>
          <div className="welcome-title">Welcome in. Trust the process.</div>
          <p className="welcome-sub">
            You've unlocked all 4 tracks on the Starter path. Every module has something to watch, do, or practice —
            videos, breakdowns, and material built specifically for where you're at. Complete every module in a rank
            to unlock the next one — E, then D, then C, B, and A.
          </p>
          <div className="overall-bar-row">
            <div className="bar-label">
              <span>OVERALL PROGRESS</span>
              <span>{overallProgressPct}%</span>
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${overallProgressPct}%` }} />
            </div>
          </div>
        </div>

        <div className="section-title">Your Tracks</div>
        <div className="section-sub">4 tracks, 30 modules each. Trust the process and work through them in order.</div>

        {TRACKS.map((track, i) => (
          <TrackAccordion
            key={track.title}
            index={i}
            track={track}
            defaultOpen={i === 0}
            planSlug="starter"
            completed={completed}
            hasAscending={hasAscending}
          />
        ))}

        <div className="footer-note">
          TRUST THE PROCESS.
          <br />
          SHOW UP. DO THE WORK. THE SYSTEM HANDLES THE REST.
        </div>
      </div>
    </div>
  )
}
