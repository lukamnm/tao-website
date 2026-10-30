'use client'
import React, { useState } from 'react'
import { Button, Icon, SectionMarker } from '@/ds'
import { useSite } from '@/site/SiteProvider'
import { Breadcrumb } from './shared'
import { OfferCard } from './OfferCard'
import type { OfferVM } from '@/lib/content'

/* Product pages (design "Health", "Travel", "Car" - ავტომობილის კორპორატიული დაზღვევა). */

export type ProductConfig = {
  product: 'health' | 'travel' | 'car'
  /** hero title lines (joined with a space for the breadcrumb and aria-label) */
  title: string[]
  /** hero title font-size (default: the two-line size) */
  titleSize?: string
  lead: string
  image: string
  imageAlt: string
  imagePos: string
  covers: { icon: string; title: string; text: string }[]
  schemes?: { icon: string; title: string; steps: string[] }[]
  schemesTitle?: string
  schemesText?: string
  faq: { q: string; a: string }[]
}

export const HEALTH: ProductConfig = {
  product: 'health',
  title: ['ჯანმრთელობის', 'დაზღვევა'],
  lead: 'იზრუნე ჯანმრთელობაზე და ხარჯები ჩვენ მოგვანდე. პოლისი შენთვის, შენი ოჯახისთვის და შენი გუნდისთვის.',
  image: '/img/hero-health-clinic.jpg',
  imageAlt: 'ექიმი პაციენტს ესაუბრება კლინიკაში',
  imagePos: '78% 50%',
  covers: [
    { icon: 'health', title: 'ამბულატორიული მომსახურება', text: 'ექიმის კონსულტაციები და დიაგნოსტიკური კვლევები' },
    { icon: 'building', title: 'სტაციონარული მკურნალობა', text: 'ჰოსპიტალიზაცია და ოპერაციები' },
    { icon: '24-support', title: 'გადაუდებელი დახმარება', text: 'სასწრაფო სამედიცინო დახმარება 24/7' },
    { icon: 'receipt-item', title: 'მედიკამენტები', text: 'წამლების ხარჯის ნაწილობრივი ანაზღაურება' },
    { icon: 'security-safe', title: 'სტომატოლოგია', text: 'პაკეტის მიხედვით' },
    { icon: 'call-calling', title: 'ოჯახის ექიმი', text: 'ოჯახის ექიმის კონსულტაციები, მათ შორის სატელეფონო და ვიდეო' },
    { icon: 'shield-tick', title: 'დაავადებათა პროფილაქტიკა', text: 'პროფილაქტიკური შემოწმებები, პაკეტის მიხედვით' },
    { icon: 'calendar', title: 'გეგმური ჰოსპიტალიზაცია', text: 'წინასწარ დაგეგმილი მკურნალობა სტაციონარში' },
  ],
  faq: [
    { q: 'როდიდან იწყებს პოლისი მოქმედებას?', a: 'მოქმედების დაწყების თარიღი ხელშეკრულებაშია მითითებული. ზოგიერთ მომსახურებაზე შეიძლება მოლოდინის პერიოდი მოქმედებდეს.' },
    { q: 'რომელ კლინიკებში შემიძლია მომსახურების მიღება?', a: 'პარტნიორი კლინიკების სიას პოლისთან ერთად მიიღებ' },
    { q: 'შემიძლია ოჯახის წევრების დაზღვევა?', a: 'კი, ოჯახის წევრების ჩართვა ერთ პოლისში შეგიძლია' },
    { q: 'როგორ მივიღო ანაზღაურება?', a: 'დაგვიკავშირდი ცხელ ხაზზე ან მოთხოვნა პორტალზე გამოგზავნე - საჭირო დოკუმენტებს ჩვენ გეტყვით' },
    { q: 'რა უნდა გავითვალისწინო შეძენამდე?', a: 'საქართველოს კანონმდებლობით, კერძო დაზღვევის შეძენისას ვერ ისარგებლებ საყოველთაო ჯანდაცვის პროგრამის სტანდარტული პაკეტით. კერძო დაზღვევის გაუქმების შემთხვევაში, იგივე პირობა 6 თვის განმავლობაში მოქმედებს.' },
  ],
}

