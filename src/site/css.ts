import type { CSSProperties } from 'react'

const cache = new Map<string, CSSProperties>()

const camel = (k: string) => {
  if (k.startsWith('--')) return k
  return k.replace(/-([a-z])/g, (_, c) => c.toUpperCase()).replace(/^(webkit|moz|ms)/, (m) => (m === 'ms' ? 'ms' : m[0].toUpperCase() + m.slice(1)))
}

/** Inline CSS declaration string to a React style object: css`display: flex; gap: ${gap}px`. */
export function css(strings: TemplateStringsArray | string, ...values: unknown[]): CSSProperties {
  const str = typeof strings === 'string' ? strings : strings.reduce((acc, s, i) => acc + s + (i < values.length ? String(values[i] ?? '') : ''), '')
  const hit = cache.get(str)
  if (hit) return hit
  const out: Record<string, string> = {}
  for (const decl of str.split(';')) {
    const i = decl.indexOf(':')
    if (i < 0) continue
    const k = decl.slice(0, i).trim()
    const v = decl.slice(i + 1).trim()
    if (!k || !v) continue
    out[camel(k)] = v
  }
  if (cache.size > 5000) cache.clear()
  cache.set(str, out as CSSProperties)
  return out as CSSProperties
}

export const cx = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(' ')
export const pad = (n: number | string) => String(n).padStart(2, '0')
