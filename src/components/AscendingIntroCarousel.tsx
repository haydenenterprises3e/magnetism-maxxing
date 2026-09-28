import { VideoEmbed } from './VideoEmbed'
import { useEffect, useRef, useState } from 'react'

const YOUTUBE_VIDEO_ID = 'bgx4ynRf-8k'

export function AscendingIntroCarousel({
  overallProgressPct,
  communityUnlocked,
}: {
  overallProgressPct: number
  communityUnlocked: boolean
}) {
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
        .intro-carousel-track { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; border-radius: 16px; }
        .intro-carousel-track::-webkit-scrollbar { display: none; }
        .intro-slide { flex: 0 0 100%; scroll-snap-align: start; padding: 0 2px; box-sizing: border-box; }
        .intro-slide-inner { min-height: 220px; border-radius: 16px; padding: 28px 32px; background: rgba(20, 10, 35, 0.55); border: 1px solid rgba(168, 120, 255, 0.35); box-shadow: 0 0 24px rgba(140, 80, 255, 0.15); display: flex; flex-direction: column; justify-content: center; gap: 10px; }
        .intro-slide-eyebrow { font-size: 12px; letter-spacing: 0.14em; color: #c9a8ff; font-weight: 600; }
        .intro-slide-title { font-size: 26px; font-weight: 700; color: #f4e9ff; }
        .intro-slide-sub { color: rgba(230, 220, 245, 0.75); line-height: 1.5; max-width: 640px; }
        .ascend-status .intro-slide-title { background: linear-gradient(90deg, #d4af37, #a86bff); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .intro-slide-btn { align-self: flex-start; margin-top: 8px; padding: 10px 20px; border-radius: 999px; background: linear-gradient(90deg, #a86bff, #d4af37); color: #120a1f; font-weight: 700; text-decoration: none; font-size: 14px; }
        .video-slide .video-frame { position: relative; width: 100%; max-width: 640px; aspect-ratio: 16 / 9; border-radius: 10px; overflow: hidden; border: 1px solid rgba(168, 120, 255, 0.35); }
        .video-frame iframe { touch-action: manipulation; position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
        .intro-carousel-dots { display: flex; justify-content: center; gap: 8px; margin-top: 14px; }
        .intro-dot { width: 8px; height: 8px; border-radius: 50%; border: none; background: rgba(168, 120, 255, 0.3); cursor: pointer; padding: 0; }
        .intro-dot.active { background: linear-gradient(90deg, #a86bff, #d4af37); width: 22px; border-radius: 4px; }
      `}</style>
      <div className="intro-carousel-wrap">
        <div className="intro-carousel-track" ref={trackRef} onPointerDown={() => setPaused(true)} onTouchStart={() => setPaused(true)}>
          <div className="intro-slide">
            <div className="intro-slide-inner ascend-status">
              <div className="intro-slide-eyebrow">RANK S ACCESS</div>
              <div className="intro-slide-title">You've Ascended</div>
              <p className="intro-slide-sub">
                Full access unlocked — all 4 core tracks, every S-Rank module, and Deeper Knowledge.
              </p>
            </div>
          </div>

          <div className="intro-slide">
            <div className="intro-slide-inner">
              <div className="welcome-eyebrow">SYSTEM MESSAGE — ASCENDING</div>
              <div className="welcome-title">Welcome in. Trust the process.</div>
              <p className="welcome-sub">
                You've unlocked all 4 tracks plus every S-Rank module exclusive to Ascending. Complete every module
                in a rank to unlock the next.
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
            <div className="intro-slide-inner" style={{ alignItems: communityUnlocked ? undefined : 'center', textAlign: communityUnlocked ? undefined : 'center' }}>
              {communityUnlocked ? (
                <>
                  <div className="intro-slide-eyebrow">YOU'RE IN</div>
                  <div className="intro-slide-title">Community</div>
                  <p className="intro-slide-sub">
                    The private space where Ascending members build and create the modules Starter members see.
                  </p>
                  <a href="/path/community" className="intro-slide-btn">
                    Enter Community →
                  </a>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 36, marginBottom: 4 }}>🔒</div>
                  <div className="intro-slide-title">Community</div>
                  <p className="intro-slide-sub">
                    Locked. Reach 70% completion across your core tracks to unlock the private community — the
                    space where Ascending members build and create the modules Starter members see.
                  </p>
                </>
              )}
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
