import { useEffect, useState } from 'react'

import { getHunterProfile, type HunterProfile } from '../server/hunterProfile'
import { PLANS } from '../lib/plans'

const ASCENDING = PLANS.find((p) => p.key === 'ascending')!

export function HunterStatus() {
  const [profile, setProfile] = useState<HunterProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getHunterProfile()
      .then(setProfile)
      .catch(() => setProfile({ signedIn: false }))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="status-window">
        <div className="status-row">
          <span>HUNTER STATUS</span>
          <span>SCANNING…</span>
        </div>
      </div>
    )
  }

  if (!profile || !profile.signedIn) {
    return (
      <div className="status-window">
        <div className="status-row">
          <span>HUNTER STATUS</span>
          <span>NOT TRACKED</span>
        </div>
        <p className="quiz-question-sub" style={{ marginTop: 16, textAlign: 'center' }}>
          Sign in with Whop to track your real rank as you complete modules.
        </p>
        <a
          className="btn-primary quiz-submit"
          href={`/api/oauth/login?redirect_to=${encodeURIComponent('/')}`}
          style={{ marginTop: 20 }}
        >
          Sign In To Start Tracking
        </a>
      </div>
    )
  }

  const { currentRank, nextRank, nextRankLocked, progressPct, doneCount, totalLessons, hasAscending, pathHref } = profile

  return (
    <div className="status-window">
      <div className="status-row">
        <span>HUNTER STATUS</span>
        <span>
          {doneCount}/{totalLessons} MODULES
        </span>
      </div>

      <div className="rank-line">
        <div className="rank-badge">{currentRank}</div>
        <div className="rank-arrow">→</div>
        <div className={`rank-badge${nextRankLocked ? '' : ' active'}`}>
          {nextRank}
          {nextRankLocked ? ' 🔒' : ''}
        </div>
      </div>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: `${progressPct}%` }} />
      </div>
      <div className="status-row" style={{ marginTop: 10 }}>
        <span>{currentRank === nextRank ? 'MAX RANK REACHED' : `RANK ${currentRank} → ${nextRank}`}</span>
        <span>{currentRank === nextRank ? '' : 'EARNED BY COMPLETING MODULES'}</span>
      </div>

      {pathHref && (
        <a
          className="btn-primary quiz-submit"
          href={pathHref}
          style={{ marginTop: 18 }}
          onClick={() => window.whop?.track('path:enter', { source: 'hunter_status' })}
        >
          View Your Path →
        </a>
      )}

      {nextRankLocked && (
        <a
          className="btn-primary quiz-submit"
          href={ASCENDING.purchaseUrl}
          style={{ marginTop: 12 }}
          onClick={() =>
            window.whop?.track('view_content', {
              plan: ASCENDING.title,
              value: ASCENDING.introPrice,
              currency: 'USD',
              source: 'rank_lock',
            })
          }
        >
          Unlock S Rank — Get Ascending (${ASCENDING.introPrice} first month)
        </a>
      )}

      {hasAscending && currentRank === 'S' && (
        <p className="quiz-question-sub" style={{ marginTop: 14, textAlign: 'center' }}>
          Ascending hunter — S Rank unlocked.
        </p>
      )}
    </div>
  )
}
