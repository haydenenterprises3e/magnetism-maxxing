import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { AwakeningQuiz } from '../components/AwakeningQuiz'
import { PricingModal } from '../components/PricingModal'
import { HunterStatus } from '../components/HunterStatus'
import { PLANS } from '../lib/plans'
import { ScrollReveal } from '../components/ScrollReveal'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Magnetism Maxxing: Increase Magnetism | H3E Community' },
      {
        name: 'description',
        content:
          'Magnetism Maxxing by H3E: a leveling system to increase magnetism, presence, confidence and discipline. Join the H3E community. Ages 18+.',
      },
    ],
  }),
  component: Home,
})

const FAQS = [
  {
    q: 'What rank do I start at?',
    a: 'Every member starts at Rank E — no exceptions, no shortcuts, no buying your way up. Rank is earned only by actually completing modules.',
  },
  {
    q: "What's the real difference between Starter and Ascending?",
    a: 'Starter unlocks the full 4-track curriculum through Rank A. Ascending unlocks everything in Starter, plus S-Rank content in every core track, plus four additional Ascending-only tracks — 60 more modules of contested history, energy work, metaphysics, and the systems shaping modern life.',
  },
  {
    q: 'Is everything in here proven fact?',
    a: 'The 4 core tracks are built on well-documented psychology, physiology, and business fundamentals. The Ascending-exclusive material is clearly labeled throughout as theory, tradition, or community-shared belief — never sold to you as settled science.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes — no contracts, cancel with one click whenever you want.',
  },
  {
    q: 'Is there an age requirement?',
    a: 'Yes, membership is for adults 18 and over.',
  },
]

const MANIFESTO = `There is a power waiting inside this program, and before you go any further, you should understand exactly what you are about to pick up. Every generation produces a small number of men who refuse to accept the life they were handed — who suspect, quietly and stubbornly, that they were built for something considerably larger than the one they are currently living. If that suspicion has ever visited you, even once, then what follows was written for you specifically, and you should read it with the seriousness it deserves.

What has been assembled here is not content. Content is what the world drowns you in for free, and it has made almost no one great. This is a system — constructed deliberately, module by module, by professionals who have actually done the thing in every domain it covers: the building of a body, the command of a room, the creation of real income, and the mastery of the mind running all three. It was designed for a single purpose, and the purpose is dramatic and unapologetic: to take a man exactly as he is today and hand him, in order, the knowledge required to become the fullest version of what he was always capable of being.

Handle this carefully. Knowledge of this kind has never been neutral — it builds the man who applies it and quietly indicts the man who reads it and does nothing. Every principle inside these tracks has been sharpened until it does real work on a real life, which means it is equally capable of showing you exactly how far you have been operating beneath your own potential. Most men are not ready for that mirror. The ones who are will recognize, somewhere in the first week, that they have found the structure they have been searching for without knowing what to call it.

Understand what you are actually competing with. Out there, the world will sell you distraction dressed as education and call it opportunity. It will let you spend a decade guessing, and charge you for the privilege. What sits behind these gates is the opposite: a deliberate, sequenced, rank-by-rank path with nothing wasted, alongside a living library that grows wiser every single day as every member who walks through adds what they have learned back into it. No single mind could build this. A community of them can, and is, right now, while you are still reading.

And this is the law underneath all of it, the one Hill understood and every serious man eventually arrives at: the mind is the only instrument you have ever actually needed. Every fortune, every physique, every room ever commanded began as a thought held with enough discipline to survive contact with reality. You are not lacking resources. You are lacking the structure to direct the one resource you already own. That structure is what is guaranteed to you here — not luck, not promises about your future, but knowledge, transmitted deliberately, from men who have done it to a man prepared to do it. Take it. Apply it. Pass it to every man you know who is still searching. What you build with it from there has always been, and will always be, entirely up to you.

— Magnetism Maxxing`

