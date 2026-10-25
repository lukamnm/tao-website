'use client'
/* TAO design-system components (ported from the Claude Design system bundle "Tao", format 4). */
import React, { useEffect, useId, useRef, useState } from 'react'
import { Icon } from './Icon'
import { cx, pad } from '@/site/css'

export { Icon } from './Icon'
export { Logo } from './Logo'

type Any = Record<string, unknown>

/* ---------- Button ---------- */
export type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'ghost' | 'cta' | 'onBlue'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  iconRight?: string
  block?: boolean
  href?: string
  className?: string
  children?: React.ReactNode
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement> & React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & { type?: 'button' | 'submit' | 'reset' }

export function Button({ variant = 'primary', size = 'md', icon, iconRight, block, href, className, children, type, ...rest }: ButtonProps) {
  const cls = cx('tao-btn', 'tao-btn--' + variant, 'tao-btn--' + size, block && 'tao-btn--block', !children && 'tao-btn--icon-only', className)
  const kids = (
    <>
      {icon ? <Icon name={icon} size={20} /> : null}
      {children ? <span className="tao-btn__label">{children}</span> : null}
      {iconRight ? <Icon name={iconRight} size={20} /> : null}
    </>
  )
  if (href)
    return (
      <a className={cls} href={href} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {kids}
      </a>
    )
  return (
    <button type={type || 'button'} className={cls} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {kids}
    </button>
  )
}

/* ---------- Link ---------- */
export function Link({ variant = 'inline', tone = 'default', className, children, ...rest }: { variant?: 'inline' | 'standalone' | 'external'; tone?: 'default' | 'onBlue'; className?: string; children?: React.ReactNode } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const cls = cx('tao-link', 'tao-link--' + variant, tone === 'onBlue' && 'tao-link--on-blue', className)
  if (variant === 'standalone')
    return (
      <a className={cls} {...rest}>
        <span>{children}</span>
        <Icon name="arrow-right" size={20} />
      </a>
    )
  if (variant === 'external')
    return (
      <a className={cls} target="_blank" rel="noopener" {...rest}>
        <span>{children}</span>
        <Icon name="export-square" size={18} />
      </a>
    )
  return (
    <a className={cls} {...rest}>
      {children}
    </a>
  )
}

/* ---------- SectionMarker ---------- */
export function SectionMarker({ number, title, kicker, text, tone = 'default', size = 'md', variant, as, className }: { number: number | string; title?: React.ReactNode; kicker?: React.ReactNode; text?: React.ReactNode; tone?: 'default' | 'onBlue'; size?: 'sm' | 'md' | 'lg'; variant?: 'diagonal'; as?: 'h1' | 'h2' | 'h3'; className?: string }) {
  if (variant === 'diagonal') {
    return (
      <span className={cx('tao-diag', 'tao-diag--' + size, tone === 'onBlue' && 'tao-diag--on-blue', className)} aria-hidden="true">
        <svg viewBox="0 0 80 80" preserveAspectRatio="none">
          <line x1={0} y1={0} x2={80} y2={80} />
        </svg>
        {number != null ? <span className="tao-diag__num">{pad(number)}</span> : null}
      </span>
    )
  }
  const box = (
    <span className={cx('tao-marker', 'tao-marker--' + size, tone === 'onBlue' && 'tao-marker--on-blue', !title && className)} aria-hidden={title ? true : undefined}>
      {pad(number)}
    </span>
  )
  if (!title) return box
  const H = as || 'h2'
  return (
    <div className={cx('tao-section-head', tone === 'onBlue' && 'tao-section-head--on-blue', className)}>
      {box}
      <div className="tao-section-head__text">
        {kicker ? <p className="tao-kicker">{kicker}</p> : null}
        <H className="tao-h tao-h--h2">{title}</H>
        {text ? <p className="tao-section-head__lead">{text}</p> : null}
      </div>
    </div>
  )
}

