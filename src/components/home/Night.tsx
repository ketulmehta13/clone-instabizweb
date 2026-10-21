import { Link } from 'react-router'
import { faqs } from '../../data/faqs'
import { PupStop } from '../pup/PupStop'
import { Scene } from '../Scene'
import { Twinkles } from '../Twinkles'
import type { Star } from '../Twinkles'

const STARS: Star[] = [
  [8, 12, 18], [22, 30, 10], [41, 8, 14], [57, 22, 9], [72, 6, 16], [88, 18, 12], [95, 42, 10], [4, 58, 12], [34, 70, 8], [63, 84, 11], [83, 66, 14],
]
const STAR_PATH = 'M20 3c1.6 9.4 7.6 15.4 17 17-9.4 1.6-15.4 7.6-17 17-1.6-9.4-7.6-15.4-17-17 9.4-1.6 15.4-7.6 17-17z'

/** "Questions, answered" under the night sky: the first three FAQs */
export function Night() {
  return (
    <Scene tone={{ top: '#4d2b19', bottom: '#2f1a10', dark: true }} className="tp-night" aria-labelledby="questions-title">
      <Twinkles stars={STARS} scale={0.9} className="pointer-events-none tp-night__stars" />
      <div className="tp-night__grid gutter">
        <div className="tp-night__intro">
          <h2 id="questions-title" className="font-plush text-huge">
            Questions, answered
          </h2>
          <Link to="/faq" className="btn btn-ghost tp-night__cta">
            Read all questions
          </Link>
          <div className="tp-night__pup">
            <span aria-hidden="true" className="tp-night__wonder font-plush">
              ?
            </span>
            <PupStop pose="sit" act="tilt" className="tp-night__teddy" />
          </div>
        </div>
        <dl className="tp-night__list">
          {faqs.slice(0, 3).map((f, i) => (
            <div key={f.id} className="tp-qa" data-pup-look={i < 2 ? '' : undefined}>
              <dt className="font-plush tp-qa__q">
                <svg viewBox="0 0 40 40" className="tp-qa__star" aria-hidden="true">
                  <path d={STAR_PATH} fill="currentColor" />
                </svg>
                {f.question}
              </dt>
              <dd className="tp-qa__a">{f.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Scene>
  )
}
