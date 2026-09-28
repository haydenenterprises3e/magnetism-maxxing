import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/dmca')({
  head: () => ({
    meta: [{ title: 'Copyright / DMCA Policy — Magnetism Maxxing' }],
  }),
  component: DmcaPage,
})

const styles = {
  page: { maxWidth: 780, margin: '0 auto', padding: '64px 24px 96px', color: 'rgba(230,230,230,0.9)', lineHeight: 1.7 } as const,
  h1: { color: '#fff', fontSize: 32, marginBottom: 8 } as const,
  updated: { color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 40 } as const,
  h2: { color: '#c9a8ff', fontSize: 20, marginTop: 40, marginBottom: 12 } as const,
  p: { marginBottom: 14, color: 'rgba(230,230,230,0.85)' } as const,
  ul: { marginBottom: 14, paddingLeft: 20, color: 'rgba(230,230,230,0.85)' } as const,
  back: { color: '#c9a8ff', textDecoration: 'none', display: 'inline-block', marginBottom: 32 } as const,
}

function DmcaPage() {
  return (
    <div style={styles.page}>
      <Link to="/" style={styles.back}>← Back to Magnetism Maxxing</Link>
      <h1 style={styles.h1}>Copyright / DMCA Policy</h1>
      <div style={styles.updated}>Last updated: 27 September 2026</div>

      <p style={styles.p}>
        Magnetism Maxxing respects the intellectual property rights of others and expects members to do the
        same. This page explains how to report content on this site that you believe infringes your
        copyright, and how we handle those reports.
      </p>

      <p style={styles.p}>
        We are a small, Australia-based team. We are not a registered DMCA agent with the US Copyright
        Office, and this page describes our good-faith takedown process rather than a claim to formal DMCA
        safe-harbor status. We take copyright complaints seriously regardless.
      </p>

      <h2 style={styles.h2}>What This Covers</h2>
      <p style={styles.p}>
        This applies to user-submitted content on the site — messages, group chat posts, trial submissions,
        and anything else members post directly into the library. It does not apply to the paid course
        content itself, which is our own original work.
      </p>

      <h2 style={styles.h2}>How to Submit a Takedown Request</h2>
      <p style={styles.p}>
        If you believe content on this site infringes your copyright, email{' '}
        <strong>haydenenterprises3e@gmail.com</strong> with the subject line "Copyright Complaint" and
        include:
      </p>
      <ul style={styles.ul}>
        <li>Your name and contact information</li>
        <li>A description of the copyrighted work you believe is being infringed</li>
        <li>The exact location of the material on this site (a URL or clear description of where to find it)</li>
        <li>A statement that you have a good-faith belief the use is not authorized by the copyright owner, its agent, or the law</li>
        <li>A statement, under penalty of perjury, that the information in your notice is accurate and that you are the copyright owner or authorized to act on their behalf</li>
        <li>Your physical or electronic signature</li>
      </ul>

      <h2 style={styles.h2}>What Happens Next</h2>
      <p style={styles.p}>
        We'll review valid requests and, where warranted, remove or disable access to the reported content.
        We aim to respond within a reasonable time, generally a few business days.
      </p>

      <h2 style={styles.h2}>Counter-Notices</h2>
      <p style={styles.p}>
        If content you posted was removed and you believe this was a mistake or misidentification, you can
        email the same address with an explanation. We'll review it in good faith, though as noted above we
        don't operate a formal DMCA counter-notice process.
      </p>

      <h2 style={styles.h2}>Repeat Infringers</h2>
      <p style={styles.p}>
        Members who repeatedly post infringing content may have their posting privileges or membership
        terminated.
      </p>

      <h2 style={styles.h2}>Contact</h2>
      <p style={styles.p}>
        For copyright notices only, email <strong>haydenenterprises3e@gmail.com</strong>. For general privacy
        or data questions, see our{' '}
        <Link to="/privacy" style={{ color: '#c9a8ff' }}>Privacy Policy</Link>.
      </p>
    </div>
  )
}
