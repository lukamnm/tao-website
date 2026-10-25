/** Public base URL of the site, without a trailing slash.
    NEXT_PUBLIC_SITE_URL wins; on Vercel the production domain (or the preview URL) is used automatically. */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/$/, '')
  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (process.env.VERCEL_ENV === 'production' && prod) return 'https://' + prod
  if (process.env.VERCEL_URL) return 'https://' + process.env.VERCEL_URL
  return 'http://localhost:3000'
}
