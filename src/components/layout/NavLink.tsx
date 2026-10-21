import { Link, useLocation } from 'react-router'
import { Paw } from '../Paw'

/** A menu link; the current page gets a paw underneath it */
export function NavLink({ href, label, className, onNavigate }: { href: string; label: string; className?: string; onNavigate?: () => void }) {
  const { pathname } = useLocation()
  const active = href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)
  return (
    <Link to={href} aria-current={active ? 'page' : undefined} data-active={active} className={className} onClick={onNavigate}>
      <span>{label}</span>
      <Paw className="tp-nav-link__paw" />
    </Link>
  )
}
