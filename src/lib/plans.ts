export type PlanInfo = {
  key: 'starter' | 'ascending'
  rankLabel: string
  title: string
  /** First charge at checkout, before the price deadline. */
  introPrice: number
  /** First charge at checkout, after the price deadline. */
  postDeadlineIntroPrice: number
  /** Recurring monthly price from the second billing cycle onward. */
  price: number
  purchaseUrl: string
  features: string[]
  featured: boolean
  ctaLabel: string
}

/** Oct 5, 2026, midnight Australia/Brisbane (UTC+10, no DST) */
export const PRICE_DEADLINE = new Date('2026-10-05T00:00:00+10:00')

export const PLANS: PlanInfo[] = [
  {
    key: 'starter',
    rankLabel: 'RANK E–A — STARTER',
    title: 'Starter',
    introPrice: 17.38,
    postDeadlineIntroPrice: 55,
    price: 21.49,
    purchaseUrl: 'https://whop.com/h3vence-com/magnetism-maxxing-starter-rank-e/',
    features: [
      'The complete 4-track foundation: Physical, Social, Income, Inner Work',
      '106 modules — everything you need to actually transform, no filler',
      'Full E through A rank progression, earned only by real completion',
      'All 12 rank-check tests, so you prove the material actually landed',
      'Tracked progress saved to your account — pick up exactly where you left off',
      'The exact system used to build strength, presence, income, and discipline from zero',
    ],
    featured: false,
    ctaLabel: 'Awaken',
  },
  {
    key: 'ascending',
    rankLabel: 'RANK S — ASCENDING',
    title: 'Ascending',
    introPrice: 27.99,
    postDeadlineIntroPrice: 99,
    price: 47,
    purchaseUrl: 'https://whop.com/h3vence-com/magnetism-maxxing-full-ascent-rank-s/',
    features: [
      'Everything in Starter — the full 106-module foundation, included',
      '11 exclusive S-Rank modules hidden inside every core track',
      '4 additional Ascending-only tracks — Hidden History, Esoteric Perception & Energy Work, Universal Law & Metaphysics, Modern Systems & Control',
      '60 more modules of contested history, energy work, metaphysics, and the systems shaping modern life',
      "Access to the world's shared knowledge — a living, community-built library of theories, conspiracies, and lived experience most people never get shown, clearly labeled as belief and opinion, not settled fact",
      'Full community access — an active exchange with other members, not a passive membership',
      'Direct content requests — help shape what gets built next',
    ],
    featured: true,
    ctaLabel: 'Ascend Now',
  },
]