const COMMUNITY_TEXT = `Understand what you are actually looking at before you decide whether you want it. This is not a forum. It is not comments under a video. This is the closest thing available to the private table the wealthiest men in the world actually sit at — the conversations that never make it to a stage, a podcast, or a book, because the men having them were never trying to teach the public anything. They were building.

Access is not sold. It is earned, in full, by finishing every single module across all eight tracks at genuine, complete 100%. That threshold exists for a reason. What waits on the other side of it is not diluted for beginners, is not softened for an audience still working through the fundamentals, and is not going anywhere. It is reserved for the men who actually finished — the small, self-selecting circle that proved, through completion alone, that they belong in the room.

Inside: the money strategies the wealthiest men in any room quietly operate by and rarely say out loud. The frameworks, the moves, the way of thinking about power, capital, and opportunity that separates the men who compound a fortune from the men who spend a lifetime chasing one. Supplemented daily by our own professionals and professors, and by every member who has already walked through the door before you — a living, compounding intelligence that gets sharper, richer, and more dangerous to ignore with every day that passes.

This is not a nice-to-have bolted onto a course. It is the actual destination. Every module in every track you are about to start was built, in part, to prepare you to be worthy of a seat here. Once you finish, instructions for entry are delivered to you personally. Most men will never see what's inside. That was never an accident. It was always the point.`

function VeinBackground() {
  return (
    <div className="vein-layer">
      <svg viewBox="0 0 1440 2400" preserveAspectRatio="xMidYMin slice">
        <path className="vein-path bright" d="M120,0 C160,180 60,320 140,480 C210,620 90,760 180,920 C250,1060 120,1200 200,1360" />
        <path className="vein-path" d="M1320,60 C1260,220 1380,360 1300,540 C1230,700 1360,860 1280,1040" />
        <path className="vein-path slow" d="M700,0 C660,160 760,300 700,480 C650,640 750,820 700,1000 C660,1160 760,1320 700,1500" />
        <path className="vein-path" d="M0,600 C120,640 220,560 340,620 C460,680 540,600 660,660" />
        <path className="vein-path slow" d="M1440,1200 C1300,1240 1220,1160 1080,1220 C960,1280 880,1200 760,1260" />
        <path className="vein-path bright" d="M200,1600 C260,1780 160,1900 240,2080 C300,2220 200,2340 260,2400" />
        <path className="vein-path" d="M1200,1600 C1140,1760 1240,1880 1180,2060 C1130,2200 1240,2320 1180,2400" />
        <circle className="vein-node" cx="140" cy="480" r="3" />
        <circle className="vein-node" cx="1300" cy="540" r="3" />
        <circle className="vein-node" cx="700" cy="480" r="3" />
        <circle className="vein-node" cx="340" cy="620" r="3" />
        <circle className="vein-node" cx="1080" cy="1220" r="3" />
        <circle className="vein-node" cx="240" cy="2080" r="3" />
        <circle className="vein-node" cx="1180" cy="2060" r="3" />
      </svg>
    </div>
  )
}

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`faq-item${open ? ' open' : ''}`}>
      <div className="faq-q" onClick={() => setOpen((o) => !o)}>
        {q}
      </div>
      <div className="faq-a">{a}</div>
    </div>
  )
}

function ManifestoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <div className="quiz-overlay" onClick={onClose}>
      <div className="quiz-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 720 }}>
        <button type="button" className="quiz-close" onClick={onClose}>
          ×
        </button>
        <div className="quiz-question-title">What Magnetism Maxxing Actually Is</div>
        <div
          className="quiz-question-sub"
          style={{ whiteSpace: 'pre-line', textAlign: 'left', marginTop: 20, lineHeight: 1.85, fontSize: '1.05rem', color: 'var(--text-main)' }}
        >
          {MANIFESTO}
        </div>
      </div>
    </div>
  )
}


function CommunityModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <div className="quiz-overlay" onClick={onClose}>
      <div className="quiz-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 720 }}>
        <button type="button" className="quiz-close" onClick={onClose}>
          ×
        </button>
        <div className="quiz-question-title">Only In Ascending</div>
        <div
          className="quiz-question-sub"
          style={{ whiteSpace: 'pre-line', textAlign: 'left', marginTop: 20, lineHeight: 1.85, fontSize: '1.05rem', color: 'var(--text-main)' }}
        >
          {COMMUNITY_TEXT}
        </div>
      </div>
    </div>
  )
}
function Home() {
  const [quizOpen, setQuizOpen] = useState(false)
  const [pricingOpen, setPricingOpen] = useState(false)
  const [manifestoOpen, setManifestoOpen] = useState(false)
  const [communityOpen, setCommunityOpen] = useState(false)
  const pastDeadline = false

  return (
    <>
      <VeinBackground />
      <AwakeningQuiz open={quizOpen} onClose={() => setQuizOpen(false)} />
      <PricingModal open={pricingOpen} onClose={() => setPricingOpen(false)} />
      <ManifestoModal open={manifestoOpen} onClose={() => setManifestoOpen(false)} />
      <CommunityModal open={communityOpen} onClose={() => setCommunityOpen(false)} />
      <div className="grain" />

      <nav>
        <div className="logo">
          MAGNETISM MAXXING<span>.</span>
        </div>
        <a className="cta-nav" href="#pricing">
          Enter the Gate
        </a>
      </nav>

      <section className="hero">
        <div className="eyebrow">System Online</div>
        <h1 className="hero-title">
          Magnetise your future into the present <span className="glow">now.</span>
        </h1>
        <p className="hero-sub">
          The moment your body, your presence, and your mind actually change, the world does not stay the same
          around you. Same rooms. Same people. A completely different reality answering back — because mastery and
          real knowledge change what you're capable of perceiving and moving through.
        </p>
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.72rem',
            letterSpacing: '0.14em',
            color: 'var(--vein-glow)',
            textTransform: 'uppercase',
            marginTop: 18,
          }}
        >
          Master Money-Making Skills · Max Out Every Stat · Get Jacked · Learn From The Best · Master AI
        </p>
        <div className="hero-ctas">
          <button type="button" className="btn-primary" onClick={() => setQuizOpen(true)}>
            Master Your Body, Mind & Money
          </button>
          <button type="button" className="btn-ghost" onClick={() => setPricingOpen(true)}>
            Magnetize The Future Now
          </button>
        </div>

        <button
          type="button"
          onClick={() => setManifestoOpen(true)}
          style={{
            background: 'none',
            border: 'none',
            marginTop: 20,
            color: 'var(--rank-gold)',
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.78rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            textShadow: '0 0 10px rgba(232,184,109,0.5)',
            cursor: 'pointer',
          }}
        >
          What Is Magnetism Maxxing? →
        </button>

        <HunterStatus />
      </section>

      <section className="section-pad" id="tracks">
        <div className="section-head">
          <div className="section-eyebrow">The Tracks</div>
          <h2 className="section-title">Everything levels together</h2>
          <p className="section-sub">
            Presence isn't one skill. It's built in layers — and each layer trains a different part of who you are.
          </p>
        </div>
        <div className="tracks-grid">
          <div className="track-card">
            <div className="track-tag">TRACK 01</div>
            <div className="track-name">Physical</div>
            <div className="track-desc">
              Your body is the first signal any room reads — long before you speak. Rebuild it, and watch how
              differently the world begins to move around you.
            </div>
          </div>
          <div className="track-card">
            <div className="track-tag">TRACK 02</div>
            <div className="track-name">Social</div>
            <div className="track-desc">
              There is a silent language running beneath every conversation. Learn to speak it, and presence stops
              being something you perform — it becomes something you simply are.
            </div>
          </div>
          <div className="track-card">
            <div className="track-tag">TRACK 03</div>
            <div className="track-name">Income</div>
            <div className="track-desc">
              Money follows a current most men never learn to read. Once you see it, opportunity stops feeling
              random — it starts feeling inevitable.
            </div>
          </div>
          <div className="track-card">
            <div className="track-tag">TRACK 04</div>
            <div className="track-name">Inner Work</div>
            <div className="track-desc">
              Beneath the body, the room, and the deal is the mind running all three. Master it, and everything else
              stops requiring the effort it once did.
            </div>
          </div>
        </div>

        <div
          className="section-eyebrow"
          style={{ textAlign: 'center', marginTop: 56, marginBottom: 14, color: 'var(--rank-gold)', textShadow: '0 0 14px rgba(232,184,109,0.7)' }}
        >
          Ascending Exclusive
        </div>

        <div className="tracks-grid">
          <div className="track-card">
            <div className="track-tag">TRACK 05 · ASCENDING</div>
            <div className="track-name">Hidden History</div>
            <div className="track-desc">
              The past you were taught is not the only past on record. Step into the readings most classrooms never
              touch — labeled honestly, explored without fear.
            </div>
            <div className="track-stat">15 MODULES</div>
          </div>
          <div className="track-card">
            <div className="track-tag">TRACK 06 · ASCENDING</div>
            <div className="track-name">Esoteric Perception & Energy Work</div>
            <div className="track-desc">
              Traditions older than modern science claim the body can sense more than five senses admit. Explore
              them for yourself — nothing here is sold to you as proven.
            </div>
            <div className="track-stat">15 MODULES</div>
          </div>
          <div className="track-card">
            <div className="track-tag">TRACK 07 · ASCENDING</div>
            <div className="track-name">Universal Law & Metaphysics</div>
            <div className="track-desc">
              Karma. Synchronicity. The unseen order cultures have sworn by for millennia. Examine it honestly.
              Decide for yourself what to carry forward.
            </div>
            <div className="track-stat">15 MODULES</div>
          </div>
          <div className="track-card">
            <div className="track-tag">TRACK 08 · ASCENDING</div>
            <div className="track-name">Modern Systems & Control</div>
            <div className="track-desc">
              The systems shaping what you see, believe, and buy were never explained to you plainly — until now.
              The most documented material in the entire library.
            </div>
            <div className="track-stat">15 MODULES</div>
          </div>
        </div>
      </section>

      <section className="section-pad" id="pricing">
        <div className="section-head">
          <div className="section-eyebrow">Enquire The Powers Of Wisdom</div>
          <h2 className="section-title">Enter the gate</h2>
          <p className="section-sub">Cancel anytime. No contracts.</p>
        </div>
        
        <div className="pricing-grid">
          {PLANS.map((plan) => {
            const displayIntroPrice = pastDeadline ? plan.postDeadlineIntroPrice : plan.introPrice
            return (
              <div key={plan.key} className={`price-card${plan.featured ? ' featured' : ''}`}>
                <div className="price-rank">{plan.rankLabel}</div>
                <div className="price-amount">
                  {!pastDeadline && (
                    <span
                      style={{
                        textDecoration: 'line-through',
                        textDecorationColor: '#d4af37',
                        color: '#f5d76e',
                        opacity: 1,
                        textShadow: '0 0 6px rgba(245,215,110,0.9), 0 0 16px rgba(212,175,55,0.7), 0 0 30px rgba(212,175,55,0.4)',
                        fontSize: '0.6em',
                        marginRight: 8,
                      }}
                    >
                      ${plan.postDeadlineIntroPrice}
                    </span>
                  )}
                  ${displayIntroPrice}
                  <span>first month</span>
                </div>
                <div className="price-then">then ${plan.price}/mo</div>
                <ul className="price-list">
                  {plan.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>

                <a
                  className="price-btn"
                  href={plan.purchaseUrl}
                  onClick={() =>
                    window.whop?.track('view_content', { plan: plan.title, value: plan.price, currency: 'USD' })
                  }
                >
                  {plan.ctaLabel}
                </a>
              </div>
            )
          })}
        </div>
      </section>
      <section className="section-pad" style={{ textAlign: 'center', paddingTop: 0 }}>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setManifestoOpen(true)}
          style={{ fontSize: '1.15rem', padding: '20px 46px', background: 'linear-gradient(135deg, #f0cf95, var(--rank-gold))', boxShadow: '0 0 34px rgba(232,184,109,0.5)' }}
        >
          Inside Magnetism Maxxing
        </button>
        <br />
        <button
          type="button"
          onClick={() => setCommunityOpen(true)}
          style={{ fontSize: '1.15rem', padding: '20px 46px', marginTop: 22, background: 'linear-gradient(135deg, var(--vein-glow), var(--vein-blue))', color: 'var(--bg-void)', border: 'none', borderRadius: 2, fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', boxShadow: '0 0 34px rgba(63,168,255,0.5)', cursor: 'pointer' }}
        >
          Our Community
        </button>
      </section>
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(to bottom, transparent, rgba(5,5,10,0.6), transparent)',
        }}
      >
        {[
          {
            prefix: 'Magnetism ',
            small: 'Read in under a second. Never forgotten.',
            medium: 'Walk into any room and watch the energy shift toward you.',
            body: "Most men spend their whole lives wondering why certain people just have it — the presence that makes a room go quiet, the frame that makes people want to be near them. It was never luck. It's trainable, and Track 01 hands you the exact system: posture, nervous system regulation, physical command. Start today and you'll notice the difference by the end of the week.",
            image: '/maxxing-images/magnetism-maxxing.png',
          },
          {
            prefix: 'Manifesting ',
            small: "Your mind is either working for you or against you. There is no neutral.",
            medium: 'Rewire the inner voice that\'s been quietly capping your ceiling.',
            body: "The gap between the life you picture and the life you're living isn't talent, and it isn't luck — it's the untrained mind running old, limiting patterns on autopilot. Track 04 gives you the actual mechanics: discipline systems that don't depend on motivation, and the mindset frameworks serious operators actually use. This is the track members say changes everything else.",
            image: '/maxxing-images/manifesting-maxxing.jpg',
          },
          {
            prefix: 'Money ',
            small: 'Income is a skill. Skills can be learned starting tonight.',
            medium: 'Stop trading hours for scraps. Start building leverage.',
            body: "Every man in this program started exactly where you are right now — no client list, no track record, no idea where to begin. Track 03 gives you the entire playbook: picking a sellable skill, cold outreach that actually gets replies, closing without begging, and using AI to do in an hour what used to take a week. The only difference between you and someone already making real money from this is the day they started.",
            image: '/maxxing-images/money-maxxing.jpg',
          },
        ].map((block, i) => (
          <ScrollReveal key={block.prefix} delay={100}>
            <div
              style={{
                minHeight: '85vh',
                display: 'flex',
                alignItems: 'center',
                padding: '100px 24px',
              }}
            >
              <div
                style={{
                  maxWidth: 1100,
                  margin: '0 auto',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 48,
                  alignItems: 'center',
                  direction: i % 2 === 1 ? 'rtl' : 'ltr',
                }}
              >
                <div style={{ direction: 'ltr' }}>
                  <h2
                    style={{
                      fontSize: 'clamp(2.6rem, 5.5vw, 4.6rem)',
                      fontWeight: 700,
                      color: '#fff',
                      marginBottom: 18,
                      lineHeight: 1.05,
                    }}
                  >
                    {block.prefix}
                    <span
                      style={{
                        color: 'var(--rank-gold)',
                        textShadow:
                          '0 0 18px rgba(232,184,109,0.8), 0 0 46px rgba(232,184,109,0.4)',
                      }}
                    >
                      Maxxing
                    </span>
                  </h2>
                  <div
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '0.9rem',
                      color: 'rgba(255,255,255,0.55)',
                      marginBottom: 10,
                    }}
                  >
                    {block.small}
                  </div>
                  <div
                    style={{
                      fontSize: '1.25rem',
                      color: 'rgba(255,255,255,0.8)',
                      marginBottom: 20,
                    }}
                  >
                    {block.medium}
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 420 }}>{block.body}</p>
                </div>

                <div style={{ direction: 'ltr' }}>
                  <img
                    src={block.image}
                    alt={`${block.prefix}Maxxing`}
                    style={{
                      width: '100%',
                                            aspectRatio: '16 / 10',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      borderRadius: 16,
                      border: '1px solid rgba(255,255,255,0.1)',
                      boxShadow: '0 0 40px rgba(232,184,109,0.15)',
                    }}
                  />
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </section>

      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: '170vh',
          background:
            'linear-gradient(to bottom, #060911 0%, #070a14 20%, #0a0a18 40%, #0d0a1c 58%, #0a0714 74%, #050308 90%, #030205 100%)',
          padding: '160px 24px',
        }}
      >
        <style>{`
          @keyframes boltFlicker {
            0%, 92%, 100% { opacity: 0; }
            93% { opacity: 1; }
            94% { opacity: 0.15; }
            95.5% { opacity: 0.9; }
            97% { opacity: 0; }
          }
          .mini-bolt { animation: boltFlicker 7s infinite; }
        `}</style>

        {/* blue veins, strongest near the top, fading out by mid-section */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 15%, transparent 48%)',
            maskImage: 'linear-gradient(to bottom, black 0%, black 15%, transparent 48%)',
          }}
        >
          <svg viewBox="0 0 1440 2600" preserveAspectRatio="xMidYMin slice" style={{ width: '100%', height: '100%' }}>
            <path
              d="M160,0 C220,160 100,300 190,460 C260,600 130,760 220,920"
              fill="none"
              stroke="var(--vein-glow)"
              strokeWidth="1"
              opacity="0.55"
            />
            <path
              d="M1280,40 C1220,200 1340,340 1260,520 C1200,680 1320,840 1240,1000"
              fill="none"
              stroke="var(--vein-glow)"
              strokeWidth="1"
              opacity="0.4"
            />
            <path
              d="M700,0 C660,180 780,320 700,500 C640,660 760,820 700,1000"
              fill="none"
              stroke="var(--vein-blue)"
              strokeWidth="1"
              opacity="0.45"
            />
          </svg>
        </div>

        {/* purple veins, fading in around the midpoint, gone by the black floor */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 38%, black 58%, black 78%, transparent 92%)',
            maskImage: 'linear-gradient(to bottom, transparent 38%, black 58%, black 78%, transparent 92%)',
          }}
        >
          <svg viewBox="0 0 1440 2600" preserveAspectRatio="xMidYMin slice" style={{ width: '100%', height: '100%' }}>
            <path
              d="M200,900 C280,1060 140,1200 240,1360 C320,1500 180,1660 260,1820"
              fill="none"
              stroke="#a855f7"
              strokeWidth="1"
              opacity="0.5"
            />
            <path
              d="M1240,1000 C1160,1140 1300,1280 1200,1440 C1120,1580 1260,1740 1180,1900"
              fill="none"
              stroke="#a855f7"
              strokeWidth="1"
              opacity="0.4"
            />
            <path
              d="M760,1100 C820,1260 700,1400 780,1560 C840,1700 720,1860 780,2000"
              fill="none"
              stroke="#c084fc"
              strokeWidth="1"
              opacity="0.35"
            />
          </svg>
        </div>

        {/* mini lightning bolts in the fully black lower field */}
        {[
          { top: '62%', left: '8%', delay: '0s', scale: 0.8 },
          { top: '70%', left: '88%', delay: '1.4s', scale: 1 },
          { top: '78%', left: '18%', delay: '2.6s', scale: 0.6 },
          { top: '84%', left: '72%', delay: '0.7s', scale: 0.9 },
          { top: '90%', left: '40%', delay: '3.5s', scale: 0.7 },
          { top: '66%', left: '55%', delay: '4.8s', scale: 0.65 },
          { top: '95%', left: '80%', delay: '2s', scale: 0.85 },
          { top: '88%', left: '10%', delay: '5.6s', scale: 0.75 },
        ].map((b, i) => (
          <svg
            key={i}
            className="mini-bolt"
            viewBox="0 0 14 22"
            style={{
              position: 'absolute',
              top: b.top,
              left: b.left,
              width: 14 * b.scale,
              height: 22 * b.scale,
              filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8))',
              animationDelay: b.delay,
            }}
          >
            <path d="M8 0L1 13h4l-2 9 9-14H8z" fill="#ffffff" />
          </svg>
        ))}

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            maxWidth: 880,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 64,
          }}
        >
          <div
            style={{
              textAlign: 'center',
              padding: '70px 40px',
              background: 'rgba(4,3,8,0.7)',
              border: '1px solid rgba(192,132,252,0.35)',
              borderRadius: 14,
              boxShadow: '0 0 70px rgba(168,85,247,0.22)',
            }}
          >
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.78rem',
                letterSpacing: '0.25em',
                color: 'rgba(192,132,252,0.7)',
                textTransform: 'uppercase',
                marginBottom: 18,
              }}
            >
              The Final Tier
            </div>
            <div
              style={{
                fontSize: 'clamp(2.8rem, 7vw, 5.6rem)',
                fontWeight: 800,
                color: '#c084fc',
                letterSpacing: '0.04em',
                textShadow: '0 0 24px rgba(192,132,252,0.9), 0 0 70px rgba(168,85,247,0.5)',
              }}
            >
              ASCENDING
            </div>
          </div>

          <div
            style={{
              background: '#020204',
              border: '1px solid rgba(192,132,252,0.28)',
              borderRadius: 14,
              padding: 'clamp(22px, 6vw, 56px) clamp(16px, 5vw, 44px)',
              boxShadow: '0 0 60px rgba(168,85,247,0.15)',
            }}
          >
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 4vw, 30px)', fontSize: 'clamp(0.8rem, 3.3vw, 1rem)' }}>
              {[
                <>
                  <strong style={{ color: '#c084fc', textShadow: '0 0 12px rgba(192,132,252,0.65)' }}>
                    Full S-Rank unlock
                  </strong>{' '}
                  across all 4 core tracks — the deepest, most guarded modules in Physical, Social, Income, and Inner
                  Work.
                </>,
                <>
                  <strong style={{ color: '#c084fc', textShadow: '0 0 12px rgba(192,132,252,0.65)' }}>
                    4 additional Ascending-only tracks
                  </strong>{' '}
                  — Hidden History, Esoteric Perception &amp; Energy Work, Universal Law &amp; Metaphysics, and Modern
                  Systems &amp; Control. 60 more modules, found nowhere else.
                </>,
                <>
                  Access to the{' '}
                  <strong style={{ color: '#c084fc', textShadow: '0 0 12px rgba(192,132,252,0.65)' }}>
                    private Community
                  </strong>{' '}
                  — the closest thing available to sitting at the table with men who already built what you're
                  chasing.
                </>,
                <>
                  A{' '}
                  <strong style={{ color: '#c084fc', textShadow: '0 0 12px rgba(192,132,252,0.65)' }}>
                    living knowledge base
                  </strong>{' '}
                  that compounds daily, sharpened by our own professionals and every member who walked through the
                  door before you.
                </>,
                <>
                  <strong style={{ color: '#c084fc', textShadow: '0 0 12px rgba(192,132,252,0.65)' }}>
                    Direct content requests
                  </strong>{' '}
                  — help shape what gets built into the library next.
                </>,
                <>
                  Everything already in Starter, permanently included —{' '}
                  <strong style={{ color: '#c084fc', textShadow: '0 0 12px rgba(192,132,252,0.65)' }}>
                    nothing gated behind a second purchase
                  </strong>
                  .
                </>,
                <>
                  <strong style={{ color: 'var(--rank-gold)', textShadow: '0 0 12px rgba(232,184,109,0.65)' }}>
                    Founding Hunter pricing locked in
                  </strong>{' '}
                  before it rises for good.
                </>,
                <>
                  The only path to{' '}
                  <strong style={{ color: 'var(--rank-gold)', textShadow: '0 0 12px rgba(232,184,109,0.65)' }}>
                    Rank S
                  </strong>{' '}
                  — the rank most members will never reach.
                </>,
              ].map((item, i) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 16,
                    alignItems: 'flex-start',
                    color: 'rgba(255,255,255,0.78)',
                    fontSize: '1.08rem',
                    lineHeight: 1.65,
                  }}
                >
                  <span style={{ color: '#c084fc', fontSize: '1.2rem', lineHeight: 1.4 }}>◆</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: '150vh',
          background:
            'linear-gradient(to bottom, #030205 0%, #020204 26%, #04070d 62%, #060b16 84%, #081019 100%)',
          padding: '220px 24px 160px',
        }}
      >
        {/* faint blue vein wash returning near the bottom, easing into the page's base tone before the FAQ */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 55%, black 82%, black 100%)',
            maskImage: 'linear-gradient(to bottom, transparent 55%, black 82%, black 100%)',
          }}
        >
          <svg viewBox="0 0 1440 1800" preserveAspectRatio="xMidYMax slice" style={{ width: '100%', height: '100%' }}>
            <path
              d="M180,1800 C240,1660 140,1540 220,1400 C290,1280 190,1160 260,1040"
              fill="none"
              stroke="var(--vein-glow)"
              strokeWidth="1"
              opacity="0.4"
            />
            <path
              d="M1260,1800 C1200,1650 1300,1520 1220,1380 C1160,1260 1280,1140 1200,1020"
              fill="none"
              stroke="var(--vein-glow)"
              strokeWidth="1"
              opacity="0.35"
            />
          </svg>
        </div>

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            maxWidth: 880,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 64,
          }}
        >
          <div
            style={{
              textAlign: 'center',
              padding: '70px 40px',
              background: 'rgba(4,3,8,0.7)',
              border: '1px solid rgba(232,184,109,0.35)',
              borderRadius: 14,
              boxShadow: '0 0 70px rgba(168,85,247,0.18), 0 0 40px rgba(232,184,109,0.12)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img
              src="/maxxing-images/magnetism-maxxing.png"
              alt="H3E"
              style={{
                width: 'clamp(64px, 18vw, 100px)',
                height: 'clamp(64px, 18vw, 100px)',
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: 26,
                boxShadow: '0 0 40px rgba(232,184,109,0.6), 0 0 70px rgba(168,85,247,0.4)',
                border: '1px solid rgba(232,184,109,0.5)',
              }}
            />
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.78rem',
                letterSpacing: '0.25em',
                color: 'rgba(232,184,109,0.75)',
                textTransform: 'uppercase',
                marginBottom: 18,
              }}
            >
              The Summit
            </div>
            <div
              style={{
                fontSize: 'clamp(2.6rem, 6.5vw, 5rem)',
                fontWeight: 800,
                color: 'var(--rank-gold)',
                letterSpacing: '0.04em',
                textShadow: '0 0 24px rgba(232,184,109,0.9), 0 0 70px rgba(232,184,109,0.4)',
              }}
            >
              H3E
            </div>
            <div
              style={{
                fontSize: 'clamp(0.9rem, 3vw, 1.1rem)',
                color: 'rgba(255,255,255,0.65)',
                marginTop: 14,
                maxWidth: 520,
                lineHeight: 1.6,
              }}
            >
              Every rank, every module, every hour of work in this entire curriculum was always leading here — to
              the room at the top of the mountain.
            </div>
          </div>

          <div
            style={{
              background: '#020204',
              border: '1px solid rgba(232,184,109,0.25)',
              borderRadius: 14,
              padding: 'clamp(22px, 6vw, 56px) clamp(16px, 5vw, 44px)',
              boxShadow: '0 0 60px rgba(168,85,247,0.12), 0 0 40px rgba(232,184,109,0.08)',
            }}
          >
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 4vw, 30px)', fontSize: 'clamp(0.8rem, 3.3vw, 1rem)' }}>
              {[
                <>
                  <strong style={{ color: 'var(--rank-gold)', textShadow: '0 0 12px rgba(232,184,109,0.7)' }}>
                    The peak of the entire path
                  </strong>{' '}
                  — where every module, every rank, every hour of work you've put in has been quietly leading.
                </>,
                <>
                  A gathering ground for{' '}
                  <strong style={{ color: '#c084fc', textShadow: '0 0 12px rgba(192,132,252,0.65)' }}>
                    professors, professionals, and self-made men
                  </strong>{' '}
                  — the kind of people who've already built what most of the world is still chasing.
                </>,
                <>
                  Built from the ground up, together —{' '}
                  <strong style={{ color: '#c084fc', textShadow: '0 0 12px rgba(192,132,252,0.65)' }}>
                    the hidden knowledge stays under construction until the brotherhood itself supplies what fills
                    it.
                  </strong>
                </>,
                <>
                  Submit what you know,{' '}
                  <strong style={{ color: 'var(--rank-gold)', textShadow: '0 0 12px rgba(232,184,109,0.7)' }}>
                    completely anonymously
                  </strong>{' '}
                  — every insight shared gets woven directly into the modules, making the library more real, more
                  valuable, and longer with every contribution.
                </>,
                <>
                  <strong style={{ color: 'var(--rank-gold)', textShadow: '0 0 12px rgba(232,184,109,0.7)' }}>
                    Get rich. Look better. Talk to women with real confidence. Get stronger.
                  </strong>{' '}
                  Every domain this program touches, discussed openly by men actually living it.
                </>,
                <>
                  A brotherhood raising the{' '}
                  <strong style={{ color: '#c084fc', textShadow: '0 0 12px rgba(192,132,252,0.65)' }}>
                    collective frequency
                  </strong>{' '}
                  — wisdom pulled up from the depths and handed to everyone willing to climb for it.
                </>,
                <>
                  <strong style={{ color: '#c084fc', textShadow: '0 0 12px rgba(192,132,252,0.65)' }}>
                    Conspiracies, forbidden history, and theories most classrooms will never teach
                  </strong>{' '}
                  — shared here first, before anywhere else.
                </>,
                <>
                  <strong style={{ color: 'var(--rank-gold)', textShadow: '0 0 12px rgba(232,184,109,0.7)' }}>
                    The only door that never closes once you've earned it
                  </strong>{' '}
                  — reach genuine 100% completion, and the invitation is yours for good.
                </>,
              ].map((item, i) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 16,
                    alignItems: 'flex-start',
                    color: 'rgba(255,255,255,0.78)',
                    fontSize: '1.08rem',
                    lineHeight: 1.65,
                  }}
                >
                  <span style={{ color: 'var(--rank-gold)', fontSize: '1.2rem', lineHeight: 1.4 }}>◆</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section><section className="section-pad" id="faq">
        <div className="section-head">
          <div className="section-eyebrow">System Log</div>
          <h2 className="section-title">Questions</h2>
        </div>
        <div className="faq-list">
          {FAQS.map((item) => (
            <Faq key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </section>

      <footer>
        MAGNETISM MAXXING — Everything taught here is for educational purposes only. It's on each student to
        actually implement and do the work. We don't guarantee profits or income — we guarantee real knowledge from
        serious sources, alongside community-based theories, conspiracies, and shared opinion, clearly presented as
        such. · © 2026 · <a href="/terms" style={{ color: 'inherit' }}>TERMS</a> · <a href="/privacy" style={{ color: 'inherit' }}>PRIVACY</a> · <a href="/dmca" style={{ color: 'inherit' }}>DMCA</a>
      </footer>
    </>
  )
}
