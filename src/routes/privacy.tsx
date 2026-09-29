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

const EMAIL = 'H3Ecommunitytakeover@gmail.com'

// A string is a paragraph; an array of strings is a bullet list.
type Section = { h: string; body: (string | string[])[] }

const intro =
  "Magnetism Maxxing is a private, team-moderated library of shared knowledge for paying members. This policy explains what information we collect, how we use and protect it, and your choices. We aim to follow the Australian Privacy Principles under the Privacy Act 1988 (Cth)."

const sections: Section[] = [
  {
    h: 'What We Collect',
    body: [
      [
        "Account information: your Whop account ID, display name, and membership status, through Whop sign-in. We never see your password.",
        "Library activity: your progress (modules completed, rank) and anything you submit, such as messages, posts, and trial submissions.",
        "Technical data: IP address, browser type, and basic request data collected automatically by our hosting provider for security and reliability.",
        "Messages to us: anything you send to our contact email, including your email address.",
      ],
      "We don't ask for sensitive information (such as health details). Please don't post it. Anything you choose to post in the library may be visible to other members.",
    ],
  },
  {
    h: 'Why We Use It',
    body: [
      [
        "to let you sign in and access the library;",
        "to track your progress and show your rank;",
        "to moderate content and keep the community safe;",
        "to protect the site against abuse, fraud, and attacks;",
        "to answer your messages and requests;",
        "to meet legal obligations.",
      ],
      "We don't use your information for advertising, and we don't build advertising profiles.",
    ],
  },
  {
    h: 'Payments',
    body: [
      "All payments are handled entirely by Whop. We never receive or store your card details. Whop's own privacy policy explains how it handles your information.",
    ],
  },
  {
    h: 'Who Can See Your Information',
    body: [
      "Access to member data is limited to our moderation team. We share information only with:",
      [
        "Whop, for sign-in, billing, and membership;",
        "Cloudflare, for hosting and security;",
        "authorities or other parties, where the law requires it or where needed to protect people or rights.",
      ],
      "We never sell your information and never share it for marketing.",
    ],
  },
  {
    h: 'Where Your Data Lives',
    body: [
      "Your data is stored and processed on Cloudflare's infrastructure, which may be located outside Australia. By using the site, you accept that your information may be handled overseas.",
    ],
  },
  {
    h: 'Cookies',
    body: [
      "We use a session cookie only, to keep you signed in. We don't use advertising or tracking cookies.",
    ],
  },
  {
    h: 'How Long We Keep It',
    body: [
      "We keep your information while your account is active, and afterwards for as long as needed for moderation, security, and legal reasons. When it is no longer needed, we delete it or make it anonymous where reasonably possible.",
    ],
  },
  {
    h: 'Security',
    body: [
      "We use reasonable measures to protect your information, including restricted access, sign-in through Whop, and encrypted connections. No online service is completely secure, so we can't guarantee absolute security. If we become aware of a breach likely to cause serious harm, we will act to contain it and notify affected people and authorities as the law requires.",
    ],
  },
  {
    h: 'Your Rights',
    body: [
      `You can ask to access, correct, or delete your information at any time by emailing ${EMAIL}. We may need to confirm your identity first, and we aim to respond within 30 days. Some information may need to be kept for legal or safety reasons.`,
    ],
  },
  {
    h: 'Age Requirement',
    body: [
      "The library is for members aged 18 and over only. We don't knowingly collect information from anyone under 18. If you think a minor has joined, contact us and we will remove the account.",
    ],
  },
  {
    h: 'Links to Other Sites',
    body: [
      "The library may link to outside sites. We don't control them and aren't responsible for their privacy practices.",
    ],
  },
  {
    h: 'Complaints',
    body: [
      "If you're unhappy with how we've handled your information, contact us first. If we can't resolve it, you can complain to the Office of the Australian Information Commissioner (OAIC) at oaic.gov.au.",
    ],
  },
  {
    h: 'Changes',
    body: [
      "We may update this policy occasionally. The date above shows the latest version.",
    ],
  },
  {
    h: 'Contact',
    body: [`For data requests or privacy questions only: ${EMAIL}`],
  },
]

function Text({ children }: { children: string }) {
  const parts = children.split(EMAIL)
  return (
    <>
      {parts.map((s, i) => (
        <span key={i}>
          {i > 0 && <strong>{EMAIL}</strong>}
          {s}
        </span>
      ))}
    </>
  )
}

function PrivacyPage() {
  return (
    <div style={styles.page}>
      <Link to="/" style={styles.back}>← Back to Magnetism Maxxing</Link>
      <h1 style={styles.h1}>Privacy Policy</h1>
      <div style={styles.updated}>Last updated: 29 September 2026</div>

      <p style={styles.p}>{intro}</p>

      {sections.map((s) => (
        <div key={s.h}>
          <h2 style={styles.h2}>{s.h}</h2>
          {s.body.map((b, i) =>
            Array.isArray(b) ? (
              <ul key={i} style={styles.ul}>
                {b.map((li) => (
                  <li key={li}>{li}</li>
                ))}
              </ul>
            ) : (
              <p key={i} style={styles.p}>
                <Text>{b}</Text>
              </p>
            ),
          )}
        </div>
      ))}
    </div>
  )
}
