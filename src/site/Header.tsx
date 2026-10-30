'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Button, Icon, Logo } from '@/ds'
import { css, cx } from './css'
import { useSite } from './SiteProvider'
import { switchLocalePath } from '@/i18n'
import { getAnimation, getLottie, noHover, reducedMotion, type AnimationItem } from './lottie'

/* Floating navbar (design: nav = "floating"): a white pill over the hero, docking into a full-width
   blue bar once the hero has scrolled away. The logo symbol is a Lottie that redraws on hover. */

const NAV = [
  { href: '/offers', label: 'შეთავაზებები' },
  { href: '/news', label: 'სიახლეები' },
  { href: '/about', label: 'ჩვენ შესახებ' },
  { href: '/contact', label: 'კონტაქტი' },
]

const DOCKED = {
  outer: 'padding: 0;',
  bar: 'max-width: 100%; padding: 10px max(24px, calc((100% - 1232px) / 2)); background: var(--primary); border: 0; border-bottom: 1px solid var(--on-blue-line); border-radius: 0;',
  active: 'color: var(--on-primary); box-shadow: inset 0 -2px 0 var(--on-primary);',
  link: 'color: var(--on-primary);',
  lang: 'color: var(--on-blue-muted);',
  menu: 'border: 1px solid var(--on-primary); background: transparent; color: var(--on-primary);',
}
const FLOATING = {
  outer: 'padding: 16px 24px 0;',
  bar: 'max-width: 1280px; padding: 6px 6px 6px 12px; background: var(--surface); border: 1px solid var(--border); border-radius: 16px;',
  active: 'color: var(--link); box-shadow: inset 0 -2px 0 var(--link);',
  link: 'color: var(--text);',
  lang: 'color: var(--text-secondary);',
  menu: 'border: 1px solid var(--primary-subtle-border); background: var(--surface); color: var(--link);',
}

