/**
 * Parses a test module's markdown content (as authored in pathData.ts) into
 * structured questions so they can be rendered one at a time as an
 * interactive quiz, instead of a static wall of markdown.
 *
 * Two authored formats exist in the content and both are handled:
 *   - "**1. Question text?**"      (whole question bolded)
 *   - "**1.** Question text?"      (only the number bolded)
 * Options are always "A) text" / "B) text" / "C) text" / "D) text".
 * The answer key line appears in either "1: B | 2: B" or "1. B  2. B" form.
 */

export type QuizOption = { letter: string; text: string }
export type QuizQuestion = {
  number: number
  text: string
  options: QuizOption[]
  correct: string
}
export type ParsedQuiz = {
  /** Markdown before the first question — title, rank line, opening quote. */
  intro: string
  questions: QuizQuestion[]
  /** The "**Scoring:** ..." line, if present, stripped of its bold markers. */
  scoringNote: string | null
}

export function parseQuiz(content: string): ParsedQuiz | null {
  const lines = content.split('\n')

  const answerKeyIdx = lines.findIndex((l) => /ANSWER KEY/i.test(l))
  if (answerKeyIdx === -1) return null

  // --- answer key ---
  let answerText = ''
  let scoringNote: string | null = null
  for (let i = answerKeyIdx + 1; i < lines.length; i++) {
    const trimmed = lines[i].trim()
    if (/^\*\*Scoring/i.test(trimmed)) {
      scoringNote = trimmed.replace(/\*\*/g, '')
      continue
    }
    answerText += `${lines[i]} `
  }
  const answerMap = new Map<number, string>()
  const answerRegex = /(\d+)\s*[:.]\s*([A-D])\b/g
  let am: RegExpExecArray | null
  while ((am = answerRegex.exec(answerText))) {
    answerMap.set(Number(am[1]), am[2])
  }
  if (answerMap.size === 0) return null

  // --- questions (everything before the answer key) ---
  const questions: QuizQuestion[] = []
  let current: QuizQuestion | null = null
  let firstQuestionLine = -1

  for (let i = 0; i < answerKeyIdx; i++) {
    const stripped = lines[i].replace(/\*\*/g, '').trim()
    const qMatch = stripped.match(/^(\d+)\.\s*(.*)$/)
    const optMatch = stripped.match(/^([A-D])\)\s*(.*)$/)

    if (qMatch && Number(qMatch[1]) > 0) {
      if (current) questions.push(current)
      current = { number: Number(qMatch[1]), text: qMatch[2], options: [], correct: '' }
      if (firstQuestionLine === -1) firstQuestionLine = i
    } else if (optMatch && current) {
      current.options.push({ letter: optMatch[1], text: optMatch[2] })
    }
  }
  if (current) questions.push(current)
  if (questions.length === 0) return null

  for (const q of questions) {
    q.correct = answerMap.get(q.number) ?? ''
  }
  // Every question needs 2+ options and a recognized correct answer to be usable.
  if (questions.some((q) => q.options.length < 2 || !q.correct)) return null

  const intro = firstQuestionLine > 0 ? lines.slice(0, firstQuestionLine).join('\n').replace(/\n?---\s*$/, '').trim() : ''

  return { intro, questions, scoringNote }
}
