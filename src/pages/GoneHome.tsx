import type { CSSProperties } from 'react'
import { Link } from 'react-router'
import { Img } from '../components/Img'
import { PupBuddy } from '../components/pup/PupBuddy'
import { RevealScope } from '../components/RevealScope'
import { gonePuppies } from '../data/puppies'
import { usePageMeta } from '../lib/usePageMeta'

const TILTS = [-1.4, 1.1, -0.6, 1.6, -1.1, 0.8]

/** Puppies who've found families, each shown as a "one ticket home" stub */
export default function GoneHome() {
  usePageMeta('Gone home', 'TeddyPups puppies who have already joined their families.')
  return (
    <div data-page="gone" className="tp-page">
      <div className="gutter mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
        <header className="tp-boothhead">
          <div className="max-w-3xl">
            <h1 className="font-plush text-giant">
              Gone home
              <svg viewBox="0 0 48 44" className="ml-3 inline-block w-[0.45em] -translate-y-[0.15em] text-toffee" aria-hidden="true">
                <path
                  d="M24 40C10 30 4 22 4 14.5 4 8.7 8.6 4 14.3 4c4.1 0 7.6 2.4 9.7 6 2.1-3.6 5.6-6 9.7-6C39.4 4 44 8.7 44 14.5 44 22 38 30 24 40z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </h1>
            <p className="text-lede mt-6 text-cocoa-soft">
              Every puppy here has already joined a loving family. Looking for one just like them? Tell us — we'll help you find your match.
            </p>
            <Link className="btn btn-primary mt-8" to="/puppies">
              See available puppies
            </Link>
          </div>
          <div aria-hidden="true" className="tp-booth">
            <PupBuddy pose="peek" className="tp-booth__teddy" />
            <div className="tp-booth__counter">
              <span className="font-plush">tickets home</span>
            </div>
          </div>
        </header>
        <RevealScope>
          <ul className="tp-tickets" aria-label="Puppies who have gone home">
            {gonePuppies.map((p, i) => (
              <li key={p.id} className="tp-ticket" data-reveal="" style={{ '--tilt': `${TILTS[i % TILTS.length]}deg`, '--i': i % TILTS.length } as CSSProperties}>
                <Link className="tp-ticket__link" to={`/puppies/${p.slug}`}>
                  <span className="tp-ticket__main">
                    <span className="tp-ticket__photo">{p.cover && <Img media={p.cover} />}</span>
                    <span className="tp-ticket__body">
                      <span className="font-scrawl tp-ticket__kicker">one ticket home</span>
                      <span className="font-plush tp-ticket__name">{p.displayName}</span>
                      <span className="tp-ticket__meta">{p.name ? `${p.breed}, ${p.genderLabel.toLowerCase()}` : p.genderLabel}</span>
                      <span className="tp-ticket__route">
                        <span>{p.origin === 'local' ? 'Dubai showroom' : 'TeddyPups'}</span>
                        <svg viewBox="0 0 60 12" aria-hidden="true">
                          <path d="M2 6h46" />
                          <path d="M44 2l6 4-6 4" />
                        </svg>
                        <span>home ♥</span>
                      </span>
                    </span>
                  </span>
                  <span aria-hidden="true" className="tp-ticket__stub">
                    <span className="font-plush">admit one</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </RevealScope>
      </div>
    </div>
  )
}
