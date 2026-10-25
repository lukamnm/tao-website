import React from 'react'
import type { Metadata } from 'next'
import { isLocale, makeT, type Locale } from '@/i18n'
import { getBanners, getNews, getOffers } from '@/lib/content'
import { Home } from '@/views/Home'
import { DEFAULT_SLIDES } from '@/lib/defaults'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = makeT(isLocale(locale) ? locale : 'ka')
  return { title: t('ტაო დაზღვევა - მთავარი'), alternates: { canonical: locale === 'en' ? '/en' : '/', languages: { ka: '/', en: '/en' } } }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: l } = await params
  const locale = (isLocale(l) ? l : 'ka') as Locale
  const [heroSlides, banners, allOffers, news] = await Promise.all([getBanners(locale, 'hero'), getBanners(locale, 'promo'), getOffers(locale), getNews(locale, 3)])
  const featured = allOffers.filter((o) => o.featured)
  const offers = (featured.length ? featured : allOffers).slice(0, 3)
  return <Home slides={heroSlides.length ? heroSlides : DEFAULT_SLIDES} banners={banners} offers={offers} news={news} />
}
