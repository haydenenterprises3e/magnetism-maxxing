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
  ul: { marginBottom: 14, paddingLeft: 20, color: 'rgba(230,230,230,0.85)' } as const,
  back: { color: '#c9a8ff', textDecoration: 'none', display: 'inline-block', marginBottom: 32 } as const,
}

const EMAIL = 'H3Ecommunitytakeover@gmail.com'

// A string is a paragraph; an array of strings is a bullet list.
type Section = { h: string; body: (string | string[])[] }

const intro =
  "Magnetism Maxxing (“we”, “us”) is a private, team-moderated library of shared knowledge made available to paying members. By joining or using the site, you agree to these Terms. If you don't agree, don't join."

const sections: Section[] = [
  {
    h: 'Who Can Join',
    body: [
      "You must be 18 or older. We may remove any account we reasonably believe belongs to someone under 18. You are responsible for keeping your Whop login secure and for activity on your account.",
    ],
  },
  {
    h: 'What This Library Is',
    body: [
      "The library is a collection of shared information, ideas, and community discussion. It is for educational and entertainment purposes only. It is not professional advice of any kind, including medical, mental health, legal, financial, or fitness advice.",
      "Content may include opinion, tradition, folklore, “bro science”, conspiracy theories, alternative history, esoteric or metaphysical beliefs, and persuasion or influence techniques. It is shared as information and belief, not as established fact. Some content may be inaccurate, exaggerated, outdated, or fictional. Use your own judgment and verify anything important yourself.",
    ],
  },
  {
    h: 'The Library Changes',
    body: [
      "The library is constantly changing. We may add, edit, reorganise, or remove content, tiers, features, and prices at any time, without notice. We don't promise that any particular content will always be available.",
    ],
  },
  {
    h: 'Health & Safety',
    body: [
      "Some material, including exercises, routines, diets, breathing or meditation practices, and other activities, could cause injury or harm, especially if done incorrectly or if you have an existing condition.",
      [
        "Speak to a qualified doctor before trying anything physical, dietary, or mental-health related.",
        "Never ignore or delay professional medical advice because of something you read here.",
        "Stop immediately if you feel pain, dizziness, distress, or anything unusual.",
        "Everything in the library is a framework of possible ideas, not a prescription for you.",
      ],
      "You take part entirely at your own risk. To the maximum extent permitted by law, we are not responsible for injury, loss, or harm resulting from your use of, or reliance on, library content.",
    ],
  },
  {
    h: 'No Guarantees of Results',
    body: [
      "We do not promise or guarantee any outcome, whether financial, physical, social, personal, or otherwise. Any results described are examples only. What you get depends on your own effort and circumstances.",
    ],
  },
  {
    h: 'Pricing, Billing & Cancellation',
    body: [
      "Membership is billed through Whop, and Whop's terms also apply to your purchase. Prices may change over time as the library changes.",
      [
        "The price shown at Whop checkout when you buy is the price that applies to you.",
        "A price change won't affect a billing period you have already paid for.",
        "You can cancel anytime through your Whop account. Cancelling stops future billing, and you keep access until the end of the period you already paid for.",
      ],
    ],
  },
  {
    h: 'Refunds',
    body: [
      `Payments are generally non-refundable once a billing period starts, except where the Australian Consumer Law or another law entitles you to a refund. If you think that applies to you, message us at ${EMAIL} with your Whop account name and the reason. Please contact us before starting a chargeback so we can try to resolve it.`,
    ],
  },
  {
    h: 'Statements Outside the Site',
    body: [
      "We may talk about the library in videos, social media posts, and messages. These are general commentary and are not part of your contract with us. Content, tiers, and prices change, so something said in a video may be out of date. The description and price shown on the site and at Whop checkout when you buy are what apply to your purchase. This section does not limit any right you have under the Australian Consumer Law.",
    ],
  },
  {
    h: 'Conduct',
    body: [
      "You must not:",
      [
        "harass, threaten, or abuse others;",
        "post spam, malware, or anything illegal;",
        "post content that infringes someone else's rights;",
        "share your account or try to get around access limits;",
        "scrape, copy, or bulk-download library content.",
      ],
      "We may remove content or accounts that break these rules, with or without notice.",
    ],
  },
  {
    h: 'Your Submissions',
    body: [
      "Anything you post stays yours. By posting, you give us a non-exclusive, free licence to display, store, and moderate it inside the library. You promise you have the right to post it and that it doesn't break the law or anyone's rights.",
    ],
  },
  {
    h: 'Our Content',
    body: [
      "Library content belongs to us or our contributors. It is licensed to you for personal use only. You may not redistribute, resell, or publicly share it without written permission.",
    ],
  },
  {
    h: 'Copyright Complaints',
    body: [
      "If you believe content on the site infringes your copyright, see our Copyright / DMCA Policy.",
    ],
  },
  {
    h: 'Third-Party Services',
    body: [
      "The site relies on Whop (sign-in and billing) and Cloudflare (hosting). We are not responsible for outages, changes, or actions of those services.",
    ],
  },
  {
    h: 'Availability',
    body: [
      "We don't promise the site will always be available or error-free. We may suspend or end the service, or your access, at any time, including if you break these Terms.",
    ],
  },
  {
    h: 'Limits on Our Liability',
    body: [
      "To the maximum extent permitted by law, we are not liable for indirect or consequential loss, including lost income, lost opportunity, or loss of data, or for injury or harm from following information, advice, or exercises in the library. Where the law allows us to limit our liability, our total liability to you is limited to the amount you paid us in the 3 months before the claim.",
      "Nothing in these Terms excludes, restricts, or modifies any right or remedy you have under the Australian Consumer Law or any other law that cannot be excluded.",
    ],
  },
  {
    h: 'Changes to These Terms',
    body: [
      "We may update these Terms from time to time. The date above shows the latest version. Continuing to use the site after a change means you accept it.",
    ],
  },
  {
    h: 'Governing Law',
    body: [
      "These Terms are governed by the laws of Australia, and both of us submit to the courts of the Australian State or Territory in which we are based. If any part of these Terms is found unenforceable, the rest still applies.",
    ],
  },
  {
    h: 'Contact',
    body: [`For refund requests or account questions: ${EMAIL}`],
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

function TermsPage() {
  return (
    <div style={styles.page}>
      <Link to="/" style={styles.back}>← Back to Magnetism Maxxing</Link>
      <h1 style={styles.h1}>Terms & Conditions</h1>
      <div style={styles.updated}>Last updated: 29 September 2026</div>

      <p style={styles.p}>{intro}</p>

      {sections.map((s, n) => (
        <div key={s.h}>
          <h2 style={styles.h2}>{n + 1}. {s.h}</h2>
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
