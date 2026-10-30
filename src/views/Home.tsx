'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { BenefitItem, Button, Icon, NewsCard, SectionMarker } from '@/ds'
import { css } from '@/site/css'
import { useSite } from '@/site/SiteProvider'
import { reducedMotion } from '@/site/lottie'
import '@/ds/pages/home.css'
import type { BannerVM, NewsVM, OfferVM } from '@/lib/content'

/* Home page (design "01 Home", look: blue = calm, hero = photo, cards = outline, banner = spotlight, nav = floating). */

type Props = { slides: BannerVM[]; banners: BannerVM[]; offers: OfferVM[]; news: NewsVM[] }

const EASE = 'cubic-bezier(.2,.8,.2,1)'
const EASE_IN = 'cubic-bezier(.7,0,.8,.3)'
const ANIM = {
  in: {
    l1: `transform: translateY(0); transition: transform 750ms ${EASE};`,
    l2: `transform: translateY(0); transition: transform 750ms ${EASE} 90ms;`,
    img: `clip-path: inset(0 0 0 0); transform: scale(1); transition: clip-path 850ms cubic-bezier(.7,0,.2,1), transform 1500ms ${EASE};`,
    text: `opacity: 1; transform: none; transition: opacity 500ms ease 220ms, transform 650ms ${EASE} 220ms;`,
  },
  out: {
    l1: `transform: translateY(-105%); transition: transform 380ms ${EASE_IN};`,
    l2: `transform: translateY(-105%); transition: transform 380ms ${EASE_IN} 40ms;`,
    img: `clip-path: inset(0 100% 0 0); transform: scale(1.03); transition: clip-path 380ms ${EASE_IN}, transform 380ms ${EASE_IN};`,
    text: 'opacity: 0; transform: translateY(-8px); transition: opacity 250ms ease, transform 300ms ease;',
  },
  pre: {
    l1: 'transform: translateY(105%); transition: none;',
    l2: 'transform: translateY(105%); transition: none;',
    img: 'clip-path: inset(0 0 0 100%); transform: scale(1.12); transition: none;',
    text: 'opacity: 0; transform: translateY(12px); transition: none;',
  },
}

/* Headline always on two lines: split at the word boundary closest to the middle, size the type so the longer line fits. */
function splitTitle(title: string) {
  const words = title.split(' ')
  let best = 1
  let bestDiff = Infinity
  for (let i = 1; i < words.length; i++) {
    const d = Math.abs(words.slice(0, i).join(' ').length - words.slice(i).join(' ').length)
    if (d < bestDiff) {
      bestDiff = d
      best = i
    }
  }
  const line1 = words.slice(0, best).join(' ')
  const line2 = words.slice(best).join(' ')
  const longest = Math.max(line1.length, line2.length)
  const px = Math.min(124, Math.floor(1180 / (longest * 0.62)))
  return { line1, line2, size: `min(${px}px, calc((100vw - 64px) * ${((px * 0.94) / 1232).toFixed(4)}))` }
}

const COVER = {
  health: ['ამბულატორიული მომსახურება', 'სტაციონარული მკურნალობა', 'გადაუდებელი დახმარება 24/7', 'მედიკამენტები', 'სტომატოლოგია', 'ორსულობა და მშობიარობა', 'ოჯახის ექიმის მომსახურება', 'დაავადებათა პროფილაქტიკა'],
  travel: ['სამედიცინო ხარჯები', 'გადაუდებელი ჰოსპიტალიზაცია', 'გადაუდებელი ამბულატორია', 'სამედიცინო ტრანსპორტირება', 'ბარგის დაგვიანება / დაკარგვა', 'რეისის გადადება'],
}

