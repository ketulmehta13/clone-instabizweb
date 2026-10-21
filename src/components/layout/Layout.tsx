import { useEffect, useLayoutEffect, useRef } from 'react'
import { Outlet, useLocation, useNavigationType } from 'react-router'
import { Footer } from './Footer'
import { Header } from './Header'
import { PawTrailCanvas } from './PawTrailCanvas'
import { RouteCurtain } from './RouteCurtain'
import { SmoothScroll } from './SmoothScroll'
import { WhatsAppBar } from './WhatsAppBar'

/** scroll position of each history entry, so Back returns you to where you were */
const positions = new Map<string, number>()

/** The frame around every page: header on top, footer at the bottom */
export function Layout() {
  const { pathname, hash, key } = useLocation()
  const navigation = useNavigationType()
  const entry = useRef(key)

  useEffect(() => {
    history.scrollRestoration = 'manual'
    const save = () => positions.set(entry.current, scrollY)
    addEventListener('scroll', save, { passive: true })
    return () => removeEventListener('scroll', save)
  }, [])

  // layout effects run before the browser can fire a scroll event for the new page
  useLayoutEffect(() => {
    entry.current = key
  }, [key])

  // new page: start at the top (or at the #section the link points to); back/forward: where you left it
  useLayoutEffect(() => {
    const saved = navigation === 'POP' ? positions.get(entry.current) : undefined
    if (saved !== undefined) {
      // wait two frames: sections like the pinned "meet the pups" row finish sizing themselves first
      let raf = requestAnimationFrame(() => (raf = requestAnimationFrame(() => scrollTo({ top: saved, behavior: 'instant' }))))
      return () => cancelAnimationFrame(raf)
    }
    if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView()
    else scrollTo({ top: 0, behavior: 'instant' })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on a page change, not on ?filter changes
  }, [pathname, hash])

  return (
    <>
      <SmoothScroll />
      <RouteCurtain />
      <a href="#main" className="sr-only-focusable fixed left-4 top-4 z-[100] rounded-full bg-cocoa px-5 py-3 font-semibold text-milk">
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="relative pt-[var(--header-h)] outline-none">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppBar />
      <PawTrailCanvas />
    </>
  )
}
