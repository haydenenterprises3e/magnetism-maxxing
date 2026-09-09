export type PlanInfo = {
  key: 'starter' | 'ascending'
  rankLabel: string
  title: string
  /** First charge at checkout. */
  introPrice: number
  /** Recurring monthly price from the second billing cycle onward. */
  price: number
  purchaseUrl: string
  features: string[]
  featured: boolean
  ctaLabel: string
}

export const PLANS: PlanInfo[] = [
  {
    key: 'starter',
    rankLabel: 'RANK E–A — STARTER',
    title: 'Starter',
    introPrice: 21.49,
    price: 27.4,
    purchaseUrl: 'https://whop.com/checkout/plan_MBYg4FoUorFqy',
    features: [
      '106 modules across all 4 tracks',
      'Full E → A rank progression',
      'All 12 rank-check tests',
      'Progress tracking',
    ],
    featured: false,
    ctaLabel: 'Awaken',
  },
  {
    key: 'ascending',
    rankLabel: 'RANK S — ASCENDING',
    title: 'Ascending',
    introPrice: 8,
    price: 47,
    purchaseUrl: 'https://whop.com/checkout/plan_bvkvhdIcWnkAS',
    features: [
      'Everything in Starter',
      '11 exclusive S-Rank modules',
      'Deeper Knowledge — 60 Ascending-only modules',
      'Monthly 1-on-1 coaching calls',
      'Community access + direct content requests',
    ],
    featured: true,
    ctaLabel: 'Ascend Now',
  },
]
