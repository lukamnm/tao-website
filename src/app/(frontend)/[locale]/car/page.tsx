import React from 'react'
import type { Metadata } from 'next'
import { isLocale, makeT } from '@/i18n'
import { Product, CAR } from '@/views/Product'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = makeT(isLocale(locale) ? locale : 'ka')
  return { title: t('ავტომობილის კორპორატიული დაზღვევა'), alternates: { languages: { ka: '/car', en: '/en/car' } } }
}

/* The car design has no offers section, so no offers are fetched. */
export default async function Page() {
  return <Product cfg={CAR} />
}
