'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useSite } from './SiteProvider'
import { getAnimation, getLottie, type AnimationItem } from './lottie'

/* Any link to the TAO portal shows the small TAO loader for a moment, then hands over to the portal. */
export function PortalOverlay() {
  const { settings, t } = useSite()
  const [on, setOn] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const anim = useRef<AnimationItem | null>(null)

  useEffect(() => {
    const base = settings.portalUrl.replace(/\/+$/, '')
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as HTMLElement | null)?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!a) return
      const href = a.getAttribute('href') || ''
      const isPortal = a.hasAttribute('data-portal') || (base && href.startsWith(base))
      if (!isPortal) return
      e.preventDefault()
      setOn(true)
      window.setTimeout(() => {
        window.location.href = a.href
      }, 1400)
      window.setTimeout(() => setOn(false), 6000)
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [settings.portalUrl])

  useEffect(() => {
    if (!on) return
    let dead = false
    ;(async () => {
      try {
        const [lottie, d] = await Promise.all([getLottie(), getAnimation('/lottie/tao-loader-small.json')])
        if (dead || !box.current) return
        box.current.innerHTML = ''
        anim.current = lottie.loadAnimation({ container: box.current, renderer: 'svg', loop: true, autoplay: true, animationData: d, rendererSettings: { preserveAspectRatio: 'xMidYMid meet' } })
      } catch {}
    })()
    return () => {
      dead = true
      anim.current?.destroy()
      anim.current = null
    }
  }, [on])

  if (!on) return null
  return (
    <div role="status" aria-live="polite" style={{ position: 'fixed', inset: 0, zIndex: 2500, background: 'rgba(16, 16, 16, 0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: 'var(--surface)', borderRadius: 16, padding: '32px 40px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, minWidth: 260, boxSizing: 'border-box', textAlign: 'center' }}>
        <div ref={box} className="tao-small-lottie" aria-hidden="true" style={{ width: 72, height: 72 }} />
        <p className="tao-caps" style={{ margin: 0, fontSize: 13, fontWeight: 500, letterSpacing: '0.08em', color: 'var(--text)' }}>{t('პორტალზე გადამისამართება')}</p>
      </div>
    </div>
  )
}
