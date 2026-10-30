'use client'
import React, { useState, useTransition } from 'react'
import { Button, Icon, SectionMarker } from '@/ds'
import { useSite } from '@/site/SiteProvider'
import { Breadcrumb } from './shared'
import { Consent, Field, SubmitRow } from './forms'
import { submitContact } from '@/actions/forms'

export function Contact() {
  const { t, L, P, settings, locale } = useSite()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [consent, setConsent] = useState(false)
  const [sent, setSent] = useState<string | null>(null)
  const [pending, start] = useTransition()

  const serviceMap = settings.service.mapUrl
  const channels: { icon: string; label: string; value: string; href: string; external?: boolean }[] = [
    { icon: 'call-calling', label: 'ცხელი ხაზი', value: settings.phone, href: 'tel:' + settings.phoneHref },
    { icon: 'sms', label: 'ელფოსტა', value: settings.email, href: 'mailto:' + settings.email },
    { icon: 'location', label: 'სერვის ცენტრი', value: settings.service.addressShort, href: serviceMap, external: true },
    { icon: 'global', label: 'ტაო დაზღვევის პორტალი', value: 'პოლისი და ანაზღაურება', href: P('') },
  ]
  const claimLinks = [
    { icon: 'global', title: 'მოთხოვნა პორტალზე', text: 'ატვირთე დოკუმენტები და ადევნე თვალი სტატუსს', href: P('claim') },
    { icon: 'document-text', title: 'პრეტენზიის წარდგენა', text: 'გაეცანი პრეტენზიების განხილვის წესს', href: L('/complaints') },
    { icon: 'messages-2', title: 'ხშირად დასმული კითხვები', text: 'პასუხები პროდუქტის გვერდებზე', href: L('/health#faq') },
  ]

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    fd.set('topic', 'general')
    fd.set('consent', consent ? '1' : '')
    fd.set('locale', locale)
    start(async () => {
      const r = await submitContact(fd)
      if (r.ok) {
        setSent(r.name)
        setErrors({})
        setConsent(false)
      } else setErrors(r.errors)
    })
  }

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
              <a key={c.label} href={c.href} target={c.external ? '_blank' : undefined} rel={c.external ? 'noopener' : undefined} className="tao-ctile" style={{ boxSizing: 'border-box', padding: '28px 24px 30px', borderLeft: '1px solid var(--on-blue-line)', display: 'flex', flexDirection: 'column', gap: 14, color: 'var(--on-primary)', textDecoration: 'none', minWidth: 0 }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <Icon name={c.icon} size={22} />
                  <span className="tao-ctile__arrow" style={{ display: 'flex' }}>
                    <Icon name="arrow-right" size={18} />
                  </span>
                </span>
                <span className="tao-caps" style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', color: 'var(--on-blue-muted)' }}>{t(c.label)}</span>
                <span style={{ fontSize: 20, fontWeight: 500, lineHeight: 1.35 }}>{t(c.value)}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Form + office */}
      <section style={{ background: 'var(--bg)', marginTop: 4, padding: '96px 0' }}>
        <div className="tao-odetail" style={{ boxSizing: 'border-box', maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)', gap: 48, alignItems: 'start' }}>
          <div data-reveal="up" style={{ display: 'flex', flexDirection: 'column', gap: 32, minWidth: 0 }}>
            <SectionMarker number={1} title={t('მოგვწერე')} text={t('გაქვს შეკითხვა ან გჭირდება დახმარება? შეავსე ფორმა და ჩვენი გუნდი დაგიკავშირდება')} />
            {sent ? (
              <div role="status" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 5, padding: '48px 40px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
                <span style={{ width: 56, height: 56, boxSizing: 'border-box', border: '1px solid var(--success)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="tick-circle" size={22} />
                </span>
                <h3 className="tao-h tao-h--h3" style={{ margin: 0 }}>{t('შეტყობინება გაიგზავნა')}</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                  {t(`მადლობა, ${sent}!`)} {t('სამუშაო დღის განმავლობაში დაგიკავშირდებით.')} {t('სასწრაფო საკითხზე დაგვირეკე:')} {settings.phone}.
                </p>
                <Button variant="secondary" onClick={() => setSent(null)}>
                  {t('ახალი შეტყობინება')}
                </Button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="tao-cform" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 5, padding: '36px 40px 40px', display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div className="tao-cfrow" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16 }}>
                  <Field label="სახელი და გვარი" name="name" autoComplete="name" error={errors.name} />
                  <Field label="ტელეფონი" name="phone" type="tel" autoComplete="tel" placeholder="5XX XX XX XX" error={errors.phone} />
                </div>
                <Field label="ელფოსტა" optional="(არასავალდებულო)" name="email" type="email" autoComplete="email" />
                <Field label="შეტყობინება" name="message" multiline rows={5} error={errors.msg} />
                <Consent on={consent} error={!!errors.consent} onToggle={() => { setConsent((c) => !c); setErrors((e) => ({ ...e, consent: '' })) }} />
                <SubmitRow pending={pending} error={errors.consent ? 'გასაგრძელებლად დაეთანხმე მონაცემების დამუშავებას' : ''} />
              </form>
            )}
          </div>
          {/* office */}
          <aside id="office" data-reveal="up" className="tao-osum" style={{ position: 'sticky', top: 104, display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
            <div className="tao-canvas" aria-hidden="true" style={{ position: 'relative', height: 340, borderRadius: 5, overflow: 'hidden' }}>
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
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 5, padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
              <p className="tao-caps" style={{ margin: 0, fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', color: 'var(--text-muted)' }}>{t('სერვის ცენტრი')}</p>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 500, lineHeight: 1.4 }}>{t(settings.service.address)}</p>
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
          </aside>
        </div>
      </section>

      {/* Claims + other ways */}
      <section style={{ padding: '96px 0 104px' }}>
        <div style={{ boxSizing: 'border-box', maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 48 }}>
          <div data-reveal="up">
            <SectionMarker number={2} title={t('სადაზღვევო შემთხვევის დროს')} />
          </div>
          <div data-reveal="stagger" className="tao-cclaim" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: 4 }}>
            <div style={{ background: 'var(--brand-black)', color: 'var(--on-primary)', borderRadius: 5, padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 18 }}>
              <span style={{ width: 52, height: 52, boxSizing: 'border-box', border: '1px solid var(--grey-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="24-support" size={22} />
              </span>
              <h3 className="tao-h tao-h--h3" style={{ margin: 0, color: 'var(--on-primary)' }}>{t('პირველ რიგში, დაგვირეკე')}</h3>
              <p style={{ margin: 0, maxWidth: 460, color: '#A8ADB3' }}>{t('ცხელ ხაზზე გეტყვიან, რა უნდა გააკეთო და რა დოკუმენტები დაგჭირდება. ჯანმრთელობის და სამოგზაურო პოლისზე ასისტანსის ნომერი პოლისშია მითითებული.')}</p>
              <a href={'tel:' + settings.phoneHref} className="tao-flink" style={{ marginTop: 8, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 44, lineHeight: 1, color: 'var(--on-primary)', textDecoration: 'none' }}>{settings.phone}</a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {claimLinks.map((l) => (
                <a key={l.title} href={l.href} className="tao-docrow" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 20, padding: '24px 28px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text)', textDecoration: 'none' }}>
                  <span style={{ flex: 'none', width: 48, height: 48, boxSizing: 'border-box', border: '1px solid var(--link)', color: 'var(--link)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={l.icon} size={22} />
                  </span>
                  <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.35 }}>{t(l.title)}</span>
                    <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{t(l.text)}</span>
                  </span>
                  <span className="tao-docrow__dl" style={{ flex: 'none', width: 40, height: 40, boxSizing: 'border-box', border: '1px solid var(--link)', color: 'var(--link)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="arrow-right" size={18} />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
