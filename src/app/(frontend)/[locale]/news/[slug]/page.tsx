import React from 'react'
import type { Metadata } from 'next'
import { isLocale, makeT, type Locale } from '@/i18n'
import { notFound } from 'next/navigation'
import { getNews, getNewsItem } from '@/lib/content'
import { NewsArticle } from '@/views/NewsArticle'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: l, slug } = await params
  const locale = (isLocale(l) ? l : 'ka') as Locale
  const n = await getNewsItem(locale, slug)
  if (!n) return {}
  return { title: n.title, description: n.excerpt, openGraph: { type: 'article', publishedTime: n.dateISO, images: n.image ? [n.image] : undefined }, alternates: { languages: { ka: n.href, en: '/en' + n.href } } }
}

export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: l, slug } = await params
  const locale = (isLocale(l) ? l : 'ka') as Locale
  const [item, all] = await Promise.all([getNewsItem(locale, slug), getNews(locale, 50)])
  if (!item) notFound()
  const others = all
    .filter((x) => x.id !== item.id)
    .sort((a, b) => Number(b.cat === item.cat) - Number(a.cat === item.cat))
    .slice(0, 3)
  return <NewsArticle item={item} others={others} />
}
