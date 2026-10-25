import React from 'react'
import type { Metadata } from 'next'
import { isLocale, makeT, type Locale } from '@/i18n'
import { getOffers } from '@/lib/content'
import { Product, TRAVEL } from '@/views/Product'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = makeT(isLocale(locale) ? locale : 'ka')
  return { title: t('სამოგზაურო დაზღვევა'), alternates: { languages: { ka: '/travel', en: '/en/travel' } } }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: l } = await params
  const locale = (isLocale(l) ? l : 'ka') as Locale
  const offers = await getOffers(locale, { product: 'travel' })
  return <Product cfg={TRAVEL} offers={offers} />
}
