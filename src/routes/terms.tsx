import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/terms')({
  head: () => ({
    meta: [{ title: 'Terms & Conditions — Magnetism Maxxing' }],
  }),
  component: TermsPage,
})

const styles = {
  page: { maxWidth: 780, margin: '0 auto', padding: '64px 24px 96px', color: 'rgba(230,230,230,0.9)', lineHeight: 1.7 } as const,
  h1: { color: '#fff', fontSize: 32, marginBottom: 8 } as const,
  updated: { color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 40 } as const,
  h2: { color: '#c9a8ff', fontSize: 20, marginTop: 40, marginBottom: 12 } as const,
  p: { marginBottom: 14, color: 'rgba(230,230,230,0.85)' } as const,
  back: { color: '#c9a8ff', textDecoration: 'none', display: 'inline-block', marginBottom: 32 } as const,
}

function TermsPage() {
  return (
    <div style={styles.page}>
      <Link to="/" style={styles.back}>← Back to Magnetism Maxxing</Link>
      <h1 style={styles.h1}>Terms & Conditions</h1>
      <div style={styles.updated}>Last updated: 25 September 2026</div>

      <p style={styles.p}>
        Magnetism Maxxing is a private, team-moderated library of shared knowledge. By joining, you agree to
        the following.
      </p>

      <h2 style={styles.h2}>Age Requirement</h2>
      <p style={styles.p}>
        You must be 18 or older to join. We may remove any account we reasonably believe belongs to someone
        under 18.
      </p>

      <h2 style={styles.h2}>Educational Purpose Only</h2>
      <p style={styles.p}>
        Everything here is for educational purposes only. It's on you to actually do the work. We don't
        guarantee any outcome — financial, physical, or otherwise.
      </p>

      <h2 style={styles.h2}>Ascending-Tier Content</h2>
      <p style={styles.p}>
        The Ascending tier includes material on alternative history, esoteric traditions, and metaphysics.
        This is shared as belief, tradition, and community opinion — not as settled fact. Use your own
        judgment.
      </p>

      <h2 style={styles.h2}>Billing & Cancellation</h2>
      <p style={styles.p}>
        Membership is billed on a recurring basis through Whop. Cancel anytime, no contracts. Cancelling
        stops future billing; you keep access until the end of the period you already paid for.
      </p>

      <h2 style={styles.h2}>Refunds</h2>
      <p style={styles.p}>
        Payments are generally non-refundable once a billing period starts, except where the Australian
        Consumer Law entitles you to a refund. Message us if you think that applies to you.
      </p>

      <h2 style={styles.h2}>Conduct</h2>
      <p style={styles.p}>
        No harassment, spam, or trying to get around access limits. We can remove content or accounts that
        break this.
      </p>

      <h2 style={styles.h2}>Content Ownership</h2>
      <p style={styles.p}>
        Library content is ours (or our contributors') and is for your personal use only — not for
        redistribution or resale. Anything you submit stays yours, but you're giving us permission to display
        and moderate it inside the library.
      </p>

      <h2 style={styles.h2}>Liability</h2>
      <p style={styles.p}>
        To the extent the law allows, we're not liable for indirect losses (like lost income) or injury from
        following advice or exercises shared in the library. This doesn't affect any right you have under the
        Australian Consumer Law that can't be excluded.
      </p>

      <h2 style={styles.h2}>Governing Law</h2>
      <p style={styles.p}>
        These Terms are governed by the laws of Australia.
      </p>

      <h2 style={styles.h2}>Refund Requests & Questions</h2>
      <p style={styles.p}>
        For refund requests or account questions, message us at <strong>haydenenterprises3e@gmail.com</strong>.
      </p>
    </div>
  )
}
