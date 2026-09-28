import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { DeeperAccordion } from '../../components/DeeperAccordion'
import { AscendingIntroCarousel } from '../../components/AscendingIntroCarousel'
import { UpcomingCourses } from '../../components/UpcomingCourses'
import { TrackAccordion } from '../../components/TrackAccordion'
import { DEEPER_MODULE_COUNT, DEEPER_SECTIONS, deeperDoneCount } from '../../lib/deeperKnowledge'
import { computeOverallRank, lessonKey, RANK_TITLES, TRACKS } from '../../lib/pathData'
import { requireAnyPurchase } from '../../lib/session'
import { getProgress } from '../../server/progress'

const ASCENDING_PRODUCT_ID = 'prod_JYWg9jHMiYBQE'
const COMPANY_ID = 'biz_jdcD3rL9FLYsxy'

const checkAccess = createServerFn({ method: 'GET' }).handler(() =>
  requireAnyPurchase([ASCENDING_PRODUCT_ID], COMPANY_ID),
)

export const Route = createFileRoute('/path/ascending')({
  head: () => ({
    meta: [{ title: 'Magnetism Maxxing — Your Path (Ascending)' }],
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
  component: AscendingPathPage,
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

// Ascending = everything in Starter's tracks, plus the S-Rank modules exclusive
// to this tier, unlocked once every A-Rank module in that same track is complete.
function AscendingPathPage() {
  const { progress } = Route.useLoaderData()

  const completed = new Set(progress.signedIn ? progress.completed : [])
  const hasAscending = progress.signedIn ? progress.hasAscending : false

  // Rank is earned only by actually completing modules — never by any click-to-earn action.
  const { currentRank: rank, progressPct: overallProgressPct } = computeOverallRank(completed, hasAscending)

  const totalCoreLessons = TRACKS.reduce((sum, t) => sum + t.lessons.length, 0)
  const doneCoreLessons = TRACKS.reduce(
    (sum, t) => sum + t.lessons.filter((l) => completed.has(lessonKey(t.slug, l.slug))).length,
    0,
  )
  const communityUnlocked = totalCoreLessons > 0 && doneCoreLessons / totalCoreLessons >= 0.7
  const rankTitle = RANK_TITLES[rank] ?? 'INITIATE'

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

        <AscendingIntroCarousel overallProgressPct={overallProgressPct} communityUnlocked={communityUnlocked} />

          <div className="section-title">Your Tracks</div>
        <div className="section-sub">4 tracks, 30 modules each. Trust the process and work through them in order.</div>

        {TRACKS.map((track, i) => (
          <TrackAccordion
            key={track.title}
            index={i}
            track={track}
            defaultOpen={i === 0}
            planSlug="ascending"
            completed={completed}
            hasAscending={hasAscending}
          />
        ))}

        <div className="section-title" id="deeper-knowledge" style={{ marginTop: 52 }}>
          Deeper Knowledge
        </div>
        <div className="section-sub">
          Ascending-only. Four sub-sections, fifteen modules each. First five unlock at overall B, next five at A, last
          five at S. Completing them does not change rank.
        </div>
        <div className="deeper-intro">
          <strong>How to read this library.</strong> Locked until you hold that rank on all four tracks. Every module is
          presented as claim, theory, or tradition — clearly labeled. Nothing here is asserted as proven fact unless the
          record actually supports it. Section D (Modern Systems & Control) is the documented core. Sections A–C go
          further into contested territory.
        </div>
        <div className="overall-bar-row" style={{ marginBottom: 22 }}>
          <div className="bar-label">
            <span>DEEPER KNOWLEDGE</span>
            <span>
              {deeperDoneCount(completed)}/{DEEPER_MODULE_COUNT}
            </span>
          </div>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{
                width: `${Math.round((deeperDoneCount(completed) / DEEPER_MODULE_COUNT) * 100)}%`,
                background: 'var(--rank-gold)',
                boxShadow: '0 0 10px rgba(232,184,109,0.45)',
              }}
            />
          </div>
        </div>

        {DEEPER_SECTIONS.map((section, i) => (
          <DeeperAccordion
            key={section.slug}
            section={section}
            defaultOpen={i === 0}
            completed={completed}
            overallRank={rank}
          />
        ))}

        <UpcomingCourses />

          <div className="footer-note">
          FOR EDUCATIONAL PURPOSES ONLY, NOT PROVEN, CONSPIRACIES ONLY,
          <br />
          COMMUNITY BRO-SCIENCE AND TEACHINGS
        </div>
      </div>
    </div>
  )
}
