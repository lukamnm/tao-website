import type { MetadataRoute } from 'next'
import { getNews, getOffers } from '@/lib/content'
import { siteUrl } from '@/lib/site-url'

const STATIC = ['', '/health', '/travel', '/car', '/offers', '/news', '/about', '/contact', '/legal', '/financial', '/complaints', '/privacy', '/terms']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl()
  const [offers, news] = await Promise.all([getOffers('ka'), getNews('ka', 500)])
  const paths = [...STATIC, ...offers.map((o) => o.href), ...news.map((n) => n.href)]
  return paths.flatMap((p) => [
    { url: base + (p || '/'), alternates: { languages: { ka: base + (p || '/'), en: base + '/en' + p } } },
    { url: base + '/en' + p, alternates: { languages: { ka: base + (p || '/'), en: base + '/en' + p } } },
  ])
}
