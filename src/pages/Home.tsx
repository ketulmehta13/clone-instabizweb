import { Chat } from '../components/home/Chat'
import { Dusk } from '../components/home/Dusk'
import { Hero } from '../components/home/Hero'
import { HomeCta } from '../components/home/HomeCta'
import { Meet } from '../components/home/Meet'
import { Night } from '../components/home/Night'
import { Passport } from '../components/home/Passport'
import { Paths } from '../components/home/Paths'
import { usePageMeta } from '../lib/usePageMeta'

/** The home page: one long scroll from morning (top) to night (bottom) */
export default function Home() {
  usePageMeta(
    null,
    'Teddy bear and teacup puppies in Dubai. Meet local puppies in our Downtown Dubai showroom or bring home a rare breed imported from trusted breeders.',
  )
  return (
    <div data-page="home" className="tp-page">
      <div data-section="hero">
        <Hero />
      </div>
      <div data-section="meet">
        <Meet />
      </div>
      <div data-section="paths">
        <Paths />
      </div>
      <div data-section="journey">
        <Chat />
      </div>
      <div data-section="trust">
        <Passport />
      </div>
      <div data-section="families">
        <Dusk />
      </div>
      <div data-section="questions">
        <Night />
      </div>
      <div data-section="cta">
        <HomeCta />
      </div>
    </div>
  )
}
