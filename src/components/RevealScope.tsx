import { useEffect, useRef } from 'react'
import type { HTMLAttributes } from 'react'
import { prefersReducedMotion } from '../lib/motion'
import { curtainDown } from './layout/curtainState'

const PENDING = '[data-reveal]:not([data-revealed])'

/**
 * Gently fades/slides in every child marked `data-reveal` as it scrolls into view
 * (the CSS for `[data-reveal]` does the animating). Items already on screen
 * appear straight away; with reduced motion everything is simply shown.
 */
export function RevealScope({ children, className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const show = (el: HTMLElement) => (el.dataset.revealed = 'true')

    if (prefersReducedMotion()) {
      const all = () => root.querySelectorAll<HTMLElement>(PENDING).forEach(show)
      all()
      const mo = new MutationObserver(all)
      mo.observe(root, { childList: true, subtree: true })
      return () => mo.disconnect()
    }

    // items that came into view while the page-change curtain was still down
    const waiting = new Set<HTMLElement>()
    const reveal = (el: HTMLElement) => {
      show(el)
      io.unobserve(el)
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const el = e.target as HTMLElement
          if (curtainDown()) waiting.add(el)
          else reveal(el)
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.08 },
    )
    const arm = (el: HTMLElement) => {
      if (el.dataset.armed) return io.observe(el)
      const r = el.getBoundingClientRect()
      if (r.top < innerHeight && r.bottom > 0 && !curtainDown()) {
        show(el)
        return
      }
      el.dataset.armed = 'true'
      io.observe(el)
    }
    root.querySelectorAll<HTMLElement>(PENDING).forEach(arm)
    const mo = new MutationObserver(() => root.querySelectorAll<HTMLElement>(PENDING).forEach(arm))
    mo.observe(root, { childList: true, subtree: true })

    const flush = () => {
      waiting.forEach(reveal)
      waiting.clear()
    }
    addEventListener('tp:arrived', flush)
    let timer = 0
    const check = () => (curtainDown() ? (timer = window.setTimeout(check, 400)) : flush())
    timer = window.setTimeout(check, 1600)
    return () => {
      clearTimeout(timer)
      io.disconnect()
      mo.disconnect()
      removeEventListener('tp:arrived', flush)
    }
  }, [])

  return (
    <div ref={ref} className={className} {...rest}>
      {children}
    </div>
  )
}
