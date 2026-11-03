import React from 'react'
import type { Metadata } from 'next'
import { isLocale, makeT, type Locale } from '@/i18n'
import { getDocuments, getPage } from '@/lib/content'
import { Other } from '@/views/TextPages'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = makeT(isLocale(locale) ? locale : 'ka')
  return { title: t('სხვა ინფორმაცია'), alternates: { languages: { ka: '/other', en: '/en/other' } } }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: l } = await params
  const locale = (isLocale(l) ? l : 'ka') as Locale
  const [privacy, terms, complaints, legal] = await Promise.all([
    getPage(locale, 'privacy'),
    getPage(locale, 'terms'),
    getDocuments(locale, 'complaints'),
    getDocuments(locale, 'legal'),
  ])
  const pdf = legal.find((d) => /კონფიდენციალ|privacy/i.test(d.title))
  // complaint documents live in their own Documents section; older uploads may still sit under "legal"
  const complaintDocs = complaints.length ? complaints : legal.filter((d) => d.product === 'general' && /პრეტენზი|complaint/i.test(d.title))
  return <Other privacy={privacy} terms={terms} pdf={pdf} complaintDocs={complaintDocs} />
}