/* ---------- LanguageSwitch ---------- */
export function LanguageSwitch({ options, value, defaultValue = 'ka', onChange, tone, showIcon, className, ariaLabel }: { options?: { value: string; label: string; lang: string }[]; value?: string; defaultValue?: string; onChange?: (v: string) => void; tone?: 'onBlue' | 'default'; showIcon?: boolean; className?: string; ariaLabel?: string }) {
  const opts = options || [
    { value: 'ka', label: 'ქარ', lang: 'ka' },
    { value: 'en', label: 'ENG', lang: 'en' },
  ]
  const [inner, setInner] = useState(defaultValue)
  const cur = value != null ? value : inner
  const pick = (v: string) => {
    if (value == null) setInner(v)
    onChange?.(v)
  }
  return (
    <div className={cx('tao-lang', tone === 'onBlue' && 'tao-lang--on-blue', className)} role="group" aria-label={ariaLabel || 'ენა / Language'}>
      {showIcon === false ? null : <Icon name="global" size={20} className="tao-lang__icon" />}
      {opts.map((o) => {
        const on = o.value === cur
        return (
          <button key={o.value} type="button" lang={o.lang} className={cx('tao-lang__opt', on && 'is-active')} aria-pressed={on} onClick={() => pick(o.value)}>
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

/* ---------- Cards and items ---------- */
export function NewsCard({ href = '#', image, imageAlt, category, date, dateTime, title, excerpt, className }: { href?: string; image?: string; imageAlt?: string; category?: string; date?: string; dateTime?: string; title: React.ReactNode; excerpt?: React.ReactNode; className?: string }) {
  return (
    <a className={cx('tao-card', 'tao-news', className)} href={href}>
      <div className="tao-card__media tao-news__media">{image ? <img src={image} alt={imageAlt || ''} /> : <Icon name="document-text" size={40} />}</div>
      <div className="tao-card__body">
        <p className="tao-news__meta">
          {category ? <span className="tao-kicker">{category}</span> : null}
          {date ? <time dateTime={dateTime}>{date}</time> : null}
        </p>
        <h3 className="tao-news__title">{title}</h3>
        {excerpt ? <p className="tao-card__text">{excerpt}</p> : null}
      </div>
    </a>
  )
}

export function BenefitItem({ icon = 'shield-tick', title, text, tone, className }: { icon?: string; title: React.ReactNode; text?: React.ReactNode; tone?: 'onBlue' | 'default'; className?: string }) {
  return (
    <div className={cx('tao-benefit', tone === 'onBlue' && 'tao-benefit--on-blue', className)}>
      <Icon name={icon} size={32} className="tao-benefit__icon" />
      <h3 className="tao-h tao-h--h4">{title}</h3>
      {text ? <p className="tao-benefit__text">{text}</p> : null}
    </div>
  )
}

export function DocumentRow({ title, fileType = 'PDF', size, date, href = '#', downloadLabel = 'ჩამოტვირთვა', className }: { title: string; fileType?: string; size?: string; date?: string; href?: string; downloadLabel?: string; className?: string }) {
  const meta = [fileType, size, date].filter(Boolean).join(' · ')
  return (
    <div className={cx('tao-doc', className)}>
      <span className="tao-doc__icon">
        <Icon name="document-text" size={24} />
      </span>
      <div className="tao-doc__text">
        <p className="tao-doc__title">{title}</p>
        <p className="tao-meta">{meta}</p>
      </div>
      <a className="tao-btn tao-btn--secondary tao-btn--sm tao-doc__dl" href={href} download="" aria-label={downloadLabel + ': ' + title}>
        <Icon name="document-download" size={20} />
        <span className="tao-btn__label">{downloadLabel}</span>
      </a>
    </div>
  )
}

/* ---------- Accordion ---------- */
export function Accordion({ items, defaultOpen, multiple, numbered = true, className }: { items: { question: React.ReactNode; answer: React.ReactNode }[]; defaultOpen?: number | number[]; multiple?: boolean; numbered?: boolean; className?: string }) {
  const [open, setOpen] = useState<number[]>(defaultOpen == null ? [] : ([] as number[]).concat(defaultOpen))
  const base = useId()
  const toggle = (i: number) => {
    const on = open.includes(i)
    setOpen(on ? open.filter((x) => x !== i) : multiple ? open.concat(i) : [i])
  }
  return (
    <div className={cx('tao-accordion', className)}>
      {items.map((it, i) => {
        const on = open.includes(i)
        const bid = base + '-b' + i
        const hid = base + '-h' + i
        return (
          <div key={i} className={cx('tao-accordion__item', on && 'is-open')}>
            {numbered ? (
              <span className="tao-accordion__num" aria-hidden="true">
                {pad(i + 1)}
              </span>
            ) : null}
            <h3 className="tao-accordion__q">
              <button type="button" id={hid} aria-expanded={on} aria-controls={bid} onClick={() => toggle(i)}>
                <span className="tao-accordion__qtext">{it.question}</span>
                <span className="tao-accordion__arrow">
                  <Icon name="arrow-down" size={24} />
                </span>
              </button>
            </h3>
            <div id={bid} role="region" aria-labelledby={hid} className="tao-accordion__a">
              <div>
                <div className="tao-accordion__inner">{it.answer}</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ---------- Pagination ---------- */
export function Pagination({ total = 1, page: pageProp, defaultPage = 1, siblings = 1, onChange, label = 'გვერდები', prevLabel = 'წინა გვერდი', nextLabel = 'შემდეგი გვერდი', className }: { total?: number; page?: number; defaultPage?: number; siblings?: number; onChange?: (n: number) => void; label?: string; prevLabel?: string; nextLabel?: string; className?: string }) {
  const [inner, setInner] = useState(defaultPage)
  const page = pageProp != null ? pageProp : inner
  const go = (n: number) => {
    if (n < 1 || n > total) return
    if (pageProp == null) setInner(n)
    onChange?.(n)
  }
  const pages: (number | '…')[] = []
  const lo = Math.max(2, page - siblings)
  const hi = Math.min(total - 1, page + siblings)
  pages.push(1)
  if (lo > 2) pages.push('…')
  for (let i = lo; i <= hi; i++) pages.push(i)
  if (hi < total - 1) pages.push('…')
  if (total > 1) pages.push(total)
  return (
    <nav className={cx('tao-pagination', className)} aria-label={label}>
      <button type="button" className="tao-pagination__cell" disabled={page <= 1} aria-label={prevLabel} onClick={() => go(page - 1)}>
        <Icon name="arrow-left-2" size={20} />
      </button>
      {pages.map((n, i) =>
        n === '…' ? (
          <span key={'e' + i} className="tao-pagination__gap" aria-hidden="true">
            …
          </span>
        ) : (
          <button key={n} type="button" className={cx('tao-pagination__cell', n === page && 'is-current')} aria-current={n === page ? 'page' : undefined} onClick={() => go(n)}>
            {pad(n)}
          </button>
        ),
      )}
      <button type="button" className="tao-pagination__cell" disabled={page >= total} aria-label={nextLabel} onClick={() => go(page + 1)}>
        <Icon name="arrow-right-2" size={20} />
      </button>
    </nav>
  )
}

/* ---------- Ticker ---------- */
export function Ticker({ items, tone = 'blue', reverse, duration = 40, className }: { items: string[]; tone?: 'blue' | 'black' | 'white'; reverse?: boolean; duration?: number; className?: string }) {
  const seq: React.ReactNode[] = []
  for (let r = 0; r < 2; r++)
    items.forEach((t, i) => {
      seq.push(
        <span key={r + '-t' + i} className="tao-ticker__item">
          {t}
        </span>,
      )
      seq.push(<img key={r + '-s' + i} className="tao-ticker__sep" src={tone === 'white' ? '/logo/symbol.svg' : '/logo/symbol-reversed.svg'} alt="" />)
    })
  return (
    <div className={cx('tao-ticker', 'tao-ticker--' + tone, reverse && 'tao-ticker--reverse', className)} role="marquee" aria-label={items.join(' · ')}>
      <div className="tao-ticker__track" style={{ animationDuration: duration + 's' }} aria-hidden="true">
        {seq}
      </div>
    </div>
  )
}

/* ---------- NumberedList ---------- */
export function NumberedList({ items, defaultActive = 0, scrollSpy = true, className }: { items: { title: React.ReactNode; text?: React.ReactNode; href?: string }[]; defaultActive?: number; scrollSpy?: boolean; className?: string }) {
  const [act, setAct] = useState(defaultActive)
  const refs = useRef<(HTMLLIElement | null)[]>([])
  useEffect(() => {
    if (!scrollSpy || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setAct(+(e.target.getAttribute('data-i') || 0))),
      { rootMargin: '-45% 0px -45% 0px' },
    )
    refs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [items.length, scrollSpy])
  return (
    <ol className={cx('tao-numlist', className)}>
      {items.map((it, i) => (
        <li key={i} data-i={i} ref={(el) => { refs.current[i] = el }} className={cx('tao-numlist__item', i === act && 'is-active')} onMouseEnter={() => setAct(i)}>
          <span className="tao-marker tao-marker--sm">{pad(i + 1)}</span>
          <div>
            <p className="tao-h tao-h--h1 tao-numlist__title">{it.href ? <a href={it.href} onFocus={() => setAct(i)}>{it.title}</a> : it.title}</p>
            {it.text ? <p className="tao-numlist__text">{it.text}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  )
}

export type { Any }
