import { Link, useParams } from 'react-router'
import { Chapter } from '../components/Chapter'
import { Img } from '../components/Img'
import { Paw } from '../components/Paw'
import { PupBuddy } from '../components/pup/PupBuddy'
import { EnquiryForm } from '../components/puppy/EnquiryForm'
import { PuppyGallery } from '../components/puppy/PuppyGallery'
import { StoryRibbon } from '../components/puppy/StoryRibbon'
import { RevealScope } from '../components/RevealScope'
import { STATUS_LABEL } from '../data/labels'
import { gonePuppies, puppies } from '../data/puppies'
import { whatsappLink } from '../data/site'
import type { Puppy as PuppyType } from '../data/types'
import { usePageMeta } from '../lib/usePageMeta'
import NotFound from './NotFound'

const INCLUDED = ['Vaccinated', 'Dewormed', 'Verified health certificate from licensed vets', 'Thoroughly checked before joining your family']

const WAY_HOME = {
  imported: {
    heading: 'Coming home from abroad',
    steps: [
      { title: 'Reserve your puppy', text: 'Tell us which puppy has captured your heart.' },
      { title: 'Personalized consultation', text: "We finalize details with you and share updates on your puppy's journey." },
      { title: 'Import and arrival', text: 'We manage health checks, travel arrangements, and documentation.' },
      { title: 'Welcome home', text: 'We help your new puppy settle in and ensure a smooth transition into your home.' },
    ],
  },
  // (no local puppies were listed on the original when this was built, so this wording is ours)
  local: {
    heading: 'Meeting your puppy in Dubai',
    steps: [
      { title: 'Choose your puppy', text: 'Tell us which puppy has captured your heart.' },
      { title: 'Meet before you choose', text: 'Visit our Downtown Dubai showroom and spend time bonding.' },
      { title: 'Take them home', text: 'Pick up your puppy the same day, or let us deliver within Dubai.' },
      { title: 'Welcome home', text: "We're here for any help as your puppy settles in." },
    ],
  },
}

