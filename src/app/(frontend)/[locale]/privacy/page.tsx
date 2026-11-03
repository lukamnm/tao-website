import { permanentRedirect } from 'next/navigation'
import { isLocale, localePath } from '@/i18n'

// Merged into "Other information". The public URL is redirected in src/proxy.ts; this covers any other way in.
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  permanentRedirect(localePath(isLocale(locale) ? locale : 'ka', '/other#privacy'))
}
