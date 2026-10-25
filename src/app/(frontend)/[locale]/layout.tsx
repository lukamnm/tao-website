import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, type Locale } from '@/i18n'
import { getSettings } from '@/lib/content'
import { SiteProvider } from '@/site/SiteProvider'
import { SiteFrame } from '@/site/SiteFrame'
import '@/ds/tokens.css'
import '@/ds/components.css'
import '@/ds/site.css'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const s = await getSettings(locale)
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  return {
    metadataBase: new URL(base),
    title: { default: s.siteName, template: `%s · ${s.siteName}` },
    description: s.siteDescription,
    openGraph: { siteName: s.siteName, locale: locale === 'en' ? 'en_GB' : 'ka_GE', type: 'website', images: s.ogImage ? [s.ogImage] : undefined },
    icons: { icon: [{ url: '/favicon.ico' }, { url: '/icon-512.png', sizes: '512x512', type: 'image/png' }], apple: '/apple-touch-icon.png' },
  }
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const settings = await getSettings(locale as Locale)
  return (
    <html lang={locale} data-lang={locale}>
      <head>
        <link rel="preload" href="/fonts/NovemberCondensedGeL-Heavy.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/NovemberGeL-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/NovemberGeL-Medium.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <SiteProvider locale={locale as Locale} settings={settings}>
          <SiteFrame>{children}</SiteFrame>
        </SiteProvider>
      </body>
    </html>
  )
}
