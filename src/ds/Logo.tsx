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

export function Logo({ variant = 'auto', height = 36, href, alt, className }: { variant?: LogoVariant; height?: number; href?: string; alt?: string; className?: string }) {
  const a = alt == null ? 'ტაო დაზღვევა' : alt
  const st = { height: height + 'px' }
  const img =
    variant === 'auto' ? (
      <span className={['tao-logo-auto', className].filter(Boolean).join(' ')}>
        <img className="tao-logo tao-logo--on-light" src={SRC.primary} alt={a} style={st} />
        <img className="tao-logo tao-logo--on-dark" src={SRC.whitetext} alt={a} style={st} />
      </span>
    ) : (
      <img className={['tao-logo', className].filter(Boolean).join(' ')} src={SRC[variant] || SRC.primary} alt={a} style={st} />
    )
  return href ? (
    <a className="tao-logo-link" href={href} aria-label={alt || 'ტაო დაზღვევა'}>
      {img}
    </a>
  ) : (
    img
  )
}
