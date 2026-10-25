'use client'
import React, { useEffect, useState } from 'react'
import { Button, Icon, NewsCard, SectionMarker } from '@/ds'
import { useSite } from '@/site/SiteProvider'
import { Breadcrumb } from './shared'
import { RichText } from './RichText'
import type { NewsVM } from '@/lib/content'
import { PRODUCT_LABEL } from '@/collections/options'

const PRODUCT_TEXT: Record<string, string> = { health: 'ექიმი, კვლევები და სტაციონარი ერთ პოლისში.', travel: 'სამედიცინო დაფარვა საზღვარგარეთ.', car: 'ავტომობილის დაცვა ყოველდღიურად.', property: 'სახლი და ქონება, დაცული.' }

export function NewsArticle({ item: cur, others }: { item: NewsVM; others: NewsVM[] }) {
  const { t, L, locale } = useSite()
  const [copied, setCopied] = useState(false)
  const prod = cur.product ? PRODUCT_LABEL[cur.product] : null
  const [share, setShare] = useState('')
  useEffect(() => setShare(window.location.href), [])
  const copyLink = () => {
    try {
      navigator.clipboard?.writeText(window.location.href)
    } catch {}
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }
  const shareBtn: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, boxSizing: 'border-box', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text)', textDecoration: 'none' }

  return (
    <>
      <section data-hero="" className="tao-canvas" style={{ margin: 4, borderRadius: 5, overflow: 'hidden', color: 'var(--on-primary)' }}>
        <div style={{ boxSizing: 'border-box', maxWidth: 1280, margin: '0 auto', padding: '150px 24px 64px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 24 }}>
          <Breadcrumb current={cur.catLabel} parent={{ label: 'სიახლეები', href: '/news' }} />
          <div className="tao-intro" style={{ ['--i' as string]: '1', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
            <span className="tao-caps" style={{ height: 28, padding: '0 10px', display: 'flex', alignItems: 'center', background: 'var(--surface)', color: 'var(--text)', fontSize: 12, fontWeight: 500, letterSpacing: '0.08em' }}>{t(cur.catLabel)}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15 }}>
              <Icon name="calendar" size={18} />
              {cur.date}
            </span>
            <span style={{ fontSize: 15, color: 'var(--on-blue-muted)' }}>{t(`${cur.readTime} წთ საკითხავი`)}</span>
          </div>
          <h1 className="tao-h tao-h--display tao-intro" style={{ ['--i' as string]: '2', margin: 0, maxWidth: 980, color: 'var(--on-primary)', fontSize: 'min(60px, 4.2vw)', lineHeight: 1.04 }}>{cur.title}</h1>
        </div>
      </section>
      <section style={{ background: 'var(--bg)', marginTop: 4, padding: '64px 0 96px' }}>
        <div style={{ boxSizing: 'border-box', maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 56 }}>
          <figure data-reveal="up" style={{ margin: 0, position: 'relative', aspectRatio: '21 / 9', borderRadius: 5, overflow: 'hidden', background: 'var(--bg-subtle)' }}>
            <img src={cur.image} alt={cur.imageAlt} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: cur.pos, display: 'block' }} />
          </figure>
          <div className="tao-odetail" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: 64, alignItems: 'start' }}>
            <article data-reveal="up" className="tao-rich" style={{ minWidth: 0, maxWidth: 720, gap: 22, lineHeight: 1.75 }}>
              {cur.lead ? <p style={{ margin: 0, fontSize: 21, lineHeight: 1.6, fontWeight: 500, color: 'var(--text)' }}>{cur.lead}</p> : null}
              {cur.body ? <RichText data={cur.body} /> : <p>{cur.excerpt}</p>}
              <div style={{ marginTop: 16, paddingTop: 24, borderTop: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16 }}>
                <Button variant="secondary" icon="arrow-left" href={L('/news')}>
                  {t('ყველა სიახლე')}
                </Button>
              </div>
            </article>
            <aside data-reveal="up" className="tao-osum" style={{ position: 'sticky', top: 104, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 5, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <p className="tao-caps" style={{ margin: 0, fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', color: 'var(--text-muted)' }}>{t('გააზიარე')}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <button type="button" onClick={copyLink} className="tao-nshare" style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 14px', border: '1px solid var(--border)', borderRadius: 5, background: 'var(--surface)', fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text)', cursor: 'pointer' }}>
                    <Icon name={copied ? 'tick-circle' : 'document-text'} size={18} />
                    {t(copied ? 'დაკოპირდა' : 'ბმულის კოპირება')}
                  </button>
                  <a href={'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(share)} target="_blank" rel="noopener" aria-label={t('გააზიარე Facebook-ზე')} title="Facebook" className="tao-nshare" style={shareBtn}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3z" />
                    </svg>
                  </a>
                  <a href={'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(share)} target="_blank" rel="noopener" aria-label={t('გააზიარე LinkedIn-ზე')} title="LinkedIn" className="tao-nshare" style={shareBtn}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M6.9 8.8H3.6V20h3.3V8.8zM5.2 3.5a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8zM20.4 13.6c0-3-1.6-5-4.3-5-1.5 0-2.5.8-2.9 1.6V8.8H10V20h3.3v-5.6c0-1.5.3-2.9 2.1-2.9s1.8 1.7 1.8 3V20h3.3v-6.4z" />
                    </svg>
                  </a>
                </div>
              </div>
              {prod ? (
                <div style={{ background: 'var(--primary)', color: 'var(--on-primary)', borderRadius: 5, padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14 }}>
                  <span style={{ width: 48, height: 48, boxSizing: 'border-box', border: '1px solid var(--on-blue-line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={prod.icon} size={22} />
                  </span>
                  <h3 className="tao-h tao-h--h4" style={{ margin: 0, color: 'var(--on-primary)' }}>{locale === 'en' ? prod.en : prod.ka}</h3>
                  <p style={{ margin: 0, fontSize: 15, color: 'var(--on-blue-muted)' }}>{t(PRODUCT_TEXT[cur.product] || '')}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 4 }}>
                    <Button variant="onBlue" size="sm" href={L(prod.route)}>
                      {t('გაიგე მეტი')}
                    </Button>
                  </div>
                </div>
              ) : null}
            </aside>
          </div>
        </div>
      </section>
      {others.length ? (
        <section style={{ padding: '96px 0 104px' }}>
          <div style={{ boxSizing: 'border-box', maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 40 }}>
            <div data-reveal="up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
              <SectionMarker number={1} title={t('სხვა სიახლეები')} />
              <Button variant="secondary" iconRight="arrow-right" href={L('/news')}>
                {t('ყველა სიახლე')}
              </Button>
            </div>
            <div data-reveal="stagger" className="tao-ogrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
              {others.map((n) => (
                <NewsCard key={n.id} image={n.image} imageAlt={n.imageAlt} category={t(n.catLabel)} date={n.date} dateTime={n.dateISO} title={n.title} excerpt={n.excerpt} href={L(n.href)} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}
