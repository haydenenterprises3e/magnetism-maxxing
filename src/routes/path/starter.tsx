import { VideoEmbed } from '../../components/VideoEmbed'
import { useEffect, useRef, useState } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { TrackAccordion } from '../../components/TrackAccordion'
import { UpcomingCourses } from '../../components/UpcomingCourses'
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
    if (process.env.LOCAL_PREVIEW_BYPASS === '1') return // local-only, never present in prod env
    const guard = await checkAccess()
    if (guard.ok) return

    if (guard.reason === 'signed_out') {
      throw redirect({
        href: `/api/oauth/login?redirect_to=${encodeURIComponent(location.href)}`,
      })
    }
    throw redirect({ href: `/?error=no_access&detail=${encodeURIComponent(String((guard as any).detail ?? ''))}` })
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

function RankRing({ pct }: { pct: number }) {
  const radius = 26
  const circumference = 2 * Math.PI * radius
  const [dash, setDash] = useState(circumference)

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setDash(circumference - (pct / 100) * circumference)
    })
    return () => cancelAnimationFrame(id)
  }, [pct, circumference])

  return (
    <div className="rank-ring-wrap">
      <svg className="rank-ring-svg" width="60" height="60" viewBox="0 0 60 60">
        <circle className="rank-ring-track" cx="30" cy="30" r={radius} />
        <circle
          className="rank-ring-fill"
          cx="30"
          cy="30"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={dash}
        />
      </svg>
      <div className="rank-ring-pct">{pct}%</div>
    </div>
  )
}

const YOUTUBE_VIDEO_ID = 'bgx4ynRf-8k' // TODO: paste your unlisted YouTube video ID here

function LockChainIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      <circle cx="12" cy="15" r="1.5" fill="currentColor" stroke="none" />
      <path d="M12 16.5V18" />
    </svg>
  )
}

function PathIntroCarousel({ overallProgressPct }: { overallProgressPct: number }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const slideCount = 4

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => {
      setActive((prev) => {
        const next = (prev + 1) % slideCount
        const el = trackRef.current
        if (el) el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' })
        return next
      })
    }, 6000)
    return () => clearInterval(id)
  }, [paused])

  const goTo = (i: number) => {
    setActive(i)
    const el = trackRef.current
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <>
      <style>{`
        .intro-carousel-wrap { margin: 24px 0 40px; }
        .intro-carousel-track {
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          border-radius: 16px;
        }
        .intro-carousel-track::-webkit-scrollbar { display: none; }
        .intro-slide {
          flex: 0 0 100%;
          scroll-snap-align: start;
          padding: 0 2px;
          box-sizing: border-box;
        }
        .intro-slide-inner {
          min-height: 220px;
          border-radius: 16px;
          padding: 28px 32px;
          background: rgba(20, 10, 35, 0.55);
          border: 1px solid rgba(168, 120, 255, 0.35);
          box-shadow: 0 0 24px rgba(140, 80, 255, 0.15);
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 10px;
        }
        .intro-slide-eyebrow { font-size: 12px; letter-spacing: 0.14em; color: #c9a8ff; font-weight: 600; }
        .intro-slide-title { font-size: 26px; font-weight: 700; color: #f4e9ff; }
        .intro-slide-sub { color: rgba(230, 220, 245, 0.75); line-height: 1.5; max-width: 640px; }
        .ascend-cta .intro-slide-title {
          background: linear-gradient(90deg, #d4af37, #a86bff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .intro-slide-btn {
          align-self: flex-start;
          margin-top: 8px;
          padding: 10px 20px;
          border-radius: 999px;
          background: linear-gradient(90deg, #a86bff, #d4af37);
          color: #120a1f;
          font-weight: 700;
          text-decoration: none;
          font-size: 14px;
        }
        .video-slide .video-frame {
          position: relative;
          width: 100%;
          max-width: 640px;
          aspect-ratio: 16 / 9;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid rgba(168, 120, 255, 0.35);
        }
        .video-frame iframe { touch-action: manipulation; position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
        .locked-slide { align-items: center; text-align: center; color: #cfc3e0; }
        .locked-slide svg { color: #a8a0bb; margin-bottom: 4px; }
        .locked-slide .intro-slide-sub { max-width: 520px; }
        .intro-carousel-dots { display: flex; justify-content: center; gap: 8px; margin-top: 14px; }
        .intro-dot { width: 8px; height: 8px; border-radius: 50%; border: none; background: rgba(168, 120, 255, 0.3); cursor: pointer; padding: 0; }
        .intro-dot.active { background: linear-gradient(90deg, #a86bff, #d4af37); width: 22px; border-radius: 4px; }
      `}</style>
      <div className="intro-carousel-wrap">
        <div className="intro-carousel-track" ref={trackRef} onPointerDown={() => setPaused(true)} onTouchStart={() => setPaused(true)}>
          <div className="intro-slide">
            <div className="intro-slide-inner ascend-cta">
              <div className="intro-slide-eyebrow">LEVEL UP</div>
              <div className="intro-slide-title">Join Ascending</div>
              <p className="intro-slide-sub">
                Unlock the Ascending-exclusive tracks, the private community, and the full system.
              </p>
              <a href="/#pricing" className="intro-slide-btn">
                See Ascending →
              </a>
            </div>
          </div>

          <div className="intro-slide">
            <div className="intro-slide-inner">
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
          </div>

          <div className="intro-slide">
            <div className="intro-slide-inner video-slide">
              <div className="intro-slide-eyebrow">START HERE</div>
              <div className="intro-slide-title">Introduction</div>
              <div className="video-frame">
                <VideoEmbed id={YOUTUBE_VIDEO_ID} />
              </div>
            </div>
          </div>

          <div className="intro-slide">
            <div className="intro-slide-inner locked-slide">
              <LockChainIcon />
              <div className="intro-slide-title">Community</div>
              <p className="intro-slide-sub">
                Locked. The community is the Ascending-only space where the modules you see on Starter are built and
                created — the source, not just the output.
              </p>
            </div>
          </div>
        </div>

        <div className="intro-carousel-dots">
          {Array.from({ length: slideCount }).map((_, i) => (
            <button
              key={i}
              className={`intro-dot${i === active ? ' active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </>
  )
}

function StarterPathPage() {
  const { progress } = Route.useLoaderData()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const completed = new Set(progress.signedIn ? progress.completed : [])
  const hasAscending = progress.signedIn ? progress.hasAscending : false

  const { currentRank: rank } = computeOverallRank(completed, hasAscending)
  const rankTitle = RANK_TITLES[rank] ?? 'INITIATE'

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
        <nav className={`sticky-header${scrolled ? ' scrolled' : ''}`}>
          <div className="logo">
            MAGNETISM MAXXING<span>.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <RankRing pct={overallProgressPct} />
            <div className="rank-pill">
              RANK: {rank} — {rankTitle}
            </div>
          </div>
        </nav>

        <PathIntroCarousel overallProgressPct={overallProgressPct} />

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

        <UpcomingCourses />

          <div className="footer-note">
            MAGNETISM MAXXING — Everything taught here is for educational purposes only. It's on each student to actually implement and do the work. We don't guarantee profits or income — we guarantee real knowledge from serious sources, alongside community-based theories, conspiracies, and shared opinion, clearly presented as such. · © 2026 · TERMS · PRIVACY
          </div>
      </div>
    </div>
  )
}
