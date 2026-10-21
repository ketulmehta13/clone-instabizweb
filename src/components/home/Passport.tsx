import type { CSSProperties, ReactNode } from 'react'
import { PupStop } from '../pup/PupStop'
import { Scene } from '../Scene'

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

const ENTRIES: { title: string; text: string; ink: string; tilt: number; shape: string; icon: ReactNode }[] = [
  {
    title: 'Vet-checked & healthy',
    text: 'Every puppy comes vaccinated, dewormed, and with a verified health certificate.',
    ink: '#a24a1a',
    tilt: -8,
    shape: 'round',
    icon: (
      <>
        <path d="M32 54C16 43 8 34 8 24c0-7 5.4-12 12-12 5 0 9 3 12 7 3-4 7-7 12-7 6.6 0 12 5 12 12 0 10-8 19-24 30z" {...stroke} />
        <path d="M22 30h7l3-7 4 13 3-6h7" {...stroke} />
      </>
    ),
  },
  {
    title: 'Korea to Dubai, safely',
    text: 'Trusted breeders, safe travel, and premium care from start to finish.',
    ink: '#1f6b45',
    tilt: 5,
    shape: 'ticket',
    icon: (
      <>
        <path d="M6 36l22-3 12-17h6l-6 17 12-1 6-7h3l-2 10 2 10h-3l-6-7-12-1 6 17h-6L28 37 6 36z" {...stroke} />
        <path d="M8 50c10 4 20 4 30 0" {...stroke} strokeDasharray="2 7" />
      </>
    ),
  },
  {
    title: 'Support 24/7',
    text: 'Always here to help, from choosing your puppy to post-delivery support.',
    ink: '#5a3a28',
    tilt: -4,
    shape: 'oval',
    icon: (
      <>
        <path d="M10 14h44v28H30l-12 10v-10h-8z" {...stroke} />
        <path d="M22 28h0M32 28h0M42 28h0" {...stroke} strokeWidth={5} />
      </>
    ),
  },
  {
    title: 'Trusted by families worldwide',
    text: 'Puppies delivered to loving homes all around the world.',
    ink: '#c2622b',
    tilt: 7,
    shape: 'scallop',
    icon: (
      <>
        <circle cx="32" cy="32" r="22" {...stroke} />
        <path d="M10 32h44M32 10c-8 8-8 36 0 44M32 10c8 8 8 36 0 44" {...stroke} />
      </>
    ),
  },
]

/** "Why families trust TeddyPups" as an open puppy passport full of stamps */
export function Passport() {
  return (
    <Scene tone={{ top: '#f0b866', bottom: '#a65a30', sunset: true }} className="tp-passport" aria-labelledby="trust-title">
      <div className="gutter mx-auto max-w-[96rem]">
        <div className="tp-book">
          <div className="tp-book__page tp-book__page--left">
            <p aria-hidden="true" className="tp-book__kicker font-scrawl">
              puppy passport
            </p>
            <h2 id="trust-title" className="font-plush tp-book__title">
              Why families trust TeddyPups
            </h2>
            <PupStop pose="sit" className="tp-book__teddy" />
          </div>
          <ul className="tp-book__page tp-book__page--right">
            {ENTRIES.map((e, i) => (
              <li key={e.title} className="tp-entry" style={{ '--ink-stamp': e.ink, '--tilt': `${e.tilt}deg`, '--i': i } as CSSProperties}>
                <span className={`tp-stamp tp-stamp--${e.shape}`}>
                  <svg viewBox="0 0 64 64" className="tp-stamp__icon" aria-hidden="true">
                    {e.icon}
                  </svg>
                  <span className="tp-stamp__title font-plush">{e.title}</span>
                </span>
                <p className="tp-entry__text">{e.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Scene>
  )
}
