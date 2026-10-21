import type { CSSProperties } from 'react'
import { Link } from 'react-router'
import { familyPhotos } from '../../data/families'
import { duskSection, homePhotoOrder, testimonial } from '../../data/home'
import type { Media } from '../../data/types'
import { Polaroid } from '../Polaroid'
import { PupStop } from '../pup/PupStop'
import { RevealScope } from '../RevealScope'
import { Scene } from '../Scene'
import { usePhotoViewer } from '../usePhotoViewer'

const photos = homePhotoOrder.map((id) => familyPhotos.find((p) => p.id === id)).filter((p): p is Media => !!p)
/** the order the 8 prints drop onto the wall */
const DROP_ORDER = [3, 0, 5, 1, 6, 2, 7, 4]

/** Happy families at dusk: a quote and a shop wall covered in photos from new owners */
export function Dusk() {
  const { open, viewer } = usePhotoViewer(photos)
  if (!photos.length) return null
  return (
    <Scene tone={{ top: '#a65a30', bottom: '#4d2b19', dark: true }} aria-labelledby="dusk-title" className="tp-dusk">
      <div className="tp-dusk__sky gutter">
        <div className="tp-dusk__head">
          <h2 id="dusk-title" className="font-plush text-huge">
            {duskSection.heading}
          </h2>
          <p className="text-lede mt-5 max-w-[50ch] text-[var(--ink-soft)]">{duskSection.body}</p>
        </div>
        <figure className="tp-dusk__note">
          <blockquote className="font-plush-text">“{testimonial.quote}”</blockquote>
          <figcaption className="font-scrawl">
            {testimonial.author}
            {testimonial.location ? `, ${testimonial.location}` : ''}
          </figcaption>
        </figure>
      </div>
      <div className="tp-photowall">
        <RevealScope className="tp-photowall__wall">
          <ul className="tp-photowall__prints" aria-label="Photos from TeddyPups families">
            {photos.slice(0, 8).map((p, i) => (
              <li key={p.id} data-reveal="" data-pup-look={i === 1 || i === 4 ? '' : undefined} style={{ '--d': `${110 * DROP_ORDER[i]}ms` } as CSSProperties}>
                <button
                  type="button"
                  className="tp-photowall__print"
                  onClick={() => open(i)}
                  aria-label={`Open photo ${i + 1} of ${photos.length}${p.caption ? `: ${p.caption}` : ''}`}
                >
                  <Polaroid media={p} order={i} />
                </button>
              </li>
            ))}
          </ul>
          <div className="tp-facade__ground">
            <span aria-hidden="true" className="tp-facade__door" />
            <span aria-hidden="true" className="tp-lamp">
              <span className="tp-lamp__light" />
            </span>
            <Link to={duskSection.ctaHref} className="btn btn-primary tp-facade__cta">
              {duskSection.ctaLabel}
            </Link>
            <PupStop pose="sit" className="tp-dusk__teddy" />
          </div>
        </RevealScope>
        <div aria-hidden="true" className="tp-street__pavement" />
      </div>
      {viewer}
    </Scene>
  )
}
