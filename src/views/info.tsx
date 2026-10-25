'use client'
import React from 'react'
import { Icon, SectionMarker } from '@/ds'
import { useSite } from '@/site/SiteProvider'
import { Breadcrumb } from './shared'
import type { DocumentVM } from '@/lib/content'

/* Info / legal pages: framed hero, sticky side navigation, numbered sections. */

const NAV = [
  { href: '/legal', icon: 'document-text', label: 'იურიდიული ინფორმაცია' },
  { href: '/financial', icon: 'receipt-item', label: 'ფინანსური ინფორმაცია' },
  { href: '/complaints', icon: 'messages-2', label: 'პრეტენზიების განხილვის წესი' },
  { href: '/privacy', icon: 'security-safe', label: 'კონფიდენციალურობის პოლიტიკა' },
  { href: '/terms', icon: 'shield-tick', label: 'საიტის გამოყენების წესები' },
]

export function InfoPage({ current, title, lead, updated, children }: { current: string; title: string; lead: string; updated?: string; children: React.ReactNode }) {
  const { t, L } = useSite()
  return (
    <>
      <section data-hero="" className="tao-canvas" style={{ margin: 4, borderRadius: 5, overflow: 'hidden', color: 'var(--on-primary)' }}>
        <div style={{ boxSizing: 'border-box', maxWidth: 1280, margin: '0 auto', padding: '150px 24px 56px', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px 48px' }}>
          <div style={{ flex: '1 1 640px', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 24 }}>
            <Breadcrumb current={title} parent={{ label: 'ჩვენ შესახებ', href: '/about' }} />
            <h1 className="tao-h tao-h--display tao-intro" style={{ ['--i' as string]: '1', margin: 0, maxWidth: 900, color: 'var(--on-primary)', fontSize: 'min(64px, 4.5vw)', lineHeight: 1 }}>{t(title)}</h1>
            <p className="tao-intro" style={{ ['--i' as string]: '2', margin: 0, maxWidth: 560, fontSize: 19, lineHeight: 1.55, color: 'var(--on-blue-muted)' }}>{t(lead)}</p>
          </div>
          {updated ? (
            <p className="tao-caps tao-intro" style={{ ['--i' as string]: '3', margin: 0, fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', color: 'var(--on-blue-muted)' }}>{t('განახლდა:')} {updated}</p>
          ) : null}
        </div>
      </section>
      <section style={{ background: 'var(--bg)', marginTop: 4, padding: '64px 0 104px' }}>
        <div className="tao-ilayout" style={{ boxSizing: 'border-box', maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '280px minmax(0, 1fr)', gap: 80, alignItems: 'start' }}>
          <nav className="tao-inav" aria-label={t('ინფორმაცია')} style={{ position: 'sticky', top: 104, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p className="tao-caps" style={{ margin: 0, padding: '0 0 12px', borderBottom: '1px solid var(--text)', fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', color: 'var(--text-muted)' }}>{t('ინფორმაცია')}</p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={L(n.href)} className={n.href === current ? 'is-on' : ''} aria-current={n.href === current ? 'page' : undefined} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 5, color: 'var(--text)', textDecoration: 'none', fontSize: 15, lineHeight: 1.35 }}>
                    <span style={{ display: 'flex', flex: 'none' }}>
                      <Icon name={n.icon} size={18} />
                    </span>
                    {t(n.label)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 72 }}>{children}</div>
        </div>
      </section>
    </>
  )
}

export function InfoSection({ id, number, title, text, children }: { id: string; number?: number; title: string; text?: string; children: React.ReactNode }) {
  const { t } = useSite()
  return (
    <section id={id} data-reveal="up" style={{ display: 'flex', flexDirection: 'column', gap: 28, scrollMarginTop: 100 }}>
      {number != null ? (
        <SectionMarker number={number} title={t(title)} text={text ? t(text) : undefined} />
      ) : (
        <div className="tao-section-head">
          <div className="tao-section-head__text">
            <h2 className="tao-h tao-h--h2">{t(title)}</h2>
          </div>
        </div>
      )}
      {children}
    </section>
  )
}

export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="tao-iprose" style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 17, lineHeight: 1.7, maxWidth: 760 }}>
      {children}
    </div>
  )
}

export const P = ({ children }: { children: React.ReactNode }) => <p style={{ margin: 0 }}>{children}</p>

export function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="tao-iprose" style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 760 }}>
      {items.map((it, i) => (
        <li key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', fontSize: 16, lineHeight: 1.6 }}>
          <span aria-hidden="true" style={{ flex: 'none', width: 8, height: 8, marginTop: 9, background: 'var(--link)' }} />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  )
}

export function Notice({ children, icon = 'info-circle', tone = 'subtle' }: { children: React.ReactNode; icon?: string; tone?: 'subtle' | 'surface' }) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '20px 24px', background: tone === 'subtle' ? 'var(--primary-subtle)' : 'var(--surface)', border: '1px solid ' + (tone === 'subtle' ? 'var(--primary-subtle-border)' : 'var(--border)'), borderRadius: 5, maxWidth: 760 }}>
      <span style={{ flex: 'none', display: 'flex', color: 'var(--link)', paddingTop: 2 }}>
        <Icon name={icon} size={22} />
      </span>
      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: 'var(--text)' }}>{children}</p>
    </div>
  )
}

export function KeyValue({ rows }: { rows: { k: string; v: React.ReactNode }[] }) {
  const { t } = useSite()
  return (
    <dl className="tao-ikv" style={{ margin: 0, borderTop: '1px solid var(--text)' }}>
      {rows.map((r) => (
        <div key={r.k} style={{ display: 'grid', gridTemplateColumns: '240px minmax(0, 1fr)', gap: 24, padding: '16px 8px', borderBottom: '1px solid var(--border)' }}>
          <dt className="tao-caps" style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', color: 'var(--text-muted)', paddingTop: 3 }}>{t(r.k)}</dt>
          <dd style={{ margin: 0, fontSize: 16 }}>{r.v}</dd>
        </div>
      ))}
    </dl>
  )
}

/** Document row with a download button (PDF). */
export function DocRow({ title, meta, href }: { title: string; meta: string; href: string }) {
  const { t } = useSite()
  return (
    <a href={href || '#'} className="tao-docrow" download={href ? '' : undefined} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '20px 8px', borderBottom: '1px solid var(--border)', color: 'var(--text)', textDecoration: 'none' }}>
      <span style={{ flex: 'none', width: 44, height: 44, boxSizing: 'border-box', border: '1px solid var(--link)', color: 'var(--link)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="document-text" size={22} />
      </span>
      <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 17, fontWeight: 500, lineHeight: 1.4 }}>{title}</span>
        <span className="tao-caps" style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', color: 'var(--text-muted)' }}>{meta}</span>
      </span>
      <span className="tao-caps tao-docrow__dl" style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 14px', border: '1px solid var(--link)', borderRadius: 5, color: 'var(--link)', fontSize: 13, fontWeight: 500, letterSpacing: '0.04em' }}>
        <Icon name="document-download" size={18} />
        <span className="tao-idl">{t('ჩამოტვირთვა')}</span>
      </span>
    </a>
  )
}

export function DocList({ docs, emptyText }: { docs: DocumentVM[]; emptyText: string }) {
  const { t } = useSite()
  if (!docs.length) return <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{t(emptyText)}</p>
  return (
    <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border)' }}>
      {docs.map((d) => (
        <DocRow key={d.id} title={d.title} meta={['PDF', d.size, d.year].filter(Boolean).join(' · ')} href={d.url} />
      ))}
    </div>
  )
}
