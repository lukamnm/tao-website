'use client'
import React from 'react'
import { Button, Icon, SectionMarker } from '@/ds'
import { useSite } from '@/site/SiteProvider'

const LINKS = [
  { href: '/health', icon: 'health', label: 'ჯანმრთელობის დაზღვევა' },
  { href: '/travel', icon: 'airplane', label: 'სამოგზაურო დაზღვევა' },
  { href: '/offers', icon: 'receipt-item', label: 'შეთავაზებები' },
  { href: '/contact', icon: 'call-calling', label: 'კონტაქტი' },
]

export function NotFound() {
  const { t, L } = useSite()
  return (
    <>
      <section data-hero="" className="tao-canvas" style={{ margin: 4, borderRadius: 5, overflow: 'hidden', color: 'var(--on-primary)' }}>
        <div style={{ boxSizing: 'border-box', maxWidth: 1280, minHeight: 640, margin: '0 auto', padding: '160px 24px 88px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28, textAlign: 'center' }}>
          <span className="tao-nf__code tao-intro" aria-hidden="true" style={{ ['--i' as string]: '0', display: 'block', fontSize: 'min(300px, 26vw)', lineHeight: 0.8, color: 'var(--on-primary)' }}>404</span>
          <span className="tao-intro" aria-hidden="true" style={{ ['--i' as string]: '1', display: 'block', width: 72, height: 2, background: 'var(--on-blue-line)' }} />
          <h1 className="tao-h tao-h--display tao-intro" style={{ ['--i' as string]: '1', margin: 0, color: 'var(--on-primary)', fontSize: 'min(56px, 4.6vw)', lineHeight: 1 }}>{t('გვერდი ვერ მოიძებნა')}</h1>
          <p className="tao-intro" style={{ ['--i' as string]: '2', margin: 0, maxWidth: 520, fontSize: 19, lineHeight: 1.55, color: 'var(--on-blue-muted)' }}>{t('შესაძლოა, ბმული შეიცვალა ან გვერდი წაიშალა. დაბრუნდი მთავარ გვერდზე ან აირჩიე სასურველი განყოფილება.')}</p>
          <div className="tao-intro" style={{ ['--i' as string]: '3', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, paddingTop: 8 }}>
            <Button variant="onBlue" icon="arrow-left" href={L('/')}>
              {t('მთავარ გვერდზე')}
            </Button>
          </div>
        </div>
      </section>
      <section style={{ background: 'var(--bg)', marginTop: 4, padding: '72px 0 96px' }}>
        <div style={{ boxSizing: 'border-box', maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div data-reveal="up">
            <SectionMarker number={1} title={t('შეიძლება ეძებდი')} />
          </div>
          <div data-reveal="stagger" className="tao-nfgrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8 }}>
            {LINKS.map((l) => (
              <a key={l.href} href={L(l.href)} className="tao-nflink" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 20, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text)', textDecoration: 'none' }}>
                <span className="tao-nflink__ic" style={{ flex: 'none', width: 44, height: 44, boxSizing: 'border-box', border: '1px solid var(--link)', color: 'var(--link)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={l.icon} size={22} />
                </span>
                <span style={{ flex: 1, fontSize: 16, fontWeight: 500, lineHeight: 1.35 }}>{t(l.label)}</span>
                <Icon name="arrow-right" size={18} />
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
