import { Link } from 'react-router'
import { PupBuddy } from '../components/pup/PupBuddy'
import { usePageMeta } from '../lib/usePageMeta'

const tabs = [
  { href: '/', label: 'Home' },
  { href: '/puppies', label: 'Puppies' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/faq', label: 'Questions' },
  { href: '/contact', label: 'Contact' },
]

/** A "lost dog" poster for addresses that don't exist */
export default function NotFound() {
  usePageMeta('Page not found')
  return (
    <div className="gutter mx-auto grid min-h-[78vh] max-w-[110rem] place-items-center py-14">
      <div className="tp-poster">
        <span aria-hidden="true" className="tp-tape tp-tape--left" />
        <span aria-hidden="true" className="tp-tape tp-tape--right" />
        <p className="font-scrawl tp-poster__kicker">have you seen this page?</p>
        <h1 className="font-plush tp-poster__title">
          Lost<span className="sr-only">: this page has wandered off</span>
        </h1>
        <div className="tp-poster__photo">
          <PupBuddy pose="sniff" facing="right" label="Teddy, sniffing out the missing page" />
        </div>
        <p className="tp-poster__desc">
          One page, last seen wandering off. It answers to the address you typed, but it isn't here any more. Teddy is on the case.
        </p>
        <p className="font-scrawl tp-poster__reward">if found, take a tab:</p>
        <ul className="tp-poster__tabs" aria-label="Pages that are here">
          {tabs.map((t) => (
            <li key={t.href}>
              <Link to={t.href} className="tp-poster__tab">
                {t.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
