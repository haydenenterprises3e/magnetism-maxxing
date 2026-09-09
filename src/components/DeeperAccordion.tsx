import { useState } from 'react'

import { deeperKey, isDeeperRankUnlocked, type DeeperSection } from '../lib/deeperKnowledge'
import type { Rank } from '../lib/pathData'

export function DeeperAccordion({
  section,
  defaultOpen,
  completed,
  overallRank,
}: {
  section: DeeperSection
  defaultOpen?: boolean
  completed: Set<string>
  overallRank: Rank
}) {
  const [open, setOpen] = useState(!!defaultOpen)
  const letter = section.letter

  const doneCount = section.modules.filter((m) => completed.has(deeperKey(section.slug, m.slug))).length
  const progressPct = Math.round((doneCount / section.modules.length) * 100)

  return (
    <div className={`track-block deeper-block${open ? ' open' : ''}`}>
      <div className="track-head" onClick={() => setOpen((o) => !o)}>
        <div className="track-head-left">
          <span className="track-num">{letter}</span>
          <div>
            <div className="track-title">{section.title}</div>
            <div className="track-meta">{section.modules.length} modules · {section.description}</div>
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
        {section.modules.map((mod, i) => {
          const isDone = completed.has(deeperKey(section.slug, mod.slug))
          const locked = !isDeeperRankUnlocked(mod.rank, overallRank)
          const num = String(i + 1).padStart(2, '0')
          const icon = (
            <div className={`lesson-icon ${locked ? 'locked' : isDone ? 'done' : 'available'}`}>
              {locked ? '🔒' : isDone ? '✓' : '›'}
            </div>
          )
          const rankTag = <span className={`rank-tag rank-tag-${mod.rank.toLowerCase()}`}>{mod.rank}</span>

          return (
            <div key={mod.slug} className="lesson-row">
              {locked ? (
                <div className="lesson-left">
                  {icon}
                  <span className="lesson-name locked-text">
                    {num}. {mod.name}
                  </span>
                  {rankTag}
                </div>
              ) : (
                <a href={`/path/deeper/${section.slug}/${mod.slug}`} className="lesson-left lesson-link">
                  {icon}
                  <span className="lesson-name">
                    {num}. {mod.name}
                  </span>
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
