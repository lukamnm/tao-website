import { fmtDate, type Locale } from '@/i18n'
import type { DocumentVM } from './content'

/** "Updated" line of the info pages: the newest document date, or the site launch date. */
export function latestUpdate(locale: Locale, docs: DocumentVM[]): string {
  const latest = docs.map((d) => d.dateISO).filter(Boolean).sort().pop()
  return fmtDate(locale, latest || '2026-10-11')
}