export function Home({ slides, banners, offers, news }: Props) {
  const { t, L, P } = useSite()
  const reduce = useRef(false)
  const n = Math.max(1, slides.length)

  /* ---------- hero carousel ---------- */
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState<'in' | 'out' | 'pre'>('in')
  const [paused, setPaused] = useState(false)
  const busy = useRef(false)
  const idxRef = useRef(0)
  idxRef.current = idx

  const go = useCallback(
    (d: number) => {
      const next = (idxRef.current + d + n) % n
      if (reduce.current) {
        setIdx(next)
        return
      }
      if (busy.current) return
      busy.current = true
      setPhase('out')
      window.setTimeout(() => {
        setIdx(next)
        setPhase('pre')
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            setPhase('in')
            busy.current = false
          }),
        )
      }, 380)
    },
    [n],
  )

  const [tick, setTick] = useState(0) // restarts the autoplay timer after manual navigation
  useEffect(() => {
    reduce.current = reducedMotion()
    if (reduce.current || paused || n < 2) return
    const id = window.setInterval(() => go(1), 6000)
    return () => window.clearInterval(id)
  }, [paused, n, go, tick])

  const cur = slides[idx] || slides[0]
  const title = cur ? t(cur.title) : ''
  const { line1, line2, size } = splitTitle(title)
  const anim = reduce.current ? { l1: '', l2: '', img: '', text: '' } : ANIM[phase]
  const bar = reduce.current ? 'width: 0;' : phase === 'in' ? (paused ? 'width: 0; transition: none;' : 'width: 100%; transition: width 6000ms linear;') : phase === 'out' ? 'width: 100%; transition: none;' : 'width: 0; transition: none;'
  const portalSlide = cur ? cur.href === 'portal' || cur.href.startsWith('portal:') : false
  const slideHref = !cur ? '#' : portalSlide ? P(cur.href.split(':')[1] || '') : cur.href.startsWith('http') ? cur.href : L(cur.href)

  /* ---------- banner slider (autoplay 6 s; any manual pick restarts the timer) ---------- */
  const [bIdx, setBIdx] = useState(0)
  const [bTick, setBTick] = useState(0)
  useEffect(() => {
    if (reducedMotion() || banners.length < 2) return
    const id = window.setInterval(() => setBIdx((i) => (i + 1) % banners.length), 6000)
    return () => window.clearInterval(id)
  }, [banners.length, bTick])
  const pickBanner = (i: number) => {
    setBIdx(((i % banners.length) + banners.length) % banners.length)
    setBTick((x) => x + 1)
  }

  /* ---------- offers ---------- */
  const [oIdx, setOIdx] = useState(0)
  const offerActive = offers[oIdx] || offers[0]

  const hrefOf = (b: BannerVM) => (b.href === 'portal' || b.href.startsWith('portal:') ? P(b.href.split(':')[1] || '') : b.href.startsWith('http') ? b.href : L(b.href))

  const sideLink: React.CSSProperties = { flex: '1 1 260px', minWidth: 0, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 16, padding: '22px 0', borderTop: '1px solid var(--on-blue-line)', borderBottom: '1px solid var(--on-blue-line)', color: 'var(--on-primary)', textDecoration: 'none' }
  const badge: React.CSSProperties = { width: 44, height: 44, boxSizing: 'border-box', border: '1px solid var(--on-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }
  const ctrl: React.CSSProperties = { width: 44, height: 44, border: '1px solid var(--primary-subtle-border)', borderRadius: 5, background: 'var(--surface)', color: 'var(--link)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }
  const bnrNav: React.CSSProperties = { position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: 40, height: 40, border: 0, borderRadius: '50%', background: 'var(--surface)', color: 'var(--link)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }
  const wrap: React.CSSProperties = { boxSizing: 'border-box', maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 48 }

  const productCard = (p: 'health' | 'travel', img: string, alt: string, pos: string, lead: string, reverse: boolean) => (
    <article className="tao-hcard" data-reveal="up" style={{ background: 'var(--surface)', border: '1px solid var(--link)', color: 'var(--text)', position: 'relative', boxSizing: 'border-box', borderRadius: 5, overflow: 'hidden', display: 'flex', flexWrap: 'wrap', flexDirection: reverse ? 'row-reverse' : 'row' }}>
      <div style={{ flex: '5 1 420px', minWidth: 0, minHeight: 420, position: 'relative', background: 'var(--bg-subtle)' }}>
        <img src={img} alt={t(alt)} style={{ position: 'absolute', inset: 0, display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos }} />
      </div>
      <div style={{ flex: '7 1 520px', minWidth: 0, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', [reverse ? 'borderRight' : 'borderLeft']: '1px solid var(--link)' }}>
        <div style={{ boxSizing: 'border-box', padding: '48px 48px 40px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 20 }}>
          <h3 className="tao-h tao-h--h2" style={{ color: 'var(--link)', margin: 0, fontSize: 'clamp(36px, 4vw, 56px)', lineHeight: 0.95, overflowWrap: 'anywhere' }}>{t(p === 'health' ? 'ჯანმრთელობის დაზღვევა' : 'სამოგზაურო დაზღვევა')}</h3>
          <p style={{ color: 'var(--text-secondary)', margin: 0, maxWidth: 560, fontSize: 18, lineHeight: 1.6 }}>{t(lead)}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginTop: 4 }}>
            <Button variant="secondary" iconRight="arrow-right" href={L('/' + p)}>
              {t('გაიგე მეტი')}
            </Button>
          </div>
        </div>
        <div style={{ background: 'var(--primary-subtle)', marginTop: 'auto', borderTop: '1px solid var(--link)', boxSizing: 'border-box', padding: '28px 48px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p className="tao-kicker" style={{ color: 'var(--link)', margin: 0 }}>{t('რას ფარავს')}</p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px 24px' }}>
            {COVER[p].map((c) => (
              <li key={c} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 16, fontWeight: 500, lineHeight: 1.35 }}>
                <span style={{ color: 'var(--link)', display: 'flex', flex: 'none' }}>
                  <Icon name="shield-tick" size={22} />
                </span>
                {t(c)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  )

  return (
    <>
      {/* Hero: Patch-style poster composition */}
      <section className="tao-canvas" aria-roledescription="carousel" aria-label={t('მთავარი ბანერები')} style={{ margin: 4, borderRadius: 5, overflow: 'hidden', color: 'var(--on-primary)' }}>
        <div className="tao-heroinner" style={{ boxSizing: 'border-box', maxWidth: 1280, margin: '0 auto', padding: '184px 24px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 48 }}>
          <h1 className="tao-h tao-h--display" aria-label={title} style={css`margin: 0; width: 100%; text-align: center; color: var(--on-primary); font-size: ${size}; line-height: 0.92; height: calc(1.84 * min(124px, calc((100vw - 64px) * 0.0946))); display: flex; flex-direction: column; align-items: center; justify-content: center;`}>
            <span style={{ display: 'block', overflow: 'hidden', padding: '0.04em 0.06em' }}>
              <span style={css`display: inline-block; white-space: nowrap; ${anim.l1}`}>{line1}</span>
            </span>
            <span style={{ display: 'block', overflow: 'hidden', padding: '0.04em 0.06em' }}>
              <span style={css`display: inline-block; white-space: nowrap; ${anim.l2}`}>{line2}</span>
            </span>
          </h1>
          <div className="tao-heromid" style={{ width: '100%', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
            <a href={L('/health')} className="tao-hside tao-intro" style={{ ['--i' as string]: '2', ...sideLink }}>
              <span style={{ display: 'flex' }}>
                <span className="tao-badge" style={badge}>
                  <Icon name="health" size={22} />
                </span>
              </span>
              <span className="tao-caps" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, lineHeight: 1.05, letterSpacing: '0.02em' }}>{t('ჯანმრთელობის დაზღვევა')}</span>
            </a>
            <div className="tao-intro" style={{ ['--i' as string]: '1', flex: '0 0 clamp(340px, 34vw, 440px)', maxWidth: '100%', aspectRatio: '1 / 1', boxSizing: 'border-box', background: 'var(--surface)', borderRadius: 5, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--link)' }}>
              {cur?.image ? <img src={cur.image} alt={cur.imageAlt} style={css`display: block; width: 100%; height: 100%; object-fit: cover; object-position: ${cur.pos}; ${anim.img}`} /> : <Icon name="shield-tick" size={96} />}
            </div>
            <a href={L('/travel')} className="tao-hside tao-intro" style={{ ['--i' as string]: '3', ...sideLink, justifyContent: 'flex-end', textAlign: 'right' }}>
              <span className="tao-caps" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, lineHeight: 1.05, letterSpacing: '0.02em' }}>{t('სამოგზაურო დაზღვევა')}</span>
              <span style={{ display: 'flex' }}>
                <span className="tao-badge" style={badge}>
                  <Icon name="airplane" size={22} />
                </span>
              </span>
            </a>
          </div>
          <div className="tao-herobottom tao-intro" style={{ ['--i' as string]: '4', width: '100%', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 560px) minmax(0, 1fr)', alignItems: 'center', gap: 24 }}>
            <div className="tao-herobottom__left" style={{ justifySelf: 'start', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 4, padding: '4px 4px 6px', background: 'var(--surface)', borderRadius: 5, color: 'var(--link)' }}>
              <button type="button" className="tao-hbtn" onClick={() => { go(-1); setTick((x) => x + 1) }} aria-label={t('წინა')} style={ctrl}>
                <Icon name="arrow-left" size={18} />
              </button>
              <span className="tao-caps" aria-live={paused ? 'polite' : 'off'} style={{ minWidth: 64, textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, letterSpacing: '0.02em' }}>
                0{idx + 1} / 0{n}
              </span>
              <button type="button" className="tao-hbtn tao-hbtn--solid" onClick={() => { go(1); setTick((x) => x + 1) }} aria-label={t('შემდეგი')} style={{ ...ctrl, border: 0, background: 'var(--primary)', color: 'var(--on-primary)' }}>
                <Icon name="arrow-right" size={18} />
              </button>
              <button type="button" className="tao-hbtn" onClick={() => setPaused((p) => !p)} aria-label={t(paused ? 'სლაიდების ჩართვა' : 'სლაიდების შეჩერება')} style={{ ...ctrl, border: 0, borderLeft: '1px solid var(--border)', borderRadius: 0 }}>
                {paused ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
                    <path d="M7 5l12 7-12 7z" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                    <line x1="8" y1="5" x2="8" y2="19" />
                    <line x1="16" y1="5" x2="16" y2="19" />
                  </svg>
                )}
              </button>
              <span aria-hidden="true" style={css`position: absolute; left: 0; bottom: 0; height: 2px; background: var(--link); ${bar}`} />
            </div>
            <div className="tao-herobottom__mid" style={{ minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
              <div style={css`display: flex; flex-direction: column; align-items: center; gap: 16px; ${anim.text}`}>
                <p style={{ margin: 0, maxWidth: 520, minHeight: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, lineHeight: 1.5, color: 'var(--on-primary)' }}>{cur ? t(cur.text) : ''}</p>
                {cur ? (
                  <Button variant={portalSlide ? 'cta' : 'onBlue'} size="sm" iconRight={portalSlide ? 'export-square' : 'arrow-right'} href={slideHref}>
                    {t(cur.action)}
                  </Button>
                ) : null}
              </div>
            </div>
            <a href="#products" className="tao-herobottom__right tao-hdown" aria-label={t('ქვემოთ, პროდუქტებზე')} style={{ justifySelf: 'end', width: 52, height: 52, boxSizing: 'border-box', borderRadius: 5, background: 'var(--surface)', color: 'var(--link)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="arrow-down" size={22} />
            </a>
          </div>
        </div>
      </section>

      {/* 01 Products */}
      <section id="products" style={{ background: 'var(--bg)', marginTop: 4, padding: '80px 0' }}>
        <div style={wrap}>
          <div data-reveal="up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 }}>
            <SectionMarker number={1} title={t('რას ვაზღვევთ')} />
            <SectionMarker number={1} variant="diagonal" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {productCard('health', '/img/hero-health-clinic.jpg', 'ექიმი პაციენტს ესაუბრება კლინიკაში', '78% 50%', 'მარტივი დისტანციური სერვისები, პროვაიდერების ფართო ქსელი, ხელმისაწვდომი სამედიცინო მომსახურება', false)}
            {productCard('travel', '/img/hero-travel-airport.jpg', 'მგზავრი ჩემოდნით აეროპორტში', '60% 50%', 'სამედიცინო დაფარვა საზღვარგარეთ დასვენების, სწავლის ან საქმიანი ვიზიტისას', true)}
          </div>
        </div>
      </section>

      {/* 02 Why TAO */}
      <section style={{ padding: '80px 0' }}>
        <div style={wrap}>
          <div data-reveal="up">
            <SectionMarker number={2} title={t('რატომ ტაო დაზღვევა')} />
          </div>
          <div data-reveal="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            <div className="tao-hbox" style={{ boxSizing: 'border-box' }}><BenefitItem icon="calendar" title={t('2007 წლიდან')} text={t('გამოცდილება, რომელსაც ოჯახები და კომპანიები ენდობიან')} /></div>
            <div className="tao-hbox" style={{ boxSizing: 'border-box' }}><BenefitItem icon="location" title={t('ხელმისაწვდომი')} text={t('მრავალრიცხოვანი პროვაიდერი კლინიკები მთელი საქართველოს მასშტაბით')} /></div>
            <div className="tao-hbox" style={{ boxSizing: 'border-box' }}><BenefitItem icon="money-send" title={t('სწრაფი ანაზღაურება')} text={t('მოქნილი სისტემა, დისტანციური სერვისები')} /></div>
            <div className="tao-hbox" style={{ boxSizing: 'border-box' }}><BenefitItem icon="24-support" title={t('მხარდაჭერა')} text={t('მომხმარებელზე ორიენტირებული მომსახურება და დახმარება საჭირო დროს')} /></div>
          </div>
        </div>
      </section>

      {/* Banner slider (admin: Banners, placement promo): image-only banners, the same files as on the TAO portal (no text in the page itself) */}
      {banners.length ? (
        <section className="tao-bnrsec" aria-roledescription="carousel" aria-label={t('ბანერები')} style={{ padding: '0 0 80px' }}>
          <div style={{ boxSizing: 'border-box', maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div data-reveal="up" className="tao-bnr" style={{ position: 'relative', width: '100%', aspectRatio: '1232 / 224', borderRadius: 5, overflow: 'hidden', background: 'var(--bg-subtle)' }}>
              {banners.map((b, i) => {
                const on = i === bIdx
                return (
                  <a key={b.id} href={hrefOf(b)} className="tao-bnr__slide" role="group" aria-roledescription="slide" aria-label={i + 1 + ' / ' + banners.length} aria-hidden={!on} tabIndex={on ? 0 : -1} style={css`position: absolute; inset: 0; display: block; transition: opacity 600ms ease, visibility 600ms; ${on ? 'opacity: 1; visibility: visible; z-index: 1;' : 'opacity: 0; visibility: hidden; z-index: 0;'}`}>
                    <img src={b.image} alt={b.imageAlt} style={css`display: block; width: 100%; height: 100%; object-fit: cover; object-position: ${b.pos};`} />
                  </a>
                )
              })}
              {banners.length > 1 ? (
                <>
                  <button type="button" onClick={() => pickBanner(bIdx - 1)} aria-label={t('წინა ბანერი')} className="tao-bnr__nav" style={{ ...bnrNav, left: 16 }}>
                    <Icon name="arrow-left-2" size={18} />
                  </button>
                  <button type="button" onClick={() => pickBanner(bIdx + 1)} aria-label={t('შემდეგი ბანერი')} className="tao-bnr__nav" style={{ ...bnrNav, right: 16 }}>
                    <Icon name="arrow-right-2" size={18} />
                  </button>
                </>
              ) : null}
            </div>
            {banners.length > 1 ? (
              <div role="tablist" aria-label={t('ბანერის არჩევა')} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {banners.map((b, i) => (
                  <button key={b.id} type="button" role="tab" aria-selected={i === bIdx} aria-label={i + 1 + ' / ' + banners.length} onClick={() => pickBanner(i)} className="tao-bnr__dot" style={css`height: 8px; padding: 0; border: 0; border-radius: 4px; cursor: pointer; ${i === bIdx ? 'width: 24px; background: var(--primary);' : 'width: 8px; background: var(--grey-300, #C9CDD2);'}`} />
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* 03 Offers */}
      {offers.length ? (
        <section style={{ background: 'var(--bg)', padding: '80px 0' }}>
          <div style={wrap}>
            <div data-reveal="up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
              <SectionMarker number={3} title={t('შეთავაზებები')} text={t('აქტიური აქციები და სპეციალური პირობები')} />
              <Button variant="secondary" iconRight="arrow-right" href={L('/offers')}>
                {t('ყველა შეთავაზება')}
              </Button>
            </div>
            {/* Offers as an editorial list: rows on the right, the active row's photo on the left */}
            <div data-reveal="up" className="tao-olist" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 5fr) minmax(0, 7fr)', gap: 48, alignItems: 'stretch' }}>
              <div className="tao-olist__media" style={{ position: 'relative', minHeight: 460, borderRadius: 5, overflow: 'hidden', background: 'var(--bg-subtle)' }}>
                {offers.map((o, i) => (
                  <img key={o.id} src={o.image} alt={o.imageAlt} style={css`position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: ${o.pos}; display: block; transition: opacity 450ms ease; opacity: ${i === oIdx ? 1 : 0};`} />
                ))}
                <span className="tao-caps" style={{ position: 'absolute', top: 0, left: 0, padding: '10px 16px', background: 'var(--primary)', color: 'var(--on-primary)', fontSize: 13, fontWeight: 500, letterSpacing: '0.08em' }}>{offerActive?.productLabel}</span>
              </div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border)' }}>
                {offers.map((o, i) => (
                  <li key={o.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <a href={L(o.href)} onMouseEnter={() => setOIdx(i)} onFocus={() => setOIdx(i)} className="tao-orow" style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '32px 8px 32px 0', color: 'var(--text)', textDecoration: 'none' }}>
                      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 20px' }}>
                          <span className="tao-caps" style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', color: 'var(--link)' }}>{o.productLabel}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--text-secondary)' }}>
                            <Icon name="calendar" size={18} />
                            {o.valid}
                          </span>
                        </div>
                        <h3 className="tao-h tao-orow__title" style={{ margin: 0, fontSize: 36, fontWeight: 700, lineHeight: 1.05, color: i === oIdx ? 'var(--link)' : 'var(--text)' }}>{o.title}</h3>
                        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{o.text}</p>
                      </div>
                      <span className="tao-orow__arrow" style={{ flex: 'none', width: 56, height: 56, boxSizing: 'border-box', border: '1px solid var(--link)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', background: i === oIdx ? 'var(--primary)' : 'transparent', color: i === oIdx ? 'var(--on-primary)' : 'var(--link)' }}>
                        <Icon name="arrow-right" size={22} />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      {/* 04 News */}
      {news.length ? (
        <section style={{ background: 'var(--bg)', padding: '80px 0' }}>
          <div style={wrap}>
            <div data-reveal="up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
              <SectionMarker number={4} title={t('სიახლეები')} />
              <Button variant="secondary" iconRight="arrow-right" href={L('/news')}>
                {t('ყველა სიახლე')}
              </Button>
            </div>
            <div data-reveal="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
              {news.map((x) => (
                <NewsCard key={x.id} image={x.image} imageAlt={x.imageAlt} date={x.date} dateTime={x.dateISO} title={x.title} excerpt={x.excerpt} href={L(x.href)} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}
