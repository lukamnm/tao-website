import React from 'react'
import type { Metadata } from 'next'
import { isLocale, makeT } from '@/i18n'
import { Product, PROPERTY } from '@/views/Product'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = makeT(isLocale(locale) ? locale : 'ka')
  return { title: t('ქონების კორპორატიული დაზღვევა'), alternates: { languages: { ka: '/property', en: '/en/property' } } }
}

/* Like car: the property design has no offers or documents section, so nothing is fetched. */
export default async function Page() {
  return <Product cfg={PROPERTY} />
}
