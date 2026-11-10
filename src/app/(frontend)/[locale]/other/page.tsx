import React from 'react'
import type { Metadata } from 'next'
import { isLocale, makeT, type Locale } from '@/i18n'
import { getDocuments } from '@/lib/content'
import { Other } from '@/views/TextPages'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = makeT(isLocale(locale) ? locale : 'ka')
  return { title: t('სხვა ინფორმაცია'), alternates: { languages: { ka: '/other', en: '/en/other' } } }
}

const isPrivacy = (title: string) => /კონფიდენციალ|privacy/i.test(title)

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: l } = await params
  const locale = (isLocale(l) ? l : 'ka') as Locale
  const [privacy, complaints, other, legal] = await Promise.all([
    getDocuments(locale, 'privacy'),
    getDocuments(locale, 'complaints'),
    getDocuments(locale, 'other'),
    getDocuments(locale, 'legal'),
  ])
  // Documents uploaded before these lists existed sit under "legal": the privacy policy (by its title),
  // complaint documents (by title) and the corporate ones (type "other", no longer on the legal page).
  const legacyPrivacy = legal.filter((d) => isPrivacy(d.title))
  const legacyComplaints = legal.filter((d) => d.product === 'general' && /პრეტენზი|complaint/i.test(d.title))
  const legacyOther = legal.filter((d) => d.type === 'other' && !isPrivacy(d.title) && !legacyComplaints.includes(d))
  return (
    <Other
      privacy={privacy.length ? privacy : legacyPrivacy}
      complaints={complaints.length ? complaints : legacyComplaints}
      other={[...other, ...legacyOther]}
    />
  )
}
