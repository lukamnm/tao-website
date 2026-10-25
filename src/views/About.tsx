'use client'
import React from 'react'
import { Icon, SectionMarker } from '@/ds'
import { useSite } from '@/site/SiteProvider'
import { Breadcrumb, InfoHero } from './shared'

const VALUES = [
  { title: 'გასაგები პირობები', text: 'პოლისში ყველაფერი მარტივად წერია, ზედმეტი წვრილი შრიფტის გარეშე.' },
  { title: 'სწრაფი ანაზღაურება', text: 'მოქნილი სისტემა და მინიმუმ ბიუროკრატია.' },
  { title: 'შენზე მორგებული', text: 'პოლისს შენს საჭიროებებს ვუსადაგებთ, არც მეტს, არც ნაკლებს.' },
  { title: 'სანდოობა', text: 'სიტყვას ვასრულებთ: საჭირო დროს შენს გვერდით ვართ.' },
  { title: 'მუდმივი განვითარება', text: 'ვუსმენთ მომხმარებელს და სერვისს ყოველდღე ვხვეწავთ.' },
]
const PRODUCTS = [
  { title: 'ჯანმრთელობის დაზღვევა', text: 'ექიმი, კვლევები, სტაციონარი.', href: '/health', image: '/img/hero-health-clinic.jpg', alt: 'ექიმი პაციენტს ესაუბრება კლინიკაში', pos: '78% 50%' },
  { title: 'სამოგზაურო დაზღვევა', text: 'სამედიცინო დაფარვა საზღვარგარეთ.', href: '/travel', image: '/img/hero-travel-airport.jpg', alt: 'მგზავრი ჩემოდნით აეროპორტში', pos: '50% 50%' },
]
const LINKS = [
  { icon: 'receipt-item', title: 'შეთავაზებები', text: 'აქციები, ფასდაკლებები და პარტნიორების სპეციალური პირობები ტაოს მომხმარებლებისთვის.', action: 'ყველა შეთავაზება', href: '/offers' },
  { icon: 'document-text', title: 'სიახლეები', text: 'ტაოს ამბები, ახალი პროდუქტები, კამპანიები და პარტნიორობები.', action: 'ყველა სიახლე', href: '/news' },
  { icon: 'messages-2', title: 'კონტაქტი', text: 'დაგვირეკე, მოგვწერე ან გვეწვიე ოფისში.', action: 'დაგვიკავშირდი', href: '/contact' },
]

