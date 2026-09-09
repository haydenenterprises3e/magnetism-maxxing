import { useRef, useState } from 'react'
import type { QuizQuestion } from '../lib/quizParser'

export function QuizRunner({
  questions,
  scoringNote,
  onFinish,
}: {
  questions: QuizQuestion[]
  scoringNote?: string | null
  /** Called once, the moment the final question is answered. */
  onFinish?: (score: number, total: number) => void
}) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const finishedRef = useRef(false)

  const total = questions.length
  const question = questions[index]
  const isLast = index === total - 1

  function pick(letter: string) {
    if (selected) return // already answered this one
    setSelected(letter)
    const correct = letter === question.correct
    const nextScore = correct ? score + 1 : score
    if (correct) setScore(nextScore)

    if (isLast) {
      setDone(true)
      if (!finishedRef.current) {
        finishedRef.current = true
        onFinish?.(nextScore, total)
      }
    }
  }

  function next() {
    setIndex((i) => i + 1)
    setSelected(null)
  }

  function retake() {
    setIndex(0)
    setSelected(null)
    setScore(0)
    setDone(false)
    finishedRef.current = false
  }

  if (done) {
    const pct = Math.round((score / total) * 100)
    const strong = score / total >= 0.75
    return (
      <div className="quiz-done">
        <div className="section-eyebrow">TEST COMPLETE</div>
        <h3 className="quiz-question-title">
          You scored {score}/{total}
        </h3>
        <div className="bar-track" style={{ marginTop: 20, marginBottom: 8 }}>
          <div className={`bar-fill${strong ? '' : ' bar-fill-weak'}`} style={{ width: `${pct}%` }} />
        </div>
        <p className="quiz-question-sub">
          {scoringNote ?? (strong ? 'Strong grasp — move on to the next module.' : 'Consider revisiting the modules this test covers.')}
        </p>
        <button type="button" className="btn-ghost quiz-submit" onClick={retake} style={{ marginTop: 22 }}>
          Retake Test
        </button>
      </div>
    )
  }

  return (
    <div className="quiz-runner">
      <div className="status-row" style={{ marginBottom: 8 }}>
        <span>
          QUESTION {index + 1} / {total}
        </span>
        <span>SCORE {score}</span>
      </div>
      <div className="bar-track" style={{ marginBottom: 28 }}>
        <div className="bar-fill" style={{ width: `${Math.round((index / total) * 100)}%` }} />
      </div>

      <h3 className="quiz-question-title">{question.text}</h3>

      <div className="quiz-options">
        {question.options.map((opt) => {
          const isCorrectOption = opt.letter === question.correct
          const isSelected = opt.letter === selected
          let stateClass = ''
          if (selected) {
            if (isCorrectOption) stateClass = ' quiz-option-correct'
            else if (isSelected) stateClass = ' quiz-option-incorrect'
            else stateClass = ' quiz-option-muted'
          }
          return (
            <button
              key={opt.letter}
              type="button"
              className={`quiz-option${stateClass}`}
              onClick={() => pick(opt.letter)}
              disabled={!!selected}
            >
              <span className="quiz-option-letter">{opt.letter}</span>
              {opt.text}
              {selected && isCorrectOption && <span className="quiz-option-mark">✓</span>}
              {selected && isSelected && !isCorrectOption && <span className="quiz-option-mark">✗</span>}
            </button>
          )
        })}
      </div>

      {selected && !isLast && (
        <button type="button" className="btn-primary quiz-submit" onClick={next} style={{ marginTop: 26 }}>
          Next Question →
        </button>
      )}
    </div>
  )
}