export const TRAVEL: ProductConfig = {
  product: 'travel',
  title: ['სამოგზაურო', 'დაზღვევა'],
  lead: 'ჩაალაგე ჩემოდანი, დანარჩენზე ჩვენ ვიზრუნებთ. სამედიცინო დაფარვა საზღვარგარეთ, ნებისმიერი მოგზაურობისთვის.',
  image: '/img/hero-travel-airport.jpg',
  imageAlt: 'მგზავრი ჩემოდნით აეროპორტში',
  imagePos: '82% 50%',
  covers: [
    { icon: 'health', title: 'სამედიცინო ხარჯები', text: 'მკურნალობა საზღვარგარეთ, მოულოდნელი ავადმყოფობის ან ტრავმის დროს' },
    { icon: '24-support', title: 'ასისტანსი 24/7', text: 'დახმარება ნებისმიერ დროს, ნებისმიერ ქვეყანაში' },
    { icon: 'airplane', title: 'სამედიცინო ტრანსპორტირება', text: 'საჭიროების შემთხვევაში, სამშობლოში დაბრუნება' },
    { icon: 'receipt-item', title: 'ბარგი', text: 'დაკარგული ან დაგვიანებული ბარგი, პაკეტის მიხედვით' },
    { icon: 'building', title: 'გადაუდებელი ჰოსპიტალიზაცია', text: 'სტაციონარული მკურნალობა, პოლისის ლიმიტის ფარგლებში' },
    { icon: 'security-safe', title: 'გადაუდებელი სტომატოლოგია', text: 'სტომატოლოგიური დახმარება მწვავე ტკივილის დროს' },
    { icon: 'calendar', title: 'რეისის გადადება', text: 'დამატებითი სერვისი, პაკეტის მიხედვით' },
    { icon: 'global', title: 'მთელი მსოფლიო', text: 'პოლისი მოქმედებს არჩეულ ქვეყნებში' },
  ],
  schemesTitle: 'საზღვარგარეთ',
  schemesText: 'რა უნდა გააკეთო, თუ მოგზაურობისას დახმარება დაგჭირდა',
  schemes: [
    { icon: '24-support', title: 'თუ ექიმი დაგჭირდა', steps: ['დარეკე ასისტანსის ნომერზე, რომელიც პოლისზეა მითითებული', 'გეტყვიან, რომელ პარტნიორ კლინიკაში მიხვიდე', 'კლინიკასთან ანგარიშსწორებას ჩვენ მოვახდენთ, ფრანშიზის შემთხვევაში, შენ მხოლოდ შენი წილის გადახდა მოგიწევს'] },
    { icon: 'receipt-item', title: 'თუ თავად გადაიხადე', steps: ['შეინახე კლინიკის დასკვნა, მომსახურების ჩამონათვალი და ქვითარი', 'დაბრუნებიდან 10 დღის განმავლობაში წარმოგვიდგინე დოკუმენტები', 'ანაზღაურებას პოლისის პირობების მიხედვით მიიღებ'] },
  ],
  faq: [
    { q: 'გამოდგება პოლისი შენგენის ვიზისთვის?', a: 'კი, პოლისი შენგენის ვიზის მოთხოვნებს აკმაყოფილებს' },
    { q: 'სავალდებულოა სამოგზაურო დაზღვევა?', a: 'ზოგიერთ ქვეყანაში სავალდებულოა, თუმცა ნებისმიერ შემთხვევაში რეკომენდებულია - ის გიცავს მოულოდნელი ხარჯებისგან' },
    { q: 'რა ვქნა, თუ საზღვარგარეთ ექიმი დამჭირდა?', a: 'დარეკე ასისტანსის ნომერზე, რომელიც პოლისზეა მითითებული - გეტყვიან, სად მიხვიდე' },
    { q: 'შემიძლია პოლისის ყიდვა უკვე საზღვარგარეთ ყოფნისას?', a: 'პოლისი გამგზავრებამდე უნდა შეიძინო' },
    { q: 'რა არის ფრანშიზა?', a: 'თანხა, რომელსაც დაზღვეული თავად იხდის, დანარჩენს კი ჩვენ ვანაზღაურებთ. ის წინასწარ არის განსაზღვრული პოლისში.' },
  ],
}

