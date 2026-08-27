'use client'
/* Reference-DNA motion (hellogrowth ScrollReveal pattern): IO staggered reveals + counter
 * ticks, zero libraries, gated behind js-on so no-JS renders everything visible. */
import { useEffect } from 'react'

export default function Reveal() {
  useEffect(() => {
    const root = document.documentElement
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    root.classList.add('js-on')
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        const el = e.target as HTMLElement
        el.classList.add('is-in')
        io.unobserve(el)
        const n = el.querySelectorAll<HTMLElement>('[data-count]')
        n.forEach((c) => {
          const raw = c.dataset.count ?? c.textContent ?? ''
          const m = raw.match(/([\d,.]+)/)
          if (!m) return
          const target = parseFloat(m[1].replace(/,/g, ''))
          const pre = raw.slice(0, m.index), post = raw.slice((m.index ?? 0) + m[1].length)
          const t0 = performance.now()
          const tick = (t: number) => {
            const p = Math.min(1, (t - t0) / 700)
            const v = Math.round(target * (1 - Math.pow(1 - p, 3)))
            c.textContent = `${pre}${v.toLocaleString('en-IN')}${post}`
            if (p < 1) requestAnimationFrame(tick)
            else c.textContent = raw
          }
          requestAnimationFrame(tick)
        })
      }
    }, { rootMargin: '600px 0px 600px 0px', threshold: 0.01 })
    document.querySelectorAll('[data-reveal]').forEach((el, i) => {
      ;(el as HTMLElement).style.transitionDelay = `${Math.min(i % 6, 4) * 70}ms`
      io.observe(el)
    })
    return () => io.disconnect()
  }, [])
  return null
}
