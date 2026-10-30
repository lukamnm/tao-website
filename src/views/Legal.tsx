'use client'
import React, { useMemo, useState } from 'react'
import { Icon } from '@/ds'
import { useSite } from '@/site/SiteProvider'
import { InfoPage, InfoSection, KeyValue, Notice, DocList } from './info'
import type { DocumentVM } from '@/lib/content'

const TYPES = [
  { id: 'all', label: 'ყველა ტიპი' },
  { id: 'terms', label: 'დაზღვევის პირობები' },
  { id: 'sheet', label: 'საინფორმაციო ფურცელი' },
  { id: 'sample', label: 'ნიმუშები და ფორმები' },
]
const PER = 8

export function Legal({ docs, updated }: { docs: DocumentVM[]; updated: string }) {
  const { t, settings, locale } = useSite()
  const corporate = docs.filter((d) => d.type === 'other')
  const library = docs.filter((d) => d.type !== 'other')
  const [q, setQ] = useState('')
  const [prod, setProd] = useState('all')
  const [type, setType] = useState('all')
  const [year, setYear] = useState('all')
  const [sort, setSort] = useState('new')
  const [page, setPage] = useState(1)

  const prods = useMemo(() => [{ id: 'all', label: 'ყველა' }].concat(settings.products.filter((p) => library.some((d) => d.product === p.key)).map((p) => ({ id: p.key, label: p.short }))), [settings.products, library])
  const years = useMemo(() => ['all'].concat(Array.from(new Set(library.map((d) => d.year))).sort().reverse()), [library])
  const query = q.trim().toLowerCase()
  const match = (d: DocumentVM, skip?: string) =>
    (skip === 'prod' || prod === 'all' || d.product === prod) && (skip === 'type' || type === 'all' || d.type === type) && (year === 'all' || d.year === year) && (!query || (d.title + ' ' + d.code).toLowerCase().includes(query))
  let res = library.filter((d) => match(d))
  res = res.slice().sort((a, b) => (sort === 'old' ? a.dateISO.localeCompare(b.dateISO) : b.dateISO.localeCompare(a.dateISO)))
  const pagesN = Math.max(1, Math.ceil(res.length / PER))
  const cur = Math.min(page, pagesN)
  const items = res.slice((cur - 1) * PER, cur * PER)
  const filtered = !!query || prod !== 'all' || type !== 'all' || year !== 'all'
  const set = (fn: () => void) => { fn(); setPage(1) }
  const chip = (on: boolean): React.CSSProperties => ({ height: 40, padding: '0 14px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--border)', borderRadius: 5, background: on ? 'var(--primary)' : 'var(--surface)', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 500, color: on ? 'var(--on-primary)' : 'var(--text)', cursor: 'pointer' })
  const field: React.CSSProperties = { width: '100%', height: 48, boxSizing: 'border-box', border: '1px solid var(--control-border)', borderRadius: 5, background: 'var(--surface)', fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--text)' }
  const pageBtn: React.CSSProperties = { width: 44, height: 44, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--link)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }

  return (
    <InfoPage current="/legal" title="იურიდიული ინფორმაცია" lead="კომპანიის რეკვიზიტები, ლიცენზია, დაზღვევის პირობები და კორპორატიული დოკუმენტები." updated={updated}>
      <InfoSection id="company" number={1} title="კომპანიის რეკვიზიტები">
        <KeyValue
          rows={[
            { k: 'დასახელება', v: t('სს „სადაზღვევო კომპანია ტაო“') },
            { k: 'საიდენტიფიკაციო კოდი', v: t('[საიდენტიფიკაციო კოდი]') },
            { k: 'იურიდიული მისამართი', v: t('საქართველო, თბილისი, ვაკის რაიონი, ანა პოლიტკოვსკაიას ქ. 16') },
            { k: 'სადაზღვევო ლიცენზია', v: t('[ლიცენზიის ნომერი], გაცემული [თარიღი]') },
            { k: 'ზედამხედველი ორგანო', v: t('საქართველოს სადაზღვევო სახელმწიფო ზედამხედველობის სამსახური') },
            { k: 'საქმიანობის სფერო', v: t('ჯანმრთელობის და სამოგზაურო დაზღვევა') },
            { k: 'ელფოსტა', v: <a href={'mailto:' + settings.email} style={{ color: 'var(--link)' }}>{settings.email}</a> },
          ]}
        />
      </InfoSection>
      <InfoSection id="corporate" number={2} title="კორპორატიული დოკუმენტები">
        <DocList docs={corporate} emptyText="დოკუმენტები მალე დაემატება." />
      </InfoSection>
      <InfoSection id="wordings" number={3} title="დაზღვევის პირობები" text="ყველა პროდუქტის დაზღვევის პირობები და დოკუმენტები - ახალიც და წინა ვერსიებიც.">
        <Notice>{t('პოლისზე ვრცელდება ის პირობები, რომლებიც მოქმედებდა პოლისის შეძენის ან ბოლო განახლების დღეს. ამიტომ აქ ინახება ყველა ვერსია. მოძებნე დოკუმენტი პოლისის თარიღის მიხედვით.')}</Notice>
        <div className="tao-dtools" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="tao-dtools__row" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 180px 180px', gap: 12 }}>
            <label style={{ position: 'relative', display: 'flex', alignItems: 'center', minWidth: 0 }}>
              <span style={{ position: 'absolute', left: 14, display: 'flex', color: 'var(--text-muted)', pointerEvents: 'none' }}>
                <Icon name="search-normal" size={18} />
              </span>
              <input type="search" value={q} onChange={(e) => set(() => setQ(e.target.value))} placeholder={t('მოძებნე დასახელებით ან კოდით')} aria-label={t('მოძებნე დასახელებით ან კოდით')} className="tao-dfield" style={{ ...field, padding: '0 14px 0 44px' }} />
            </label>
            <label className="tao-dselect" style={{ position: 'relative', display: 'flex', minWidth: 0 }}>
              <select value={year} onChange={(e) => set(() => setYear(e.target.value))} aria-label={t('წელი')} className="tao-dfield" style={{ ...field, padding: '0 40px 0 14px', appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer' }}>
                {years.map((y) => (
                  <option key={y} value={y}>{y === 'all' ? t('ყველა წელი') : y}</option>
                ))}
              </select>
              <span style={{ position: 'absolute', right: 14, top: 15, display: 'flex', color: 'var(--link)', pointerEvents: 'none' }}><Icon name="arrow-down-2" size={18} /></span>
            </label>
            <label className="tao-dselect" style={{ position: 'relative', display: 'flex', minWidth: 0 }}>
              <select value={sort} onChange={(e) => set(() => setSort(e.target.value))} aria-label={t('დალაგება')} className="tao-dfield" style={{ ...field, padding: '0 40px 0 14px', appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer' }}>
                <option value="new">{t('ჯერ ახალი')}</option>
                <option value="old">{t('ჯერ ძველი')}</option>
              </select>
              <span style={{ position: 'absolute', right: 14, top: 15, display: 'flex', color: 'var(--link)', pointerEvents: 'none' }}><Icon name="arrow-down-2" size={18} /></span>
            </label>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div role="radiogroup" aria-label={t('პროდუქტი')} style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {prods.map((c) => (
                <button key={c.id} type="button" role="radio" aria-checked={prod === c.id} onClick={() => set(() => setProd(c.id))} className={'tao-dchip' + (prod === c.id ? ' is-on' : '')} style={chip(prod === c.id)}>
                  {t(c.label)}
                  <span className="tao-dchip__n" style={{ fontSize: 12, color: 'var(--text-muted)' }}>{library.filter((d) => match(d, 'prod') && (c.id === 'all' || d.product === c.id)).length}</span>
                </button>
              ))}
            </div>
            <div role="radiogroup" aria-label={t('დოკუმენტის ტიპი')} style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {TYPES.map((c) => (
                <button key={c.id} type="button" role="radio" aria-checked={type === c.id} onClick={() => set(() => setType(c.id))} className={'tao-dchip' + (type === c.id ? ' is-on' : '')} style={chip(type === c.id)}>
                  {t(c.label)}
                  <span className="tao-dchip__n" style={{ fontSize: 12, color: 'var(--text-muted)' }}>{library.filter((d) => match(d, 'type') && (c.id === 'all' || d.type === c.id)).length}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingBottom: 12, borderBottom: '1px solid var(--text)' }}>
          <p style={{ margin: 0, fontSize: 15, color: 'var(--text-secondary)' }}>
            {t('ნაპოვნია')} <strong style={{ color: 'var(--text)', fontWeight: 500 }}>{res.length}</strong> {t('დოკუმენტი')}
          </p>
          {filtered ? (
            <button type="button" onClick={() => set(() => { setQ(''); setProd('all'); setType('all'); setYear('all') })} className="tao-dclear" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0', border: 0, background: 'transparent', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 500, color: 'var(--link)', cursor: 'pointer' }}>
              <Icon name="close" size={18} />
              {t('ფილტრების გასუფთავება')}
            </button>
          ) : null}
        </div>
        {res.length ? (
          <>
            <ul style={{ listStyle: 'none', margin: '-28px 0 0', padding: 0, display: 'flex', flexDirection: 'column' }}>
              {items.map((d) => (
                <li key={d.id}>
                  <a href={d.url || '#'} download="" className="tao-drow" style={{ display: 'grid', gridTemplateColumns: '132px minmax(0, 1fr) auto', alignItems: 'center', gap: 20, padding: '20px 8px', borderBottom: '1px solid var(--border)', color: 'var(--text)', textDecoration: 'none' }}>
                    <span className="tao-drow__date" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontSize: 15, fontWeight: 500 }}>{d.month}</span>
                      <span className="tao-caps" style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', color: 'var(--text-muted)' }}>{t('გამოქვეყნდა')}</span>
                    </span>
                    <span style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span className="tao-caps" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', color: 'var(--link)' }}>
                        <Icon name={d.icon} size={16} />
                        <span>{d.prodLabel || (locale === 'en' ? 'General' : 'ზოგადი')}</span>
                        <span aria-hidden="true">·</span>
                        <span>{t(TYPES.find((x) => x.id === d.type)?.label || '')}</span>
                      </span>
                      <span className="tao-drow__title" style={{ fontSize: 17, fontWeight: 500, lineHeight: 1.4 }}>{d.title}</span>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{[d.code, 'PDF', d.size].filter(Boolean).join(' · ')}</span>
                    </span>
                    <span className="tao-caps tao-drow__dl" style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 14px', border: '1px solid var(--link)', borderRadius: 5, color: 'var(--link)', fontSize: 13, fontWeight: 500, letterSpacing: '0.04em' }}>
                      <Icon name="document-download" size={18} />
                      <span className="tao-idl">{t('ჩამოტვირთვა')}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            {pagesN > 1 ? (
              <nav aria-label={t('გვერდები')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <button type="button" onClick={() => setPage(Math.max(1, cur - 1))} disabled={cur <= 1} aria-label={t('წინა გვერდი')} className="tao-dpage" style={pageBtn}><Icon name="arrow-left-2" size={18} /></button>
                {Array.from({ length: pagesN }, (_, k) => (
                  <button key={k} type="button" onClick={() => setPage(k + 1)} aria-current={k + 1 === cur ? 'page' : undefined} className={'tao-dpage' + (k + 1 === cur ? ' is-on' : '')} style={{ ...pageBtn, minWidth: 44, width: 'auto', padding: '0 8px', color: 'var(--text)', fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 500 }}>{k + 1}</button>
                ))}
                <button type="button" onClick={() => setPage(Math.min(pagesN, cur + 1))} disabled={cur >= pagesN} aria-label={t('შემდეგი გვერდი')} className="tao-dpage" style={pageBtn}><Icon name="arrow-right-2" size={18} /></button>
              </nav>
            ) : null}
          </>
        ) : (
          <div style={{ marginTop: -28, padding: '48px 24px', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
            <span style={{ width: 56, height: 56, boxSizing: 'border-box', border: '1px solid var(--link)', color: 'var(--link)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="search-normal" size={22} /></span>
            <h3 className="tao-h tao-h--h4" style={{ margin: 0 }}>{t('დოკუმენტი ვერ მოიძებნა')}</h3>
            <p style={{ margin: 0, maxWidth: 420, fontSize: 15, color: 'var(--text-secondary)' }}>{t(library.length ? 'სცადე სხვა სიტყვა ან შეცვალე ფილტრები. თუ საჭირო დოკუმენტს ვერ პოულობ, დაგვიკავშირდი.' : 'დოკუმენტები მალე დაემატება.')}</p>
          </div>
        )}
      </InfoSection>
    </InfoPage>
  )
}
