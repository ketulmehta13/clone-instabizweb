import type { CSSProperties } from 'react'
import { Link } from 'react-router'
import { Flight } from '../components/home/Flight'
import { Journeys } from '../components/how/Journeys'
import { PupBuddy } from '../components/pup/PupBuddy'
import { Scene } from '../components/Scene'
import { journeys } from '../data/journeys'
import { whatsappLink } from '../data/site'
import { usePageMeta } from '../lib/usePageMeta'

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

const HEART = (
  <>
    <path d="M32 54C16 43 8 34 8 24c0-7 5.4-12 12-12 5 0 9 3 12 7 3-4 7-7 12-7 6.6 0 12 5 12 12 0 10-8 19-24 30z" {...stroke} />
    <path d="M22 30h7l3-7 4 13 3-6h7" {...stroke} />
  </>
)
const PLANE = (
  <>
    <path d="M6 36l22-3 12-17h6l-6 17 12-1 6-7h3l-2 10 2 10h-3l-6-7-12-1 6 17h-6L28 37 6 36z" {...stroke} />
    <path d="M8 50c10 4 20 4 30 0" {...stroke} strokeDasharray="2 7" />
  </>
)
const CHAT = (
  <>
    <path d="M10 14h44v28H30l-12 10v-10h-8z" {...stroke} />
    <path d="M22 28h0M32 28h0M42 28h0" {...stroke} strokeWidth={5} />
  </>
)

const SECTIONS = [
  { href: '#two-ways', label: 'Two ways home' },
  { href: '#promise', label: 'Our premium puppy promise' },
  { href: '#delivery', label: 'Delivery & collection' },
  { href: '#why', label: 'Why choose us' },
]

const PROMISE = [
  { title: 'Hand-selected breeders', text: 'We work only with breeders who uphold the highest ethical and health standards.', ink: '#a24a1a', tilt: -8, shape: 'round', icon: HEART },
  { title: 'Full transparency', text: 'Photos, videos, and health certificates are shared before your puppy travels.', ink: '#1f6b45', tilt: 5, shape: 'ticket', icon: PLANE },
  {
    title: 'Safe, stress-free delivery',
    text: 'We handle every detail of the import process, so your puppy arrives happy, healthy, and ready to love you.',
    ink: '#5a3a28',
    tilt: -4,
    shape: 'oval',
    icon: CHAT,
  },
]

const DELIVERY = [
  { title: 'Take your puppy home the same day', text: 'Local puppies are available immediately — visit, fall in love, and go home together.' },
  { title: 'Delivery within Dubai', text: 'Prefer to stay home? We deliver your puppy to your door within Dubai, safely and comfortably.' },
  { title: 'Safe international cargo', text: 'We handle all the paperwork and ensure comfortable travel so your puppy arrives happy and stress-free.' },
  {
    title: 'Worldwide delivery',
    text: 'We safely deliver puppies to loving homes all around the world. Our trusted international cargo partners ensure your new furry friend travels comfortably and arrives safely, no matter the distance.',
  },
]

const WHY = [
  {
    title: 'International cargo',
    text: 'We safely deliver puppies to loving homes all around the world. Our trusted international cargo partners ensure your new furry friend travels comfortably and arrives safely, no matter the distance.',
    icon: PLANE,
  },
  {
    title: 'Support 24/7',
    text: "Our team is available 24/7 to answer your questions and assist you through every step of the adoption process. From choosing your puppy to post-delivery support — we're just a message away.",
    icon: CHAT,
  },
  {
    title: 'Health guarantee',
    text: 'All our puppies come with a verified health certificate from licensed vets. We ensure every puppy is vaccinated, dewormed, and thoroughly checked before joining your family.',
    icon: HEART,
  },
]

