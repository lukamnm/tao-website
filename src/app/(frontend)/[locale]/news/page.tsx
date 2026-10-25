import React from 'react'
import type { Metadata } from 'next'
import { isLocale, makeT, type Locale } from '@/i18n'
import { getNews } from '@/lib/content'
import { News } from '@/views/News'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = makeT(isLocale(locale) ? locale : 'ka')
  return { title: t('სიახლეები'), alternates: { languages: { ka: '/news', en: '/en/news' } } }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: l } = await params
  const locale = (isLocale(l) ? l : 'ka') as Locale
  const items = await getNews(locale)
  return <News items={items} />
}