const CHECK = (
  <svg viewBox="0 0 32 32" className="mt-0.5 size-6 shrink-0 text-toffee-deep" aria-hidden="true">
    <path d="M5 17l7 7L27 8" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/** "Copper (Cavapoo)" for named puppies, otherwise just "Toy Poodle" */
const enquiryLabel = (p: PuppyType) => (p.name ? `${p.displayName} (${p.breed})` : p.displayName)

function askMessage(p: PuppyType) {
  const url = `${location.origin}/puppies/${p.slug}`
  if (p.status === 'rehomed') return `Hi TeddyPups! I loved ${p.name ? p.displayName : `the ${p.displayName}`} (${url}). Do you have a puppy like them?`
  return p.name
    ? `Hi TeddyPups! I'm interested in ${p.displayName}, the ${p.breed}: ${url}`
    : `Hi TeddyPups! I'm interested in the ${p.displayName} (${p.genderLabel.toLowerCase()}): ${url}`
}

/** Previous/next puppy (wrapping round) within the same list */
function neighbours(list: PuppyType[], p: PuppyType) {
  const i = list.indexOf(p)
  return [list[(i - 1 + list.length) % list.length], list[(i + 1) % list.length]]
}

function NeighbourLink({ pup, label }: { pup: PuppyType; label: string }) {
  return (
    <Link
      to={`/puppies/${pup.slug}`}
      className="group flex items-center gap-5 rounded-[2rem] border-[3px] border-cocoa bg-milk p-4 transition-transform duration-500 hover:-rotate-1 sm:last:flex-row-reverse sm:last:text-right"
    >
      <span className="relative h-24 w-20 shrink-0 overflow-hidden rounded-[999px_999px_0.6rem_0.6rem] border-[3px] border-cocoa bg-honey-soft">
        {pup.cover && <Img media={pup.cover} />}
      </span>
      <span>
        <span className="font-scrawl block text-sm text-cocoa-soft">{label}</span>
        <span className="font-plush text-[1.6rem]">{pup.displayName}</span>
      </span>
    </Link>
  )
}

function PuppyStory({ pup }: { pup: PuppyType }) {
  const gone = pup.status === 'rehomed'
  const list = gone ? gonePuppies : puppies
  const [prev, next] = neighbours(list, pup)
  const way = pup.origin === 'local' ? WAY_HOME.local : WAY_HOME.imported
  const what = pup.name ? pup.displayName : `this ${pup.displayName}`
  const facts = [
    ['Breed', pup.breed],
    ['Boy or girl', pup.genderLabel],
    ['Age', pup.age],
    ['Where', pup.origin === 'local' ? 'In Dubai' : 'Imported for you'],
  ].filter(([, v]) => v)

  usePageMeta(
    pup.name ? `${pup.displayName}, ${pup.breed} puppy` : `${pup.displayName} puppy (${pup.genderLabel.toLowerCase()})`,
    `Meet ${pup.name ? pup.displayName : `this ${pup.displayName}`}: ${pup.breed}, ${pup.genderLabel.toLowerCase()}${pup.age ? `, ${pup.age} old` : ''}, ${
      pup.origin === 'local' ? 'in Dubai' : 'imported'
    }. Real photos${pup.media.some((m) => m.kind === 'video') ? ' and video' : ''} from TeddyPups U.A.E.`,
  )

  return (
    <article
      className="tp-storybook"
      style={{ background: `linear-gradient(180deg, color-mix(in oklab, ${pup.cover?.color ?? '#fbe3b4'} 24%, var(--color-milk)) 0, var(--color-milk) 85%)` }}
    >
      <StoryRibbon />
      <RevealScope className="gutter mx-auto max-w-[110rem] pb-20 pt-8 md:pt-12">
        <nav aria-label="Breadcrumb" className="text-[0.95rem] font-semibold text-cocoa-soft">
          <Link className="link-ink" to={gone ? '/gone-home' : '/puppies'}>
            {gone ? 'Gone home' : 'Available puppies'}
          </Link>{' '}
          <span aria-hidden="true">/</span> <span aria-current="page">{pup.displayName}</span>
        </nav>
        <Chapter n={1}>{gone ? 'the day they went home' : "hello, it's me"}</Chapter>
        <div className="mt-4 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-7">
            <PuppyGallery key={pup.slug} name={pup.displayName} media={pup.media} />
          </div>
          <div className="min-w-0 lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+5.5rem)]">
              <div className="tp-tag tp-board mt-16 !rounded-[2.2rem_2.2rem_2.2rem_0.6rem] !p-7 md:!p-9 lg:mt-20" data-reveal="">
                <span aria-hidden="true" className="tp-tag__ring" />
                <PupBuddy pose="peek" className="absolute -top-[4.8rem] right-6 w-[9.5rem]" label={`Teddy, peeking over ${pup.displayName}'s tag`} />
                {gone ? (
                  <span className="inline-grid place-items-center rounded-full border-[3px] border-current px-3 py-1 font-scrawl text-sm uppercase tracking-wide -rotate-6 text-toffee-deep">
                    Gone home ♥
                  </span>
                ) : (
                  <span className="chip">
                    <Paw className="size-4 text-toffee" />
                    {STATUS_LABEL[pup.status]}
                  </span>
                )}
                <h1 className="font-plush mt-4 text-[clamp(2.6rem,5vw,4.6rem)]">{pup.displayName}</h1>
                {pup.name && <p className="mt-2 text-lg font-semibold text-cocoa-soft">{pup.breed}</p>}
                <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4">
                  {facts.map(([k, v]) => (
                    <div key={k}>
                      <dt className="font-scrawl text-sm text-cocoa-soft">{k}</dt>
                      <dd className="mt-0.5 text-[1.05rem] font-semibold">{v}</dd>
                    </div>
                  ))}
                </dl>
                {pup.description && <p className="mt-6 whitespace-pre-line text-cocoa-soft">{pup.description}</p>}
                <div className="mt-8 flex flex-col gap-3">
                  <a href={whatsappLink(askMessage(pup))} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                    {gone ? 'Ask about a puppy like this' : `Ask about ${pup.name ? pup.displayName : 'this puppy'} on WhatsApp`}
                  </a>
                  <a href={`#enquire-${pup.slug}`} className="btn btn-ghost">
                    Send an enquiry
                  </a>
                </div>
              </div>
              <div className="tp-paper mt-8 -rotate-1">
                <Chapter n={2}>what comes with {what}</Chapter>
                <h2 className="font-plush mt-1 text-[1.9rem]">Every Teddy Pup comes</h2>
                <ul className="mt-4 space-y-2.5">
                  {INCLUDED.map((item) => (
                    <li key={item} className="flex items-start gap-3 font-semibold">
                      {CHECK}
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        {!gone && (
          <section aria-labelledby={`home-steps-${pup.slug}`} className="mt-20">
            <Chapter n={3}>the way home</Chapter>
            <h2 id={`home-steps-${pup.slug}`} className="font-plush text-big mt-3">
              {way.heading}
            </h2>
            <ol className="tp-trail tp-trail--row tp-trail--paws mt-10">
              {way.steps.map((s, i) => (
                <li key={s.title}>
                  <span aria-hidden="true" className="tp-trail__num font-plush">
                    {i + 1}
                  </span>
                  <h3 className="font-plush-text text-xl font-bold leading-tight">{s.title}</h3>
                  <p className="mt-2 max-w-[38ch] text-cocoa-soft">{s.text}</p>
                </li>
              ))}
            </ol>
          </section>
        )}
        <section id={`enquire-${pup.slug}`} aria-labelledby={`enquire-title-${pup.slug}`} className="tp-letter mt-20 grid gap-10 lg:grid-cols-12">
          <span aria-hidden="true" className="tp-letter__stamp">
            <Paw className="size-9" />
          </span>
          <div className="lg:col-span-4">
            <Chapter n={gone ? 3 : 4}>dear TeddyPups…</Chapter>
            <h2 id={`enquire-title-${pup.slug}`} className="font-plush text-big mt-2">
              {gone ? 'Looking for a puppy like this?' : `Ask about ${pup.name ? pup.displayName : 'this puppy'}`}
            </h2>
            <p className="mt-4 text-cocoa-soft">Leave your details and our team will get back to you promptly — or message us on WhatsApp for the quickest reply.</p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <EnquiryForm key={pup.slug} puppyLabel={enquiryLabel(pup)} />
          </div>
        </section>
        {list.length > 1 && (
          <nav aria-label="More puppies" className="mt-16 grid gap-4 sm:grid-cols-2">
            <NeighbourLink pup={prev} label="Previous pup" />
            <NeighbourLink pup={next} label="Next pup" />
          </nav>
        )}
      </RevealScope>
    </article>
  )
}

export default function Puppy() {
  const { slug } = useParams()
  const pup = puppies.find((p) => p.slug === slug) ?? gonePuppies.find((p) => p.slug === slug)
  if (!pup) return <NotFound />
  return (
    <div data-page="pup" className="tp-page">
      <PuppyStory key={pup.slug} pup={pup} />
    </div>
  )
}
