import { NextResponse } from 'next/server'
import { getPayload } from '@/lib/payload'

/* Old-site file links (taoinsurance.ge/<file>.pdf|.xls|...) reach this handler through src/proxy.ts.
   When the file was imported into Documents (same file name, or with spaces turned into "_"), the visitor is sent
   to the new file permanently; anything else goes to the archived old site, old.taoinsurance.ge. */
export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const name = decodeURIComponent((await params).name)
  const names = Array.from(new Set([name, name.replace(/\s+/g, '_')]))
  try {
    const payload = await getPayload()
    const found = await payload.find({ collection: 'documents', where: { filename: { in: names } }, limit: 1, depth: 0 })
    const doc = found.docs[0] as { filename?: string } | undefined
    if (doc?.filename) {
      const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://taoinsurance.ge'
      return NextResponse.redirect(`${site}/api/documents/file/${encodeURIComponent(doc.filename)}`, 301)
    }
  } catch {
    // fall through to the old site
  }
  return NextResponse.redirect(`https://old.taoinsurance.ge/${encodeURIComponent(name)}`, 302)
}
