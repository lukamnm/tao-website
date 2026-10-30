import { getPayload } from './payload'
import type { Locale } from '@/i18n'
import { fmtDMY, fmtDate, fmtUntil, fmtMonth } from '@/i18n'
import { OFFER_TYPES } from '@/collections/options'

/* Plain, serializable view models for the pages (client components receive these as props). */

/** A product from the editable list (admin: კატეგორიები > პროდუქტები). */
export type ProductVM = { key: string; name: string; short: string; icon: string; menuText: string; description: string; href: string; inMenu: boolean; portal: string }
/** An entry of a simple editable list (news categories, partner categories, cities). */
export type ListItem = { key: string; name: string }

export type SiteSettings = {
  phone: string
  phoneHref: string
  email: string
  address: string
  addressShort: string
  city: string
  hours: string
  mapUrl: string
  portalUrl: string
  portal: Record<string, string>
  facebook: string
  instagram: string
  linkedin: string
  stats: { foundedYear: string; clients: string; paid: string; corporate: string }
  siteName: string
  siteDescription: string
  ogImage: string
  products: ProductVM[]
}

type AnyDoc = Record<string, any>

const str = (v: unknown, d = '') => (typeof v === 'string' && v ? v : d)
const doc = (v: unknown): AnyDoc | null => (v && typeof v === 'object' ? (v as AnyDoc) : null)

export function mediaUrl(m: unknown, size?: 'thumb' | 'card' | 'wide' | 'hero'): string {
  if (!m || typeof m !== 'object') return ''
  const doc = m as AnyDoc
  if (size && doc.sizes?.[size]?.url) return doc.sizes[size].url
  return str(doc.url)
}
const mediaAlt = (m: unknown) => (m && typeof m === 'object' ? str((m as AnyDoc).alt) : '')

function productVM(p: AnyDoc): ProductVM {
  const name = str(p.name)
  return {
    key: str(p.key),
    name,
    short: str(p.shortName, name),
    icon: str(p.icon, 'shield-tick'),
    menuText: str(p.menuText),
    description: str(p.description),
    href: str(p.pagePath),
    inMenu: !!p.showInMenu && !!p.pagePath,
    portal: str(p.portalUrl),
  }
}
const productOf = (v: unknown): ProductVM | null => {
  const d = doc(v)
  return d ? productVM(d) : null
}
const itemOf = (v: unknown): ListItem | null => {
  const d = doc(v)
  return d ? { key: str(d.key), name: str(d.name) } : null
}

export async function getProducts(locale: Locale): Promise<ProductVM[]> {
  const payload = await getPayload()
  const res = await payload.find({ collection: 'products', locale, fallbackLocale: 'ka', sort: '_order', limit: 100, depth: 0 })
  return (res.docs as AnyDoc[]).map(productVM)
}

async function getList(collection: 'news-categories' | 'offer-categories' | 'cities', locale: Locale): Promise<ListItem[]> {
  const payload = await getPayload()
  const res = await payload.find({ collection, locale, fallbackLocale: 'ka', sort: '_order', limit: 200, depth: 0 })
  return (res.docs as AnyDoc[]).map((d) => ({ key: str(d.key), name: str(d.name) }))
}
export const getNewsCategories = (locale: Locale) => getList('news-categories', locale)
export const getOfferCategories = (locale: Locale) => getList('offer-categories', locale)
export const getCities = (locale: Locale) => getList('cities', locale)

export async function getSettings(locale: Locale): Promise<SiteSettings> {
  const payload = await getPayload()
  const [s, products] = await Promise.all([payload.findGlobal({ slug: 'settings', locale, fallbackLocale: 'ka' }) as Promise<AnyDoc>, getProducts(locale)])
  const portalUrl = str(s.portalUrl, 'https://portal.taoinsurance.ge')
  const portal: Record<string, string> = { '': portalUrl, claim: str(s.portalClaimUrl, portalUrl) }
  for (const p of products) portal[p.key] = p.portal || portalUrl
  return {
    phone: str(s.phone, '+995 32 280 10 01'),
    phoneHref: str(s.phoneHref, '+995322801001'),
    email: str(s.email, 'info@taoinsurance.ge'),
    address: str(s.address, 'ანა პოლიტკოვსკაიას ქ. 16, 0186 თბილისი'),
    addressShort: str(s.addressShort, 'ანა პოლიტკოვსკაიას ქ. 16'),
    city: str(s.city, '0186 თბილისი'),
    hours: str(s.hours, 'ორშ-პარ, 10:00-18:00'),
    mapUrl: str(s.mapUrl),
    portalUrl,
    portal,
    facebook: str(s.facebook),
    instagram: str(s.instagram),
    linkedin: str(s.linkedin),
    stats: { foundedYear: str(s.foundedYear, '2007'), clients: str(s.clients, '[N]+'), paid: str(s.paid, '[N] ₾ M'), corporate: str(s.corporate, '[N]+') },
    siteName: str(s.siteName, locale === 'en' ? 'TAO Insurance' : 'ტაო დაზღვევა'),
    siteDescription: str(s.siteDescription),
    ogImage: mediaUrl(s.ogImage, 'wide'),
    products,
  }
}