export default function HowItWorks() {
  usePageMeta(
    'How it works',
    'Meet a local puppy in our Downtown Dubai showroom or reserve a premium teacup breed imported for you — every step, from choosing to coming home.',
  )
  return (
    <div data-page="how" className="tp-page">
      <Scene tone={{ top: '#fffbf3', bottom: '#f6cc85' }} aria-labelledby="how-title">
        <div className="gutter mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
          <header className="grid gap-8 md:grid-cols-12 md:items-end">
            <h1 id="how-title" className="font-plush text-giant md:col-span-7">
              How it works
            </h1>
            <p className="text-lede text-[var(--ink-soft)] md:col-span-5 md:pb-4">
              Whether you choose to visit us locally or order a premium breed from overseas, TeddyPups is here to make the experience unforgettable.
            </p>
          </header>
          <nav aria-label="On this page" className="mt-10 flex flex-wrap gap-2">
            {SECTIONS.map((s, i) => (
              <a key={s.href} href={s.href} className="chip h-11 border-2 border-cocoa !bg-milk px-4 hover:!bg-honey-soft">
                <span className="font-plush text-toffee">{i + 1}</span>
                {s.label}
              </a>
            ))}
          </nav>
          <div id="two-ways">
            <Journeys journeys={journeys} />
          </div>
          <section id="promise" aria-labelledby="promise-title" className="tp-paper mt-24 -rotate-[0.6deg]">
            <p aria-hidden="true" className="font-scrawl text-lg text-toffee-ink">
              puppy passport
            </p>
            <h2 id="promise-title" className="font-plush text-huge mt-1 max-w-[16ch]">
              Our premium puppy promise
            </h2>
            <ul className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {PROMISE.map((p, i) => (
                <li key={p.title} className="tp-entry" style={{ '--ink-stamp': p.ink, '--tilt': `${p.tilt}deg`, '--i': i } as CSSProperties}>
                  <span className={`tp-stamp tp-stamp--${p.shape}`}>
                    <svg viewBox="0 0 64 64" className="tp-stamp__icon" aria-hidden="true">
                      {p.icon}
                    </svg>
                    <span className="tp-stamp__title font-plush">{p.title}</span>
                  </span>
                  <p className="tp-entry__text">{p.text}</p>
                </li>
              ))}
            </ul>
          </section>
          <section id="delivery" aria-labelledby="delivery-title" className="mt-24 grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <h2 id="delivery-title" className="font-plush text-huge">
                Delivery & collection
              </h2>
              <p className="text-lede mt-5 text-[var(--ink-soft)]">
                From a same-day visit in Downtown Dubai to a flight from Korea, every puppy travels comfortably and arrives safely.
              </p>
              <ul className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
                {DELIVERY.map((d) => (
                  <li key={d.title}>
                    <h3 className="font-plush-text text-[1.3rem] font-bold leading-snug">{d.title}</h3>
                    <p className="mt-1.5 text-[var(--ink-soft)]">{d.text}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-[clamp(14rem,30vw,22rem)] lg:col-span-6">
              <svg viewBox="0 0 300 120" className="absolute inset-x-0 bottom-0 w-full text-cocoa/25" aria-hidden="true">
                <path
                  d="M4 116h292M20 116V78h16v38M44 116V60h18v56M70 116V84h12v32M150 116V36l4-6v-14l3-4 3 4v14l4 6v80M118 116V70l12-8v54M174 116V64l14 8v44M200 116V82h18v34M226 116V56h14v60M248 116V88h22v28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <Flight label="A plane flying puppies from Korea to Dubai" />
            </div>
          </section>
          <section id="why" aria-labelledby="why-title" className="mt-24 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 id="why-title" className="font-plush text-huge">
                Why choose us
              </h2>
              <p className="text-lede mt-6 text-[var(--ink-soft)]">
                We're here to help you find a new family member. From the moment you visit our site to the joyful day your puppy arrives at your door, we're with you every
                step of the way. Our mission is to make the entire adoption process smooth, transparent, and full of love.
              </p>
            </div>
            <ul className="space-y-8 lg:col-span-6 lg:col-start-7">
              {WHY.map((w) => (
                <li key={w.title} className="flex gap-5">
                  <svg viewBox="0 0 64 64" className="size-14 shrink-0 text-toffee-deep" aria-hidden="true">
                    {w.icon}
                  </svg>
                  <div>
                    <h3 className="font-plush text-[1.7rem]">{w.title}</h3>
                    <p className="mt-2 text-[var(--ink-soft)]">{w.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="care-title" className="tp-board mt-24 grid items-center gap-8 md:grid-cols-[1fr_auto] md:!p-12">
            <div>
              <h2 id="care-title" className="font-plush text-big">
                Unique and high quality puppies
              </h2>
              <p className="text-lede measure mt-5 text-cocoa-soft">
                When you choose TeddyPups, you can trust that you're getting a puppy of the highest quality. We also provide guidance and support to new pet owners,
                offering advice on training, nutrition, and general care to ensure a smooth transition for you and your new furry friend.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                  Ask us on WhatsApp
                </a>
                <Link className="btn btn-ghost" to="/puppies">
                  See available puppies
                </Link>
              </div>
            </div>
            <PupBuddy pose="bow" facing="left" className="mx-auto w-48 md:w-56" label="Teddy, ready to play" />
          </section>
        </div>
      </Scene>
    </div>
  )
}
