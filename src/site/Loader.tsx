'use client'
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { getAnimation, getLottie, reducedMotion, type AnimationItem } from './lottie'
import { css } from './css'

/* First-visit loader: TAO blue screen, the white handwritten ტ (Lottie, played once), then the screen
   slides up and the page rises in. Shown once per browser session; skipped with reduced motion. */

type Phase = 'play' | 'leave' | 'done'
const LoaderCtx = createContext<{ phase: Phase; replay: () => void }>({ phase: 'done', replay: () => {} })
export const useLoader = () => useContext(LoaderCtx)

const KEY = 'tao-loader-seen'

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>('done')
  const [mobile, setMobile] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const anim = useRef<AnimationItem | null>(null)
  const timer = useRef<number>(0)

  const finish = useCallback(() => {
    setPhase('leave')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setPhase('done')
      anim.current?.destroy()
      anim.current = null
    }, 470)
  }, [])

  const start = useCallback(() => {
    if (reducedMotion()) return
    setMobile(window.innerWidth < 600)
    setPhase('play')
  }, [])

  useEffect(() => {
    let seen = true
    try {
      seen = sessionStorage.getItem(KEY) === '1'
      sessionStorage.setItem(KEY, '1')
    } catch {}
    if (!seen) start()
  }, [start])

  useEffect(() => {
    if (phase !== 'play') return
    let dead = false
    const hard = window.setTimeout(finish, 6000)
    ;(async () => {
      try {
        const [lottie, d] = await Promise.all([getLottie(), getAnimation('/lottie/tao-loader-symbol.json')])
        if (dead || !box.current) return
        box.current.innerHTML = ''
        anim.current = lottie.loadAnimation({
          container: box.current,
          renderer: 'svg',
          loop: false,
          autoplay: true,
          animationData: d,
          rendererSettings: { preserveAspectRatio: window.innerWidth < 600 ? 'xMidYMid meet' : 'xMidYMid slice' },
        })
        anim.current.addEventListener('complete', finish)
      } catch {
        finish()
      }
    })()
    return () => {
      dead = true
      window.clearTimeout(hard)
    }
  }, [phase, finish])

  return (
    <LoaderCtx.Provider value={{ phase, replay: start }}>
      {phase !== 'done' ? (
        <div aria-hidden="true" style={css`position: fixed; inset: 0; z-index: 2000; background: #283DEE; overflow: hidden; ${phase === 'leave' ? 'transform: translateY(-100%); transition: transform 450ms cubic-bezier(0.8, 0, 0.5, 1);' : 'transform: translateY(0);'}`}>
          <div ref={box} className="tao-big-lottie" style={css`${mobile ? 'position: absolute; top: 0; bottom: 0; left: 50%; width: 140vw; transform: translateX(-50%);' : 'position: absolute; inset: 0;'}`} />
        </div>
      ) : null}
      {children}
    </LoaderCtx.Provider>
  )
}

/** Inline style for the page wrapper while the loader runs (content rises in as the screen leaves). */
export function pageEnterStyle(phase: Phase): React.CSSProperties {
  if (phase === 'play') return css`opacity: 0; transform: translateY(20px);`
  if (phase === 'leave') return css`opacity: 1; transform: translateY(0); transition: opacity 450ms ease-out, transform 450ms cubic-bezier(0.8, 0, 0.5, 1);`
  return {}
}
