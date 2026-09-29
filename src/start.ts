import { createStart, createCsrfMiddleware, createMiddleware } from '@tanstack/react-start'

const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === 'serverFn',
  failureResponse: (ctx: any) => {
    const h = ctx.request.headers
    console.error('CSRF_BLOCK', 'fetchSite=' + h.get('Sec-Fetch-Site'), 'origin=' + h.get('Origin'), 'referer=' + h.get('Referer'), 'url=' + new URL(ctx.request.url).origin)
    return new Response('Forbidden', { status: 403 })
  },
})

const securityHeadersMiddleware = createMiddleware().server(async ({ next }) => {
  const result = await next()
  result.response.headers.set('X-Content-Type-Options', 'nosniff')
  result.response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://api.whop.com https://*.whop.com https://*.google-analytics.com",
      "frame-ancestors 'self' https://whop.com https://*.whop.com",
      "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  )
  result.response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  result.response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  return result
})

export const startInstance = createStart(() => ({
  requestMiddleware: [csrfMiddleware, securityHeadersMiddleware],
}))
