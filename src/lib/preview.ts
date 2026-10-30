import { siteUrl } from './site-url'

/** Address of a document on the public site, used by the admin's "Preview" button. */
export function previewUrl(path: string, locale?: string | { code?: string }): string {
  const code = typeof locale === 'string' ? locale : locale?.code
  const p = path.startsWith('/') ? path : '/' + path
  return siteUrl() + (code === 'en' ? (p === '/' ? '/en' : '/en' + p) : p)
}
