import { useEffect, useState } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { companyAccessLevel, currentUser } from '../../../lib/session'
import {
  approveGroupMessage,
  deleteDirectMessage,
  deleteTrial,
  listAnnouncements,
  listDirectMessages,
  listPendingMessages,
  listTrials,
  postAdminMessage,
  postAnnouncement,
  rejectGroupMessage,
  type Announcement,
  type DirectMessage,
  type GroupMessage,
  type TrialSubmission,
} from '../../../server/community'

const COMPANY_ID = 'biz_jdcD3rL9FLYsxy'

const checkAdminGuard = createServerFn({ method: 'GET' }).handler(async () => {
  const user = await currentUser()
  if (!user) return { signedIn: false as const }
  const isAdmin = (await companyAccessLevel(user.sub, COMPANY_ID)) === 'admin'
  return { signedIn: true as const, isAdmin }
})

export const Route = createFileRoute('/path/community/admin')({
  head: () => ({
    meta: [{ title: 'Magnetism Maxxing — Community Admin' }],
  }),
  beforeLoad: async ({ location }) => {
    const guard = await checkAdminGuard()
    if (!guard.signedIn) {
      throw redirect({
        href: `/api/oauth/login?redirect_to=${encodeURIComponent(location.href)}`,
      })
    }
    if (!guard.isAdmin) throw redirect({ to: '/path/community' })
  },
  component: CommunityAdminPage,
})

