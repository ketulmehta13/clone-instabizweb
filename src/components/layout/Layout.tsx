import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import { Footer } from './Footer'
import { Header } from './Header'
import { WhatsAppBar } from './WhatsAppBar'

/** The frame around every page: header on top, footer at the bottom */
export function Layout() {
  const { pathname, hash } = useLocation()

  // new page: start at the top (or at the #section the link points to)
  useEffect(() => {
    if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView()
    else scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])

  return (
    <>
      <a href="#main" className="sr-only-focusable fixed left-4 top-4 z-[100] rounded-full bg-cocoa px-5 py-3 font-semibold text-milk">
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="relative pt-[var(--header-h)] outline-none">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppBar />
    </>
  )
}
