import { useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router'
import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { meetSection } from '../../data/home'
import { STATUS_LABEL } from '../../data/labels'
import { puppies } from '../../data/puppies'
import type { Puppy } from '../../data/types'
import { useReducedMotion } from '../../lib/motion'
import { Img } from '../Img'
import { Paw } from '../Paw'
import { cuePup } from '../pup/cue'
import { PupStop } from '../pup/PupStop'
import { Scene } from '../Scene'

const DOOR_COLOURS = ['#a24a1a', '#5a3a28', '#d4893f', '#b8644a', '#7a4a2e']

/** A front door with the puppy waiting inside; it swings open as it slides into view */
function Door({ pup, index }: { pup: Puppy; index: number }) {
  const hasVideo = pup.media.some((m) => m.kind === 'video')
  return (
    <Link to={`/puppies/${pup.slug}`} className="tp-door__link" style={{ '--door': DOOR_COLOURS[index % DOOR_COLOURS.length] } as CSSProperties}>
      <span className="tp-door__plate">
        <span className="font-plush tp-door__name">{pup.displayName}</span>
        <span className="tp-door__meta">
          {pup.name ? `${pup.breed}, ` : ''}
          {pup.genderLabel.toLowerCase()}
          {pup.age ? `, ${pup.age}` : ''}
          {hasVideo ? ', with video' : ''}
        </span>
      </span>
      <span className="tp-door__frame">
        <span className="tp-door__room">{pup.cover && <Img media={pup.cover} />}</span>
        <span aria-hidden="true" className="tp-door__way">
          <span className="tp-door__leaf">
            <Paw className="tp-door__peephole" />
            <span className="tp-door__knob" />
          </span>
        </span>
        <span className="tp-door__tag font-scrawl">{STATUS_LABEL[pup.status]}</span>
      </span>
    </Link>
  )
}

/**
 * On large screens the section "pins" while you scroll and the row of doors
 * slides sideways (Teddy walks along on a treadmill). Elsewhere it's a normal
 * swipeable row.
 */
export function Meet() {
  const rangeRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLOListElement>(null)
  const hallRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [overflow, setOverflow] = useState(0)
  const [pinned, setPinned] = useState(false)

  // size the doors to fit the screen height, and measure how far the row must slide
  useLayoutEffect(() => {
    const measure = () => {
      const wide = matchMedia('(min-width: 1024px)').matches
      setPinned(wide && !reduced)
      const track = trackRef.current
      const hall = hallRef.current
      if (hall && track && wide && !reduced) {
        const stage = hall.parentElement!
        const head = stage.querySelector<HTMLElement>('.tp-meet__head')
        const plate = Math.max(64, ...[...track.querySelectorAll<HTMLElement>('.tp-door__plate')].map((el) => el.offsetHeight))
        const floor = hall.querySelector<HTMLElement>('.tp-meet__floor')?.offsetHeight ?? 0
        const free = stage.clientHeight - (head ? head.offsetTop + head.offsetHeight : 0) - floor - plate - 40
        const doorW = Math.max(128, Math.min(256, 0.15 * innerWidth, free / 1.3))
        hall.style.setProperty('--door-w', `${doorW.toFixed(0)}px`)
      } else hall?.style.removeProperty('--door-w')
      setOverflow(track ? Math.max(0, track.scrollWidth - innerWidth) : 0)
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (trackRef.current) ro.observe(trackRef.current)
    if (hallRef.current?.parentElement) ro.observe(hallRef.current.parentElement)
    addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      removeEventListener('resize', measure)
    }
  }, [reduced])

  const { scrollYProgress } = useScroll({ target: rangeRef, offset: ['start start', 'end end'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 170, damping: 32, mass: 0.35 })
  const x = useTransform(smooth, [0, 1], [0, -overflow])

  // open each door as it passes the left third of the screen, and have Teddy glance at it
  useLayoutEffect(() => {
    const track = trackRef.current
    if (!pinned || !track) return
    const update = (offset: number, cue: boolean) => {
      hallRef.current?.style.setProperty('--floor-x', `${offset.toFixed(1)}px`)
      const line = 0.36 * innerWidth
      for (const door of track.children as HTMLCollectionOf<HTMLElement>) {
        const open = door.offsetLeft + offset < line
        if ((door.dataset.open === 'true') !== open) {
          door.dataset.open = String(open)
          if (open && cue) cuePup({ look: door, secs: 0.9 })
        }
      }
    }
    update(x.get(), false)
    return x.on('change', (v) => update(v, true))
  }, [pinned, x])

  if (!puppies.length) return null
  return (
    <Scene tone={{ top: '#fff1d8', bottom: '#fbe3b4' }} aria-labelledby="meet-title" className="tp-meet" data-pinned={pinned || undefined}>
      <div
        ref={rangeRef}
        data-pin-range=""
        style={{ height: pinned ? `calc(100vh + ${Math.round(0.8 * overflow)}px)` : undefined, '--pinned': pinned ? 1 : 0 } as CSSProperties}
      >
        <div className="tp-meet__stage">
          <header className="tp-meet__head gutter">
            <div>
              <h2 id="meet-title" className="font-plush text-huge">
                {meetSection.heading}
              </h2>
              <p className="text-lede mt-3 max-w-[44ch] text-[var(--ink-soft)]">{meetSection.body}</p>
            </div>
            <Link to={meetSection.ctaHref} className="btn btn-primary shrink-0">
              {meetSection.ctaLabel}
            </Link>
          </header>
          <div ref={hallRef} className="tp-meet__hall">
            <motion.ol ref={trackRef} style={pinned ? { x } : undefined} className="tp-meet__track" data-treadmill="" aria-label="Puppies looking for a family">
              {puppies.map((pup, i) => (
                <li key={pup.id} className="tp-door" data-open={pinned ? 'false' : 'true'}>
                  <Door pup={pup} index={i} />
                </li>
              ))}
              <li className="tp-door tp-door--all" data-open="true">
                <Link to={meetSection.ctaHref} className="tp-door__link">
                  <span className="tp-door__frame tp-door__frame--all">
                    <span className="font-plush tp-door__all">Meet them all</span>
                  </span>
                </Link>
              </li>
            </motion.ol>
            <div aria-hidden="true" className="tp-meet__floor" />
            <PupStop pose={pinned ? 'walk' : 'sit'} act={pinned ? 'treadmill' : undefined} className="tp-meet__teddy" />
          </div>
        </div>
      </div>
    </Scene>
  )
}