function Bubble({ name, message, createdAt }: { name: string; message: string; createdAt: number }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: '12px 16px',
        marginBottom: 10,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
        <span style={{ color: '#c9a8ff', fontWeight: 700 }}>{name}</span>
        <span style={{ color: 'rgba(255,255,255,0.35)' }}>{new Date(createdAt).toLocaleString()}</span>
      </div>
      <div style={{ color: 'rgba(230,230,230,0.9)', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{message}</div>
    </div>
  )
}

function CommunityAdminPage() {
  const [tab, setTab] = useState<'dm' | 'pending' | 'announcements' | 'trials'>('dm')
  const [dms, setDms] = useState<DirectMessage[]>([])
  const [pending, setPending] = useState<(GroupMessage & { _key: string })[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [trials, setTrials] = useState<TrialSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [dmDrafts, setDmDrafts] = useState<Record<string, string>>({})
  const [dmPosting, setDmPosting] = useState<Record<string, boolean>>({})
  const [dmPosted, setDmPosted] = useState<Record<string, boolean>>({})
  const [newAnnMessage, setNewAnnMessage] = useState('')
  const [newAnnLink, setNewAnnLink] = useState('')
  const [postingAnn, setPostingAnn] = useState(false)

  async function load() {
    setLoading(true)
    setLoadError(null)
    try {
      const [dmList, pendingList, annList, trialList] = await Promise.all([
        listDirectMessages(),
        listPendingMessages(),
        listAnnouncements(),
        listTrials(),
      ])
      setDms(dmList)
      setPending(pendingList.map((m) => ({ ...m, _key: `pending:${m.createdAt}:${m.id}` })))
      setAnnouncements(annList)
      setTrials(trialList)
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load admin data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleApprove(key: string) {
    await approveGroupMessage({ data: { key } })
    await load()
  }

  async function handleReject(key: string) {
    await rejectGroupMessage({ data: { key } })
    await load()
  }

  async function handlePostAnnouncement() {
    if (!newAnnMessage.trim() || postingAnn) return
    setPostingAnn(true)
    try {
      await postAnnouncement({ data: { message: newAnnMessage.trim(), link: newAnnLink.trim() || undefined } })
      setNewAnnMessage('')
      setNewAnnLink('')
      await load()
    } finally {
      setPostingAnn(false)
    }
  }

  async function handlePostDm(dmId: string, originalMessage: string) {
    const text = (dmDrafts[dmId] ?? originalMessage).trim()
    if (!text) return
    setDmPosting((s) => ({ ...s, [dmId]: true }))
    try {
      await postAdminMessage({ data: { message: text } })
      setDmPosted((s) => ({ ...s, [dmId]: true }))
    } finally {
      setDmPosting((s) => ({ ...s, [dmId]: false }))
    }
  }

  async function handleDeleteDm(m: DirectMessage) {
    await deleteDirectMessage({ data: { key: `dm:${m.createdAt}:${m.id}` } })
    await load()
  }

  async function handleDeleteTrial(t: TrialSubmission) {
    await deleteTrial({ data: { key: `trial:${t.createdAt}:${t.id}` } })
    await load()
  }

  return (
    <div className="path-page">
      <div className="wrap" style={{ maxWidth: 720 }}>
        <nav>
          <div className="logo">
            MAGNETISM MAXXING<span>.</span>
          </div>
          <a href="/path/community" className="rank-pill" style={{ textDecoration: 'none' }}>
            ← Community
          </a>
        </nav>

        <div className="section-title" style={{ marginTop: 12 }}>
          Admin Inbox
        </div>
        <div className="section-sub">Everything coming in, live. Only you can see this page.</div>

        {loadError && (
          <div
            style={{
              marginTop: 16,
              padding: '12px 16px',
              borderRadius: 12,
              background: 'rgba(255,80,80,0.1)',
              border: '1px solid rgba(255,80,80,0.35)',
              color: '#ffb3b3',
            }}
          >
            Couldn't load admin data: {loadError}{' '}
            <button
              onClick={() => load()}
              style={{ marginLeft: 8, textDecoration: 'underline', background: 'none', border: 'none', color: '#ffb3b3', cursor: 'pointer' }}
            >
              Retry
            </button>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            gap: 6,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 999,
            padding: 4,
            width: 'fit-content',
            flexWrap: 'wrap',
            margin: '24px 0',
          }}
        >
          <button
            type="button"
            onClick={() => setTab('dm')}
            style={{
              border: 'none',
              background: tab === 'dm' ? '#2b2b31' : 'transparent',
              color: tab === 'dm' ? '#f2f2f2' : 'rgba(230,230,230,0.6)',
              fontSize: 13,
              fontWeight: 700,
              borderRadius: 999,
              padding: '8px 18px',
              cursor: 'pointer',
            }}
          >
            Direct Messages ({dms.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('pending')}
            style={{
              border: 'none',
              background: tab === 'pending' ? '#2b2b31' : 'transparent',
              color: tab === 'pending' ? '#f2f2f2' : 'rgba(230,230,230,0.6)',
              fontSize: 13,
              fontWeight: 700,
              borderRadius: 999,
              padding: '8px 18px',
              cursor: 'pointer',
            }}
          >
            Pending Approval ({pending.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('announcements')}
            style={{
              border: 'none',
              background: tab === 'announcements' ? '#2b2b31' : 'transparent',
              color: tab === 'announcements' ? '#f2f2f2' : 'rgba(230,230,230,0.6)',
              fontSize: 13,
              fontWeight: 700,
              borderRadius: 999,
              padding: '8px 18px',
              cursor: 'pointer',
            }}
          >
            Announcements ({announcements.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('trials')}
            style={{
              border: 'none',
              background: tab === 'trials' ? '#2b2b31' : 'transparent',
              color: tab === 'trials' ? '#f2f2f2' : 'rgba(230,230,230,0.6)',
              fontSize: 13,
              fontWeight: 700,
              borderRadius: 999,
              padding: '8px 18px',
              cursor: 'pointer',
            }}
          >
            Trials ({trials.length})
          </button>
        </div>

        <div
          style={{
            maxHeight: '65vh',
            overflowY: 'auto',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14,
            padding: 16,
            background: 'rgba(0,0,0,0.2)',
          }}
        >
          {loading ? (
            <p style={{ color: 'rgba(230,230,230,0.4)' }}>Loading…</p>
          ) : tab === 'dm' ? (
            dms.length === 0 ? (
              <p style={{ color: 'rgba(230,230,230,0.4)' }}>No direct messages yet.</p>
            ) : (
              dms.map((m) => (
              <div key={m.id} style={{ marginBottom: 4 }}>
                <Bubble name={m.userName} message={m.message} createdAt={m.createdAt} />
                <textarea
                  value={dmDrafts[m.id] ?? m.message}
                  onChange={(e) => setDmDrafts((s) => ({ ...s, [m.id]: e.target.value }))}
                  rows={3}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    color: '#e6e6e6',
                    fontSize: 13,
                    padding: '8px 10px',
                    marginTop: -4,
                    marginBottom: 8,
                    fontFamily: 'inherit',
                    resize: 'vertical',
                  }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <button
                    type="button"
                    disabled={dmPosting[m.id]}
                    style={{
                      padding: '6px 16px',
                      borderRadius: 999,
                      border: 'none',
                      background: 'linear-gradient(90deg, #a86bff, #d4af37)',
                      color: '#120a1f',
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: dmPosting[m.id] ? 'default' : 'pointer',
                      opacity: dmPosting[m.id] ? 0.6 : 1,
                    }}
                    onClick={() => handlePostDm(m.id, m.message)}
                  >
                    {dmPosting[m.id] ? 'Posting…' : 'Post to Group Chat'}
                  </button>
                  {dmPosted[m.id] && (
                    <span style={{ color: '#8fdc9a', fontSize: 12, fontWeight: 700 }}>Posted ✓</span>
                  )}
                  <button
                    type="button"
                    style={{
                      padding: '6px 16px',
                      borderRadius: 999,
                      border: '1px solid rgba(255,255,255,0.2)',
                      background: 'transparent',
                      color: 'rgba(230,230,230,0.7)',
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                    onClick={() => handleDeleteDm(m)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
            )
          ) : tab === 'pending' ? (
            pending.length === 0 ? (
              <p style={{ color: 'rgba(230,230,230,0.4)' }}>Nothing waiting for review.</p>
            ) : (
              pending.map((m) => (
                <div key={m.id} style={{ marginBottom: 4 }}>
                  <Bubble name={m.userName} message={m.message} createdAt={m.createdAt} />
                  <div style={{ display: 'flex', gap: 8, marginTop: -4, marginBottom: 14 }}>
                    <button
                      type="button"
                      style={{
                        padding: '6px 16px',
                        borderRadius: 999,
                        border: 'none',
                        background: 'linear-gradient(90deg, #a86bff, #d4af37)',
                        color: '#120a1f',
                        fontWeight: 700,
                        fontSize: 12,
                        cursor: 'pointer',
                      }}
                      onClick={() => handleApprove(m._key)}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      style={{
                        padding: '6px 16px',
                        borderRadius: 999,
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: 'transparent',
                        color: 'rgba(230,230,230,0.7)',
                        fontSize: 12,
                        cursor: 'pointer',
                      }}
                      onClick={() => handleReject(m._key)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )
          ) : tab === 'announcements' ? (
            <div>
              <div
                style={{
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12,
                  padding: 14,
                  marginBottom: 18,
                  background: 'rgba(255,255,255,0.03)',
                }}
              >
                <textarea
                  value={newAnnMessage}
                  onChange={(e) => setNewAnnMessage(e.target.value)}
                  rows={3}
                  placeholder="Write a new announcement…"
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    color: '#e6e6e6',
                    fontSize: 13,
                    padding: '8px 10px',
                    marginBottom: 8,
                    fontFamily: 'inherit',
                    resize: 'vertical',
                  }}
                />
                <input
                  value={newAnnLink}
                  onChange={(e) => setNewAnnLink(e.target.value)}
                  placeholder="Optional link (Instagram, YouTube, etc.)"
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    color: '#e6e6e6',
                    fontSize: 13,
                    padding: '8px 10px',
                    marginBottom: 10,
                    fontFamily: 'inherit',
                  }}
                />
                <button
                  type="button"
                  disabled={postingAnn}
                  onClick={handlePostAnnouncement}
                  style={{
                    padding: '7px 18px',
                    borderRadius: 999,
                    border: 'none',
                    background: 'linear-gradient(90deg, #a86bff, #d4af37)',
                    color: '#120a1f',
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: postingAnn ? 'default' : 'pointer',
                    opacity: postingAnn ? 0.6 : 1,
                  }}
                >
                  {postingAnn ? 'Posting…' : 'Post Announcement'}
                </button>
              </div>
              {announcements.length === 0 ? (
                <p style={{ color: 'rgba(230,230,230,0.4)' }}>Nothing posted yet.</p>
              ) : (
                announcements.map((a) => (
                  <div
                    key={a.id}
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 12,
                      padding: '12px 16px',
                      marginBottom: 10,
                    }}
                  >
                    <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginBottom: 6 }}>
                      {new Date(a.createdAt).toLocaleString()}
                    </div>
                    <div style={{ color: 'rgba(230,230,230,0.9)', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                      {a.message}
                    </div>
                    {a.link && (
                      <a
                        href={a.link}
                        target="_blank"
                        rel="noreferrer"
                        style={{ display: 'inline-block', marginTop: 8, color: '#c9a8ff', fontSize: 13 }}
                      >
                        {a.link}
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : trials.length === 0 ? (
            <p style={{ color: 'rgba(230,230,230,0.4)' }}>No trial submissions yet.</p>
          ) : (
            trials.map((t) => (
              <div
                key={t.id}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12,
                  padding: '12px 16px',
                  marginBottom: 10,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                  <span style={{ color: '#c9a8ff', fontWeight: 700 }}>{t.userName}</span>
                  <span style={{ color: 'rgba(255,255,255,0.35)' }}>{new Date(t.createdAt).toLocaleString()}</span>
                </div>
                
                <a
                  href={t.videoLink}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#c9a8ff', fontSize: 14, wordBreak: 'break-all' }}
                >
                  {t.videoLink}
                </a>
                {t.note && (
                  <div
                    style={{
                      color: 'rgba(230,230,230,0.85)',
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.5,
                      marginTop: 8,
                      fontSize: 13,
                    }}
                  >
                    {t.note}
                  </div>
                )}
                <div style={{ marginTop: 10 }}>
                  <button
                    type="button"
                    style={{
                      padding: '6px 16px',
                      borderRadius: 999,
                      border: '1px solid rgba(255,255,255,0.2)',
                      background: 'transparent',
                      color: 'rgba(230,230,230,0.7)',
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                    onClick={() => handleDeleteTrial(t)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
