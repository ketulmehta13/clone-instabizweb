import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { PupBuddy } from '../components/pup/PupBuddy'
import { PuppyCard } from '../components/PuppyCard'
import { RevealScope } from '../components/RevealScope'
import { breeds, gonePuppies, puppies } from '../data/puppies'
import { whatsappLink } from '../data/site'
import { usePageMeta } from '../lib/usePageMeta'

const FILTERS = ['origin', 'breed', 'gender', 'collection'] as const
type Filter = (typeof FILTERS)[number]

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className="tp-sticker-chip">
      {children}
    </button>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-scrawl mr-1 w-full shrink-0 text-cocoa-soft sm:w-28">{label}</span>
      {children}
    </div>
  )
}

const shownBreeds = breeds.filter((b) => puppies.some((p) => p.breeds.includes(b.slug)))
const hasTeacups = puppies.some((p) => p.collections.includes('korean-teacup'))
const hasLocal = puppies.some((p) => p.origin === 'local')

/**
 * Filters + puppy grid. The chosen filters live in the web address
 * (e.g. /puppies?breed=cavapoo), so links can open the list pre-filtered.
 */
function PuppyBrowser() {
  const [params, setParams] = useSearchParams()
  const active: Record<Filter, string> = {
    origin: params.get('origin') ?? '',
    breed: params.get('breed') ?? '',
    gender: params.get('gender') ?? '',
    collection: params.get('collection') ?? '',
  }
  /** click a chip to turn its filter on; click it again to turn it off */
  const toggle = (key: Filter, value: string) => {
    const next = new URLSearchParams(params)
    if (value && active[key] !== value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true, preventScrollReset: true })
  }
  const clear = () => setParams({}, { replace: true, preventScrollReset: true })

  const shown = useMemo(
    () =>
      puppies.filter(
        (p) =>
          (!active.origin || p.origin === active.origin) &&
          (!active.breed || p.breeds.includes(active.breed)) &&
          (!active.gender || p.gender === active.gender || p.gender === 'male-female') &&
          (!active.collection || p.collections.includes(active.collection)),
      ),
    [active.origin, active.breed, active.gender, active.collection],
  )
  const filtered = FILTERS.some((k) => active[k])

  return (
    <div>
      <div role="group" aria-label="Filter puppies" className="tp-sketchpad flex flex-col gap-4">
        <Row label="where">
          <Chip active={!active.origin && !active.collection} onClick={clear}>
            Everywhere
          </Chip>
          {hasLocal && (
            <Chip active={active.origin === 'local'} onClick={() => toggle('origin', 'local')}>
              In Dubai
            </Chip>
          )}
          <Chip active={active.origin === 'imported'} onClick={() => toggle('origin', 'imported')}>
            Imported
          </Chip>
          {hasTeacups && (
            <Chip active={active.collection === 'korean-teacup'} onClick={() => toggle('collection', 'korean-teacup')}>
              Korean Teacup
            </Chip>
          )}
        </Row>
        <Row label="breed">
          {shownBreeds.map((b) => (
            <Chip key={b.slug} active={active.breed === b.slug} onClick={() => toggle('breed', b.slug)}>
              {b.name}
            </Chip>
          ))}
        </Row>
        <Row label="boy or girl">
          <Chip active={active.gender === 'male'} onClick={() => toggle('gender', 'male')}>
            Boys
          </Chip>
          <Chip active={active.gender === 'female'} onClick={() => toggle('gender', 'female')}>
            Girls
          </Chip>
          {filtered && (
            <button type="button" onClick={clear} className="link-ink ml-auto text-[0.95rem] font-semibold">
              Clear filters
            </button>
          )}
        </Row>
      </div>
      <p className="font-scrawl mt-10 text-lg text-[var(--ink-soft)]" aria-live="polite">
        {shown.length === 1 ? '1 puppy' : `${shown.length} puppies`} {filtered ? 'match' : 'looking for a home'}
      </p>
      {shown.length ? (
        <RevealScope>
          <motion.ul layout className="tp-sketches mt-8">
            <AnimatePresence mode="popLayout">
              {shown.map((p, i) => (
                <motion.li
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.86 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.86, transition: { duration: 0.2 } }}
                  transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                >
                  <PuppyCard pup={p} index={i} preload={i < 3} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </RevealScope>
      ) : (
        <div className="tp-sketchpad mt-10 grid items-center gap-6 md:grid-cols-[auto_1fr] md:gap-10">
          <PupBuddy pose="sit" act="tilt" className="mx-auto w-44 md:w-52" label="Teddy, tilting his head" />
          <div>
            <p className="font-plush text-big">No puppies match just now.</p>
            <p className="mt-3 max-w-[48ch] text-cocoa-soft">
              Tell us what you're hoping for and we'll let you know what's in our showroom or what we can bring in for you.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                Ask on WhatsApp
              </a>
              <button type="button" onClick={clear} className="btn btn-ghost">
                Show all puppies
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Puppies() {
  usePageMeta(
    'Available puppies',
    'Teacup and teddy bear puppies available now in Dubai and imported from trusted breeders — every listing shows real photos of the puppy.',
  )
  return (
    <div data-page="pups" className="tp-page">
      <RevealScope>
        <section aria-labelledby="pups-title" className="tp-sketchbook">
          <div className="gutter mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
            <div className="tp-sketchbook__head">
              <div className="tp-sketchbook__words">
                <p className="font-scrawl text-lg text-toffee-ink" data-reveal="">
                  from Teddy's sketchbook
                </p>
                <h1 id="pups-title" className="font-plush text-giant tp-sketchbook__title" data-reveal="">
                  Available puppies
                  <svg aria-hidden="true" viewBox="0 0 400 24" preserveAspectRatio="none" className="tp-sketchbook__underline">
                    <path d="M4 15c40-9 70 5 112-2s70-9 112 0 74 8 116-1 38-4 52 1" pathLength="1" />
                  </svg>
                </h1>
                <p className="tp-sketchbook__lede text-lede mt-6 max-w-[46ch] text-cocoa-soft" data-reveal="">
                  Every listing shows real photos of the actual puppy. Open a profile to see them all, then ask us about them on WhatsApp.
                </p>
              </div>
              <div className="tp-sketchbook__self" data-reveal="">
                <PupBuddy pose="sit" facing="left" label="Teddy, the TeddyPups puppy" />
                <span className="font-scrawl tp-sketchbook__caption">self-portrait</span>
              </div>
            </div>
            <div className="mt-12">
              <PuppyBrowser />
            </div>
          </div>
        </section>
        {gonePuppies.length > 0 && (
          <section aria-labelledby="gone-title" className="tp-gone-strip">
            <div className="gutter mx-auto flex max-w-[110rem] flex-col gap-10 md:flex-row md:items-center">
              <div className="md:w-1/3" data-reveal="">
                <h2 id="gone-title" className="font-plush text-big">
                  Already gone home
                </h2>
                <p className="mt-3 text-cocoa-soft">These puppies have found their families.</p>
                <Link className="btn btn-primary mt-6" to="/gone-home">
                  See the puppies who've gone home
                </Link>
              </div>
              <ul className="tp-gone-strip__row" aria-label="Some puppies who have gone home">
                {gonePuppies.slice(0, 5).map((p, i) => (
                  <li key={p.id}>
                    <PuppyCard pup={p} index={i} small />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </RevealScope>
    </div>
  )
}
