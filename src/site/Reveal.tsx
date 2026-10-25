'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useLoader } from './Loader'
import { reducedMotion } from './lottie'

/* Scroll reveal: elements with data-reveal get data-in once they enter the viewport (once, subtle).
   Starts after the first-visit loader has gone so the first reveals happen in view. */
export function Reveal() {
  const { phase } = useLoader()
  const pathname = usePathname()

  useEffect(() => {
    if (phase !== 'done') return
    const reduce = reducedMotion() || !('IntersectionObserver' in window)
    const io = reduce
      ? null
      : new IntersectionObserver(
          (entries) =>
            entries.forEach((en) => {
              if (en.isIntersecting) {
                en.target.setAttribute('data-in', '')
                io?.unobserve(en.target)
              }
            }),
          { threshold: 0.15 },
        )
    const seen = new WeakSet<Element>()
    const scan = () => {
      document.querySelectorAll('[data-reveal]:not([data-in])').forEach((el) => {
        if (seen.has(el)) return
        seen.add(el)
        if (!io) el.setAttribute('data-in', '')
        else io.observe(el)
      })
      // elements already on screen: show them now so the transition is visible
      const h = window.innerHeight || 800
      document.querySelectorAll('[data-reveal]:not([data-in])').forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.top < h * 0.88 && r.bottom > 0 && h < 2400) el.setAttribute('data-in', '')
      })
    }
    scan()
    const raf = requestAnimationFrame(scan)
    const mo = new MutationObserver(() => scan())
    mo.observe(document.body, { childList: true, subtree: true })
    const onScroll = () => scan()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      mo.disconnect()
      io?.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [phase, pathname])

  return null
}
