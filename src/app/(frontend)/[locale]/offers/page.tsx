import React from 'react'
import type { Metadata } from 'next'
import { isLocale, makeT, type Locale } from '@/i18n'
import { getCities, getOfferCategories, getOffers, getSettings } from '@/lib/content'
import { Offers } from '@/views/Offers'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const loc = (isLocale(locale) ? locale : 'ka') as Locale
  const t = makeT(loc)
  const { offersOn } = await getSettings(loc)
  return { title: t('შეთავაზებები'), alternates: { languages: { ka: '/offers', en: '/en/offers' } }, ...(offersOn ? {} : { robots: { index: false } }) }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: l } = await params
  const locale = (isLocale(l) ? l : 'ka') as Locale
  const [offers, categories, cities] = await Promise.all([getOffers(locale), getOfferCategories(locale), getCities(locale)])
  return <Offers offers={offers} categories={categories} cities={cities} />
}
