'use client'
import React from 'react'
import { useSite } from '@/site/SiteProvider'

/* Pieces shared by the inner pages. */

/** Framed blue hero panel of the inner pages (data-hero drives the docking navbar). */
export function InfoHero({ children, bottom, minHeight, padding = '150px 24px 56px' }: { children: React.ReactNode; bottom?: React.ReactNode; minHeight?: number; padding?: string }) {
  return (
    <section data-hero="" className="tao-canvas" style={{ margin: 4, borderRadius: 5, overflow: 'hidden', color: 'var(--on-primary)' }}>
      <div style={{ boxSizing: 'border-box', maxWidth: 1280, minHeight, margin: '0 auto', padding, display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '32px 48px' }}>
        <div style={{ flex: '1 1 560px', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 24 }}>{children}</div>
        {bottom}
      </div>
    </section>
  )
}

export function Breadcrumb({ current, parent }: { current: string; parent?: { label: string; href: string } }) {
  const { t, L } = useSite()
  return (
    <nav className="tao-intro" aria-label={t('ნავიგაციის ბილიკი')} style={{ ['--i' as string]: '0', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--on-blue-muted)' }}>
      <a href={L('/')} className="tao-flink" style={{ color: 'var(--on-blue-muted)', textDecoration: 'none' }}>{t('მთავარი')}</a>
      {parent ? (
        <>
          <span aria-hidden="true">/</span>
          <a href={L(parent.href)} className="tao-flink" style={{ color: 'var(--on-blue-muted)', textDecoration: 'none' }}>{t(parent.label)}</a>
        </>
      ) : null}
      <span aria-hidden="true">/</span>
      <span aria-current="page" style={{ color: 'var(--on-primary)' }}>{t(current)}</span>
    </nav>
  )
}

export const WRAP: React.CSSProperties = { boxSizing: 'border-box', maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 48 }
