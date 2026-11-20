import { NextResponse } from 'next/server'
import { getPayload } from '@/lib/payload'

/* Policies print the address of their terms as taoinsurance.ge/legal-info/<document code>/ge (e.g. TAO-R-TR-001-2026).
   src/proxy.ts sends those addresses here; the document whose code matches (ignoring case, "/", "-", "#" and spaces,
   so TAO/MO/C-001-25 also matches TAO-MO-C-001-25) is opened. Unknown codes land on the legal information page. */
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

export async function GET(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const want = norm(decodeURIComponent((await params).code))
  const en = new URL(req.url).searchParams.get('lang') === 'en'
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://taoinsurance.ge'
  try {
    const payload = await getPayload()
    const res = await payload.find({ collection: 'documents', where: { code: { exists: true } }, sort: '-date', limit: 500, depth: 0 })
    const doc = (res.docs as { code?: string; filename?: string }[]).find((d) => d.code && d.filename && norm(d.code) === want)
    if (doc?.filename) return NextResponse.redirect(`${site}/api/documents/file/${encodeURIComponent(doc.filename)}`, 302)
  } catch {
    // fall through to the legal page
  }
  return NextResponse.redirect(`${site}${en ? '/en' : ''}/legal`, 302)
}