export function Header() {
  const { t, L, P, locale, settings } = useSite()
  const pathname = usePathname()
  const router = useRouter()
  const [docked, setDocked] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [ready, setReady] = useState<{ dark: boolean; light: boolean }>({ dark: false, light: false })
  const dockedRef = useRef(false)
  const anims = useRef<{ dark?: AnimationItem; light?: AnimationItem; playing?: boolean }>({})

  const bare = pathname.replace(/^\/en(?=\/|$)/, '') || '/'
  const isActive = (href: string) => bare === href || bare.startsWith(href + '/')
  // Products menu: the products marked "show in menu" in the admin (each has its own page)
  const PRODUCTS = settings.products.filter((p) => p.inMenu).map((p) => ({ href: p.href, icon: p.icon, title: p.name, text: p.menuText }))
  const productActive = bare === '/' || PRODUCTS.some((p) => isActive(p.href))
  const dock = docked ? DOCKED : FLOATING

  // docked once the hero has scrolled out
  useEffect(() => {
    const onScroll = () => {
      const hero = document.querySelector('[data-hero],[aria-roledescription="carousel"]')
      const d = hero ? hero.getBoundingClientRect().bottom < 90 : window.scrollY > 500
      if (d !== dockedRef.current) {
        dockedRef.current = d
        setDocked(d)
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  // Lottie logo symbol (dark on the white pill, light on the blue bar); static on touch devices
  useEffect(() => {
    if (reducedMotion() || noHover()) return
    let dead = false
    const mount = async (k: 'dark' | 'light') => {
      const [lottie, d] = await Promise.all([getLottie(), getAnimation(k === 'dark' ? '/lottie/tao-logo-hover.json' : '/lottie/tao-logo-hover-reversed.json')])
      const el = document.querySelector('.tao-hlogo__sym--' + k) as HTMLElement | null
      if (dead || !el) return
      el.innerHTML = ''
      const a = lottie.loadAnimation({ container: el, renderer: 'svg', loop: false, autoplay: false, animationData: d })
      anims.current[k] = a
      a.addEventListener('DOMLoaded', () => {
        a.goToAndStop(0, true)
        setReady((r) => ({ ...r, [k]: true }))
      })
      a.addEventListener('complete', () => {
        anims.current.playing = false
        a.goToAndStop(0, true)
      })
    }
    mount('dark').catch(() => {})
    mount('light').catch(() => {})
    const cur = anims.current
    return () => {
      dead = true
      cur.dark?.destroy()
      cur.light?.destroy()
      cur.dark = cur.light = undefined
    }
  }, [])

  const playLogo = useCallback(() => {
    const a = anims.current[dockedRef.current ? 'light' : 'dark']
    if (!a || anims.current.playing) return
    anims.current.playing = true
    a.goToAndPlay(0, true)
  }, [])

  const switchLang = () => {
    const next = switchLocalePath(locale, pathname)
    try {
      localStorage.setItem('tao-lang', locale === 'en' ? 'ka' : 'en')
    } catch {}
    setMenuOpen(false)
    router.push(next)
  }

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const linkStyle = (active: boolean, extra = '') => css`display: flex; align-items: center; height: 44px; padding: 0 14px; ${extra} text-decoration: none; font-size: 14px; font-weight: 500; letter-spacing: 0.04em; ${active ? dock.active : dock.link}`

  return (
    <>
      {menuOpen ? (
        <div className="tao-mmenu" role="dialog" aria-modal="true" aria-label={t('მენიუ')} style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'var(--surface)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <div style={{ flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
            <Logo variant="primary" height={32} href={L('/')} />
            <button type="button" onClick={() => setMenuOpen(false)} aria-label={t('მენიუს დახურვა')} className="tao-mclose" style={{ width: 40, height: 40, border: '1px solid var(--primary-subtle-border)', borderRadius: 12, background: 'var(--surface)', color: 'var(--link)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Icon name="close" size={22} />
            </button>
          </div>
          <nav aria-label={t('მობილური მენიუ')} style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p className="tao-caps" style={{ margin: 0, fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', color: 'var(--text-muted)' }}>{t('დაზღვევა')}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
                {PRODUCTS.map((p) => (
                  <a key={p.href} href={L(p.href)} className="tao-mtile" style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16, border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text)', textDecoration: 'none', fontSize: 14, fontWeight: 500, lineHeight: 1.3 }}>
                    <span style={{ width: 40, height: 40, boxSizing: 'border-box', border: '1px solid var(--link)', color: 'var(--link)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name={p.icon} size={22} />
                    </span>
                    {t(p.title)}
                  </a>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--text)' }}>
              {NAV.map((n) => (
                <a key={n.href} href={L(n.href)} className="tao-mrow" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '18px 4px', borderBottom: '1px solid var(--border)', color: 'var(--text)', textDecoration: 'none' }}>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span className="tao-caps" style={{ fontSize: 17, fontWeight: 500, letterSpacing: '0.04em' }}>{t(n.label)}</span>
                  </span>
                  <Icon name="arrow-right" size={18} />
                </a>
              ))}
            </div>
          </nav>
          <div style={{ flex: 'none', padding: '20px 24px 28px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Button variant="cta" block href={P('')}>
              {t('ჩემი პროფილი')}
            </Button>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, fontSize: 14 }}>
              <a href={'tel:' + settings.phoneHref} style={{ color: 'var(--link)', textDecoration: 'none', fontWeight: 500 }}>{settings.phone}</a>
              <button type="button" onClick={switchLang} className="tao-caps" style={{ border: 0, background: 'transparent', padding: '4px 0', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500, letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>
                ქარ / ENG
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div style={{ position: 'sticky', top: 0, zIndex: 50, height: 84, marginBottom: -84 }}>
        <header className={cx('tao-navfloat', docked && 'is-docked')} style={css`box-sizing: border-box; transition: padding 250ms ease; ${dock.outer}`}>
          <div style={css`box-sizing: border-box; margin: 0 auto; display: flex; align-items: center; gap: 24px; transition: max-width 250ms ease, background-color 250ms ease, border-radius 250ms ease, padding 250ms ease; ${dock.bar}`}>
            <a href={L('/')} className="tao-hlogo" aria-label={t('ტაო დაზღვევა - მთავარი გვერდი')} onMouseEnter={playLogo}>
              <span className={cx('tao-hlogo__sym tao-hlogo__sym--dark tao-hlogo--dark', ready.dark && 'is-ready')} aria-hidden="true" />
              <span className={cx('tao-hlogo__sym tao-hlogo__sym--light tao-hlogo--light', ready.light && 'is-ready')} aria-hidden="true" />
              <img className="tao-hlogo__word tao-hlogo--dark" src="/logo/wordmark-dark.svg" alt="" />
              <img className="tao-hlogo__word tao-hlogo--light" src="/logo/wordmark-light.svg" alt="" />
            </a>
            <nav className="tao-segnav" aria-label={t('მთავარი მენიუ')} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <ul style={{ display: 'flex', gap: 4, listStyle: 'none', margin: 0, padding: 0 }}>
                <li className="tao-dd" style={{ position: 'relative' }}>
                  <a href={L('/#products')} aria-haspopup="true" aria-current={productActive ? 'page' : undefined} className="tao-caps tao-fl-link" style={linkStyle(productActive, 'gap: 4px;')}>
                    {t('დაზღვევა')}
                    <Icon name="arrow-down-2" size={16} />
                  </a>
                  <div className="tao-dd__panel" role="menu" aria-label={t('დაზღვევა')} style={{ position: 'absolute', top: '100%', left: '50%', zIndex: 60, paddingTop: 14, width: 340, transform: 'translateX(-50%)' }}>
                    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {PRODUCTS.map((p) => (
                        <a key={p.href} href={L(p.href)} className="tao-dd__item" role="menuitem" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderRadius: 10, color: 'var(--text)', textDecoration: 'none' }}>
                          <span className="tao-dd__icon" style={{ flex: 'none', width: 40, height: 40, borderRadius: 10, background: 'var(--primary-subtle)', color: 'var(--link)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon name={p.icon} size={22} />
                          </span>
                          <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                            <span style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.3 }}>{t(p.title)}</span>
                            <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{t(p.text)}</span>
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </li>
                {NAV.map((n) => (
                  <li key={n.href}>
                    <a href={L(n.href)} aria-current={isActive(n.href) ? 'page' : undefined} className="tao-caps tao-fl-link" style={linkStyle(isActive(n.href))}>
                      {t(n.label)}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
              <button type="button" onClick={switchLang} className="tao-caps tao-hlang" aria-label={locale === 'en' ? 'Language: English, switch to Georgian' : 'ენა: ქართული, გადართვა ინგლისურზე'} style={css`height: 40px; padding: 0 12px; border: 0; background: transparent; ${dock.lang} font-family: var(--font-sans); font-size: 13px; font-weight: 500; letter-spacing: 0.08em; cursor: pointer;`}>
                ქარ / ENG
              </button>
              <Button variant="cta" size="sm" href={P('')}>
                {t('ჩემი პროფილი')}
              </Button>
              <button type="button" aria-label={t('მენიუ')} className="tao-menubtn" onClick={() => setMenuOpen(true)} style={css`width: 40px; height: 40px; border-radius: 5px; ${dock.menu} align-items: center; justify-content: center; cursor: pointer;`}>
                <Icon name="hamburger-menu" size={22} />
              </button>
            </div>
          </div>
        </header>
      </div>
    </>
  )
}
