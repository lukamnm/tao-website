'use client'
import React from 'react'
import { Button, Icon, SectionMarker } from '@/ds'
import { useSite } from '@/site/SiteProvider'
import { Breadcrumb } from './shared'

type Line = { text: string; href: string; external?: boolean }

export function Contact() {
  const { t, P, settings } = useSite()

  const serviceMap = settings.service.mapUrl
  const legalMap = settings.mapUrl || 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(settings.address)
  const channels: { icon: string; label: string; lines: Line[] }[] = [
    {
      icon: 'health',
      label: 'ჯანმრთელობის დაზღვევა',
      lines: [
        { text: settings.phone, href: 'tel:' + settings.phoneHref },
        { text: settings.email, href: 'mailto:' + settings.email },
      ],
    },
    {
      icon: 'car',
      label: 'ავტომობილის კორპორატიული დაზღვევა',
      lines: [
        { text: settings.car.phone, href: 'tel:' + settings.car.phoneHref },
        { text: settings.car.email, href: 'mailto:' + settings.car.email },
      ],
    },
    { icon: 'location', label: 'სერვის ცენტრი (ჯანმრთელობის დაზღვევა)', lines: [{ text: t(settings.service.addressShort), href: serviceMap, external: true }] },
    { icon: 'global', label: 'ტაო დაზღვევის პორტალი', lines: [{ text: t('პოლისი და ანაზღაურება'), href: P('') }] },
  ]
  // one card per hotline: health on light blue, corporate motor on TAO blue (design v7)
  const hotlines = [
    { label: 'ჯანმრთელობის დაზღვევა', text: 'ცხელ ხაზზე გეტყვიან, რა უნდა გააკეთო და რა დოკუმენტები დაგჭირდება. ჯანმრთელობის და სამოგზაურო პოლისზე ასისტანსის ნომერი პოლისშია მითითებული.', phone: settings.phone, href: 'tel:' + settings.phoneHref, email: settings.email, card: { background: 'var(--primary-subtle)', border: '1px solid var(--primary-subtle-border)', color: 'var(--text)' }, icon: { border: '1px solid var(--link)', color: 'var(--link)' }, muted: 'var(--text-secondary)', strong: 'var(--link)', mail: 'var(--text)' },
    { label: 'ავტომობილის კორპორატიული დაზღვევა', text: 'ცხელ ხაზზე გეტყვიან, რა უნდა გააკეთო და რა დოკუმენტები დაგჭირდება', phone: settings.car.phone, href: 'tel:' + settings.car.phoneHref, email: settings.car.email, card: { background: 'var(--primary)', color: 'var(--on-primary)' }, icon: { border: '1px solid var(--on-blue-line)' }, muted: 'var(--on-blue-muted)', strong: 'var(--on-primary)', mail: 'var(--on-primary)' },
  ]

  const card: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 5, padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }
  const cardLabel: React.CSSProperties = { margin: 0, fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', color: 'var(--text-muted)' }
  const cardValue: React.CSSProperties = { margin: 0, fontSize: 20, fontWeight: 500, lineHeight: 1.4 }

  return (
    <>
      {/* Contact hero */}
      <section data-hero="" className="tao-canvas" style={{ margin: 4, borderRadius: 5, overflow: 'hidden', color: 'var(--on-primary)' }}>
        <div style={{ boxSizing: 'border-box', maxWidth: 1280, margin: '0 auto', padding: '150px 24px 0', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 24 }}>
          <Breadcrumb current="კონტაქტი" />
          <h1 className="tao-h tao-h--display tao-intro" style={{ ['--i' as string]: '1', margin: 0, color: 'var(--on-primary)', fontSize: 'min(76px, 5.3vw)', lineHeight: 0.95, whiteSpace: 'nowrap' }}>{t('კონტაქტი')}</h1>
        </div>
        {/* contact channels */}
        <div style={{ marginTop: 56, borderTop: '1px solid var(--on-blue-line)' }}>
          <div className="tao-ctiles tao-intro" style={{ ['--i' as string]: '3', boxSizing: 'border-box', maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
            {channels.map((c) => (
              <div key={c.label} className="tao-ctile" style={{ boxSizing: 'border-box', padding: '28px 24px 30px', borderLeft: '1px solid var(--on-blue-line)', display: 'flex', flexDirection: 'column', gap: 14, color: 'var(--on-primary)', minWidth: 0 }}>
                <span style={{ display: 'flex' }}>
                  <Icon name={c.icon} size={22} />
                </span>
                <span className="tao-caps" style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', color: 'var(--on-blue-muted)' }}>{t(c.label)}</span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {c.lines.map((ln) => (
                    <a key={ln.href} href={ln.href} target={ln.external ? '_blank' : undefined} rel={ln.external ? 'noopener' : undefined} className="tao-flink" style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.35, color: 'var(--on-primary)', textDecoration: 'none', overflowWrap: 'anywhere' }}>
                      {ln.text}
                    </a>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 01 Where to find us */}
      <section style={{ background: 'var(--bg)', marginTop: 4, padding: '96px 0' }}>
        <div style={{ boxSizing: 'border-box', maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 48 }}>
          <div data-reveal="up">
            <SectionMarker number={1} title={t('სად გვიპოვი')} />
          </div>
          <div id="office" data-reveal="up" className="tao-odetail" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)', gap: 4, alignItems: 'stretch' }}>
            <div className="tao-canvas" aria-hidden="true" style={{ position: 'relative', height: '100%', minHeight: 340, borderRadius: 5, overflow: 'hidden' }}>
              <svg width="100%" height="100%" viewBox="0 0 520 340" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, display: 'block' }}>
                <g fill="none" stroke="#FFFFFF" strokeOpacity="0.55">
                  <path d="M-20 250 C 120 230 210 260 300 200 S 460 120 560 140" strokeWidth="10" strokeOpacity="0.18" />
                  <path d="M-20 250 C 120 230 210 260 300 200 S 460 120 560 140" strokeWidth="1.5" />
                  <path d="M60 -10 L 150 360" strokeWidth="1" />
                  <path d="M330 -10 L 250 360" strokeWidth="1" />
                  <path d="M-10 90 L 540 70" strokeWidth="1" />
                  <path d="M-10 160 L 540 180" strokeWidth="1" />
                  <path d="M420 -10 L 470 360" strokeWidth="1" strokeOpacity="0.35" />
                </g>
              </svg>
              <div style={{ position: 'absolute', left: '50%', top: '44%', transform: 'translate(-50%, -100%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ width: 52, height: 52, background: 'var(--surface)', color: 'var(--link)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="location" size={22} />
                </span>
                <span style={{ width: 2, height: 18, background: 'var(--surface)' }} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
              <div style={card}>
                <p className="tao-caps" style={cardLabel}>{t('სერვის ცენტრი (ჯანმრთელობის დაზღვევა)')}</p>
                <p style={cardValue}>{t(settings.service.address)}</p>
                {settings.service.hours.length ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 16, borderTop: '1px solid var(--border)', fontSize: 15, lineHeight: 1.5 }}>
                    {settings.service.hours.map((h) => (
                      <div key={h.days} style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                        <span style={{ color: 'var(--text-muted)' }}>{t(h.days)}</span>
                        <span style={{ fontWeight: 500 }}>{t(h.time)}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
                <Button variant="secondary" iconRight="export-square" href={serviceMap} target="_blank" rel="noopener">
                  {t('რუკაზე ნახვა')}
                </Button>
              </div>
              <div style={card}>
                <p className="tao-caps" style={cardLabel}>{t('იურიდიული მისამართი')}</p>
                <p style={cardValue}>{t(settings.address)}</p>
                <Button variant="secondary" iconRight="export-square" href={legalMap} target="_blank" rel="noopener">
                  {t('რუკაზე ნახვა')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Claims + other ways */}
      <section style={{ padding: '96px 0 104px' }}>
        <div style={{ boxSizing: 'border-box', maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 48 }}>
          <div data-reveal="up">
            <SectionMarker number={2} title={t('სადაზღვევო შემთხვევის დროს')} />
          </div>
          <div data-reveal="stagger" className="tao-cclaim" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 4 }}>
            {hotlines.map((h) => (
              <div key={h.label} style={{ ...h.card, borderRadius: 5, padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 18, minWidth: 0 }}>
                <span style={{ width: 52, height: 52, boxSizing: 'border-box', ...h.icon, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="24-support" size={22} />
                </span>
                <span className="tao-caps" style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', color: h.muted }}>{t(h.label)}</span>
                <h3 className="tao-h tao-h--h3" style={{ margin: 0, color: h.strong }}>{t('პირველ რიგში, დაგვირეკე')}</h3>
                <p style={{ margin: 0, maxWidth: 460, color: h.muted }}>{t(h.text)}</p>
                <div style={{ marginTop: 'auto', paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <a href={h.href} className="tao-flink tao-cphone" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 40, lineHeight: 1, color: h.strong, textDecoration: 'none', whiteSpace: 'nowrap' }}>{h.phone}</a>
                  <a href={'mailto:' + h.email} className="tao-flink" style={{ fontSize: 17, fontWeight: 500, color: h.mail, textDecoration: 'none' }}>{h.email}</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
