import React from 'react'
import type { Metadata } from 'next'
import { isLocale, makeT, type Locale } from '@/i18n'
import { getDocuments, getPage } from '@/lib/content'
import { Complaints } from '@/views/TextPages'
import { latestUpdate } from '@/lib/updated'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = makeT(isLocale(locale) ? locale : 'ka')
  return { title: t('პრეტენზიების განხილვის წესი'), alternates: { languages: { ka: '/complaints', en: '/en/complaints' } } }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: l } = await params
  const locale = (isLocale(l) ? l : 'ka') as Locale
  const [page, docs] = await Promise.all([getPage(locale, 'complaints'), getDocuments(locale, 'legal')])
  const own = docs.filter((d) => d.product === 'general' && /პრეტენზი|complaint/i.test(d.title))
  return <Complaints page={page} docs={own} updated={latestUpdate(locale, own)} />
}
