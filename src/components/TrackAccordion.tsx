import { useState } from 'react'

import { isRankUnlocked, lessonKey, type TrackData } from '../lib/pathData'

export function TrackAccordion({
  index,
  track,
  defaultOpen,
  planSlug,
  completed,
  hasAscending,
}: {
  index: number
  track: TrackData
  defaultOpen?: boolean
  /** "starter" or "ascending" — lessons link to `/path/module/${planSlug}/${track.slug}/${lesson.slug}`. */
  planSlug: string
  /** `${trackSlug}__${lessonSlug}` keys the visitor has completed. */
  completed: Set<string>
  hasAscending: boolean
}) {
  const [open, setOpen] = useState(!!defaultOpen)
  const num = String(index + 1).padStart(2, '0')

  const doneCount = track.lessons.filter((l) => completed.has(lessonKey(track.slug, l.slug))).length
  const progressPct = Math.round((doneCount / track.lessons.length) * 100)

  return (
    <div className={`track-block${open ? ' open' : ''}`}>
      <div className="track-head" onClick={() => setOpen((o) => !o)}>
        <div className="track-head-left">
          <span className="track-num">{num}</span>
          <div>
            <div className="track-title">{track.title}</div>
            <div className="track-meta">{track.lessons.length} modules</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div className="track-progress-mini">
            <div className="track-progress-track">
              <div className="track-progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="track-percent">{progressPct}%</span>
          </div>
          <span className="chevron">›</span>
        </div>
      </div>
      <div className="lesson-list">
        {track.lessons.map((lesson) => {
          const tierLocked = lesson.tier === 'ascending' && planSlug !== 'ascending'
          const rankUnlocked = isRankUnlocked(track, lesson.rank, completed, hasAscending)
          const locked = tierLocked || !rankUnlocked
          const isDone = completed.has(lessonKey(track.slug, lesson.slug))

          const icon = (
            <div className={`lesson-icon ${locked ? 'locked' : isDone ? 'done' : 'available'}`}>
              {locked ? '🔒' : isDone ? '✓' : '›'}
            </div>
          )
          const rankTag = <span className={`rank-tag rank-tag-${lesson.rank.toLowerCase()}`}>{lesson.rank}</span>

          return (
            <div key={lesson.slug} className={`lesson-row${lesson.isTest ? ' test-row' : ''}`}>
              {locked ? (
                <div className="lesson-left">
                  {icon}
                  <span className="lesson-name locked-text">{lesson.name}</span>
                  {rankTag}
                  {tierLocked && <span className="tier-tag">ASCENDING</span>}
                </div>
              ) : (
                <a href={`/path/module/${planSlug}/${track.slug}/${lesson.slug}`} className="lesson-left lesson-link">
                  {icon}
                  <span className="lesson-name">{lesson.name}</span>
                  {rankTag}
                </a>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
