import dict from './dict.json'

/* Georgian is the source language of every text in the code. English comes from the dictionary
   (exact strings, built together with the design) plus a few patterns for text that is composed
   at runtime (dates, counters, validity lines). CMS content is localized in Payload itself. */

export type Locale = 'ka' | 'en'
export const LOCALES: Locale[] = ['ka', 'en']
export const DEFAULT_LOCALE: Locale = 'ka'

const D = dict as Record<string, string>
const G = /[Ⴀ-ჿᲐ-Ჿ]/

const MON_NOM: Record<string, string> = { 'იანვარი': 'January', 'თებერვალი': 'February', 'მარტი': 'March', 'აპრილი': 'April', 'მაისი': 'May', 'ივნისი': 'June', 'ივლისი': 'July', 'აგვისტო': 'August', 'სექტემბერი': 'September', 'ოქტომბერი': 'October', 'ნოემბერი': 'November', 'დეკემბერი': 'December' }
const MON_UNTIL: Record<string, string> = { 'იანვრ': 'January', 'თებერვლ': 'February', 'მარტ': 'March', 'აპრილ': 'April', 'მაის': 'May', 'ივნის': 'June', 'ივლის': 'July', 'აგვისტო': 'August', 'სექტემბრ': 'September', 'ოქტომბრ': 'October', 'ნოემბრ': 'November', 'დეკემბრ': 'December' }
const PROD_GEN: Record<string, string> = { 'ჯანმრთელობის დაზღვევის': 'health insurance', 'ავტოდაზღვევის': 'car insurance', 'ქონების დაზღვევის': 'property insurance', 'სამოგზაურო დაზღვევის': 'travel insurance' }

const norm = (s: string) => s.replace(/\s+/g, ' ').trim()

function list(s: string): string | null {
  const parts = s.split(', ')
  const out: string[] = []
  for (const p of parts) {
    const t = D[p]
    if (t == null) return null
    out.push(t)
  }
  return out.join(', ')
}

/** English for a Georgian string, or null when unknown. */
export function tr(s: string): string | null {
  const k = norm(s)
  let m: RegExpMatchArray | null
  if (!k || !G.test(k)) return null
  if (D[k] != null) return D[k]
  if ((m = k.match(/^(\d{4}) წლის აუდიტირებული ფინანსური ანგარიშგება$/))) return m[1] + ' audited financial statements'
  if ((m = k.match(/^(\d{4}) (Q\d) ფინანსური ანგარიშგება$/))) return m[1] + ' ' + m[2] + ' financial statements'
  if ((m = k.match(/^მოქმედებს (?:(\d{4}) წლის )?(\d{1,2}) (\S+?)(?:ამდე|მდე)$/)) && MON_UNTIL[m[3]]) return 'Valid until ' + m[2] + ' ' + MON_UNTIL[m[3]] + (m[1] ? ' ' + m[1] : '')
  if ((m = k.match(/^(\S+) (\d{4})$/)) && MON_NOM[m[1]]) return MON_NOM[m[1]] + ' ' + m[2]
  if ((m = k.match(/^(\d{1,2}) (\S+) (\d{4})$/)) && MON_NOM[m[2]]) return m[1] + ' ' + MON_NOM[m[2]] + ' ' + m[3]
  if ((m = k.match(/^განახლდა: (\d{1,2}) (\S+) (\d{4})$/)) && MON_NOM[m[2]]) return 'Updated: ' + m[1] + ' ' + MON_NOM[m[2]] + ' ' + m[3]
  if ((m = k.match(/^(\d+) წთ საკითხავი$/))) return m[1] + ' min read'
  if ((m = k.match(/^ნაჩვენებია (\d+) \/ (\d+)$/))) return 'Showing ' + m[1] + ' of ' + m[2]
  if ((m = k.match(/^ფილტრები \((\d+)\)$/))) return 'Filters (' + m[1] + ')'
  if ((m = k.match(/^ნახე შედეგები \((\d+)\)$/))) return 'Show results (' + m[1] + ')'
  if ((m = k.match(/^მოხსნა: (.+)$/))) return 'Remove: ' + (tr(m[1]) || m[1])
  if ((m = k.match(/^შეთავაზება ვრცელდება (.+) მოქმედი პოლისის მფლობელებზე\.$/)) && PROD_GEN[m[1]]) return 'The offer applies to holders of an active ' + PROD_GEN[m[1]] + ' policy.'
  if ((m = k.match(/^შეთავაზება მოქმედებს (.+)\.$/))) { const w = list(m[1]); if (w) return 'The offer is valid in: ' + w + '.' }
  if ((m = k.match(/^მადლობა, (.+)!$/))) return 'Thank you, ' + m[1] + '!'
  if (k.indexOf(', ') > 0) { const l = list(k); if (l) return l }
  return null
}

