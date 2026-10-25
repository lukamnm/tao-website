import React from 'react'
import type { Metadata } from 'next'
import { isLocale, makeT, type Locale } from '@/i18n'
import { notFound } from 'next/navigation'
import { getOffer, getOffers } from '@/lib/content'
import { OfferDetail } from '@/views/OfferDetail'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: l, slug } = await params
  const locale = (isLocale(l) ? l : 'ka') as Locale
  const o = await getOffer(locale, slug)
  if (!o) return {}
  return { title: o.title, description: o.text, openGraph: { images: o.image ? [o.image] : undefined }, alternates: { languages: { ka: o.href, en: '/en' + o.href } } }
}

export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: l, slug } = await params
  const locale = (isLocale(l) ? l : 'ka') as Locale
  const [offer, all] = await Promise.all([getOffer(locale, slug), getOffers(locale)])
  if (!offer) notFound()
  const others = all
    .filter((x) => x.id !== offer.id)
    .sort((a, b) => Number(b.product === offer.product) - Number(a.product === offer.product) || a.order - b.order)
    .slice(0, 3)
  return <OfferDetail offer={offer} others={others} />
}
