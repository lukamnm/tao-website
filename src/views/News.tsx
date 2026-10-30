'use client'
import React, { useState } from 'react'
import { Button, Icon, NewsCard } from '@/ds'
import { useSite } from '@/site/SiteProvider'
import { Breadcrumb } from './shared'
import type { ListItem, NewsVM } from '@/lib/content'

const STEP = 6
const FIRST = 7

export function News({ items, categories }: { items: NewsVM[]; categories: ListItem[] }) {
  const { t, L } = useSite()
  const [cat, setCat] = useState('all')
  const [query, setQuery] = useState('')
  const [shown, setShown] = useState(FIRST)
  const q = query.trim().toLowerCase()
  const match = (n: NewsVM, skipCat?: boolean) => (skipCat || cat === 'all' || n.cat === cat) && (!q || (n.title + ' ' + n.excerpt).toLowerCase().includes(q))
  const results = items.filter((n) => match(n))
  const visible = results.slice(0, shown)
  const featured = visible[0]
  const rest = visible.slice(1)
  const chips = [{ value: 'all', label: 'ყველა' }].concat(categories.filter((c) => items.some((n) => n.cat === c.key)).map((c) => ({ value: c.key, label: c.name })))

  return (
    <>
      <section data-hero="" className="tao-canvas" style={{ margin: 4, borderRadius: 5, overflow: 'hidden', color: 'var(--on-primary)' }}>
        <div style={{ boxSizing: 'border-box', maxWidth: 1280, margin: '0 auto', padding: '150px 24px 56px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 24 }}>
          <Breadcrumb current="სიახლეები" />
          <h1 className="tao-h tao-h--display tao-intro" style={{ ['--i' as string]: '1', margin: 0, color: 'var(--on-primary)', fontSize: 'min(76px, 5.3vw)', lineHeight: 0.95, whiteSpace: 'nowrap' }}>{t('სიახლეები')}</h1>
          <p className="tao-intro" style={{ ['--i' as string]: '2', margin: 0, maxWidth: 560, fontSize: 19, lineHeight: 1.55, color: 'var(--on-blue-muted)' }}>{t('ტაო დაზღვევის ამბები, ახალი სერვისები, ახალი პროვაიდერები')}</p>
        </div>
      </section>
      <section id="list" style={{ background: 'var(--bg)', marginTop: 4, padding: '56px 0 96px' }}>
        <div style={{ boxSizing: 'border-box', maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
            <div role="tablist" aria-label={t('კატეგორია')} style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {chips.map((c) => (
                <button key={c.value} type="button" role="tab" aria-selected={cat === c.value} onClick={() => { setCat(c.value); setShown(FIRST) }} className={'tao-ochip' + (cat === c.value ? ' is-on' : '')} style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 14px', boxSizing: 'border-box', border: '1px solid var(--border)', borderRadius: 5, background: 'var(--surface)', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 500, color: 'var(--text)', cursor: 'pointer' }}>
                  <span>{t(c.label)}</span>
                  <span style={{ fontSize: 12, opacity: 0.7 }}>{items.filter((n) => match(n, true) && (c.value === 'all' || n.cat === c.value)).length}</span>
                </button>
              ))}
            </div>
            <label className="tao-nsearch" style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: '0 1 320px', minWidth: 220 }}>
              <span style={{ position: 'absolute', left: 12, display: 'flex', color: 'var(--text-muted)', pointerEvents: 'none' }}>
                <Icon name="search-normal" size={18} />
              </span>
              <input type="search" value={query} onChange={(e) => { setQuery(e.target.value); setShown(FIRST) }} placeholder={t('მოძებნე სიახლე')} aria-label={t('მოძებნე სიახლე')} style={{ width: '100%', height: 40, boxSizing: 'border-box', padding: '0 12px 0 40px', border: '1px solid var(--border)', borderRadius: 5, background: 'var(--surface)', fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text)' }} />
            </label>
          </div>
          {featured ? (
            <>
              <a data-reveal="up" href={L(featured.href)} className="tao-nfeat" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 5, overflow: 'hidden', color: 'var(--text)', textDecoration: 'none' }}>
                <div style={{ position: 'relative', minHeight: 400, background: 'var(--bg-subtle)' }}>
                  <img src={featured.image} alt={featured.imageAlt} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: featured.pos, display: 'block' }} />
                </div>
                <div style={{ boxSizing: 'border-box', padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16, borderLeft: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
                    <span className="tao-caps" style={{ height: 26, padding: '0 10px', display: 'flex', alignItems: 'center', background: 'var(--primary)', color: 'var(--on-primary)', fontSize: 11, fontWeight: 500, letterSpacing: '0.08em' }}>{t(featured.catLabel)}</span>
                    <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{featured.date}</span>
                  </div>
                  <h2 className="tao-h tao-h--h2 tao-nfeat__title" style={{ margin: 0, fontSize: 36, lineHeight: 1.15 }}>{featured.title}</h2>
                  <p style={{ margin: 0, fontSize: 17, color: 'var(--text-secondary)' }}>{featured.excerpt}</p>
                  <span className="tao-caps" style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 500, letterSpacing: '0.04em', color: 'var(--link)' }}>
                    {t('წაიკითხე')}
                    <span className="tao-ocard__arrow" style={{ width: 36, height: 36, boxSizing: 'border-box', border: '1px solid var(--link)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="arrow-right" size={18} />
                    </span>
                  </span>
                </div>
              </a>
              {rest.length ? (
                <div data-reveal="stagger" className="tao-ogrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
                  {rest.map((n) => (
                    <NewsCard key={n.id} image={n.image} imageAlt={n.imageAlt} category={t(n.catLabel)} date={n.date} dateTime={n.dateISO} title={n.title} excerpt={n.excerpt} href={L(n.href)} />
                  ))}
                </div>
              ) : null}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, paddingTop: 8 }}>
                <p className="tao-caps" style={{ margin: 0, fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', color: 'var(--text-muted)' }}>{t(`ნაჩვენებია ${visible.length} / ${results.length}`)}</p>
                <div style={{ width: 220, height: 2, background: 'var(--border)' }}>
                  <div style={{ height: 2, background: 'var(--primary)', width: Math.round((visible.length / Math.max(1, results.length)) * 100) + '%' }} />
                </div>
                {results.length > visible.length ? (
                  <Button variant="secondary" iconRight="arrow-down" onClick={() => setShown((s) => s + STEP)}>
                    {t('მეტის ჩვენება')}
                  </Button>
                ) : null}
              </div>
            </>
          ) : (
            <div style={{ border: '1px solid var(--border)', borderRadius: 5, background: 'var(--surface)', padding: '64px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, textAlign: 'center' }}>
              <span style={{ width: 64, height: 64, boxSizing: 'border-box', border: '1px solid var(--link)', color: 'var(--link)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="search-normal" size={22} />
              </span>
              <h3 className="tao-h tao-h--h3" style={{ margin: 0 }}>{t('სიახლე ვერ ვიპოვეთ')}</h3>
              <p style={{ margin: 0, maxWidth: 460, color: 'var(--text-secondary)' }}>{t('სცადე სხვა სიტყვა ან კატეგორია')}</p>
              <Button variant="primary" onClick={() => { setCat('all'); setQuery(''); setShown(FIRST) }}>
                {t('ყველა სიახლე')}
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
