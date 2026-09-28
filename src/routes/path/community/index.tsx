import { useEffect, useRef, useState } from 'react'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { computeOverallRank, lessonKey, TRACKS } from '../../../lib/pathData'
import { companyAccessLevel, currentUser, requireAnyPurchase } from '../../../lib/session'
import { getProgress } from '../../../server/progress'
import {
  listAnnouncements,
  listApprovedMessages,
  sendDirectMessage,
  submitGroupMessage,
  submitTrial,
  type Announcement,
  type GroupMessage,
} from '../../../server/community'

const ASCENDING_PRODUCT_ID = 'prod_JYWg9jHMiYBQE'
const COMPANY_ID = 'biz_jdcD3rL9FLYsxy'

const checkAccess = createServerFn({ method: 'GET' }).handler(() =>
  requireAnyPurchase([ASCENDING_PRODUCT_ID], COMPANY_ID),
)

const checkIsAdmin = createServerFn({ method: 'GET' }).handler(async () => {
  const user = await currentUser()
  if (!user) return false
  return (await companyAccessLevel(user.sub, COMPANY_ID)) === 'admin'
})

export const Route = createFileRoute('/path/community/')({
  head: () => ({
    meta: [{ title: 'Magnetism Maxxing — Community' }],
  }),
  beforeLoad: async ({ location }) => {
    const guard = await checkAccess()
    if (guard.ok) return

    if (guard.reason === 'signed_out') {
      throw redirect({
        href: `/api/oauth/login?redirect_to=${encodeURIComponent(location.href)}`,
      })
    }
    throw redirect({ to: '/' })
  },
  loader: async () => {
    const progress = await getProgress()
    const completed = new Set(progress.signedIn ? progress.completed : [])
    const hasAscending = progress.signedIn ? progress.hasAscending : false
    computeOverallRank(completed, hasAscending) // keep rank system consistent, unused here directly

    const totalCoreLessons = TRACKS.reduce((sum, t) => sum + t.lessons.length, 0)
    const doneCoreLessons = TRACKS.reduce(
      (sum, t) => sum + t.lessons.filter((l) => completed.has(lessonKey(t.slug, l.slug))).length,
      0,
    )
    const unlocked = totalCoreLessons > 0 && doneCoreLessons / totalCoreLessons >= 0.7

    if (!unlocked) {
      // Company admins can always preview gated content, same as the purchase check above.
      const isAdmin = await checkIsAdmin()
      if (!isAdmin) {
        throw redirect({ to: '/path/ascending' })
      }
    }

    const isAdmin = await checkIsAdmin()
    return { isAdmin }
  },
  component: CommunityPage,
})

