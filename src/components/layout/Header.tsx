import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router'
import { navLinks, site, whatsappLink } from '../../data/site'
import { MobileMenu } from './MobileMenu'
import { NavLink } from './NavLink'

export function Header() {
  const ref = useRef<HTMLElement>(null)
  const isHome = useLocation().pathname === '/'

  // data-scrolled: gives the header its background once you leave the top.
  // data-hidden: slides the header away while scrolling down, back when scrolling up.
  useEffect(() => {
    const header = ref.current!
    let lastY = scrollY
    let queued = false
    const update = () => {
      const y = scrollY
      header.dataset.scrolled = y > 8 ? 'true' : 'false'
      if (Math.abs(y - lastY) > 6) {
        header.dataset.hidden = y > lastY && y > 220 ? 'true' : 'false'
        lastY = y
      }
      queued = false
    }
    const onScroll = () => {
      if (!queued) {
        queued = true
        requestAnimationFrame(update)
      }
    }
    const onFocus = () => (header.dataset.hidden = 'false')
    update()
    addEventListener('scroll', onScroll, { passive: true })
    header.addEventListener('focusin', onFocus)
    return () => {
      removeEventListener('scroll', onScroll)
      header.removeEventListener('focusin', onFocus)
    }
  }, [])

  return (
    <header ref={ref} id="site-header" data-scrolled="false" data-hidden="false" data-home={isHome || undefined} className="tp-header fixed inset-x-0 top-0 z-50">
      <div className="tp-header__bar gutter">
        <Link className="tp-header__brand" aria-label={`${site.name} — home`} to="/">
          <img alt="" width={56} height={56} className="tp-header__logo" src="/brand/logo.png" />
          <span className="font-plush tp-header__name">TeddyPups</span>
        </Link>
        <nav aria-label="Main" className="tp-header__nav">
          <ul>
            <li>
              <NavLink href="/" label="Home" className="tp-nav-link" />
            </li>
            {navLinks.map((l) => (
              <li key={l.href}>
                <NavLink href={l.href} label={l.label} className="tp-nav-link" />
              </li>
            ))}
          </ul>
        </nav>
        <div className="tp-header__end">
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp tp-header__wa">
            WhatsApp us
          </a>
          <MobileMenu />
        </div>
      </div>
      {/* scalloped "hem" along the bottom edge */}
      <svg aria-hidden="true" className="tp-header__hem" width="100%" height="14" preserveAspectRatio="none">
        <defs>
          <pattern id="tp-hem" width="44" height="14" patternUnits="userSpaceOnUse">
            <path d="M0 0H44V2A22 11 0 0 1 0 2Z" className="tp-header__hem-fill" />
            <path d="M0 2A22 11 0 0 0 44 2" className="tp-header__hem-line" />
          </pattern>
        </defs>
        <rect width="100%" height="14" fill="url(#tp-hem)" />
      </svg>
    </header>
  )
}