/* ---------- Banners ---------- */
export type BannerVM = { id: string; kicker: string; title: string; text: string; image: string; imageAlt: string; pos: string; action: string; href: string }

/** The chosen link as an address; the portal is "portal" or "portal:<product key>" (the Home view opens it). */
function linkHref(l: AnyDoc | null | undefined): string {
  if (!l) return '/'
  switch (l.type) {
    case 'offer': return doc(l.offer)?.slug ? '/offers/' + doc(l.offer)!.slug : '/offers'
    case 'news': return doc(l.news)?.slug ? '/news/' + doc(l.news)!.slug : '/news'
    case 'portal': return doc(l.product)?.key ? 'portal:' + doc(l.product)!.key : 'portal'
    case 'url': return str(l.url, '/')
    default: return str(l.page, '/')
  }
}

export async function getBanners(locale: Locale, placement: 'hero' | 'promo'): Promise<BannerVM[]> {
  const payload = await getPayload()
  const today = new Date().toISOString()
  const res = await payload.find({
    collection: 'banners',
    locale,
    fallbackLocale: 'ka',
    where: {
      and: [
        { placement: { equals: placement } },
        { active: { equals: true } },
        { or: [{ from: { exists: false } }, { from: { less_than_equal: today } }] },
        { or: [{ until: { exists: false } }, { until: { greater_than_equal: today } }] },
      ],
    },
    sort: '_order',
    limit: 10,
    depth: 1,
  })
  return (res.docs as AnyDoc[]).map((b) => ({
    id: String(b.id),
    kicker: str(b.kicker),
    title: str(b.title),
    text: str(b.text),
    image: mediaUrl(b.image, 'hero'),
    imageAlt: mediaAlt(b.image),
    pos: str(b.imagePosition, '50% 50%'),
    action: str(b.actionLabel, 'გაიგე მეტი'),
    href: linkHref(b.link),
  }))
}

/* ---------- Offers ---------- */
export type OfferVM = {
  id: string
  slug: string
  href: string
  product: string
  productLabel: string
  productShort: string
  icon: string
  type: string
  typeLabel: string
  cat: string
  catLabel: string
  cities: string[]
  where: string
  value: string
  pct: number
  note: string
  title: string
  text: string
  image: string
  imageAlt: string
  pos: string
  from: string
  until: string
  valid: string
  period: string
  body: unknown
  steps: string[]
  terms: string[]
  partner: { name: string; phone: string; address: string; website: string }
  featured: boolean
}

const label = (list: { label: string; value: string }[], id: string) => list.find((x) => x.value === id)?.label || ''

function offerVM(o: AnyDoc, locale: Locale): OfferVM {
  const pr = productOf(o.product)
  const cat = itemOf(o.category)
  const cityItems = (Array.isArray(o.cities) ? o.cities : []).map(itemOf).filter((c: ListItem | null): c is ListItem => !!c)
  const where = o.type === 'partner' ? cityItems.map((c: ListItem) => c.name).join(', ') : 'ონლაინ, ტაოს პორტალზე'
  return {
    id: String(o.id),
    slug: str(o.slug),
    href: '/offers/' + str(o.slug),
    product: pr?.key || '',
    productLabel: pr?.name || '',
    productShort: pr?.short || '',
    icon: pr?.icon || 'shield-tick',
    type: str(o.type, 'discount'),
    typeLabel: label(OFFER_TYPES, o.type),
    cat: cat?.key || '',
    catLabel: cat?.name || '',
    cities: cityItems.map((c: ListItem) => c.key),
    where,
    value: str(o.value),
    pct: Number(o.pct) || 0,
    note: str(o.note),
    title: str(o.title),
    text: str(o.excerpt),
    image: mediaUrl(o.image, 'wide'),
    imageAlt: mediaAlt(o.image),
    pos: str(o.imagePosition, '50% 50%'),
    from: str(o.from),
    until: str(o.until),
    valid: o.until ? fmtUntil(locale, o.until) : '',
    period: o.from && o.until ? fmtDMY(o.from) + ' - ' + fmtDMY(o.until) : '',
    body: o.body ?? null,
    steps: Array.isArray(o.steps) ? o.steps.map((s: AnyDoc) => str(s.text)) : [],
    terms: Array.isArray(o.terms) ? o.terms.map((s: AnyDoc) => str(s.text)) : [],
    partner: { name: str(o.partner?.name), phone: str(o.partner?.phone), address: str(o.partner?.address), website: str(o.partner?.website) },
    featured: !!o.featured,
  }
}

export async function getOffers(locale: Locale, opts: { activeOnly?: boolean; product?: string } = {}): Promise<OfferVM[]> {
  const payload = await getPayload()
  const today = new Date().toISOString().slice(0, 10)
  const and: AnyDoc[] = []
  if (opts.activeOnly !== false) and.push({ until: { greater_than_equal: today } })
  if (opts.product) and.push({ 'product.key': { equals: opts.product } })
  const res = await payload.find({ collection: 'offers', locale, fallbackLocale: 'ka', where: and.length ? { and } : undefined, sort: '-from', limit: 200, depth: 1 })
  return (res.docs as AnyDoc[]).map((o) => offerVM(o, locale))
}

