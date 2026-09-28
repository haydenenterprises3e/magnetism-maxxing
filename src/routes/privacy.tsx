import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/privacy')({
  head: () => ({
    meta: [{ title: 'Privacy Policy — Magnetism Maxxing' }],
  }),
  component: PrivacyPage,
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

function PrivacyPage() {
  return (
    <div style={styles.page}>
      <Link to="/" style={styles.back}>← Back to Magnetism Maxxing</Link>
      <h1 style={styles.h1}>Privacy Policy</h1>
      <div style={styles.updated}>Last updated: 25 September 2026</div>

      <p style={styles.p}>
        Magnetism Maxxing is a private, team-moderated library of shared knowledge, made available to paying
        members. This policy explains what information is collected from you and how it's handled, in line
        with the Australian Privacy Principles under the Privacy Act 1988 (Cth).
      </p>

      <h2 style={styles.h2}>What We Collect</h2>
      <ul style={styles.ul}>
        <li>Your Whop account ID, display name, and membership status (via Whop sign-in — we never see your password)</li>
        <li>Your progress through the library (modules completed, rank)</li>
        <li>Anything you submit inside the library (messages, posts, trial submissions)</li>
        <li>Basic technical data (IP address, browser) collected automatically by our hosting provider for security</li>
      </ul>

      <h2 style={styles.h2}>Payments</h2>
      <p style={styles.p}>
        All payments are handled entirely by Whop. We never receive or store your card details.
      </p>

      <h2 style={styles.h2}>Where Your Data Lives</h2>
      <p style={styles.p}>
        Data is stored on Cloudflare's infrastructure, which may process it outside Australia. Access to
        member data is restricted to the moderation team only.
      </p>

      <h2 style={styles.h2}>Cookies</h2>
      <p style={styles.p}>
        We use a session cookie only, to keep you signed in. No advertising or tracking cookies.
      </p>

      <h2 style={styles.h2}>We Don't Sell Your Data</h2>
      <p style={styles.p}>
        Your information is only ever shared with Whop (for sign-in and billing) and Cloudflare (for
        hosting) — never sold, and never shared for marketing purposes.
      </p>

      <h2 style={styles.h2}>Age Requirement</h2>
      <p style={styles.p}>
        This library is for members aged 18 and over only.
      </p>

      <h2 style={styles.h2}>Your Rights & Contact</h2>
      <p style={styles.p}>
        You can request access to, correction of, or deletion of your data at any time. For data requests or
        privacy questions only, contact <strong>haydenenterprises3e@gmail.com</strong>.
      </p>

      <h2 style={styles.h2}>Changes</h2>
      <p style={styles.p}>
        This policy may be updated occasionally; the date above will reflect the latest version.
      </p>
    </div>
  )
}
