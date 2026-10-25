'use client'
import React from 'react'
import { Button, Icon, SectionMarker } from '@/ds'
import { useSite } from '@/site/SiteProvider'
import { Breadcrumb } from './shared'
import { OfferCard } from './OfferCard'
import { RichText } from './RichText'
import type { OfferVM } from '@/lib/content'

/* Default copy per offer type, used when the admin left the body / steps / terms empty (same as the design). */
const BODY: Record<string, string> = {
  discount: 'შეთავაზება ვრცელდება ტაოს პორტალზე შეძენილ ახალ პოლისებზე. ფასდაკლება ავტომატურად აისახება პოლისის ფასის დათვლისას, პრომოკოდი საჭირო არ არის.',
  bundle: 'პაკეტი ერთ განაცხადში ფორმდება, ასე რომ მონაცემების ორჯერ შევსება არ მოგიწევს. ფასდაკლება ავტომატურად აისახება პორტალზე.',
  partner: 'შეთავაზებით სარგებლობა შეუძლია ტაოს მოქმედი პოლისის ყველა მფლობელს. ფასდაკლების მისაღებად პარტნიორთან წარადგინე პოლისის ნომერი ან პირადობის მოწმობა.',
}
const STEPS: Record<string, string[]> = {
  discount: ['გადადი ტაოს პორტალზე და აირჩიე პროდუქტი.', 'შეავსე განაცხადი: ფასდაკლება ფასში უკვე ჩათვლილია.', 'გადაიხადე ონლაინ და პოლისი ელფოსტაზე მიიღე.'],
  bundle: ['გადადი ტაოს პორტალზე და აირჩიე პაკეტი.', 'შეავსე ერთი განაცხადი ყველა პოლისისთვის.', 'გადაიხადე ონლაინ და პოლისები ელფოსტაზე მიიღე.'],
  partner: ['შეამოწმე, რომ შენი პოლისი მოქმედია.', 'ეწვიე პარტნიორს ან მის ვებგვერდს.', 'გადახდისას წარადგინე პოლისის ნომერი და მიიღე ფასდაკლება.'],
}
const TERMS = (o: OfferVM): string[] =>
  ({
    discount: ['შეთავაზება მოქმედებს მითითებულ ვადაში შეძენილ პოლისებზე.', 'ფასდაკლება არ ჯამდება სხვა აქციებთან.', 'პოლისის პირობები არ იცვლება: იცვლება მხოლოდ ფასი.', 'ტაო იტოვებს უფლებას, ვადამდე შეწყვიტოს შეთავაზება და ამის შესახებ წინასწარ გაცნობებს.'],
    bundle: ['შეთავაზება მოქმედებს მითითებულ ვადაში ერთად შეძენილ პოლისებზე.', 'პოლისის გაუქმებისას ფასდაკლება ხელახლა გადაითვლება.', 'ფასდაკლება არ ჯამდება სხვა აქციებთან.', 'დეტალური პირობები იხილე დაზღვევის ხელშეკრულებაში.'],
    partner: ['შეთავაზება ვრცელდება ' + o.productLabel.replace('დაზღვევა', 'დაზღვევის') + ' მოქმედი პოლისის მფლობელებზე.', 'ფასდაკლებას გასცემს პარტნიორი, მისივე წესების მიხედვით.', 'ფასდაკლება არ ჯამდება პარტნიორის სხვა აქციებთან.', 'შეთავაზება მოქმედებს ' + o.where + '.'],
  })[o.type] || []

