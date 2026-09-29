/**
 * Lesson versions. Every lesson is version 1 unless listed here.
 * When you rewrite a lesson, raise its number by 1: members who already
 * completed it see a purple glow until they mark it complete again.
 * Keys: `${track}__${lesson}` for core lessons,
 *       `deeper__${section}__${lesson}` for Deeper Knowledge.
 * (Both come straight from the lesson's URL.)
 */
export const LESSON_VERSIONS: Record<string, number> = {
  // 'track-slug__lesson-slug': 2,
}

export function lessonVersion(key: string): number {
  return LESSON_VERSIONS[key] ?? 1
}

export type CompletionState = 'none' | 'current' | 'updated'

export function completionState(completed: Set<string>, key: string): CompletionState {
  if (!completed.has(key)) return 'none'
  const v = lessonVersion(key)
  return v <= 1 || completed.has(`${key}@v${v}`) ? 'current' : 'updated'
}
