export type Rank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S'
export type Tier = 'starter' | 'ascending'

export type Lesson = {
  name: string
  slug: string
  rank: Rank
  tier: Tier
  isTest: boolean
  content: string
}
export type TrackData = { title: string; slug: string; lessons: Lesson[] }

/** Rank progression order. E is always unlocked; each later rank requires every lesson of the rank before it. */
export const RANK_ORDER: Rank[] = ['E', 'D', 'C', 'B', 'A', 'S']

/** The unique key a lesson is tracked and stored under. */
export function lessonKey(trackSlug: string, lessonSlug: string): string {
  return `${trackSlug}__${lessonSlug}`
}

/**
 * Whether a rank tier is unlocked in this track: E always is; every later rank
 * requires every lesson of the rank immediately before it to be complete.
 * S additionally requires an active Ascending membership.
 */
export function isRankUnlocked(track: TrackData, rank: Rank, completed: Set<string>, hasAscending: boolean): boolean {
  const idx = RANK_ORDER.indexOf(rank)
  if (idx <= 0) return true

  const prevRank = RANK_ORDER[idx - 1]
  const prevLessons = track.lessons.filter((l) => l.rank === prevRank)
  const allPrevDone = prevLessons.length > 0 && prevLessons.every((l) => completed.has(lessonKey(track.slug, l.slug)))

  return rank === 'S' ? allPrevDone && hasAscending : allPrevDone
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Module text goes here as it's written, keyed by `${trackSlug}__${lessonSlug}`.
 * Lesson names like "Test: Foundations Check" repeat across tracks with different
 * content, so the track is part of the key. Empty until filled in. Stored as
 * markdown — rendered with react-markdown on the module page.
 */

type LessonSpec = { name: string; rank: Rank; tier: Tier }

function buildLessons(trackSlug: string, specs: LessonSpec[]): Lesson[] {
  return specs.map(({ name, rank, tier }) => {
    const slug = slugify(name)
    return {
      name,
      slug,
      rank,
      tier,
      isTest: name.startsWith('Test:'),
      content: '',
    }
  })
}

const PHYSICAL_LESSONS: LessonSpec[] = [
  { name: 'Why the body comes first', rank: 'E', tier: 'starter' },
  { name: 'Building your training baseline', rank: 'E', tier: 'starter' },
  { name: 'Posture and frame fundamentals', rank: 'E', tier: 'starter' },
  { name: 'Nutrition without the noise', rank: 'E', tier: 'starter' },
  { name: 'Grooming and personal upkeep', rank: 'E', tier: 'starter' },
  { name: 'Sleep and recovery systems', rank: 'E', tier: 'starter' },
  { name: 'Strength foundations', rank: 'E', tier: 'starter' },
  { name: 'Progressive overload basics', rank: 'E', tier: 'starter' },
  { name: 'Mobility and flexibility work', rank: 'E', tier: 'starter' },
  { name: 'Test: Foundations Check', rank: 'E', tier: 'starter' },
  { name: 'Style: dressing for your build', rank: 'D', tier: 'starter' },
  { name: 'Energy and stamina work', rank: 'D', tier: 'starter' },
  { name: 'Skin and hygiene routine', rank: 'D', tier: 'starter' },
  { name: 'Home workout systems', rank: 'D', tier: 'starter' },
  { name: 'Gym etiquette and confidence', rank: 'D', tier: 'starter' },
  { name: 'Cardio without burnout', rank: 'D', tier: 'starter' },
  { name: "Building a physique you're proud of", rank: 'D', tier: 'starter' },
  { name: 'Recovery days done right', rank: 'D', tier: 'starter' },
  { name: 'Supplementation basics', rank: 'D', tier: 'starter' },
  { name: 'Test: Progress Check', rank: 'D', tier: 'starter' },
  { name: 'Advanced training splits', rank: 'C', tier: 'starter' },
  { name: 'Long-term consistency systems', rank: 'C', tier: 'starter' },
  { name: 'Martial arts fundamentals', rank: 'B', tier: 'starter' },
  { name: 'Facial presence and expression', rank: 'B', tier: 'starter' },
  { name: 'Height, genetics, and honest expectations', rank: 'B', tier: 'starter' },
  { name: 'Injury prevention', rank: 'A', tier: 'starter' },
  { name: 'Fascia, chi gong, and nervous system energy work', rank: 'S', tier: 'ascending' },
  { name: 'Semen retention: tradition, discipline, and the actual evidence', rank: 'S', tier: 'ascending' },
  { name: 'Physical confidence and becoming the magnet', rank: 'A', tier: 'starter' },
  { name: 'Test: Mastery Check', rank: 'A', tier: 'starter' },
]

const SOCIAL_LESSONS: LessonSpec[] = [
  { name: 'Presence over performance', rank: 'E', tier: 'starter' },
  { name: 'Body language fundamentals', rank: 'E', tier: 'starter' },
  { name: 'Starting real conversations', rank: 'E', tier: 'starter' },
  { name: 'Listening as a skill', rank: 'E', tier: 'starter' },
  { name: 'Handling nerves in the moment', rank: 'E', tier: 'starter' },
  { name: 'Public speaking basics', rank: 'E', tier: 'starter' },
  { name: 'Reading a room', rank: 'E', tier: 'starter' },
  { name: 'Building genuine rapport', rank: 'E', tier: 'starter' },
  { name: 'Group dynamics', rank: 'E', tier: 'starter' },
  { name: 'Test: Foundations Check', rank: 'E', tier: 'starter' },
  { name: 'Setting boundaries with respect', rank: 'D', tier: 'starter' },
  { name: 'Humor and timing', rank: 'D', tier: 'starter' },
  { name: 'Networking without the cringe', rank: 'D', tier: 'starter' },
  { name: 'Conversational depth vs small talk', rank: 'D', tier: 'starter' },
  { name: 'Handling disagreement gracefully', rank: 'D', tier: 'starter' },
  { name: 'Reading red flags: narcissism, manipulation, and genuine care', rank: 'D', tier: 'starter' },
  { name: 'Making people feel heard', rank: 'D', tier: 'starter' },
  { name: 'Storytelling basics', rank: 'D', tier: 'starter' },
  { name: 'Reading tone and subtext', rank: 'D', tier: 'starter' },
  { name: 'Test: Progress Check', rank: 'D', tier: 'starter' },
  { name: 'Leading a group conversation', rank: 'C', tier: 'starter' },
  { name: 'Presence in high-stakes settings', rank: 'C', tier: 'starter' },
  { name: 'Charisma frameworks', rank: 'B', tier: 'starter' },
  { name: 'The power of silence', rank: 'B', tier: 'starter' },
  { name: 'Ethical influence: reading and moving a room without manipulation', rank: 'A', tier: 'starter' },
  { name: 'Becoming memorable', rank: 'A', tier: 'starter' },
  { name: 'Advanced rapport and elicitation: guiding conversation with intent', rank: 'S', tier: 'ascending' },
  { name: 'Perception, aura, and the energy you bring into a room', rank: 'S', tier: 'ascending' },
  { name: "Esoteric social knowledge: what's taught behind closed doors", rank: 'S', tier: 'ascending' },
  { name: 'Test: Mastery Check', rank: 'A', tier: 'starter' },
]

const INCOME_LESSONS: LessonSpec[] = [
  { name: 'Picking your first skill', rank: 'E', tier: 'starter' },
  { name: 'Value over money: the actual game', rank: 'E', tier: 'starter' },
  { name: 'Cold outreach fundamentals', rank: 'E', tier: 'starter' },
  { name: "Scripts that don't sound scripted", rank: 'E', tier: 'starter' },
  { name: 'Making your first cold call', rank: 'E', tier: 'starter' },
  { name: 'Handling objections', rank: 'E', tier: 'starter' },
  { name: 'Closing without pressure tactics', rank: 'E', tier: 'starter' },
  { name: 'Using AI agents for outreach', rank: 'E', tier: 'starter' },
  { name: 'Building a course with AI tools', rank: 'E', tier: 'starter' },
  { name: 'Test: Foundations Check', rank: 'E', tier: 'starter' },
  { name: 'Building simple apps with AI', rank: 'D', tier: 'starter' },
  { name: 'Selling AI websites to local businesses', rank: 'D', tier: 'starter' },
  { name: 'Pricing your services', rank: 'D', tier: 'starter' },
  { name: 'Getting your first client', rank: 'D', tier: 'starter' },
  { name: 'Managing client relationships', rank: 'D', tier: 'starter' },
  { name: 'Basic contracts and invoicing', rank: 'D', tier: 'starter' },
  { name: 'Building a personal brand', rank: 'D', tier: 'starter' },
  { name: 'Content that sells without selling', rank: 'D', tier: 'starter' },
  { name: 'Mass marketing, the basics actually taught', rank: 'D', tier: 'starter' },
  { name: 'Test: Progress Check', rank: 'D', tier: 'starter' },
  { name: 'Scaling past your first clients', rank: 'C', tier: 'starter' },
  { name: 'Hiring your first help', rank: 'C', tier: 'starter' },
  { name: 'Systems and automation', rank: 'B', tier: 'starter' },
  { name: 'Diversifying income streams', rank: 'B', tier: 'starter' },
  { name: 'Money knowledge, E to A: earning, saving, investing basics', rank: 'A', tier: 'starter' },
  { name: 'Compound interest and long-term wealth thinking', rank: 'A', tier: 'starter' },
  { name: 'Quick-money schemes: how to spot and avoid getting burned', rank: 'A', tier: 'starter' },
  { name: 'Reinvesting wisely, building something that runs without you', rank: 'A', tier: 'starter' },
  { name: 'Becoming the magnet: how value creates inbound opportunity', rank: 'S', tier: 'ascending' },
  { name: 'Test: Mastery Check', rank: 'A', tier: 'starter' },
]

const INNER_WORK_LESSONS: LessonSpec[] = [
  { name: 'Discipline over motivation', rank: 'E', tier: 'starter' },
  { name: 'Building a daily system', rank: 'E', tier: 'starter' },
  { name: 'Focus in a distracted world', rank: 'E', tier: 'starter' },
  { name: 'Sitting with discomfort', rank: 'E', tier: 'starter' },
  { name: 'Journaling and self-review', rank: 'E', tier: 'starter' },
  { name: 'Mindset frameworks that actually hold up', rank: 'E', tier: 'starter' },
  { name: 'Visualization and goal-setting', rank: 'E', tier: 'starter' },
  { name: 'Handling setbacks without spiraling', rank: 'E', tier: 'starter' },
  { name: 'Building your own code to live by', rank: 'E', tier: 'starter' },
  { name: 'Test: Foundations Check', rank: 'E', tier: 'starter' },
  { name: 'Isolation as a tool, not an escape', rank: 'D', tier: 'starter' },
  { name: 'Managing your inner dialogue', rank: 'D', tier: 'starter' },
  { name: 'Meditation: the actual practice, not the aesthetic', rank: 'D', tier: 'starter' },
  { name: 'Gratitude and why it works', rank: 'D', tier: 'starter' },
  { name: 'The laws of attraction and detachment: psychology vs. belief', rank: 'D', tier: 'starter' },
  { name: 'Mirror work and self-hypnosis', rank: 'D', tier: 'starter' },
  { name: 'Handling criticism without collapsing', rank: 'D', tier: 'starter' },
  { name: 'Values clarification and purpose', rank: 'D', tier: 'starter' },
  { name: "Letting go of what doesn't serve you: the kill list", rank: 'D', tier: 'starter' },
  { name: 'Test: Progress Check', rank: 'D', tier: 'starter' },
  { name: 'Deep focus and flow state', rank: 'C', tier: 'starter' },
  { name: 'Building genuine self-respect and sovereignty', rank: 'C', tier: 'starter' },
  { name: 'The traps: entertainment, the rabbit hole, and fake-knowledge loops', rank: 'B', tier: 'starter' },
  { name: 'Ghost mode: disciplined isolation for deep work', rank: 'B', tier: 'starter' },
  { name: 'Integration: bringing the four tracks together', rank: 'A', tier: 'starter' },
  { name: 'God, the universe, and the laws that undergird this work', rank: 'S', tier: 'ascending' },
  { name: 'Subconscious programming and reality framing', rank: 'S', tier: 'ascending' },
  { name: 'The karmic cycle, synchronicity, and the unseen order', rank: 'S', tier: 'ascending' },
  {
    name: 'Beyond the five senses: third eye, remote viewing, and esoteric perception traditions',
    rank: 'S',
    tier: 'ascending',
  },
  { name: 'Test: Mastery Check', rank: 'A', tier: 'starter' },
]

export const TRACKS: TrackData[] = [
  { title: 'Physical', slug: 'physical', lessons: buildLessons('physical', PHYSICAL_LESSONS) },
  { title: 'Social', slug: 'social', lessons: buildLessons('social', SOCIAL_LESSONS) },
  { title: 'Income', slug: 'income', lessons: buildLessons('income', INCOME_LESSONS) },
  {
    title: 'Inner Work',
    slug: 'inner-work',
    lessons: buildLessons('inner-work', INNER_WORK_LESSONS),
  },
]

/** Find a lesson by its track slug + lesson slug (unique together; lesson names like "Test: ..." repeat across tracks). */
export function findLesson(trackSlug: string, lessonSlug: string): { track: TrackData; lesson: Lesson } | null {
  const track = TRACKS.find((t) => t.slug === trackSlug)
  if (!track) return null
  const lesson = track.lessons.find((l) => l.slug === lessonSlug)
  if (!lesson) return null
  return { track, lesson }
}

export const RANK_TITLES: Record<string, string> = {
  E: 'INITIATE',
  D: 'APPRENTICE',
  C: 'ADEPT',
  B: 'CHALLENGER',
  A: 'VETERAN',
  S: 'ASCENDANT',
}

export type OverallRank = {
  currentRank: Rank
  nextRank: Rank
  /** True only when the sole thing blocking the next rank is not owning Ascending — every module is otherwise done. */
  nextRankLocked: boolean
  doneCount: number
  totalLessons: number
  progressPct: number
}

/**
 * A visitor's real, earned rank — derived only from lessons actually marked
 * complete, never from a click-to-earn action. Rank is the highest tier
 * unlocked in every one of the 4 tracks at once (a visitor is only as
 * advanced as their least-progressed track), so it can't be inflated by
 * favoring one track or by anything other than finishing modules.
 */
export function computeOverallRank(completed: Set<string>, hasAscending: boolean): OverallRank {
  let minRankIdx = RANK_ORDER.length - 1
  for (const track of TRACKS) {
    let trackIdx = 0
    for (let i = RANK_ORDER.length - 1; i >= 0; i--) {
      if (isRankUnlocked(track, RANK_ORDER[i], completed, hasAscending)) {
        trackIdx = i
        break
      }
    }
    minRankIdx = Math.min(minRankIdx, trackIdx)
  }

  const currentRank = RANK_ORDER[minRankIdx]
  const nextIdx = Math.min(minRankIdx + 1, RANK_ORDER.length - 1)
  const nextRank = RANK_ORDER[nextIdx]

  // "Locked" means every A-rank module is genuinely done in every track — the
  // only thing standing between this visitor and S rank is not owning
  // Ascending, not unfinished work. (Checking A-rank done, not S-rank done —
  // a non-Ascending visitor has no S-rank lessons available to complete.)
  const allARankDone = TRACKS.every((track) => {
    const lessons = track.lessons.filter((l) => l.rank === 'A')
    return lessons.length === 0 || lessons.every((l) => completed.has(lessonKey(track.slug, l.slug)))
  })
  const nextRankLocked = nextRank === 'S' && !hasAscending && allARankDone

  const totalLessons = TRACKS.reduce((sum, t) => sum + t.lessons.length, 0)
  const doneCount = TRACKS.reduce(
    (sum, t) => sum + t.lessons.filter((l) => completed.has(lessonKey(t.slug, l.slug))).length,
    0,
  )
  const progressPct = totalLessons > 0 ? Math.round((doneCount / totalLessons) * 100) : 0

  return { currentRank, nextRank, nextRankLocked, doneCount, totalLessons, progressPct }
}
