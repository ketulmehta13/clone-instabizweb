import { Link } from 'react-router'
import { puppies } from '../../data/puppies'
import { whatsappLink } from '../../data/site'
import { Img } from '../Img'
import { PupStop } from '../pup/PupStop'
import { Scene } from '../Scene'

const inside = puppies.find((p) => p.cover)

/** "Ready to meet your new best friend?" — a little house with a puppy waiting inside */
export function HomeCta() {
  return (
    <Scene tone={{ top: '#2f1a10', bottom: '#24130b', dark: true }} className="tp-home" aria-labelledby="cta-title">
      <div className="tp-home__copy gutter">
        <h2 id="cta-title" className="font-plush text-huge">
          Ready to meet your new best friend?
        </h2>
        <p className="tp-home__lede">
          Bring home a healthy, happy teacup or designer puppy with expert guidance every step of the way. We help you find the right match and ensure a smooth, safe
          delivery across the UAE.
        </p>
      </div>
      <div className="tp-house">
        <span aria-hidden="true" className="tp-house__plant tp-house__plant--left" />
        <span aria-hidden="true" className="tp-house__lamp" />
        <div className="tp-house__doorway">
          <span className="tp-house__inside">{inside?.cover && <Img media={inside.cover} alt={`${inside.displayName}, waiting inside`} />}</span>
          <span aria-hidden="true" className="tp-house__door">
            <span className="tp-house__peep" />
            <span className="tp-house__knob" />
          </span>
        </div>
        <span aria-hidden="true" className="tp-house__plant tp-house__plant--right" />
        <span aria-hidden="true" className="tp-house__mat font-scrawl">
          welcome home
        </span>
        <PupStop pose="bow" className="tp-house__teddy" />
      </div>
      <div className="tp-home__actions gutter">
        <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
          Enquire on WhatsApp
        </a>
        <Link to="/contact" className="btn btn-ghost tp-home__ghost">
          Visit & contact
        </Link>
      </div>
    </Scene>
  )
}
