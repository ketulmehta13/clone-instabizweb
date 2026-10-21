import { NoticeBoard } from '../components/faq/NoticeBoard'
import { Scene } from '../components/Scene'
import { faqs } from '../data/faqs'
import { site, whatsappLink } from '../data/site'
import { usePageMeta } from '../lib/usePageMeta'

export default function Faq() {
  usePageMeta('Questions & answers', 'Answers about TeddyPups puppies: health checks and vaccinations, meeting local puppies, imported teacup breeds and delivery.')
  return (
    <div data-page="faq" className="tp-page">
      <Scene tone={{ top: '#a95e32', bottom: '#331c11', dark: true }} className="tp-faqroom overflow-hidden" aria-labelledby="faq-title">
        <div className="gutter relative mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
          <header className="max-w-4xl">
            <h1 id="faq-title" className="font-plush text-giant">
              Questions & answers
            </h1>
            <p className="text-lede mt-6 max-w-[52ch] text-[var(--ink-soft)]">Can't find what you're looking for? Message us on WhatsApp — our team is available 24/7.</p>
          </header>
          <div className="mt-12 md:mt-16">
            <NoticeBoard faqs={faqs} askHref={whatsappLink(site.askGreeting)} />
          </div>
        </div>
      </Scene>
    </div>
  )
}