export async function getOffer(locale: Locale, slug: string): Promise<OfferVM | null> {
  const payload = await getPayload()
  const res = await payload.find({ collection: 'offers', locale, fallbackLocale: 'ka', where: { slug: { equals: slug } }, limit: 1, depth: 1 })
  const d = res.docs[0] as AnyDoc | undefined
  return d ? offerVM(d, locale) : null
}

/* ---------- News ---------- */
export type NewsVM = {
  id: string
  slug: string
  href: string
  cat: string
  catLabel: string
  product: ProductVM | null
  dateISO: string
  date: string
  title: string
  excerpt: string
  lead: string
  image: string
  imageAlt: string
  pos: string
  body: unknown
  readTime: number
}

function textLength(node: unknown): number {
  if (!node || typeof node !== 'object') return 0
  const n = node as AnyDoc
  let len = typeof n.text === 'string' ? n.text.split(/\s+/).length : 0
  const kids = n.children || n.root?.children
  if (Array.isArray(kids)) for (const k of kids) len += textLength(k)
  return len
}

function newsVM(n: AnyDoc, locale: Locale): NewsVM {
  const words = (str(n.lead) + ' ' + str(n.excerpt)).split(/\s+/).length + textLength(n.body)
  return {
    id: String(n.id),
    slug: str(n.slug),
    href: '/news/' + str(n.slug),
    cat: itemOf(n.category)?.key || '',
    catLabel: itemOf(n.category)?.name || '',
    product: productOf(n.product),
    dateISO: str(n.date),
    date: n.date ? fmtDate(locale, n.date) : '',
    title: str(n.title),
    excerpt: str(n.excerpt),
    lead: str(n.lead),
    image: mediaUrl(n.image, 'wide'),
    imageAlt: mediaAlt(n.image),
    pos: str(n.imagePosition, '50% 50%'),
    body: n.body ?? null,
    readTime: Math.max(2, Math.round(words / 120)),
  }
}

export async function getNews(locale: Locale, limit = 100): Promise<NewsVM[]> {
  const payload = await getPayload()
  const res = await payload.find({ collection: 'news', locale, fallbackLocale: 'ka', where: { published: { equals: true } }, sort: '-date', limit, depth: 1 })
  return (res.docs as AnyDoc[]).map((n) => newsVM(n, locale))
}

export async function getNewsItem(locale: Locale, slug: string): Promise<NewsVM | null> {
  const payload = await getPayload()
  const res = await payload.find({ collection: 'news', locale, fallbackLocale: 'ka', where: { slug: { equals: slug } }, limit: 1, depth: 1 })
  const d = res.docs[0] as AnyDoc | undefined
  return d ? newsVM(d, locale) : null
}

/* ---------- Documents ---------- */
export type DocumentVM = {
  id: string
  title: string
  section: string
  type: string
  product: string
  prodLabel: string
  prodShort: string
  icon: string
  dateISO: string
  year: string
  quarter: string
  month: string
  code: string
  size: string
  url: string
}

const fmtSize = (bytes: number) => (bytes >= 1024 * 1024 ? (bytes / 1024 / 1024).toFixed(1) + ' MB' : Math.max(1, Math.round(bytes / 1024)) + ' KB')

export async function getDocuments(locale: Locale, section: 'legal' | 'financial'): Promise<DocumentVM[]> {
  const payload = await getPayload()
  const res = await payload.find({ collection: 'documents', locale, fallbackLocale: 'ka', where: { section: { equals: section } }, sort: '-date', limit: 500, depth: 1 })
  return (res.docs as AnyDoc[]).map((d) => {
    const pl = productOf(d.product)
    return {
      id: String(d.id),
      title: str(d.title),
      section: str(d.section),
      type: str(d.docType),
      product: pl?.key || 'general',
      prodLabel: pl?.name || '',
      prodShort: pl?.short || '',
      icon: pl?.icon || 'document-text',
      dateISO: str(d.date),
      year: str(d.date).slice(0, 4),
      quarter: str(d.quarter),
      month: d.date ? fmtMonth(locale, d.date) : '',
      code: str(d.code),
      size: typeof d.filesize === 'number' ? fmtSize(d.filesize) : '',
      url: str(d.url),
    }
  })
}

/* ---------- Pages ---------- */
export type PageVM = { title: string; intro: string; body: unknown; effectiveDate: string }

export async function getPage(locale: Locale, slug: string): Promise<PageVM | null> {
  const payload = await getPayload()
  const res = await payload.find({ collection: 'pages', locale, fallbackLocale: 'ka', where: { slug: { equals: slug } }, limit: 1, depth: 0 })
  const d = res.docs[0] as AnyDoc | undefined
  if (!d) return null
  return { title: str(d.title), intro: str(d.intro), body: d.body ?? null, effectiveDate: d.effectiveDate ? fmtDate(locale, d.effectiveDate) : '' }
}
