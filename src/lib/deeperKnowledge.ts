import type { Rank } from './pathData'

export type DeeperRank = 'B' | 'A' | 'S'

export type DeeperModule = {
  name: string
  slug: string
  rank: DeeperRank
  content: string
}

export type DeeperSection = {
  letter: 'A' | 'B' | 'C' | 'D'
  title: string
  slug: string
  description: string
  framing: string
  modules: DeeperModule[]
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** First 5 modules in a section are B, next 5 A, last 5 S. */
export function deeperRankForIndex(index: number): DeeperRank {
  if (index < 5) return 'B'
  if (index < 10) return 'A'
  return 'S'
}

/**
 * Deeper Knowledge unlocks off overall path rank (weakest of the four tracks).
 * Completing these modules does not change rank.
 */
const OVERALL_RANK_ORDER: Rank[] = ['E', 'D', 'C', 'B', 'A', 'S']

export function isDeeperRankUnlocked(rank: DeeperRank, overallRank: Rank): boolean {
  return OVERALL_RANK_ORDER.indexOf(overallRank) >= OVERALL_RANK_ORDER.indexOf(rank)
}

function wrapModule(section: Omit<DeeperSection, 'modules'>, name: string, index: number, body: string): DeeperModule {
  const n = String(index + 1).padStart(2, '0')
  const rank = deeperRankForIndex(index)
  return {
    name,
    slug: slugify(name),
    rank,
    content: `# MODULE ${n}: ${name.toUpperCase()}

**Deeper Knowledge — Section ${section.letter}: ${section.title} | Rank ${rank} | Ascending**

*Framing: ${section.framing}*

---

${body.trim()}`,
  }
}

function buildSection(
  meta: Omit<DeeperSection, 'modules'>,
  names: string[],
  bodies: string[] = [],
): DeeperSection {
  if (names.length !== 15) {
    throw new Error(`Deeper Knowledge section "${meta.slug}" must have 15 names`)
  }
  return {
    ...meta,
    modules: names.map((name, i) => wrapModule(meta, name, i, bodies[i] ?? '')),
  }
}

const HIDDEN_HISTORY_META = {
  letter: 'A' as const,
  title: 'Hidden History',
  slug: 'hidden-history',
  description: 'Contested readings of the historical record — labeled as theory, not delivered as fact.',
  framing:
    'This module presents a theory, a claim, or a contested reading of the historical record — labeled as such. It is not asserted as proven fact.',
}

const ESOTERIC_PERCEPTION_META = {
  letter: 'B' as const,
  title: 'Esoteric Perception & Energy Work',
  slug: 'esoteric-perception',
  description: 'Traditions and practices people actually use. Unverified mechanisms stay unverified.',
  framing:
    'This module presents a tradition, a claim, or a practice people actually use — labeled as such. Unverified mechanisms are not treated as settled science.',
}

const UNIVERSAL_LAW_META = {
  letter: 'C' as const,
  title: 'Universal Law & Metaphysics',
  slug: 'universal-law',
  description: 'Metaphysical claims and traditions, examined honestly. Belief is optional. Clarity is not.',
  framing:
    'This module presents a metaphysical claim, a tradition, or a theory — labeled as such. It is not asserted as proven fact.',
}

const MODERN_SYSTEMS_META = {
  letter: 'D' as const,
  title: 'Modern Systems & Control',
  slug: 'modern-systems',
  description: 'Documented incentives, propaganda, and attention systems. The most defensible material in this library.',
  framing:
    'This module covers documented systems, incentives, and tactics. Where something is a theory rather than a record, it is labeled.',
}

export const DEEPER_SECTIONS: DeeperSection[] = [
  buildSection(HIDDEN_HISTORY_META, [
    "What they don't teach you: an introduction to hidden history",
    'The Tartarian theory: a lost global civilization, examined',
    'Free energy: the claims and what actually happened',
    'Ancient technology theories: pyramids, megaliths, lost engineering',
    'Suppressed inventions and the men behind them',
    "Secret societies: what's documented, what's myth",
    'The "mud flood" theory, examined',
    "World's fairs and the architecture of forgotten empires",
    'Controlled history: how official narratives get written',
    'Lost maps and pre-modern cartography mysteries',
    'The Denver airport and modern conspiracy landmarks',
    'Underground cities and bunkers: rumor vs. record',
    "Vatican archive claims: what's known, what's speculation",
    'Alternative timeline theories',
    'Building your own hidden-history research method',
  ]),
  buildSection(ESOTERIC_PERCEPTION_META, [
    "The third eye: tradition, practice, and what's unverified",
    'Remote viewing: origins and the declassified government programs',
    'Telepathy: claims, experiments, and honest skepticism',
    'Astral projection: technique and testimony',
    'Chi, prana, and life-force traditions across cultures',
    'Aura reading: what practitioners claim to see',
    'Telekinesis: the history of the claim',
    'Sensing energy in people and rooms',
    'Dream work and lucid dreaming',
    'Sound and frequency: claims about vibration and the body',
    'Crystals and stones: tradition, ritual, and the placebo question',
    'Sacred geometry across traditions',
    'Kundalini: tradition and controversy',
    'Psychic development practices people actually use',
    'Building your own perception practice',
  ]),
  buildSection(UNIVERSAL_LAW_META, [
    'The akashic records: origin and claims',
    'Karmic cycles across traditions',
    "Synchronicity: Jung's theory and what came after",
    'Angels and guardian spirits across cultures',
    'Astrology: history, method, and honest critique',
    'Numerology basics',
    'The evil eye: a global tradition',
    'Manifestation beyond the basics',
    'Parallel realities and the multiverse idea',
    'DNA activation theories',
    'Sacred texts across traditions: the common threads',
    'Reincarnation: claims across cultures',
    'The observer effect: what physics says, what pop culture added',
    'Rituals: why they work psychologically, regardless of belief',
    'Building your own belief framework, examined honestly',
  ]),
  buildSection(MODERN_SYSTEMS_META, [
    'Media literacy: how narratives are actually shaped',
    'The attention economy: who profits from your focus',
    'Financial systems: what most people never learn',
    'Psychological operations: real historical examples',
    'Social engineering tactics, named plainly',
    'Surveillance capitalism, explained',
    'The algorithm and you',
    'Manufactured consent: propaganda basics',
    'Corporate influence on public discourse',
    'Health industry incentives worth understanding',
    'Education system critique',
    'Modern lobbying and institutional influence',
    'Reading between the lines of official statements',
    'Building resilience against manipulation',
    'Becoming an independent thinker',
  ]),
]

export const DEEPER_MODULE_COUNT = DEEPER_SECTIONS.reduce((n, s) => n + s.modules.length, 0)

/** Progress key — stored with the four-track keys, ignored by rank. */
export function deeperKey(sectionSlug: string, lessonSlug: string): string {
  return `deeper__${sectionSlug}__${lessonSlug}`
}

export function findDeeperLesson(
  sectionSlug: string,
  lessonSlug: string,
): { section: DeeperSection; module: DeeperModule } | null {
  const section = DEEPER_SECTIONS.find((s) => s.slug === sectionSlug)
  if (!section) return null
  const mod = section.modules.find((m) => m.slug === lessonSlug)
  if (!mod) return null
  return { section, module: mod }
}

export function deeperDoneCount(completed: Set<string>): number {
  let n = 0
  for (const section of DEEPER_SECTIONS) {
    for (const mod of section.modules) {
      if (completed.has(deeperKey(section.slug, mod.slug))) n++
    }
  }
  return n
}