/* The design writes the hotline into the first car step; at render time it is swapped for the admin phone (settings.phone). */
const DESIGN_PHONE = '+995 32 219 52 12'

export const CAR: ProductConfig = {
  product: 'car',
  title: ['ავტომობილის', 'კორპორატიული', 'დაზღვევა'],
  titleSize: 'min(64px, 4.4vw)',
  lead: 'კომპანიის ავტოპარკის დაცვა დაზიანების, ქურდობისა და მესამე პირის მიმართ პასუხისმგებლობისგან',
  image: '/img/hero-car-mountain.jpg',
  imageAlt: 'ლურჯი მანქანა მთის გზაზე',
  imagePos: '50% 50%',
  covers: [
    { icon: 'car', title: 'დაზიანება', text: 'ავარიის, ბუნებრივი მოვლენების ან ვანდალიზმის შედეგად მიყენებული ზარალი' },
    { icon: 'security-safe', title: 'ქურდობა', text: 'ავტომობილის ან მისი ნაწილების ქურდობა და ძარცვა' },
    { icon: 'shield-tick', title: 'მესამე პირის პასუხისმგებლობა', text: 'სხვისი ავტომობილის ან ქონების დაზიანება, პოლისის ლიმიტის ფარგლებში' },
    { icon: 'health', title: 'მძღოლი და მგზავრები', text: 'უბედური შემთხვევა მძღოლისა და მგზავრებისთვის' },
    { icon: '24-support', title: 'ასისტანსი 24/7', text: 'დახმარება გზაზე და ევაკუატორის გამოძახება' },
    { icon: 'building', title: 'სერვის ცენტრები', text: 'შეკეთება პარტნიორ სერვის ცენტრებში' },
    { icon: 'document-text', title: 'მთელი ავტოპარკი', text: 'ერთი პოლისი კომპანიის ყველა ავტომობილისთვის' },
    { icon: 'global', title: 'საქართველოს მასშტაბით', text: 'პოლისი მოქმედებს მთელი საქართველოს ტერიტორიაზე' },
  ],
  schemesTitle: 'შემთხვევის დროს',
  schemesText: 'რა უნდა გააკეთო, თუ ავტომობილი დაზიანდა ან დაიკარგა',
  schemes: [
    {
      icon: 'warning-2',
      title: 'თუ ავარია მოხდა',
      steps: [
        'დაგვირეკე +995 32 219 52 12 და გვაცნობე შემთხვევის შესახებ',
        'გამოიძახე საპატრულო პოლიცია და შეინახე ოქმი',
        'ჩვენი ექსპერტი დაათვალიერებს ავტომობილს და შეაფასებს ზარალს',
      ],
    },
    {
      icon: 'security-safe',
      title: 'თუ ავტომობილი მოიპარეს',
      steps: [
        'დაუყოვნებლივ შეატყობინე პოლიციას',
        'დაგვიკავშირდი და გვაცნობე შემთხვევის შესახებ',
        'წარმოგვიდგინე დოკუმენტები და ანაზღაურებას პოლისის პირობების მიხედვით მიიღებ',
      ],
    },
  ],
  faq: [
    { q: 'ვის შეუძლია ავტომობილის კორპორატიული დაზღვევის გაფორმება?', a: 'კომპანიებს, რომლებსაც ერთი ან მეტი ავტომობილი აქვთ' },
    { q: 'შეიძლება მთელი ავტოპარკის ერთ პოლისში დაზღვევა?', a: 'კი, კომპანიის ყველა ავტომობილი შეიძლება ერთ პოლისში გაერთიანდეს' },
    { q: 'როგორ გავაფორმო პოლისი?', a: 'დაგვირეკე ან მოგვწერე, ჩვენი გუნდი შეგიდგენს შეთავაზებას შენი კომპანიის საჭიროებების მიხედვით' },
    { q: 'რა ვქნა, თუ ავარია მოხდა?', a: 'დაგვირეკე და გამოიძახე საპატრულო პოლიცია, შემდეგ ჩვენი ექსპერტი ზარალს შეაფასებს' },
    { q: 'რა არის ფრანშიზა?', a: 'თანხა, რომელსაც დაზღვეული თავად იხდის, დანარჩენს კი ჩვენ ვანაზღაურებთ. ის წინასწარ არის განსაზღვრული პოლისში.' },
  ],
}

