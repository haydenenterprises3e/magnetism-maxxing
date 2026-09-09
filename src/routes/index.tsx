import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { AwakeningQuiz } from '../components/AwakeningQuiz'
import { PricingModal } from '../components/PricingModal'
import { HunterStatus } from '../components/HunterStatus'
import { PLANS } from '../lib/plans'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [{ title: 'Magnetism Maxxing — The Awakening Path' }],
  }),
  component: Home,
})

const FAQS = [
  {
    q: 'Do I need to be athletic or "naturally social" to start?',
    a: 'No. The system is built for rank E — meaning zero prior experience. Every track starts at the fundamentals.',
  },
  {
    q: 'How is this different from free content online?',
    a: 'Structure and accountability. You get a tracked path, a community at your same rank, and direct access to feedback instead of guessing what to watch next.',
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

function Home() {
  const [quizOpen, setQuizOpen] = useState(false)
  const [pricingOpen, setPricingOpen] = useState(false)

  return (
    <>
      <VeinBackground />
      <AwakeningQuiz open={quizOpen} onClose={() => setQuizOpen(false)} />
      <PricingModal open={pricingOpen} onClose={() => setPricingOpen(false)} />
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
          Most people never <span className="glow">awaken.</span>
        </h1>
        <p className="hero-sub">
          A structured path for rebuilding your body, your presence, and your income — one rank at a time. No
          theory. Tracked progress, real mentorship, a system built to level you up.
        </p>
        <div className="hero-ctas">
          <button type="button" className="btn-primary" onClick={() => setQuizOpen(true)}>
            Begin Your Awakening
          </button>
          <button type="button" className="btn-ghost" onClick={() => setPricingOpen(true)}>
            See the Tracks
          </button>
        </div>

        <HunterStatus />
      </section>

      <section className="section-pad" id="tracks">
        <div className="section-head">
          <div className="section-eyebrow">The Four Tracks</div>
          <h2 className="section-title">Everything levels together</h2>
          <p className="section-sub">
            Presence isn't one skill. It's built in layers — and each layer trains a different part of who you are.
          </p>
          <h3 className="section-note">
            Our team of professionals, prioritize results through the growth of learning, understanding and
            implementing into ones life.
          </h3>
        </div>
        <div className="tracks-grid">
          <div className="track-card">
            <div className="track-tag">TRACK 01</div>
            <div className="track-name">Physical</div>
            <div className="track-desc">
              Training, posture, frame, grooming — the stat points people see before you say a word.
            </div>
            <div className="track-stat">STR + END + APP +</div>
          </div>
          <div className="track-card">
            <div className="track-tag">TRACK 02</div>
            <div className="track-name">Social</div>
            <div className="track-desc">
              Conversation, presence, reading a room — built on genuine confidence, not scripts.
            </div>
            <div className="track-stat">CHA + INT + PRE +</div>
          </div>
          <div className="track-card">
            <div className="track-tag">TRACK 03</div>
            <div className="track-name">Income</div>
            <div className="track-desc">
              Sales, cold outreach, building with AI, and shipping real things people pay for.
            </div>
            <div className="track-stat">SKL + RES + GLD +</div>
          </div>
          <div className="track-card">
            <div className="track-tag">TRACK 04</div>
            <div className="track-name">Inner Work</div>
            <div className="track-desc">
              Discipline, focus, and the mindset frameworks that hold the other three tracks together.
            </div>
            <div className="track-stat">WIL + FOC + CLM +</div>
          </div>
        </div>
      </section>

      <section className="section-pad" id="reports">
        <div className="section-head">
          <div className="section-eyebrow">Field Reports</div>
          <h2 className="section-title">Hunters who leveled up</h2>
        </div>
        <div className="reports-grid">
          <div className="report-card">
            <div className="report-rank">RANK D → RANK B</div>
            <p className="report-text">
              "I stopped waiting to feel ready and just started logging reps — in the gym and in conversations. Six
              weeks in, people noticed before I did."
            </p>
            <div className="report-name">— Member, Physical + Social Track</div>
          </div>
          <div className="report-card">
            <div className="report-rank">RANK E → RANK C</div>
            <p className="report-text">
              "The income track is the first place cold calling actually made sense to me. First paid client in
              week three."
            </p>
            <div className="report-name">— Member, Income Track</div>
          </div>
          <div className="report-card">
            <div className="report-rank">RANK C → RANK A</div>
            <p className="report-text">
              "Less about hacks, more about actually becoming someone worth being around. That shift changed
              everything else."
            </p>
            <div className="report-name">— Member, Inner Work Track</div>
          </div>
        </div>
      </section>

      <section className="section-pad" id="pricing">
        <div className="section-head">
          <div className="section-eyebrow">Choose Your Rank</div>
          <h2 className="section-title">Enter the gate</h2>
          <p className="section-sub">Cancel anytime. No contracts, no hidden tiers.</p>
        </div>
        <div className="pricing-grid">
          {PLANS.map((plan) => (
            <div key={plan.key} className={`price-card${plan.featured ? ' featured' : ''}`}>
              <div className="price-rank">{plan.rankLabel}</div>
              <div className="price-amount">
                ${plan.introPrice}
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
          ))}
        </div>
      </section>

      <section className="section-pad" id="faq">
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

      <footer>MAGNETISM MAXXING — THE AWAKENING PATH · © 2026 · TERMS · PRIVACY</footer>
    </>
  )
}
