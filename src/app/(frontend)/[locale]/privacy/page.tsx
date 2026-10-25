import React from 'react'
import type { Metadata } from 'next'
import { isLocale, makeT, type Locale } from '@/i18n'
import { getDocuments, getPage } from '@/lib/content'
import { Privacy } from '@/views/TextPages'
import { latestUpdate } from '@/lib/updated'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = makeT(isLocale(locale) ? locale : 'ka')
  return { title: t('კონფიდენციალურობის პოლიტიკა'), alternates: { languages: { ka: '/privacy', en: '/en/privacy' } } }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: l } = await params
  const locale = (isLocale(l) ? l : 'ka') as Locale
  const [page, docs] = await Promise.all([getPage(locale, 'privacy'), getDocuments(locale, 'legal')])
  const pdf = docs.find((d) => /კონფიდენციალ|privacy/i.test(d.title))
  return <Privacy page={page} pdf={pdf} updated={latestUpdate(locale, pdf ? [pdf] : [])} />
}
