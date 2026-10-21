import { LetterForm } from '../components/contact/LetterForm'
import { Img } from '../components/Img'
import { Paw } from '../components/Paw'
import { PupBuddy } from '../components/pup/PupBuddy'
import { Scene } from '../components/Scene'
import { journeyMedia } from '../data/families'
import { site, whatsappLink } from '../data/site'
import { usePageMeta } from '../lib/usePageMeta'

/** the showroom photo of the apricot puppy saying hello */
const showroom = journeyMedia.find((m) => m.id === 'skvodl2NZiKq') ?? journeyMedia[0]

export default function Contact() {
  usePageMeta('Visit & contact', 'Visit TeddyPups in Downtown Dubai or get in touch on WhatsApp, by phone or email.')
  return (
    <div data-page="contact" className="tp-page">
      <Scene tone={{ top: '#fff9ee', bottom: '#f9dca4' }} aria-labelledby="contact-title">
        <div className="gutter mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
          <header className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <h1 id="contact-title" className="font-plush text-giant max-w-[12ch] lg:col-span-7">
              Get in touch with us
            </h1>
            <p className="text-lede text-[var(--ink-soft)] lg:col-span-5 lg:pb-3">
              Have questions about our puppies or adoption process? Fill out the form, and our team will get back to you promptly. Whether ready to adopt or just seeking
              info, we'd love to hear from you!
            </p>
          </header>
          <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1">
              <LetterForm />
              <PupBuddy pose="sit" facing="left" className="ml-auto mr-6 -mt-3 w-36 md:w-40" label="Teddy, waiting for your letter" />
            </div>
            <div className="lg:col-span-5 lg:row-start-1">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp w-full sm:w-auto">
                WhatsApp {site.phoneDisplay}
              </a>
              <dl className="mt-10 space-y-6">
                <div>
                  <dt className="font-scrawl text-[var(--ink-soft)]">call us</dt>
                  <dd className="mt-1 text-lg font-semibold">
                    <a className="link-ink" href={`tel:${site.phone}`}>
                      {site.phoneDisplay}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-scrawl text-[var(--ink-soft)]">email</dt>
                  <dd className="mt-1 break-all text-lg font-semibold">
                    <a className="link-ink" href={`mailto:${site.email}`}>
                      {site.email}
                    </a>
                  </dd>
                </div>
              </dl>
              <section aria-labelledby="visit-title" className="tp-shopfront mt-12">
                <svg viewBox="0 0 300 120" className="absolute -bottom-1 right-0 w-3/4 text-toffee/30" aria-hidden="true">
                  <path
                    d="M4 116h292M20 116V78h16v38M44 116V60h18v56M70 116V84h12v32M150 116V36l4-6v-14l3-4 3 4v14l4 6v80M118 116V70l12-8v54M174 116V64l14 8v44M200 116V82h18v34M226 116V56h14v60M248 116V88h22v28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="tp-visit relative p-7 pt-6">
                  <div>
                    <h2 id="visit-title" className="font-plush text-[2rem] leading-tight">
                      Visit us in Downtown Dubai
                    </h2>
                    <p className="mt-3 max-w-[38ch] text-cocoa-soft">Step into our Downtown Dubai showroom and experience the joy of choosing your puppy face-to-face.</p>
                    <p className="mt-4 flex items-center gap-2 font-semibold">
                      <Paw className="size-5 shrink-0 text-toffee-deep" />
                      {site.address}
                    </p>
                    <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-6 !bg-milk">
                      Open in Google Maps
                    </a>
                  </div>
                  <figure className="tp-visit__photo">{showroom && <Img media={showroom} />}</figure>
                </div>
              </section>
            </div>
          </div>
        </div>
      </Scene>
    </div>
  )
}
