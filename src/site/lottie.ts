'use client'
import type { AnimationItem, LottiePlayer } from 'lottie-web'

let player: Promise<LottiePlayer> | null = null
const data = new Map<string, Promise<unknown>>()

/** lottie-web (SVG renderer), loaded on first use. */
export function getLottie(): Promise<LottiePlayer> {
  if (!player) player = import('lottie-web/build/player/lottie_svg').then((m) => (m.default || m) as unknown as LottiePlayer)
  return player
}

/** Animation JSON, fetched once per path. A fresh copy is returned every time (lottie mutates it). */
export async function getAnimation(path: string): Promise<unknown> {
  if (!data.has(path)) data.set(path, fetch(path).then((r) => r.json()))
  const d = await data.get(path)
  return JSON.parse(JSON.stringify(d))
}

export const reducedMotion = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const noHover = () => typeof window !== 'undefined' && !!window.matchMedia && (window.matchMedia('(hover: none)').matches || window.matchMedia('(pointer: coarse)').matches)

export type { AnimationItem }
