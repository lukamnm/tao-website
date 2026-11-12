import { NextResponse, type NextRequest } from 'next/server'

/* Next 16 proxy (formerly middleware).
   1. URL scheme: Georgian at "/", English at "/en/...". Internally every public page lives under
      /[locale]/..., so "/health" is rewritten to "/ka/health" and "/en/health" stays as is.
   2. /account/* is guarded by the Neon Auth session (visitor accounts, set up by the Neon session).
   3. Retired pages: /privacy, /terms and /complaints (and /en/...) were merged into /other; they get a
      permanent redirect to the matching list there (the fragment is kept in the Location header).
   4. Old-site URLs (before 2026-11): its .html pages redirect to the new pages; its root-level files
      (/<name>.pdf, .xls...) go to the legacy-file handler, which finds the imported copy in Documents.
   5. /neon-status (Neon test page) is closed in production unless ENABLE_NEON_STATUS=1. */
const PUBLIC_FILE = /\.[a-zA-Z0-9]+$/
const MOVED = /^(\/en)?\/(privacy|terms|complaints)\/?$/
const OLD_PAGES: Record<string, string> = {
  'index.html': '/', 'index_geo.html': '/', 'index_eng.html': '/en',
  'contact_geo.html': '/contact', 'contact_eng.html': '/en/contact',
  'financial_info_geo.html': '/financial', 'financial_info_eng.html': '/en/financial',
  'wording_geo.html': '/legal', 'wording_eng.html': '/en/legal',
  'auto_geo.html': '/car', 'auto_eng.html': '/en/car',
  'property_geo.html': '/property', 'property_eng.html': '/en/property',
}
const OLD_FILE = /^\/([^/]+\.(pdf|xls|xlsx|doc|docx|rar|zip))$/i

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === '/account' || pathname.startsWith('/account/')) {
    if (process.env.NEON_AUTH_BASE_URL && process.env.NEON_AUTH_COOKIE_SECRET) {
      const { auth } = await import('@/lib/auth/server')
      return auth.middleware({ loginUrl: '/auth/sign-in' })(req)
    }
    return NextResponse.next()
  }

  const old = OLD_PAGES[pathname.slice(1).toLowerCase()]
  if (old) {
    const url = req.nextUrl.clone()
    url.pathname = old
    url.search = ''
    return NextResponse.redirect(url, 301)
  }
  const oldFile = OLD_FILE.exec(pathname)
  if (oldFile) {
    const url = req.nextUrl.clone()
    url.pathname = '/legacy-file/' + oldFile[1]
    return NextResponse.rewrite(url)
  }
  if (pathname.startsWith('/neon-status') && process.env.NODE_ENV === 'production' && process.env.ENABLE_NEON_STATUS !== '1') {
    return new NextResponse('Not found', { status: 404 })
  }

  const moved = MOVED.exec(pathname)
  if (moved) {
    const url = req.nextUrl.clone()
    url.pathname = (moved[1] || '') + '/other'
    url.hash = moved[2]
    return NextResponse.redirect(url, 308)
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
