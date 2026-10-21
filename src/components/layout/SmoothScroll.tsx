import Lenis from 'lenis'
import { useEffect } from 'react'
import { onFrame, prefersReducedMotion, useReducedMotion } from '../../lib/motion'

let lenis: Lenis | null = null

/**
 * Smooth wheel scrolling (mouse and trackpad only; touch scrolling stays native),
 * and smooth jumps for same-page #section links.
 */
export function SmoothScroll() {
  const reduced = useReducedMotion()

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // e.detail === 0: keyboard "click", let the browser move focus normally
      if (e.defaultPrevented || e.detail === 0 || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest?.<HTMLAnchorElement>("a[href*='#']")
      if (!a || (a.target && a.target !== '_self')) return
      const url = new URL(a.href, location.href)
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || url.hash.length < 2) return
      const id = decodeURIComponent(url.hash.slice(1))
      const target = [...document.querySelectorAll<HTMLElement>(`[id="${CSS.escape(id)}"]`)].find((el) => el.getClientRects().length)
      if (!target) return
      e.preventDefault()
      if (lenis) lenis.scrollTo(target)
      else target.scrollIntoView({ behavior: prefersReducedMotion() ? 'instant' : 'smooth' })
      history.pushState(history.state, '', url.hash)
    }
    addEventListener('click', onClick)
    return () => removeEventListener('click', onClick)
  }, [])

  useEffect(() => {
    if (reduced || !matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const html = document.documentElement
    const instance = new Lenis({
      autoRaf: false,
      lerp: 0.1,
      wheelMultiplier: 0.85,
      prevent: (node) => !!node.closest?.('dialog, [data-lenis-prevent]'),
      // pause while something (the curtain, a dialog) has locked page scrolling
      virtualScroll: () => getComputedStyle(html).overflowY !== 'hidden',
    })
    lenis = instance
    // on a page change, stop any glide that's still going
    // (popstate in the capture phase: before the router renders the page and restores its scroll)
    const halt = () => instance.scrollTo(instance.actualScroll, { immediate: true })
    addEventListener('tp:navigate', halt)
    addEventListener('popstate', halt, true)
    const stop = onFrame((now) => instance.raf(now))
    return () => {
      stop()
      removeEventListener('tp:navigate', halt)
      removeEventListener('popstate', halt, true)
      instance.destroy()
      lenis = null
    }
  }, [reduced])

  return null
}
