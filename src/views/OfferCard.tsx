'use client'
import React from 'react'
import { Icon } from '@/ds'
import { useSite } from '@/site/SiteProvider'
import type { OfferVM } from '@/lib/content'

/** Offer card: image with the value tab, product kicker, title, where it applies, validity. */
export function OfferCard({ o }: { o: OfferVM }) {
  const { t, L } = useSite()
  return (
    <a href={L(o.href)} className="tao-ocard" style={{ display: 'flex', flexDirection: 'column', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 5, overflow: 'hidden', color: 'var(--text)', textDecoration: 'none', minWidth: 0 }}>
      <div style={{ position: 'relative', background: 'var(--bg-subtle)', aspectRatio: '4 / 3', overflow: 'hidden' }}>
        <img src={o.image} alt={o.imageAlt} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: o.pos, display: 'block' }} />
        {o.value ? (
          <span style={{ position: 'absolute', left: 0, bottom: 0, minWidth: 76, height: 64, boxSizing: 'border-box', padding: '0 14px', background: 'var(--primary)', color: 'var(--on-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 30, lineHeight: 1, whiteSpace: 'nowrap' }}>{o.value}</span>
        ) : null}
      </div>
      <div style={{ flex: 1, padding: '22px 24px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span className="tao-caps" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', color: 'var(--link)' }}>
          <Icon name={o.icon} size={16} />
          {o.productLabel}
        </span>
        <h3 className="tao-h tao-h--h4 tao-ocard__title" style={{ margin: 0, fontSize: 20, lineHeight: 1.3 }}>{o.title}</h3>
        <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="location" size={16} />
          {t(o.where)}
        </p>
      </div>
      <div style={{ margin: '20px 24px 0', padding: '16px 0 20px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--text-secondary)' }}>
          <Icon name="calendar" size={18} />
          {o.valid}
        </span>
        <span className="tao-ocard__arrow" aria-hidden="true" style={{ flex: 'none', width: 36, height: 36, boxSizing: 'border-box', border: '1px solid var(--link)', color: 'var(--link)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="arrow-right" size={18} />
        </span>
      </div>
    </a>
  )
}
