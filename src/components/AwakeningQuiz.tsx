import { useEffect, useState } from 'react'
import { PLANS } from '../lib/plans'

declare global {
  interface Window {
    whop?: { track: (event: string, data?: Record<string, unknown>) => void }
  }
}

type Answers = {
  source: string
  goal: string
  track: string
  stage: string
  blocker: string
  priority: string
  age: string
  email: string
}

const EMPTY_ANSWERS: Answers = {
  source: '',
  goal: '',
  track: '',
  stage: '',
  blocker: '',
  priority: '',
  age: '',
  email: '',
}

const QUESTIONS: Array<{
  key: keyof Omit<Answers, 'email'>
  title: string
  subtitle?: string
  options: string[]
}> = [
  {
    key: 'source',
    title: 'Where did you find us?',
    options: ['TikTok', 'YouTube', 'Instagram', 'Other'],
  },
  {
    key: 'goal',
    title: "What's your main goal right now?",
    options: [
      'Build confidence & social skills',
      'Get in better shape / improve my physique',
      'Make more money / start earning online',
      'Fix my mindset & discipline',
      'All of the above, I want the full system',
    ],
  },
  {
    key: 'track',
    title: 'Which track feels weakest for you right now?',
    options: [
      'Physical (fitness, presence, posture)',
      'Social (confidence, conversation)',
      'Income (sales, building, earning)',
      'Inner Work (discipline, focus, mindset)',
    ],
  },
  {
    key: 'stage',
    title: "How would you describe where you're at today?",
    options: [
      'Just starting out, ready to learn',
      "I've made some progress but stalled",
      "I'm doing okay but want to go further, faster",
      "I've tried other programs/courses and they didn't stick",
    ],
  },
  {
    key: 'blocker',
    title: "What's held you back the most so far?",
    options: [
      "Lack of structure / don't know where to start",
      'Motivation / consistency',
      'Not having people around me on the same path',
      'Money / resources',
    ],
  },
  {
    key: 'priority',
    title: 'What matters most to you in a program like this?',
    options: [
      'A clear step-by-step system',
      'A community to grow alongside',
      'Direct access to coaching/feedback',
      'Fast, visible results',
    ],
  },
  {
    key: 'age',
    title: 'Age range?',
    options: ['18–20', '21–24', '25–30', '31+'],
  },
]

const TOTAL_STEPS = QUESTIONS.length + 1 // + email step

function trackName(trackAnswer: string) {
  return trackAnswer.split(' (')[0]
}

function recommendPlan(answers: Answers) {
  const wantsCoaching = answers.priority === 'Direct access to coaching/feedback'
  const wantsFullSystem = answers.goal === 'All of the above, I want the full system'
  const triedBefore = answers.stage === "I've tried other programs/courses and they didn't stick"
  const recommendAscending = wantsCoaching || wantsFullSystem || triedBefore
  return PLANS.find((p) => p.key === (recommendAscending ? 'ascending' : 'starter')) ?? PLANS[0]
}

