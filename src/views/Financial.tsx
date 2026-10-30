'use client'
import React, { useState } from 'react'
import { Button, Icon } from '@/ds'
import { useSite } from '@/site/SiteProvider'
import { InfoPage, InfoSection, Notice, DocRow } from './info'
import type { DocumentVM } from '@/lib/content'

const RECENT = 6

export function Financial({ docs, updated }: { docs: DocumentVM[]; updated: string }) {
  const { t, locale } = useSite()
  const [showAll, setShowAll] = useState(false)
  const annual = docs.filter((d) => d.type === 'annual').sort((a, b) => b.year.localeCompare(a.year))
  const quarterly = docs.filter((d) => d.type === 'quarterly')
  const qYears = Array.from(new Set(quarterly.map((d) => d.year))).sort().reverse()
  const shown = showAll ? annual : annual.slice(0, RECENT)
  const older = annual.slice(RECENT)
  const olderRange = older.length ? `${older[older.length - 1].year}-${older[0].year}` : ''
  const qTitle = (d: DocumentVM) => (locale === 'en' ? `${d.year} ${d.quarter} financial statements` : `${d.year} ${d.quarter} ფინანსური ანგარიშგება`)

  return (
    <InfoPage current="/financial" title="ფინანსური ინფორმაცია" lead="აუდიტირებული წლიური და კვარტალური ფინანსური ანგარიშგება" updated={updated}>
      <InfoSection id="annual" number={1} title="წლიური ანგარიშგება" text="2009 წლიდან, დამოუკიდებელი აუდიტორის დასკვნით">
        {annual.length ? (
          <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border)' }}>
            {shown.map((d) => (
              <DocRow key={d.id} title={d.title || (locale === 'en' ? `${d.year} audited financial statements` : `${d.year} წლის აუდიტირებული ფინანსური ანგარიშგება`)} meta={['PDF', t('აუდიტირებული'), d.size].filter(Boolean).join(' · ')} href={d.url} />
            ))}
          </div>
        ) : (
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{t('დოკუმენტები მალე დაემატება.')}</p>
        )}
        {older.length ? (
          <div>
            <Button variant="secondary" iconRight={showAll ? 'arrow-up-2' : 'arrow-down'} onClick={() => setShowAll((s) => !s)}>
              {showAll ? t('ნაკლების ჩვენება') : `${t('ყველა წელი')} (${olderRange})`}
            </Button>
          </div>
        ) : null}
      </InfoSection>
      <InfoSection id="quarterly" number={2} title="კვარტალური ანგარიშგება">
        {qYears.length ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {qYears.map((y) => (
              <div key={y} className="tao-iqgrid" style={{ display: 'grid', gridTemplateColumns: '96px repeat(4, minmax(0, 1fr))', gap: 4, alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 26 }}>{y}</span>
                {['Q1', 'Q2', 'Q3', 'Q4'].map((q) => {
                  const d = quarterly.find((x) => x.year === y && x.quarter === q)
                  return d ? (
                    <a key={q} href={d.url || '#'} download="" className="tao-iq" aria-label={qTitle(d)} style={{ height: 56, boxSizing: 'border-box', border: '1px solid var(--link)', color: 'var(--link)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '0 14px', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>
                      {q}
                      <Icon name="document-download" size={18} />
                    </a>
                  ) : (
                    <span key={q} aria-hidden="true" style={{ height: 56, boxSizing: 'border-box', border: '1px dashed var(--border)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: '0 14px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>
                      {q}
                    </span>
                  )
                })}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{t('დოკუმენტები მალე დაემატება.')}</p>
        )}
        <Notice>{t('კვარტალური ანგარიშგება ქვეყნდება 2017 წლის მესამე კვარტლიდან. ახალი ანგარიში კვარტლის დასრულებიდან [N] დღეში ემატება.')}</Notice>
      </InfoSection>
    </InfoPage>
  )
}