export function translate(locale: Locale, s: string): string {
  if (locale !== 'en') return s
  return tr(s) ?? s
}

export type T = (s: string) => string
export const makeT = (locale: Locale): T => (s) => translate(locale, s)

export function isLocale(x: unknown): x is Locale {
  return x === 'ka' || x === 'en'
}

/** Path for a locale: Georgian lives at "/", English at "/en". */
export function localePath(locale: Locale, path: string): string {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path
  const p = path.startsWith('/') ? path : '/' + path
  if (locale === 'en') return p === '/' ? '/en' : '/en' + p
  return p
}

/** The same page in the other language. */
export function switchLocalePath(current: Locale, pathname: string): string {
  const bare = pathname.replace(/^\/en(?=\/|$)/, '') || '/'
  return current === 'en' ? bare : localePath('en', bare)
}

/* Georgian Mtavruli (capitals) by code-point shift: used only where the font feature cannot apply (title tag, e-mails). */
export function mtavruli(s: string): string {
  let out = ''
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i)
    out += c >= 0x10d0 && c <= 0x10fa ? String.fromCharCode(c - 0x10d0 + 0x1c90) : c < 0x0250 ? s[i].toUpperCase() : s[i]
  }
  return out
}

const KA_MONTHS = ['იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი', 'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი']
const KA_UNTIL = ['იანვრამდე', 'თებერვლამდე', 'მარტამდე', 'აპრილამდე', 'მაისამდე', 'ივნისამდე', 'ივლისამდე', 'აგვისტომდე', 'სექტემბრამდე', 'ოქტომბრამდე', 'ნოემბრამდე', 'დეკემბრამდე']
const EN_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const parts = (iso: string) => {
  const d = new Date(iso)
  return { y: d.getUTCFullYear(), m: d.getUTCMonth(), d: d.getUTCDate() }
}

/** "8 ოქტომბერი 2026" / "8 October 2026" */
export function fmtDate(locale: Locale, iso: string): string {
  const { y, m, d } = parts(iso)
  return locale === 'en' ? `${d} ${EN_MONTHS[m]} ${y}` : `${d} ${KA_MONTHS[m]} ${y}`
}

/** "ოქტომბერი 2026" / "October 2026" */
export function fmtMonth(locale: Locale, iso: string): string {
  const { y, m } = parts(iso)
  return locale === 'en' ? `${EN_MONTHS[m]} ${y}` : `${KA_MONTHS[m]} ${y}`
}

/** "მოქმედებს 2027 წლის 31 იანვრამდე" / "Valid until 31 January 2027" (year omitted in the current year). */
export function fmtUntil(locale: Locale, iso: string, now = new Date()): string {
  const { y, m, d } = parts(iso)
  const sameYear = y === now.getFullYear()
  if (locale === 'en') return `Valid until ${d} ${EN_MONTHS[m]}${sameYear ? '' : ' ' + y}`
  return `მოქმედებს ${sameYear ? '' : y + ' წლის '}${d} ${KA_UNTIL[m]}`
}

/** "01.10.2026" */
export function fmtDMY(iso: string): string {
  const { y, m, d } = parts(iso)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(d)}.${p(m + 1)}.${y}`
}
