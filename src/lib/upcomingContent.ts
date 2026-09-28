export type ContentTier = 'starter' | 'ascending'

export type UpcomingItem = {
  id: string
  title: string
  tier: ContentTier
  price: number | null
  videoId: string | null
  source: 'team' | 'community'
}

export const UPCOMING_CONTENT: UpcomingItem[] = [
  { id: 'slot-01', title: 'Introduction', tier: 'starter', price: null, videoId: 'bgx4ynRf-8k', source: 'team' },
  { id: 'slot-ascending-01', title: 'Coming Soon', tier: 'ascending', price: null, videoId: null, source: 'team' },
  { id: 'slot-ascending-01', title: 'Coming Soon', tier: 'ascending', price: null, videoId: null, source: 'team' },
  ...Array.from({ length: 19 }, (_, i) => ({
    id: `slot-${String(i + 2).padStart(2, '0')}`,
    title: 'Coming Soon',
    tier: 'starter' as ContentTier,
    price: null,
    videoId: null,
    source: 'team' as const,
  })),
]
