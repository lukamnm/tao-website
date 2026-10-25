import React, { createElement } from 'react'
import { ICONS, type IconName } from './icons'

export type IconProps = {
  name: IconName | string
  size?: number
  className?: string
  title?: string
  style?: React.CSSProperties
}

/** Iconsax Linear icon, 1.5px stroke, currentColor. */
export function Icon({ name, size = 24, className, title, style }: IconProps) {
  const def = ICONS[name as IconName]
  if (!def) return null
  return (
    <svg
      className={['tao-icon', className].filter(Boolean).join(' ')}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      focusable="false"
      style={style}
    >
      {title ? <title>{title}</title> : null}
      {def.map((el, i) => createElement(el[0], { key: i, ...el[1] }))}
    </svg>
  )
}
