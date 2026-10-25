import React from 'react'
import type { Metadata } from 'next'
import { isLocale, makeT, type Locale } from '@/i18n'
import { Contact } from '@/views/Contact'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = makeT(isLocale(locale) ? locale : 'ka')
  return { title: t('კონტაქტი'), alternates: { languages: { ka: '/contact', en: '/en/contact' } } }
}

export default function Page() {
  return <Contact />
}
