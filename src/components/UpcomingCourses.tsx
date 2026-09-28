import { useState } from 'react'
import { UPCOMING_CONTENT, type ContentTier } from '../lib/upcomingContent'

export function UpcomingCourses() {
  const [tab, setTab] = useState<ContentTier>('starter')
  const items = UPCOMING_CONTENT.filter((item) => item.tier === tab)

  return (
    <>
      <style>{`
        .upcoming-section { margin: 56px 0; border-radius: 18px; background: linear-gradient(180deg, #16161a 0%, #0c0c0e 100%); border: 1px solid rgba(255,255,255,0.08); padding: 24px; }
        .upcoming-head { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 18px; }
        .upcoming-title { font-size: 22px; font-weight: 700; color: #f2f2f2; }
        .upcoming-sub { font-size: 13px; color: rgba(230,230,230,0.55); margin-top: 4px; }
        .upcoming-tabs { display: flex; gap: 6px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 999px; padding: 4px; }
        .upcoming-tab { border: none; background: transparent; color: rgba(230,230,230,0.6); font-size: 12px; font-weight: 700; letter-spacing: 0.06em; padding: 8px 16px; border-radius: 999px; cursor: pointer; }
        .upcoming-tab.active { background: #2b2b31; color: #f2f2f2; }
        .upcoming-list { max-height: 520px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; padding-right: 4px; }
        .upcoming-item { display: flex; align-items: center; gap: 14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 10px; }
        .upcoming-thumb { flex: 0 0 120px; height: 68px; border-radius: 8px; overflow: hidden; background: #1c1c20; display: flex; align-items: center; justify-content: center; color: rgba(230,230,230,0.35); font-size: 10px; letter-spacing: 0.08em; font-weight: 700; }
        .upcoming-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .upcoming-info { flex: 1; min-width: 0; }
        .upcoming-item-title { color: #e8e8e8; font-size: 14px; font-weight: 600; }
        .upcoming-item-meta { color: rgba(230,230,230,0.4); font-size: 11px; margin-top: 2px; letter-spacing: 0.04em; }
        .upcoming-price { flex: 0 0 auto; font-size: 12px; font-weight: 700; color: rgba(230,230,230,0.5); background: rgba(255,255,255,0.05); border-radius: 999px; padding: 5px 12px; }
      `}</style>
      <div className="upcoming-section">
        <div className="upcoming-head">
          <div>
            <div className="upcoming-title">Up & Coming Courses</div>
            <div className="upcoming-sub">New videos and courses from the team and the community.</div>
          </div>
          <div className="upcoming-tabs">
            <button className={"upcoming-tab" + (tab === 'starter' ? ' active' : '')} onClick={() => setTab('starter')}>STARTER</button>
            <button className={"upcoming-tab" + (tab === 'ascending' ? ' active' : '')} onClick={() => setTab('ascending')}>ASCENDING</button>
          </div>
        </div>

        <div className="upcoming-list">
          {items.map((item) => (
            <div className="upcoming-item" key={item.id}>
              <div className="upcoming-thumb">
                {item.videoId ? (
                  <img src={`https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`} alt={item.title} />
                ) : (
                  'COMING SOON'
                )}
              </div>
              <div className="upcoming-info">
                <div className="upcoming-item-title">{item.title}</div>
                <div className="upcoming-item-meta">{item.source === 'team' ? 'TEAM' : 'COMMUNITY'} · {item.tier.toUpperCase()}</div>
              </div>
              <div className="upcoming-price">{item.price != null ? `$${item.price}` : 'TBD'}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
