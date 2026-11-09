import type { MetadataRoute } from 'next'
import { getNews, getOffers, getSettings } from '@/lib/content'
import { siteUrl } from '@/lib/site-url'

const STATIC = ['', '/health', '/travel', '/car', '/property', '/offers', '/news', '/about', '/contact', '/legal', '/financial', '/other']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl()
  const [offers, news, settings] = await Promise.all([getOffers('ka'), getNews('ka', 500), getSettings('ka')])
  // offers switched off in the admin: their pages stay reachable (admin preview) but are not listed
  const paths = [...STATIC.filter((p) => settings.offersOn || p !== '/offers'), ...(settings.offersOn ? offers.map((o) => o.href) : []), ...news.map((n) => n.href)]
  return paths.flatMap((p) => [
    { url: base + (p || '/'), alternates: { languages: { ka: base + (p || '/'), en: base + '/en' + p } } },
    { url: base + '/en' + p, alternates: { languages: { ka: base + (p || '/'), en: base + '/en' + p } } },
  ])
}
