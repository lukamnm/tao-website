// One-off import of the old site's financial reports (old.taoinsurance.ge/financial_info_GEO.html) into Documents.
//   TAO_FS_<year>_GEO.pdf          -> annual report of <year>
//   FinancialReport_<year>_Q<n>.xls -> quarterly report
// Run with the target site's env (DATABASE_URL, bucket keys):  IMPORT_DIR=<folder> npx payload run scripts/import-old-financial.ts
// Safe to run again: a report that already exists (same type, year, quarter) is skipped.
import fs from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const dir = process.env.IMPORT_DIR
if (!dir || !fs.existsSync(dir)) throw new Error('IMPORT_DIR must point to the folder with the downloaded files')

const ROMAN: Record<string, string> = { Q1: 'I', Q2: 'II', Q3: 'III', Q4: 'IV' }
const QEND: Record<string, string> = { Q1: '03', Q2: '06', Q3: '09', Q4: '12' }

type Item = { file: string; docType: 'annual' | 'quarterly'; date: string; quarter?: string; ka: string; en: string; mimetype: string }
const items: Item[] = []
for (const file of fs.readdirSync(dir).sort()) {
  let m = file.match(/^TAO_FS_(\d{4})_GEO\.pdf$/i)
  if (m) {
    const y = m[1]
    items.push({ file, docType: 'annual', date: `${y}-12-31`, ka: `${y} წლის აუდიტირებული ფინანსური ანგარიშგება`, en: `${y} audited financial statements`, mimetype: 'application/pdf' })
    continue
  }
  m = file.match(/^FinancialReport_(\d{4})_(Q[1-4])\.xls$/i)
  if (m) {
    const [, y, q] = m
    items.push({ file, docType: 'quarterly', date: `${y}-${QEND[q]}-28`, quarter: q, ka: `${y} წლის ${ROMAN[q]} კვარტლის ფინანსური ანგარიშგება`, en: `${y} ${q} financial statements`, mimetype: 'application/vnd.ms-excel' })
    continue
  }
  console.log('skipped (unknown name):', file)
}

const payload = await getPayload({ config })
let created = 0
for (const it of items) {
  const year = it.date.slice(0, 4)
  const existing = await payload.find({
    collection: 'documents',
    where: { and: [{ section: { equals: 'financial' } }, { docType: { equals: it.docType } }, { date: { greater_than_equal: `${year}-01-01` } }, { date: { less_than_equal: `${year}-12-31T23:59:59` } }, ...(it.quarter ? [{ quarter: { equals: it.quarter } }] : [])] },
    limit: 1,
    depth: 0,
  })
  if (existing.docs.length) {
    console.log('exists:', it.file)
    continue
  }
  const data = fs.readFileSync(path.join(dir, it.file))
  const doc = await payload.create({
    collection: 'documents',
    locale: 'ka',
    data: { title: it.ka, section: 'financial', docType: it.docType, date: it.date, ...(it.quarter ? { quarter: it.quarter } : {}) } as never,
    file: { data, name: it.file, mimetype: it.mimetype, size: data.length },
  })
  await payload.update({ collection: 'documents', id: doc.id, locale: 'en', data: { title: it.en } as never })
  created++
  console.log('created:', it.file, '->', doc.url)
}
console.log(`done: ${created} created, ${items.length - created} already there`)
process.exit(0)
