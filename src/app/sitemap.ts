import type { MetadataRoute } from 'next'
import { getNews, getOffers } from '@/lib/content'

const STATIC = ['', '/health', '/travel', '/offers', '/news', '/about', '/contact', '/legal', '/financial', '/complaints', '/privacy', '/terms']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
  const [offers, news] = await Promise.all([getOffers('ka'), getNews('ka', 500)])
  const paths = [...STATIC, ...offers.map((o) => o.href), ...news.map((n) => n.href)]
  return paths.flatMap((p) => [
    { url: base + (p || '/'), alternates: { languages: { ka: base + (p || '/'), en: base + '/en' + p } } },
    { url: base + '/en' + p, alternates: { languages: { ka: base + (p || '/'), en: base + '/en' + p } } },
  ])
}