export function OfferDetail({ offer: o, others }: { offer: OfferVM; others: OfferVM[] }) {
  const { t, L, P } = useSite()
  const isPartner = o.type === 'partner'
  const steps = o.steps.length ? o.steps : STEPS[o.type] || []
  const terms = o.terms.length ? o.terms : TERMS(o)
  const valueNote = o.note || (isPartner ? 'ფასდაკლება ტაოს პოლისის მფლობელებს' : 'ფასდაკლება პოლისის ფასზე')
  const ctaHref = isPartner ? o.partner.website : P(o.product)
  const hasCta = isPartner ? !!o.partner.website : true
  const facts = [
    { k: 'პროდუქტი', v: o.productLabel },
    { k: 'პარტნიორი', v: isPartner ? o.partner.name || '[პარტნიორის სახელი]' : 'ტაო' },
    ...(o.catLabel ? [{ k: 'კატეგორია', v: t(o.catLabel) }] : []),
    { k: 'ვადა', v: o.period },
  ]
  const contacts = isPartner
    ? [
        o.partner.phone ? { icon: 'call-calling', label: 'ტელეფონი', value: o.partner.phone, href: 'tel:' + o.partner.phone.replace(/\s/g, '') } : null,
        o.partner.address ? { icon: 'location', label: 'მისამართი', value: o.partner.address, href: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(o.partner.address) } : null,
        o.partner.website ? { icon: 'global', label: 'ვებგვერდი', value: o.partner.website.replace(/^https?:\/\//, ''), href: o.partner.website } : null,
      ].filter(Boolean) as { icon: string; label: string; value: string; href: string }[]
    : []

  return (
    <>
      {/* Offer hero */}
      <section data-hero="" className="tao-canvas" style={{ margin: 4, borderRadius: 5, overflow: 'hidden', color: 'var(--on-primary)' }}>
        <div style={{ boxSizing: 'border-box', maxWidth: 1280, margin: '0 auto', padding: '150px 24px 72px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 48 }}>
          <div className="tao-intro" style={{ ['--i' as string]: '0', flex: '1 1 520px', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 22 }}>
            <Breadcrumb current={o.productLabel} parent={{ label: 'შეთავაზებები', href: '/offers' }} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <span className="tao-caps" style={{ height: 28, padding: '0 10px', display: 'flex', alignItems: 'center', gap: 6, border: '1px solid var(--on-blue-line)', fontSize: 12, fontWeight: 500, letterSpacing: '0.08em' }}>
                <Icon name={o.icon} size={16} />
                {o.productLabel}
              </span>
            </div>
            <h1 className="tao-h tao-h--display" style={{ margin: 0, color: 'var(--on-primary)', fontSize: 'min(60px, 4.2vw)', lineHeight: 1.02, maxWidth: 640 }}>{o.title}</h1>
            <p style={{ margin: 0, maxWidth: 520, fontSize: 19, lineHeight: 1.55, color: 'var(--on-blue-muted)' }}>{o.text}</p>
            <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8, fontSize: 15 }}>
              <Icon name="calendar" size={18} />
              {o.period}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', paddingTop: 6 }}>
              {hasCta ? (
                <Button variant={isPartner ? 'primary' : 'cta'} iconRight="export-square" href={ctaHref} target={isPartner ? '_blank' : undefined} rel={isPartner ? 'noopener' : undefined}>
                  {t(isPartner ? 'პარტნიორის ვებგვერდი' : 'ონლაინ ყიდვა')}
                </Button>
              ) : null}
              <Button variant="onBlue" iconRight="arrow-down" href="#terms">
                {t('პირობები')}
              </Button>
            </div>
          </div>
          <div className="tao-intro" style={{ ['--i' as string]: '2', flex: '1 1 420px', minWidth: 0, position: 'relative', minHeight: 440 }}>
            <div style={{ position: 'absolute', inset: 0, border: '1px solid var(--on-blue-line)', borderRadius: 5, transform: 'translate(14px, -14px)' }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: 5, overflow: 'hidden', background: 'var(--surface)' }}>
              <img src={o.image} alt={o.imageAlt} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: o.pos, display: 'block' }} />
              {o.value ? (
                <span style={{ position: 'absolute', left: 0, bottom: 0, minWidth: 120, height: 96, boxSizing: 'border-box', padding: '0 22px', background: 'var(--brand-black)', color: 'var(--on-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 48, lineHeight: 1, whiteSpace: 'nowrap' }}>{o.value}</span>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Offer body: text + summary */}
      <section id="terms" style={{ background: 'var(--bg)', marginTop: 4, padding: '96px 0' }}>
        <div className="tao-odetail" style={{ boxSizing: 'border-box', maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: 64, alignItems: 'start' }}>
          <article data-reveal="up" className="tao-rich" style={{ minWidth: 0, maxWidth: 720 }}>
            <h2 className="tao-h tao-h--h3" style={{ margin: 0 }}>{t('შეთავაზების შესახებ')}</h2>
            <p>{o.text}</p>
            {o.body ? <RichText data={o.body} /> : <p>{t(BODY[o.type] || '')}</p>}
            {steps.length ? (
              <>
                <h2 className="tao-h tao-h--h3" style={{ margin: '28px 0 0' }}>{t('როგორ ვისარგებლო')}</h2>
                <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border)' }}>
                  {steps.map((s, i) => (
                    <li key={i} style={{ display: 'flex', gap: 18, alignItems: 'flex-start', padding: '18px 0', borderBottom: '1px solid var(--border)', color: 'var(--text)' }}>
                      <span style={{ flex: 'none', width: 32, height: 32, boxSizing: 'border-box', border: '1px solid var(--link)', color: 'var(--link)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>{i + 1}</span>
                      <span style={{ paddingTop: 3, fontSize: 16, lineHeight: 1.55 }}>{t(s)}</span>
                    </li>
                  ))}
                </ol>
              </>
            ) : null}
            {terms.length ? (
              <>
                <h2 className="tao-h tao-h--h3" style={{ margin: '28px 0 0' }}>{t('პირობები')}</h2>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {terms.map((tm, i) => (
                    <li key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', fontSize: 16, lineHeight: 1.55, color: 'var(--text-secondary)' }}>
                      <span aria-hidden="true" style={{ flex: 'none', width: 8, height: 8, marginTop: 9, background: 'var(--link)' }} />
                      <span>{t(tm)}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </article>
          <aside data-reveal="up" className="tao-osum" style={{ position: 'sticky', top: 104, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 5, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'stretch', borderBottom: '1px solid var(--border)' }}>
              <span style={{ flex: 'none', minWidth: 96, padding: '0 16px', boxSizing: 'border-box', background: 'var(--primary)', color: 'var(--on-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 32, lineHeight: 1, whiteSpace: 'nowrap' }}>{o.value || '✓'}</span>
              <span style={{ flex: 1, padding: '18px 20px', fontSize: 15, fontWeight: 500, lineHeight: 1.4 }}>{t(valueNote)}</span>
            </div>
            <dl style={{ margin: 0, padding: '4px 24px' }}>
              {facts.map((f) => (
                <div key={f.k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                  <dt className="tao-caps" style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', color: 'var(--text-muted)', paddingTop: 2 }}>{t(f.k)}</dt>
                  <dd style={{ margin: 0, fontSize: 15, textAlign: 'right' }}>{t(f.v)}</dd>
                </div>
              ))}
            </dl>
            {contacts.length ? (
              <div style={{ padding: '20px 24px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <p className="tao-caps" style={{ margin: 0, fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', color: 'var(--text-muted)' }}>{t('პარტნიორის კონტაქტი')}</p>
                {contacts.map((c) => (
                  <a key={c.label} href={c.href} className="tao-pcontact" target={c.icon === 'call-calling' ? undefined : '_blank'} rel="noopener" style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text)', textDecoration: 'none', minWidth: 0 }}>
                    <span className="tao-pcontact__icon" style={{ flex: 'none', width: 36, height: 36, boxSizing: 'border-box', border: '1px solid var(--link)', color: 'var(--link)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name={c.icon} size={18} />
                    </span>
                    <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t(c.label)}</span>
                      <span style={{ fontSize: 15, overflowWrap: 'anywhere' }}>{c.value}</span>
                    </span>
                  </a>
                ))}
              </div>
            ) : null}
            {hasCta ? (
              <div style={{ padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Button variant={isPartner ? 'primary' : 'cta'} block iconRight="export-square" href={ctaHref} target={isPartner ? '_blank' : undefined} rel={isPartner ? 'noopener' : undefined}>
                  {t(isPartner ? 'პარტნიორის ვებგვერდი' : 'ონლაინ ყიდვა')}
                </Button>
                {isPartner ? (
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Icon name="info-circle" size={16} />
                    {t('გაიხსნება ახალ ფანჯარაში')}
                  </p>
                ) : null}
              </div>
            ) : (
              <div style={{ padding: 12 }} />
            )}
          </aside>
        </div>
      </section>

      {/* Other offers */}
      {others.length ? (
        <section style={{ padding: '96px 0 104px' }}>
          <div style={{ boxSizing: 'border-box', maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 40 }}>
            <div data-reveal="up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
              <SectionMarker number={1} title={t('სხვა შეთავაზებები')} />
              <Button variant="secondary" iconRight="arrow-right" href={L('/offers')}>
                {t('ყველა შეთავაზება')}
              </Button>
            </div>
            <div data-reveal="stagger" className="tao-ogrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
              {others.map((x) => (
                <OfferCard key={x.id} o={x} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}
