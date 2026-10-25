import { NextResponse, type NextRequest } from 'next/server'

/* Next 16 proxy (formerly middleware).
   1. URL scheme: Georgian at "/", English at "/en/...". Internally every public page lives under
      /[locale]/..., so "/health" is rewritten to "/ka/health" and "/en/health" stays as is.
   2. /account/* is guarded by the Neon Auth session (visitor accounts, set up by the Neon session). */
const PUBLIC_FILE = /\.[a-zA-Z0-9]+$/

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === '/account' || pathname.startsWith('/account/')) {
    if (process.env.NEON_AUTH_BASE_URL && process.env.NEON_AUTH_COOKIE_SECRET) {
      const { auth } = await import('@/lib/auth/server')
      return auth.middleware({ loginUrl: '/auth/sign-in' })(req)
    }
    return NextResponse.next()
  }

  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/neon-status') ||
    pathname === '/en' ||
    pathname.startsWith('/en/') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next()
  }

  // "/ka/..." is never a public URL: send it to the bare path
  if (pathname === '/ka' || pathname.startsWith('/ka/')) {
    const url = req.nextUrl.clone()
    url.pathname = pathname.replace(/^\/ka/, '') || '/'
    return NextResponse.redirect(url, 308)
  }

  const url = req.nextUrl.clone()
  url.pathname = '/ka' + (pathname === '/' ? '' : pathname)
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
