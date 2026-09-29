import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Magnetism Maxxing: Increase Magnetism | H3E Community',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: 'Magnetism Maxxing: Increase Magnetism | H3E Community' },
      { property: 'og:description', content: 'A structured leveling system for building presence, confidence, and discipline.' },
      { name: 'twitter:card', content: 'summary' },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
      { rel: 'icon', href: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { rel: 'apple-touch-icon', href: '/favicon-180.png' },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Magnetism Maxxing',
          alternateName: ['magnetism-maxxing', 'H3E', 'H3E Community', 'H3VENCE', 'Ascending Maxxing', 'The Awakening Path'],
          url: 'https://magnetism-maxxing.whop.site/',
        }),
      },
      {
        src: 'https://www.googletagmanager.com/gtag/js?id=G-2K5VDJ93FQ',
        async: true,
      },
      {
        children: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-2K5VDJ93FQ');
        `,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
