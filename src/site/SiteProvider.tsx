'use client'
import React, { createContext, useContext, useMemo } from 'react'
import { localePath, makeT, type Locale, type T } from '@/i18n'
import type { SiteSettings } from '@/lib/content'

export type SiteCtx = {
  locale: Locale
  /** Georgian source string to the page language. */
  t: T
  /** Site path for the page language: L('/health') is "/en/health" in English. */
  L: (path: string) => string
  /** TAO portal URL for a product ('' = portal home). */
  P: (product?: string) => string
  settings: SiteSettings
}

const Ctx = createContext<SiteCtx | null>(null)

export function SiteProvider({ locale, settings, children }: { locale: Locale; settings: SiteSettings; children: React.ReactNode }) {
  const value = useMemo<SiteCtx>(
    () => ({
      locale,
      t: makeT(locale),
      L: (p) => localePath(locale, p),
      P: (product = '') => settings.portal[product] || settings.portalUrl,
      settings,
    }),
    [locale, settings],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useSite(): SiteCtx {
  const v = useContext(Ctx)
  if (!v) throw new Error('useSite outside SiteProvider')
  return v
}
