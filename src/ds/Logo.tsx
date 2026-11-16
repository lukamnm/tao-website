import React from 'react'

export type LogoVariant = 'auto' | 'primary' | 'reversed' | 'whitetext' | 'white' | 'black' | 'stacked' | 'symbol' | 'symbol-reversed'

const SRC: Record<Exclude<LogoVariant, 'auto'>, string> = {
  primary: '/logo/primary.svg',
  reversed: '/logo/reversed.svg',
  whitetext: '/logo/whitetext.svg',
  white: '/logo/white.svg',
  black: '/logo/black.svg',
  stacked: '/logo/stacked.svg',
  symbol: '/logo/symbol.svg',
  'symbol-reversed': '/logo/symbol-reversed.svg',
}
// English logo files (same layout, "TAO INSURANCE" lettering); the symbol has no text, so it is shared
const SRC_EN: Partial<Record<Exclude<LogoVariant, 'auto'>, string>> = {
  primary: '/logo/primary-en.svg',
  reversed: '/logo/reversed-en.svg',
  whitetext: '/logo/whitetext-en.svg',
  white: '/logo/white-en.svg',
  black: '/logo/black-en.svg',
  stacked: '/logo/stacked-en.svg',
}

export function Logo({ variant = 'auto', height = 36, href, alt, className, lang = 'ka' }: { variant?: LogoVariant; height?: number; href?: string; alt?: string; className?: string; lang?: 'ka' | 'en' }) {
  const src = (v: Exclude<LogoVariant, 'auto'>) => (lang === 'en' && SRC_EN[v]) || SRC[v] || SRC.primary
  const name = lang === 'en' ? 'TAO Insurance' : 'ტაო დაზღვევა'
  const a = alt == null ? name : alt
  const st = { height: height + 'px' }
  const img =
    variant === 'auto' ? (
      <span className={['tao-logo-auto', className].filter(Boolean).join(' ')}>
        <img className="tao-logo tao-logo--on-light" src={src('primary')} alt={a} style={st} />
        <img className="tao-logo tao-logo--on-dark" src={src('whitetext')} alt={a} style={st} />
      </span>
    ) : (
      <img className={['tao-logo', className].filter(Boolean).join(' ')} src={src(variant)} alt={a} style={st} />
    )
  return href ? (
    <a className="tao-logo-link" href={href} aria-label={alt || name}>
      {img}
    </a>
  ) : (
    img
  )
}
