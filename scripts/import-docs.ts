// Uploads files into Documents from a JSON manifest (an array), with Georgian and English titles:
//   [{ "file": "Procedure.pdf", "ka": "...", "en": "...", "section": "complaints", "docType": "other", "date": "2026-11-04" }]
// Optional: "code" (document code, used by search), "product" (product key, e.g. "car"), "quarter".
// "file" is relative to the manifest. A bare date is stored at noon Tbilisi time so it never shifts a day. Run with the target site's env (DATABASE_URL, bucket keys):
//   MANIFEST=<path to manifest.json> npx payload run scripts/import-docs.ts
// Safe to run again: an entry whose file name is already in Documents is skipped.
import fs from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../src/payload.config'

type Entry = { file: string; ka: string; en: string; section: string; docType: string; date: string; quarter?: string; code?: string; product?: string }

const manifest = process.env.MANIFEST
if (!manifest || !fs.existsSync(manifest)) throw new Error('MANIFEST must point to a JSON manifest')
const entries = JSON.parse(fs.readFileSync(manifest, 'utf8')) as Entry[]
const MIME: Record<string, string> = { '.pdf': 'application/pdf', '.xls': 'application/vnd.ms-excel', '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }

const payload = await getPayload({ config })
const products = new Map((await payload.find({ collection: 'products', limit: 100, depth: 0 })).docs.map((p) => [(p as { key?: string }).key, p.id]))
for (const e of entries) {
  if (e.product && !products.has(e.product)) throw new Error('unknown product key: ' + e.product)
  const name = path.basename(e.file)
  const existing = await payload.find({ collection: 'documents', where: { filename: { equals: name } }, limit: 1, depth: 0 })
  if (existing.docs.length) {
    console.log('exists:', name)
    continue
  }
  const data = fs.readFileSync(path.resolve(path.dirname(manifest), e.file))
  const doc = await payload.create({
    collection: 'documents',
    locale: 'ka',
    data: {
      title: e.ka,
      section: e.section,
      docType: e.docType,
      date: /^\d{4}-\d{2}-\d{2}$/.test(e.date) ? `${e.date}T12:00:00+04:00` : e.date,
      ...(e.quarter ? { quarter: e.quarter } : {}),
      ...(e.code ? { code: e.code } : {}),
      ...(e.product ? { product: products.get(e.product) } : {}),
    } as never,
    file: { data, name, mimetype: MIME[path.extname(name).toLowerCase()] || 'application/pdf', size: data.length },
  })
  await payload.update({ collection: 'documents', id: doc.id, locale: 'en', data: { title: e.en } as never })
  console.log('created:', name, '->', doc.url)
}
process.exit(0)
