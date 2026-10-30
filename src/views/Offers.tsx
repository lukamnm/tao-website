'use client'
import React, { useMemo, useState } from 'react'
import { Button, Icon } from '@/ds'
import { useSite } from '@/site/SiteProvider'
import { Breadcrumb } from './shared'
import { OfferCard } from './OfferCard'
import type { ListItem, OfferVM } from '@/lib/content'

/* Offers listing (design "06 Offers"): product chips, sort, side filters, grid with pagination. */

const PER = 9
const SORTS = [
  { id: 'new', label: 'ახალი დამატებული' },
  { id: 'end', label: 'მალე სრულდება' },
  { id: 'value', label: 'ფასდაკლებით' },
]

type Key = 'cat' | 'fmt' | 'city'

export function Offers({ offers, categories, cities }: { offers: OfferVM[]; categories: ListItem[]; cities: ListItem[] }) {
  const { t, settings } = useSite()
  const [product, setProduct] = useState('all')
  const [sel, setSel] = useState<Record<Key, string[]>>({ cat: [], fmt: [], city: [] })
  const [sort, setSort] = useState('new')
  const [page, setPage] = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const products = useMemo(() => settings.products.filter((p) => offers.some((o) => o.product === p.key)), [settings.products, offers])
  const match = (o: OfferVM, skip?: string) =>
    (skip === 'product' || product === 'all' || o.product === product) &&
    (skip === 'cat' || !sel.cat.length || sel.cat.includes(o.cat)) &&
    (skip === 'city' || !sel.city.length || o.cities.some((c) => sel.city.includes(c))) &&
    (skip === 'fmt' || !sel.fmt.length || (sel.fmt.includes('online') && o.online))

  let results = offers.filter((o) => match(o))
  if (sort === 'end') results = results.slice().sort((a, b) => a.until.localeCompare(b.until))
  if (sort === 'value') results = results.slice().sort((a, b) => b.pct - a.pct)
  const pagesN = Math.max(1, Math.ceil(results.length / PER))
  const cur = Math.min(page, pagesN)
  const pageItems = results.slice((cur - 1) * PER, cur * PER)

  const set = (fn: () => void) => { fn(); setPage(1) }
  const toggle = (key: Key, id: string) => () => set(() => setSel((s) => ({ ...s, [key]: s[key].includes(id) ? s[key].filter((x) => x !== id) : s[key].concat(id) })))
  const has = (o: OfferVM, key: Key, id: string) => (key === 'city' ? o.cities.includes(id) : key === 'fmt' ? id === 'online' && o.online : o.cat === id)
  const count = (key: Key, id: string) => offers.filter((o) => match(o, key) && has(o, key, id)).length

  // Lists per filter group: categories and cities come from the CMS; "ფორმატი" holds the single "ონლაინ" option (OfferVM.online).
  const lists: Record<Key, { id: string; label: string }[]> = {
    cat: categories.map((x) => ({ id: x.key, label: x.name })),
    fmt: [{ id: 'online', label: 'ონლაინ' }],
    city: cities.filter((x) => x.key !== 'online').map((x) => ({ id: x.key, label: x.name })),
  }
  const groups = [
    { key: 'cat' as const, title: 'აირჩიე კატეგორია', items: lists.cat },
    { key: 'fmt' as const, title: 'ფორმატი', items: lists.fmt },
    { key: 'city' as const, title: 'ქალაქი / რეგიონი', items: lists.city },
  ]

  const chips = [{ id: 'all', short: 'ყველა', icon: '' }].concat(products.map((p) => ({ id: p.key, short: p.short, icon: p.icon })))
  const activeTags: { label: string; remove: () => void }[] = []
  ;(['cat', 'fmt', 'city'] as const).forEach((key) => {
    sel[key].forEach((id) => {
      const f = lists[key].find((x) => x.id === id)
      if (f) activeTags.push({ label: f.label, remove: toggle(key, id) })
    })
  })
  const nFilters = activeTags.length
  const hasFilters = nFilters > 0 || product !== 'all'
  const clearAll = () => set(() => { setProduct('all'); setSel({ cat: [], fmt: [], city: [] }) })
  const goPage = (n: number) => {
    setPage(n)
    const el = document.getElementById('list')
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' })
  }

  const checkBtn: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '8px 8px 8px 6px', border: 0, borderRadius: 5, background: 'transparent', textAlign: 'left', fontFamily: 'var(--font-sans)', fontSize: 15, lineHeight: 1.35, color: 'var(--text)', cursor: 'pointer' }
  const box: React.CSSProperties = { flex: 'none', width: 20, height: 20, boxSizing: 'border-box', border: '1px solid var(--control-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--on-primary)' }
  const legend: React.CSSProperties = { float: 'left', width: '100%', padding: '0 0 12px', fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', color: 'var(--text-muted)' }
  const pageBtn: React.CSSProperties = { width: 44, height: 44, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--link)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }

  return (
    <>
      {/* Offers hero: compact framed blue panel */}
      <section data-hero="" className="tao-canvas" style={{ margin: 4, borderRadius: 5, overflow: 'hidden', color: 'var(--on-primary)' }}>
        <div style={{ boxSizing: 'border-box', maxWidth: 1280, margin: '0 auto', padding: '150px 24px 56px', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40 }}>
          <div className="tao-intro" style={{ ['--i' as string]: '0', flex: '1 1 560px', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 24 }}>
            <Breadcrumb current="შეთავაზებები" />
            <h1 className="tao-h tao-h--display" style={{ margin: 0, color: 'var(--on-primary)', fontSize: 'min(76px, 5.3vw)', lineHeight: 0.95, whiteSpace: 'nowrap' }}>{t('შეთავაზებები')}</h1>
            <p style={{ margin: 0, maxWidth: 520, fontSize: 19, lineHeight: 1.55, color: 'var(--on-blue-muted)' }}>{t('აქციები, ფასდაკლებები და სპეციალური პირობები ტაო დაზღვევისგან')}</p>
          </div>
          <div className="tao-intro tao-ostats tao-ostats--one" style={{ ['--i' as string]: '2', flex: '0 1 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', borderTop: '1px solid var(--on-blue-line)', borderLeft: '1px solid var(--on-blue-line)' }}>
            <div style={{ boxSizing: 'border-box', padding: '20px 28px 22px', minWidth: 190, borderRight: '1px solid var(--on-blue-line)', borderBottom: '1px solid var(--on-blue-line)', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 56, lineHeight: 1 }}>{offers.length}</span>
              <span className="tao-caps" style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', color: 'var(--on-blue-muted)' }}>{t('აქტიური შეთავაზება')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Listing: filters on the left, results on the right */}
      <section id="list" style={{ background: 'var(--bg)', marginTop: 4, padding: '56px 0 96px' }}>
        <div className="tao-olayout" style={{ boxSizing: 'border-box', maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '280px minmax(0, 1fr)', gap: 48, alignItems: 'start' }}>
          <aside className={'tao-oside' + (filtersOpen ? ' is-open' : '')} aria-label={t('ფილტრები')} style={{ position: 'sticky', top: 104, display: 'flex', flexDirection: 'column', gap: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingBottom: 16, borderBottom: '1px solid var(--text)' }}>
              <span className="tao-caps" style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.08em' }}>{t('ფილტრები')}</span>
              {hasFilters ? (
                <button type="button" onClick={clearAll} className="tao-caps tao-oreset" style={{ border: 0, background: 'transparent', padding: 0, fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', color: 'var(--link)', cursor: 'pointer' }}>{t('გასუფთავება')}</button>
              ) : null}
            </div>
            <fieldset style={{ margin: 0, padding: '20px 0 22px', border: 0, borderBottom: '1px solid var(--border)', minWidth: 0 }}>
              <legend className="tao-caps" style={legend}>{t('დალაგება')}</legend>
              <div role="radiogroup" aria-label={t('დალაგება')} style={{ clear: 'both', display: 'flex', flexDirection: 'column', gap: 2 }}>
                {SORTS.map((so) => (
                  <button key={so.id} type="button" role="radio" aria-checked={sort === so.id} onClick={() => set(() => setSort(so.id))} className={'tao-ocheck tao-oradio' + (sort === so.id ? ' is-on' : '')} style={checkBtn}>
                    <span className="tao-ocheck__box" aria-hidden="true" style={{ ...box, color: undefined }}>
                      <span className="tao-oradio__dot" style={{ width: 10, height: 10, background: 'var(--primary)' }} />
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>{t(so.label)}</span>
                  </button>
                ))}
              </div>
            </fieldset>
            {groups.map((g) => (
              <fieldset key={g.key} style={{ margin: 0, padding: '20px 0 22px', border: 0, borderBottom: '1px solid var(--border)', minWidth: 0 }}>
                <legend className="tao-caps" style={legend}>{t(g.title)}</legend>
                <div style={{ clear: 'both', display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {g.items.map((f) => {
                    const on = sel[g.key].includes(f.id)
                    return (
                      <button key={f.id} type="button" role="checkbox" aria-checked={on} onClick={toggle(g.key, f.id)} className={'tao-ocheck' + (on ? ' is-on' : '')} style={checkBtn}>
                        <span className="tao-ocheck__box" aria-hidden="true" style={box}>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6.2 4.7 9 10 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
                          </svg>
                        </span>
                        <span style={{ flex: 1, minWidth: 0 }}>{t(f.label)}</span>
                        <span style={{ flex: 'none', fontSize: 13, color: 'var(--text-muted)' }}>{count(g.key, f.id)}</span>
                      </button>
                    )
                  })}
                </div>
              </fieldset>
            ))}
            <div className="tao-oside__done" style={{ paddingTop: 20 }}>
              <Button variant="primary" block onClick={() => setFiltersOpen(false)}>
                {t(`ნახე შედეგები (${results.length})`)}
              </Button>
            </div>
          </aside>

          <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <div role="tablist" aria-label={t('პროდუქტი')} className="tao-ochips" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {chips.map((c) => (
                  <button key={c.id} type="button" role="tab" aria-selected={product === c.id} onClick={() => set(() => setProduct(c.id))} className={'tao-ochip' + (product === c.id ? ' is-on' : '')} style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 14px', boxSizing: 'border-box', border: '1px solid var(--border)', borderRadius: 5, background: 'var(--surface)', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 500, color: 'var(--text)', cursor: 'pointer' }}>
                    {c.icon ? <Icon name={c.icon} size={18} /> : null}
                    <span>{t(c.short)}</span>
                    <span className="tao-ochip__n" style={{ fontSize: 12, opacity: 0.7 }}>{offers.filter((o) => match(o, 'product') && (c.id === 'all' || o.product === c.id)).length}</span>
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button type="button" onClick={() => setFiltersOpen(true)} className="tao-caps tao-ofbtn" style={{ display: 'none', alignItems: 'center', gap: 8, height: 40, padding: '0 14px', border: '1px solid var(--link)', borderRadius: 5, background: 'var(--surface)', color: 'var(--link)', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500, letterSpacing: '0.04em', cursor: 'pointer' }}>
                  {t(nFilters ? `ფილტრები (${nFilters})` : 'ფილტრები')}
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 12px', paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
              <p style={{ margin: '0 8px 0 0', fontSize: 15, color: 'var(--text-secondary)' }}>
                {t('ნაპოვნია')} <strong style={{ color: 'var(--text)', fontWeight: 500 }}>{results.length}</strong> {t('შეთავაზება')}
              </p>
              {activeTags.map((tag) => (
                <button key={tag.label} type="button" onClick={tag.remove} className="tao-otag" aria-label={t(`მოხსნა: ${tag.label}`)} style={{ display: 'flex', alignItems: 'center', gap: 6, height: 30, padding: '0 8px 0 12px', border: '1px solid var(--primary-subtle-border)', borderRadius: 5, background: 'var(--primary-subtle)', color: 'var(--link)', fontFamily: 'var(--font-sans)', fontSize: 13, cursor: 'pointer' }}>
                  {t(tag.label)}
                  <Icon name="close" size={16} />
                </button>
              ))}
            </div>
            {results.length ? (
              <>
                <div data-reveal="stagger" className="tao-ogrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
                  {pageItems.map((o) => (
                    <OfferCard key={o.id} o={o} />
                  ))}
                </div>
                {pagesN > 1 ? (
                  <nav aria-label={t('გვერდები')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, paddingTop: 16 }}>
                    <button type="button" onClick={() => cur > 1 && goPage(cur - 1)} disabled={cur === 1} aria-label={t('წინა გვერდი')} className="tao-opage" style={pageBtn}>
                      <Icon name="arrow-left-2" size={18} />
                    </button>
                    {Array.from({ length: pagesN }, (_, i) => (
                      <button key={i} type="button" onClick={() => goPage(i + 1)} aria-current={i + 1 === cur ? 'page' : undefined} className={'tao-opage' + (i + 1 === cur ? ' is-on' : '')} style={{ ...pageBtn, color: 'var(--text)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17 }}>
                        {i + 1}
                      </button>
                    ))}
                    <button type="button" onClick={() => cur < pagesN && goPage(cur + 1)} disabled={cur === pagesN} aria-label={t('შემდეგი გვერდი')} className="tao-opage" style={pageBtn}>
                      <Icon name="arrow-right-2" size={18} />
                    </button>
                  </nav>
                ) : null}
              </>
            ) : (
              <div style={{ border: '1px solid var(--border)', borderRadius: 5, background: 'var(--surface)', padding: '64px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, textAlign: 'center' }}>
                <span style={{ width: 64, height: 64, boxSizing: 'border-box', border: '1px solid var(--link)', color: 'var(--link)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="search-normal" size={22} />
                </span>
                <h3 className="tao-h tao-h--h3" style={{ margin: 0 }}>{t(offers.length ? 'ასეთი შეთავაზება ვერ ვიპოვეთ' : 'შეთავაზებები მალე დაემატება')}</h3>
                <p style={{ margin: 0, maxWidth: 460, color: 'var(--text-secondary)' }}>{t(offers.length ? 'სცადე სხვა ფილტრები ან გაასუფთავე არჩეული პარამეტრები. ახალი შეთავაზებების შესახებ პირველმა რომ გაიგო, გამოგვყევი სოციალურ ქსელებში.' : 'ამ ეტაპზე აქტიური შეთავაზება არ არის. გამოგვყევი სოციალურ ქსელებში, რომ პირველმა გაიგო.')}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
                  {hasFilters ? (
                    <Button variant="primary" onClick={clearAll}>
                      {t('ფილტრების გასუფთავება')}
                    </Button>
                  ) : null}
                  {settings.facebook ? <Button variant="secondary" iconRight="export-square" href={settings.facebook} target="_blank" rel="noopener">Facebook</Button> : null}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
