'use client'
import React from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { LoaderProvider, pageEnterStyle, useLoader } from './Loader'
import { PortalOverlay } from './PortalOverlay'
import { Reveal } from './Reveal'

function Ground({ children }: { children: React.ReactNode }) {
  const { phase } = useLoader()
  return (
    <div className="tao-ground" id="top" style={{ fontFamily: 'var(--font-sans)', color: 'var(--text)', fontSize: 16, lineHeight: 1.6, paddingBottom: 4, ...pageEnterStyle(phase) }}>
      <Header />
      {children}
      <Footer />
    </div>
  )
}

/** Header, page, footer, first-visit loader, portal hand-over overlay and scroll reveals. */
export function SiteFrame({ children }: { children: React.ReactNode }) {
  return (
    <LoaderProvider>
      <PortalOverlay />
      <Reveal />
      <Ground>{children}</Ground>
    </LoaderProvider>
  )
}