export function About() {
  const { t, L, settings } = useSite()
  const stats = [
    { label: 'ბაზარზე', value: settings.stats.foundedYear, style: { background: 'var(--brand-black)', color: 'var(--on-primary)' } },
    { label: 'დაზღვეული მომხმარებელი', value: settings.stats.clients, style: { background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' } },
    { label: 'ანაზღაურებული თანხა', value: settings.stats.paid, style: { background: 'var(--primary)', color: 'var(--on-primary)' } },
    { label: 'კორპორატიული კლიენტი', value: settings.stats.corporate, style: { background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' } },
  ]
  const wrap: React.CSSProperties = { boxSizing: 'border-box', maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 48 }
  return (
    <>
      <InfoHero>
        <Breadcrumb current="ჩვენ შესახებ" />
        <h1 className="tao-h tao-h--display tao-intro" aria-label={t('დაზღვევა, რომელიც მუშაობს')} style={{ ['--i' as string]: '1', margin: 0, color: 'var(--on-primary)', fontSize: 'min(76px, 5.3vw)', lineHeight: 0.95, display: 'flex', flexDirection: 'column' }}>
          <span style={{ whiteSpace: 'nowrap' }}>{t('დაზღვევა,')}</span>
          <span style={{ whiteSpace: 'nowrap' }}>{t('რომელიც მუშაობს')}</span>
        </h1>
      </InfoHero>
      {/* Photo + who we are */}
      <section style={{ background: 'var(--bg)', marginTop: 4, padding: '64px 0 96px' }}>
        <div style={{ ...wrap, gap: 72 }}>
          <figure data-reveal="up" style={{ margin: 0, position: 'relative', aspectRatio: '21 / 9', borderRadius: 5, overflow: 'hidden', background: 'var(--bg-subtle)' }}>
            <img src="/img/about-team-office.jpg" alt={t('ტაოს გუნდი ოფისში')} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 45%', display: 'block' }} />
          </figure>
          <div className="tao-abwho" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: 96, alignItems: 'start' }}>
            <div data-reveal="up">
              <SectionMarker number={1} title={t('ვინ ვართ')} />
            </div>
            <div data-reveal="up" style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 760 }}>
              <p style={{ margin: 0, fontSize: 24, lineHeight: 1.5, fontWeight: 500 }}>{t('ტაო ქართული სადაზღვევო კომპანიაა, რომელიც 2007 წლიდან სთავაზობს მომხმარებლებს ჯანმრთელობის და სამოგზაურო დაზღვევას.')}</p>
              <p style={{ margin: 0, fontSize: 17, lineHeight: 1.7, color: 'var(--text-secondary)' }}>{t('ვმუშაობთ როგორც ფიზიკურ პირებთან, ისე კომპანიებთან. პოლისს თითოეულის საჭიროებას ვუსადაგებთ, არც მეტს, არც ნაკლებს. პირობებს მარტივად ვწერთ, ზედმეტი წვრილი შრიფტის გარეშე, ანაზღაურებას კი სწრაფად და მინიმალური ბიუროკრატიით ვიხდით.')}</p>
              <p style={{ margin: 0, fontSize: 17, lineHeight: 1.7, color: 'var(--text-secondary)' }}>{t('2026 წელს ტაო ახალი ბრენდით და ციფრული სერვისებით აგრძელებს: პოლისის შეძენა და ანაზღაურების მოთხოვნა ახლა ონლაინ, ტაოს პორტალზეა შესაძლებელი.')}</p>
            </div>
          </div>
        </div>
      </section>
      {/* Numbers */}
      <section style={{ padding: '0 0 4px' }}>
        <div data-reveal="stagger" className="tao-abstats" style={{ margin: '0 4px', display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 4 }}>
          {stats.map((s) => (
            <div key={s.label} style={{ boxSizing: 'border-box', minHeight: 240, padding: '36px 32px', borderRadius: 5, ...s.style, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 32 }}>
              <span className="tao-caps" style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', opacity: 0.75 }}>{t(s.label)}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 72, lineHeight: 0.9, whiteSpace: 'nowrap' }}>{s.value}</span>
            </div>
          ))}
        </div>
      </section>
      {/* Values */}
      <section style={{ padding: '96px 0' }}>
        <div className="tao-abwho" style={{ boxSizing: 'border-box', maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: 96, alignItems: 'start' }}>
          <div data-reveal="up" style={{ position: 'sticky', top: 104, display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'flex-start' }}>
            <div className="tao-section-head">
              <div className="tao-section-head__text">
                <h2 className="tao-h tao-h--h2">{t('ჩვენი ღირებულებები')}</h2>
              </div>
            </div>
            <p style={{ margin: 0, maxWidth: 320, color: 'var(--text-secondary)' }}>{t('ის, რითაც ყოველდღიურ გადაწყვეტილებებს ვიღებთ.')}</p>
          </div>
          <ol data-reveal="stagger" style={{ listStyle: 'none', margin: 0, padding: 0, borderTop: '1px solid var(--text)' }}>
            {VALUES.map((v, i) => (
              <li key={v.title} className="tao-abval" style={{ display: 'grid', gridTemplateColumns: '56px minmax(0, 1fr) minmax(0, 1.2fr)', gap: 24, alignItems: 'center', padding: '28px 8px', borderBottom: '1px solid var(--border)' }}>
                <span className="tao-abval__n" style={{ width: 44, height: 44, boxSizing: 'border-box', border: '1px solid var(--link)', color: 'var(--link)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17 }}>{i + 1}</span>
                <h3 className="tao-h tao-h--h4" style={{ margin: 0 }}>{t(v.title)}</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{t(v.text)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      {/* What we insure */}
      <section style={{ background: 'var(--bg)', padding: '96px 0' }}>
        <div style={wrap}>
          <div data-reveal="up">
            <SectionMarker number={2} title={t('რას ვაზღვევთ')} />
          </div>
          <div data-reveal="stagger" className="tao-abprod" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 24 }}>
            {PRODUCTS.map((p) => (
              <a key={p.href} href={L(p.href)} className="tao-hcard" style={{ display: 'flex', flexDirection: 'column', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 5, overflow: 'hidden', color: 'var(--text)', textDecoration: 'none' }}>
                <div style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border)' }}>
                  <img src={p.image} alt={t(p.alt)} style={{ display: 'block', width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', objectPosition: p.pos }} />
                </div>
                <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <h3 className="tao-h tao-h--h4" style={{ margin: 0 }}>{t(p.title)}</h3>
                  <p style={{ margin: 0, fontSize: 15, color: 'var(--text-secondary)' }}>{t(p.text)}</p>
                  <span className="tao-caps" style={{ marginTop: 'auto', paddingTop: 8, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, letterSpacing: '0.04em', color: 'var(--link)' }}>
                    {t('გაიგე მეტი')}
                    <Icon name="arrow-right" size={18} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
      {/* Further links */}
      <section style={{ padding: '96px 0 104px' }}>
        <div style={wrap}>
          <div data-reveal="up">
            <SectionMarker number={3} title={t('გაიგე მეტი')} />
          </div>
          <div data-reveal="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', borderTop: '1px solid var(--border)', borderLeft: '1px solid var(--border)' }}>
            {LINKS.map((l) => (
              <a key={l.href} href={L(l.href)} className="tao-coveritem" style={{ boxSizing: 'border-box', padding: '32px 28px 36px', borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 16, minHeight: 240, color: 'var(--text)', textDecoration: 'none' }}>
                <span className="tao-coveritem__icon" style={{ width: 52, height: 52, boxSizing: 'border-box', border: '1px solid var(--link)', color: 'var(--link)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={l.icon} size={22} />
                </span>
                <h3 className="tao-h tao-h--h4" style={{ margin: '8px 0 0' }}>{t(l.title)}</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 15 }}>{t(l.text)}</p>
                <span className="tao-caps" style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, letterSpacing: '0.04em', color: 'var(--link)' }}>
                  {t(l.action)}
                  <Icon name="arrow-right" size={18} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
