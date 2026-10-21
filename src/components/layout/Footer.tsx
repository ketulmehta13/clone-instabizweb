import { Link } from 'react-router'
import { site, whatsappLink } from '../../data/site'
import { PupStop } from '../pup/PupStop'
import { Twinkles } from '../Twinkles'
import type { Star } from '../Twinkles'

const STARS: Star[] = [
  [6, 18, 18], [14, 42, 12], [23, 12, 14], [31, 30, 10], [44, 9, 16], [52, 36, 11], [63, 15, 15], [71, 40, 10], [92, 33, 12],
]

const YEAR = new Date().getFullYear()

const explore = [
  { href: '/puppies', label: 'Available puppies' },
  { href: '/gone-home', label: 'Gone home' },
  { href: '/happy-families', label: 'Happy families' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/how-it-works#delivery', label: 'Delivery & collection' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Visit & contact' },
]

export function Footer() {
  return (
    <footer className="tp-footer relative pb-[calc(var(--bar-h)+2rem)] text-milk md:pb-10">
      <svg aria-hidden="true" viewBox="0 0 1440 80" preserveAspectRatio="none" className="tp-footer__hill">
        <path d="M0 80V44c120-30 240-44 360-30s240 46 360 34 240-58 360-46 240 40 360 26v52z" />
      </svg>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-6 h-64 overflow-hidden">
        <Twinkles stars={STARS} scale={0.7} />
        <span className="tp-moon" />
      </div>
      <div className="gutter relative mx-auto grid max-w-[110rem] gap-12 pt-20 md:grid-cols-12 md:gap-x-12 md:gap-y-6 md:pt-28">
        <div className="md:col-span-5">
          <p className="font-plush text-big text-honey-soft">Home, at last.</p>
          <p className="mt-5 max-w-md text-milk/80">{site.about}</p>
        </div>
        <div className="order-last md:order-none md:col-span-5 md:col-start-1 md:row-start-2">
          {/* Teddy's basket: the last stop of his walk down the page */}
          <div className="tp-basket">
            <svg aria-hidden="true" viewBox="0 0 300 240" className="tp-basket__back">
              <ellipse cx="212" cy="145" rx="96" ry="12" className="tp-basket__hollow" />
              <path d="M116 145 A96 12 0 0 1 308 145" className="tp-basket__rim-line" />
              <path d="M116 145 A96 12 0 0 1 308 145" className="tp-basket__rim" />
            </svg>
            <PupStop pose="snug" act="basket" behind lane className="tp-basket__pup" label="Teddy, sitting snug in his basket" />
            <svg aria-hidden="true" viewBox="0 0 300 240" className="tp-basket__front">
              <path d="M116 145 C118 180 126 214 138 232 L286 232 C298 214 306 180 308 145 A96 12 0 0 1 116 145 Z" className="tp-basket__body" />
              <path d="M121 178 Q212 197 303 178 M127 206 Q212 223 297 206" className="tp-basket__weave" />
              <path d="M150 164 L158 230 M182 168 L185 232 M212 169 V232 M242 168 L239 232 M274 164 L266 230" className="tp-basket__weave tp-basket__weave--stakes" />
              <path d="M116 145 A96 12 0 0 0 308 145" className="tp-basket__rim-line" />
              <path d="M116 145 A96 12 0 0 0 308 145" className="tp-basket__rim" />
            </svg>
          </div>
        </div>
        <nav aria-label="Footer" className="md:col-span-3 md:col-start-7 md:row-span-2 md:row-start-1">
          <h2 className="font-scrawl text-lg text-honey">Explore</h2>
          <ul className="mt-4 space-y-2.5">
            {explore.map((l) => (
              <li key={l.href}>
                <Link className="font-semibold text-milk/90 underline-offset-4 hover:text-honey hover:underline" to={l.href}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-3 md:row-span-2 md:row-start-1">
          <h2 className="font-scrawl text-lg text-honey">Say hello</h2>
          <ul className="mt-4 space-y-2.5 text-milk/90">
            <li>
              <a className="font-semibold hover:text-honey" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                WhatsApp {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a className="break-all hover:text-honey" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </li>
            <li>{site.address}</li>
          </ul>
          <ul className="mt-6 flex flex-wrap gap-3" aria-label="Social media">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center rounded-full border-2 border-milk/30 px-4 text-sm font-semibold hover:border-honey hover:text-honey"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="gutter relative mx-auto mt-16 flex max-w-[110rem] flex-col items-start justify-between gap-4 border-t border-milk/15 pt-6 text-sm text-milk/60 md:flex-row md:items-center">
        <span className="flex items-center gap-3">
          <img alt="" loading="lazy" width={36} height={36} className="size-9" src="/brand/logo.png" />© {YEAR} {site.name}
        </span>
        <span className="font-scrawl text-base text-honey/80">{site.tagline}</span>
      </div>
    </footer>
  )
}
