import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site-url'

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl()
  // Staging stays out of search engines until NEXT_PUBLIC_INDEXABLE=1 is set on the live deployment.
  const indexable = process.env.NEXT_PUBLIC_INDEXABLE === '1'
  return {
    rules: indexable ? [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/account', '/auth'] }] : [{ userAgent: '*', disallow: '/' }],
    sitemap: base + '/sitemap.xml',
  }
}
