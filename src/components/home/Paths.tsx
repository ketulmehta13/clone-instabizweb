import { Link } from 'react-router'
import { journeyMedia } from '../../data/families'
import { puppies } from '../../data/puppies'
import { Img } from '../Img'
import { PupStop } from '../pup/PupStop'
import { Scene } from '../Scene'
import { Flight } from './Flight'

const showroom = journeyMedia[0]
const flyer = puppies.find((p) => p.collections.includes('korean-teacup')) ?? puppies[0]

/** "Two ways to meet your puppy": a fork in the road — local showroom or imported */
export function Paths() {
  return (
    <Scene tone={{ top: '#fbe3b4', bottom: '#f7d18d' }} className="tp-paths" aria-labelledby="paths-title">
      <div className="gutter mx-auto max-w-[110rem]">
        <h2 id="paths-title" className="tp-paths__title font-plush text-huge">
          Two ways to meet your puppy
        </h2>
        <div className="tp-fork">
          <div aria-hidden="true" className="tp-fork__post" />
          <article className="tp-way tp-way--left" aria-labelledby="way-local">
            <h3 id="way-local" className="tp-sign tp-sign--left font-plush">
              Puppies in Dubai
            </h3>
            <div className="tp-way__scene" data-pup-look="">
              <svg viewBox="0 0 300 120" className="tp-way__skyline" aria-hidden="true">
                <path
                  d="M4 116h292M20 116V78h16v38M44 116V60h18v56M70 116V84h12v32M150 116V36l4-6v-14l3-4 3 4v14l4 6v80M118 116V70l12-8v54M174 116V64l14 8v44M200 116V82h18v34M226 116V56h14v60M248 116V88h22v28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <figure className="tp-window">
                <span className="tp-window__glass">{showroom && <Img media={showroom} />}</span>
                <figcaption className="font-scrawl">In our showroom</figcaption>
              </figure>
            </div>
            <p className="tp-way__text">See them, love them, take them home. Come meet our locally available puppies before you decide.</p>
            <Link className="btn btn-primary" to="/puppies?origin=local">
              Meet local puppies
            </Link>
          </article>
          <article className="tp-way tp-way--right" aria-labelledby="way-imported">
            <h3 id="way-imported" className="tp-sign tp-sign--right font-plush">
              Imported for you
            </h3>
            <div className="tp-way__scene" data-pup-look="">
              <Flight photo={flyer?.cover?.src} label={`A plane bringing a ${flyer?.breed ?? 'teacup'} puppy from Korea to Dubai`} />
            </div>
            <p className="tp-way__text">
              Exclusive Korean teacup puppies, delivered. Order from the world's most reputable breeders and let us handle the import.
            </p>
            <Link className="btn btn-primary" to="/puppies?origin=imported">
              See imported puppies
            </Link>
          </article>
          <PupStop pose="sit" className="tp-fork__teddy" />
        </div>
      </div>
    </Scene>
  )
}