const WRAP: React.CSSProperties = { boxSizing: 'border-box', maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 48 }
const NUM: React.CSSProperties = { flex: 'none', width: 32, height: 32, boxSizing: 'border-box', border: '1px solid var(--link)', color: 'var(--link)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500, fontSize: 14 }

export function Product({ cfg, offers = [] }: { cfg: ProductConfig; offers?: OfferVM[] }) {
  const { t, L, settings } = useSite()
  const [faqOpen, setFaqOpen] = useState(0)
  let n = 0
  const next = () => ++n
  // the design's hotline inside step texts follows the admin phone
  const stepText = (st: string) => t(st).split(DESIGN_PHONE).join(settings.phone)

  return (
    <>
      {/* Product hero: framed blue panel */}
      <section data-hero="" className="tao-canvas" style={{ margin: 4, borderRadius: 5, overflow: 'hidden', color: 'var(--on-primary)' }}>
        <div style={{ boxSizing: 'border-box', maxWidth: 1280, margin: '0 auto', padding: '150px 24px 64px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 48 }}>
          <div className="tao-intro" style={{ ['--i' as string]: '0', flex: '1 1 520px', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 24 }}>
            <Breadcrumb current={cfg.title.join(' ')} parent={{ label: 'დაზღვევა', href: '/#products' }} />
            <h1 className="tao-h tao-h--display" aria-label={t(cfg.title.join(' '))} style={{ margin: 0, color: 'var(--on-primary)', fontSize: cfg.titleSize || 'min(76px, 5.3vw)', lineHeight: 0.95, display: 'flex', flexDirection: 'column' }}>
              {cfg.title.map((line) => (
                <span key={line} style={{ whiteSpace: 'nowrap' }}>{t(line)}</span>
              ))}
            </h1>
            <p style={{ margin: 0, maxWidth: 520, fontSize: 19, lineHeight: 1.55, color: 'var(--on-blue-muted)' }}>{t(cfg.lead)}</p>
          </div>
          <div className="tao-intro" style={{ ['--i' as string]: '2', flex: '1 1 420px', minWidth: 0, position: 'relative', minHeight: 460 }}>
            <div style={{ position: 'absolute', inset: 0, border: '1px solid var(--on-blue-line)', borderRadius: 5, transform: 'translate(14px, -14px)' }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: 5, overflow: 'hidden', background: 'var(--surface)' }}>
              <img src={cfg.image} alt={t(cfg.imageAlt)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: cfg.imagePos, display: 'block' }} />
            </div>
          </div>
        </div>
        {/* quick facts strip */}
        <div style={{ borderTop: '1px solid var(--on-blue-line)' }}>
          <div className="tao-facts" style={{ boxSizing: 'border-box', maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
            <a href="#covered" className="tao-fact" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '22px 0', color: 'var(--on-primary)', textDecoration: 'none' }}>
              <Icon name="shield-tick" size={22} />
              <span className="tao-caps" style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.08em' }}>{t('რას ფარავს')}</span>
            </a>
            <a href="#faq" className="tao-fact" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '22px 0 22px 24px', borderLeft: '1px solid var(--on-blue-line)', color: 'var(--on-primary)', textDecoration: 'none' }}>
              <Icon name="messages-2" size={22} />
              <span className="tao-caps" style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.08em' }}>{t('ხშირად დასმული კითხვები')}</span>
            </a>
          </div>
        </div>
      </section>

      {/* What's covered */}
      <section id="covered" style={{ background: 'var(--bg)', marginTop: 4, padding: '96px 0' }}>
        <div style={WRAP}>
          <div data-reveal="up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 }}>
            <SectionMarker number={next()} title={t('რას ფარავს')} />
            <SectionMarker number={n} variant="diagonal" />
          </div>
          <div data-reveal="stagger" className="tao-cover" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', borderTop: '1px solid var(--border)', borderLeft: '1px solid var(--border)' }}>
            {cfg.covers.map((c) => (
              <div key={c.title} className="tao-coveritem" style={{ boxSizing: 'border-box', padding: '32px 28px 36px', borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 16, minHeight: 240 }}>
                <span className="tao-coveritem__icon" style={{ width: 52, height: 52, boxSizing: 'border-box', border: '1px solid var(--link)', color: 'var(--link)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={c.icon} size={22} />
                </span>
                <h3 className="tao-h tao-h--h4" style={{ margin: '8px 0 0' }}>{t(c.title)}</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 15 }}>{t(c.text)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to use: two schemes (travel, car) */}
      {cfg.schemes ? (
        <section style={{ padding: '96px 0' }}>
          <div style={WRAP}>
            <div data-reveal="up">
              <SectionMarker number={next()} title={t(cfg.schemesTitle || '')} text={cfg.schemesText ? t(cfg.schemesText) : undefined} />
            </div>
            <div data-reveal="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 24 }}>
              {cfg.schemes.map((sc) => (
                <div key={sc.title} style={{ boxSizing: 'border-box', border: '1px solid var(--link)', borderRadius: 5, overflow: 'hidden', background: 'var(--surface)' }}>
                  <div style={{ display: 'flex', alignItems: 'stretch', borderBottom: '1px solid var(--link)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', padding: '0 18px', borderRight: '1px solid var(--link)', color: 'var(--link)' }}>
                      <Icon name={sc.icon} size={22} />
                    </span>
                    <h3 className="tao-h tao-h--h4" style={{ margin: 0, flex: 1, padding: '20px 20px' }}>{t(sc.title)}</h3>
                  </div>
                  <ol style={{ listStyle: 'none', margin: 0, padding: '8px 28px 28px', display: 'flex', flexDirection: 'column' }}>
                    {sc.steps.map((st, i) => (
                      <li key={i} style={{ display: 'flex', gap: 18, alignItems: 'flex-start', padding: '20px 0', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ ...NUM, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>{i + 1}</span>
                        <span style={{ paddingTop: 4, fontSize: 16, lineHeight: 1.5 }}>{stepText(st)}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Current offers (hidden when there are none) */}
      {offers.length ? (
        <section style={{ background: cfg.schemes ? 'var(--bg)' : undefined, padding: '96px 0' }}>
          <div style={WRAP}>
            <div data-reveal="up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
              <SectionMarker number={next()} title={t('აქტიური შეთავაზებები')} />
              <Button variant="secondary" iconRight="arrow-right" href={L('/offers')}>
                {t('ყველა შეთავაზება')}
              </Button>
            </div>
            <div data-reveal="stagger" className="tao-pogrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
              {offers.slice(0, 3).map((o) => (
                <OfferCard key={o.id} o={o} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* FAQ: question list only, full width (no number) */}
      <section id="faq" style={{ background: cfg.schemes ? undefined : 'var(--bg)', padding: '96px 0' }}>
        <div style={{ boxSizing: 'border-box', maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', flexWrap: 'wrap', gap: 48 }}>
          <div data-reveal="up" style={{ flex: '1 1 100%', minWidth: 0 }}>
            <div className="tao-faq" style={{ borderTop: '1px solid var(--text)' }}>
              {cfg.faq.map((q, i) => {
                const open = faqOpen === i
                return (
                  <div key={i} className={'tao-faq__item' + (open ? ' is-open' : '')} style={{ borderBottom: '1px solid var(--border)' }}>
                    <button type="button" onClick={() => setFaqOpen(open ? -1 : i)} aria-expanded={open} className="tao-faq__q" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, padding: '22px 0', border: 0, background: 'transparent', textAlign: 'left', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 18, fontWeight: 500, lineHeight: 1.4, color: 'var(--text)' }}>
                      <span>{t(q.q)}</span>
                      <span className="tao-faq__icon" aria-hidden="true" style={{ flex: 'none', width: 36, height: 36, boxSizing: 'border-box', border: '1px solid var(--link)', color: 'var(--link)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name={open ? 'minus' : 'add'} size={18} />
                      </span>
                    </button>
                    {open ? <p className="tao-faq__a" style={{ margin: 0, padding: '0 60px 24px 0', fontSize: 16, lineHeight: 1.6, color: 'var(--text-secondary)' }}>{t(q.a)}</p> : null}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