export function AwakeningQuiz({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS)
  const [submitted, setSubmitted] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  function reset() {
    setStep(0)
    setAnswers(EMPTY_ANSWERS)
    setEmail('')
    setSubmitted(false)
  }

  function handleClose() {
    onClose()
    // Give the close animation/state a beat before wiping progress.
    setTimeout(reset, 200)
  }

  function selectAnswer(key: keyof Omit<Answers, 'email'>, value: string) {
    const next = { ...answers, [key]: value }
    setAnswers(next)
    window.whop?.track(`quiz:${key}_selected`, { value })
    setStep((s) => s + 1)
  }

  function submitEmail(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    const recommended = recommendPlan(answers)
    window.whop?.track('identify', { email })
    window.whop?.track('lead', {
      source: answers.source,
      goal: answers.goal,
      track: answers.track,
      stage: answers.stage,
      blocker: answers.blocker,
      priority: answers.priority,
      age: answers.age,
      email,
      recommended_plan: recommended.title,
    })
    setSubmitted(true)
  }

  const onQuestionStep = step < QUESTIONS.length
  const progressPct = Math.min(100, Math.round((step / TOTAL_STEPS) * 100))

  return (
    <div className="quiz-overlay" role="dialog" aria-modal="true" onClick={handleClose}>
      <div className="quiz-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="quiz-close" onClick={handleClose} aria-label="Close">
          ×
        </button>

        {!submitted && (
          <>
            <div className="status-row" style={{ marginBottom: 8 }}>
              <span>AWAKENING SCAN</span>
              <span>{progressPct}%</span>
            </div>
            <div className="bar-track" style={{ marginBottom: 30 }}>
              <div className="bar-fill" style={{ width: `${progressPct}%` }} />
            </div>
          </>
        )}

        {onQuestionStep && !submitted && (
          <div>
            <div className="section-eyebrow">
              QUESTION {step + 1} / {QUESTIONS.length}
            </div>
            <h3 className="quiz-question-title">{QUESTIONS[step].title}</h3>
            {QUESTIONS[step].subtitle && <p className="quiz-question-sub">{QUESTIONS[step].subtitle}</p>}
            <div className="quiz-options">
              {QUESTIONS[step].options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className="quiz-option"
                  onClick={() => selectAnswer(QUESTIONS[step].key, opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
            {step > 0 && (
              <span className="quiz-back" onClick={() => setStep((s) => s - 1)}>
                ← back
              </span>
            )}
          </div>
        )}

        {!onQuestionStep && !submitted && (
          <form onSubmit={submitEmail}>
            <div className="section-eyebrow">FINAL STEP</div>
            <h3 className="quiz-question-title">Unlock your results</h3>
            <p className="quiz-question-sub">
              Enter your email to see your recommended track and rank. We store your email and quiz answers with our platform provider, Whop, and may contact you about the program. See our <a href="/privacy">Privacy Policy</a>.
            </p>
            <div className="quiz-email-row">
              <input
                type="email"
                required
                placeholder="you@email.com"
                className="quiz-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="btn-primary quiz-submit">
                Unlock My Path
              </button>
            </div>
            <span className="quiz-back" onClick={() => setStep((s) => s - 1)}>
              ← back
            </span>
          </form>
        )}

        {submitted &&
          (() => {
            const recommended = recommendPlan(answers)
            return (
              <div className="quiz-done">
                <div className="section-eyebrow">SCAN COMPLETE</div>
                <h3 className="quiz-question-title">Your path has been calculated.</h3>
                <p className="quiz-question-sub">
                  Focused on the <strong>{trackName(answers.track)}</strong> track, working toward{' '}
                  <strong>{answers.goal.toLowerCase()}</strong>. We'll send your full breakdown to{' '}
                  <strong>{email}</strong>.
                </p>

                <div className="quiz-recommendation">
                  <div className="section-eyebrow">Recommended For You</div>
                  <div className="price-rank" style={{ marginTop: 10 }}>
                    {recommended.rankLabel}
                  </div>
                  <div className="price-amount">
                    ${recommended.introPrice}
                    <span>first month</span>
                  </div>
                  <div className="price-then">then ${recommended.price}/mo</div>
                </div>

                <a
                  className="btn-primary quiz-submit"
                  href={recommended.purchaseUrl}
                  onClick={() => {
                    window.whop?.track('view_content', {
                      plan: recommended.title,
                      value: recommended.price,
                      currency: 'USD',
                      source: 'quiz_recommendation',
                    })
                    handleClose()
                  }}
                >
                  Get {recommended.title} — {recommended.ctaLabel}
                </a>
                <span
                  className="quiz-back"
                  onClick={() => {
                    handleClose()
                    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  See all plans
                </span>
              </div>
            )
          })()}
      </div>
    </div>
  )
}
