import React from 'react'
import type { Metadata } from 'next'
import { isLocale, makeT } from '@/i18n'
import { About } from '@/views/About'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = makeT(isLocale(locale) ? locale : 'ka')
  return { title: t('ჩვენ შესახებ'), alternates: { languages: { ka: '/about', en: '/en/about' } } }
}

export default function AboutPage() {
  return <About />
}