function CommunitySidebarSection({
  title,
  eyebrow,
  status,
  description,
  defaultOpen,
  children,
}: {
  title: string
  eyebrow: string
  status?: string
  description?: string
  defaultOpen?: boolean
  children?: React.ReactNode
}) {
  const [open, setOpen] = useState(!!defaultOpen)
  return (
    <div className={`track-block${open ? ' open' : ''}`}>
      <div className="track-head" onClick={() => setOpen((o) => !o)}>
        <div className="track-head-left">
          <div>
            <div className="track-title">{title}</div>
            <div className="track-meta">{eyebrow}</div>
          </div>
        </div>
        <span className="chevron">›</span>
      </div>
      {open && (
        <div style={{ padding: '18px 22px 26px' }}>
          {children ? (
            children
          ) : (
            <>
              <p style={{ color: 'rgba(230,220,245,0.75)', lineHeight: 1.5, marginBottom: 14 }}>{description}</p>
              <div
                style={{
                  display: 'inline-block',
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  color: '#d4af37',
                  background: 'rgba(212,175,55,0.1)',
                  border: '1px solid rgba(212,175,55,0.3)',
                  borderRadius: 999,
                  padding: '5px 14px',
                }}
              >
                {status}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function CommunityPage() {
  const { isAdmin } = Route.useLoaderData()

  const [dmText, setDmText] = useState('')
  const [dmSending, setDmSending] = useState(false)
  const [dmSent, setDmSent] = useState(false)

  const [groupText, setGroupText] = useState('')
  const [groupSending, setGroupSending] = useState(false)
  const [groupSent, setGroupSent] = useState(false)
  const [approved, setApproved] = useState<GroupMessage[]>([])

  const [announcements, setAnnouncements] = useState<Announcement[]>([])

  const [trialLink, setTrialLink] = useState('')
  const [trialNote, setTrialNote] = useState('')
  const [trialSending, setTrialSending] = useState(false)
  const [trialSent, setTrialSent] = useState(false)

  async function loadApproved() {
    const list = await listApprovedMessages()
    setApproved([...list].sort((a, b) => a.createdAt - b.createdAt))
  }

  async function loadAnnouncements() {
    const list = await listAnnouncements()
    setAnnouncements(list)
  }

  const feedRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = feedRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [approved])

  useEffect(() => {
    loadApproved()
    loadAnnouncements()
  }, [])

  async function handleSendDM() {
    if (!dmText.trim() || dmSending) return
    setDmSending(true)
    try {
      await sendDirectMessage({ data: { message: dmText.trim() } })
      setDmText('')
      setDmSent(true)
      setTimeout(() => setDmSent(false), 3000)
    } finally {
      setDmSending(false)
    }
  }

  async function handleSubmitGroup() {
    if (!groupText.trim() || groupSending) return
    setGroupSending(true)
    try {
      await submitGroupMessage({ data: { message: groupText.trim() } })
      setGroupText('')
      setGroupSent(true)
      setTimeout(() => setGroupSent(false), 3000)
    } finally {
      setGroupSending(false)
    }
  }

  async function handleSubmitTrial() {
    if (!trialLink.trim() || trialSending) return
    setTrialSending(true)
    try {
      await submitTrial({ data: { videoLink: trialLink.trim(), note: trialNote.trim() } })
      setTrialLink('')
      setTrialNote('')
      setTrialSent(true)
      setTimeout(() => setTrialSent(false), 3000)
    } finally {
      setTrialSending(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    minHeight: 80,
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(168,120,255,0.3)',
    borderRadius: 10,
    padding: 12,
    color: '#f2f2f2',
    fontFamily: 'inherit',
    fontSize: 14,
    resize: 'vertical',
  }

  const btnStyle: React.CSSProperties = {
    marginTop: 10,
    padding: '9px 20px',
    borderRadius: 999,
    border: 'none',
    background: 'linear-gradient(90deg, #a86bff, #d4af37)',
    color: '#120a1f',
    fontWeight: 700,
    fontSize: 13,
    cursor: 'pointer',
  }

  return (
    <div className="path-page">
      <div className="wrap">
        <nav>
          <div className="logo">
            MAGNETISM MAXXING<span>.</span>
          </div>
          <a href="/path/ascending" className="rank-pill" style={{ textDecoration: 'none' }}>
            ← Ascending Path
          </a>
        </nav>

        <div className="section-title" style={{ marginTop: 12 }}>
          Community
        </div>
        <div className="section-sub">
          The building block behind every track and every module — where the curriculum actually gets built.
        </div>

        {isAdmin && (
          
          <Link
            to="/path/community/admin"
            style={{
              display: 'inline-block',
              marginTop: 14,
              fontSize: 13,
              fontWeight: 700,
              color: '#d4af37',
              textDecoration: 'none',
              border: '1px solid rgba(212,175,55,0.3)',
              borderRadius: 999,
              padding: '7px 16px',
            }}
          >
            Open Admin Inbox →
          </Link>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '28px 0 48px', maxWidth: 640 }}>
          <CommunitySidebarSection title="Announcements" eyebrow="TEAM UPDATES" defaultOpen>
            <p style={{ color: 'rgba(230,220,245,0.75)', lineHeight: 1.5, marginBottom: 14 }}>
              What's new, what's changed, and what's coming next — posted directly by the team.
            </p>
            {announcements.length === 0 ? (
              <p style={{ color: 'rgba(230,230,230,0.4)', fontSize: 13 }}>Nothing posted yet.</p>
            ) : (
              announcements.map((a) => (
                <div
                  key={a.id}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 10,
                    padding: '12px 14px',
                    marginBottom: 10,
                  }}
                >
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginBottom: 6 }}>
                    {new Date(a.createdAt).toLocaleString()}
                  </div>
                  <div style={{ color: 'rgba(235,235,235,0.92)', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
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
          </CommunitySidebarSection>
          <CommunitySidebarSection title="Message the Team" eyebrow="DIRECT">
            <p style={{ color: 'rgba(230,220,245,0.75)', lineHeight: 1.5, marginBottom: 14 }}>
              A direct line to the team for questions, feedback, or content requests. Only you and the team see this
              thread.
            </p>
            <textarea
              style={inputStyle}
              placeholder="Type your message to the team…"
              value={dmText}
              onChange={(e) => setDmText(e.target.value)}
            />
            <div>
              <button type="button" style={btnStyle} onClick={handleSendDM} disabled={dmSending}>
                {dmSending ? 'Sending…' : dmSent ? 'Sent ✓' : 'Send'}
              </button>
            </div>

          </CommunitySidebarSection>
          <CommunitySidebarSection title="Group Discussion" eyebrow="MODERATED" defaultOpen>
            <p style={{ color: 'rgba(230,220,245,0.75)', lineHeight: 1.5, marginBottom: 14 }}>
              Open discussion with other Ascending members. Every post is reviewed before it goes live, so the space
              stays sharp and on-topic.
            </p>

            <div
              ref={feedRef}
              style={{
                background: '#000',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                height: 420,
                overflowY: 'auto',
                padding: '16px 14px',
                marginBottom: 12,
              }}
            >
              {approved.length === 0 ? (
                <p style={{ color: 'rgba(230,230,230,0.35)', fontSize: 13, textAlign: 'center', marginTop: 40 }}>
                  No messages yet. Be the first once it's approved.
                </p>
              ) : (
                approved.map((m) => (
                  <div key={m.id} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                      <span style={{ color: '#c9a8ff', fontWeight: 700 }}>{m.userName}</span>
                      <span style={{ color: 'rgba(255,255,255,0.3)' }}>
                        {new Date(m.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'inline-block',
                        maxWidth: '85%',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 10,
                        padding: '8px 12px',
                        color: 'rgba(235,235,235,0.92)',
                        whiteSpace: 'pre-wrap',
                        lineHeight: 1.45,
                        fontSize: 14,
                      }}
                    >
                      {m.message}
                    </div>
                  </div>
                ))
              )}
            </div>

            <textarea
              style={{ ...inputStyle, minHeight: 60 }}
              placeholder="Share something with the group…"
              value={groupText}
              onChange={(e) => setGroupText(e.target.value)}
            />
            <div>
              <button type="button" style={btnStyle} onClick={handleSubmitGroup} disabled={groupSending}>
                {groupSending ? 'Submitting…' : groupSent ? 'Submitted for review ✓' : 'Submit'}
              </button>
            </div>
          </CommunitySidebarSection>
          <CommunitySidebarSection title="Trials" eyebrow="PROVE IT">
            <p style={{ color: 'rgba(230,220,245,0.75)', lineHeight: 1.5, marginBottom: 14 }}>
              Real challenges tied to what you've learned. Submit an unlisted video link with a short note — the
              team reviews every submission.
            </p>
            <textarea
              style={{ ...inputStyle, minHeight: 44 }}
              placeholder="Unlisted YouTube link…"
              value={trialLink}
              onChange={(e) => setTrialLink(e.target.value)}
            />
            <textarea
              style={{ ...inputStyle, marginTop: 10 }}
              placeholder="What did you work on? Any context for the team…"
              value={trialNote}
              onChange={(e) => setTrialNote(e.target.value)}
            />
            <div>
              <button type="button" style={btnStyle} onClick={handleSubmitTrial} disabled={trialSending}>
                {trialSending ? 'Submitting…' : trialSent ? 'Submitted ✓' : 'Submit Trial'}
              </button>
            </div>
          </CommunitySidebarSection>
        </div>

        <div className="footer-note">
          MAGNETISM MAXXING — Everything taught here is for educational purposes only. It's on each student to
          actually implement and do the work. We don't guarantee profits or income — we guarantee real knowledge
          from serious sources, alongside community-based theories, conspiracies, and shared opinion, clearly
          presented as such. · © 2026 · TERMS · PRIVACY
        </div>
      </div>
    </div>
  )
}
