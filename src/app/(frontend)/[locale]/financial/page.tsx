import React from 'react'
import type { Metadata } from 'next'
import { isLocale, makeT, type Locale } from '@/i18n'
import { getDocuments } from '@/lib/content'
import { Financial } from '@/views/Financial'
import { latestUpdate } from '@/lib/updated'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = makeT(isLocale(locale) ? locale : 'ka')
  return { title: t('ფინანსური ინფორმაცია'), alternates: { languages: { ka: '/financial', en: '/en/financial' } } }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: l } = await params
  const locale = (isLocale(l) ? l : 'ka') as Locale
  const docs = await getDocuments(locale, 'financial')
  return <Financial docs={docs} updated={latestUpdate(locale, docs)} />
}
