import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router'
import type { Puppy } from '../../data/types'
import { prefersReducedMotion } from '../../lib/motion'
import { Img } from '../Img'

/** Where each seat sits: [x %, width rem, how far the pup peeks up, tilt deg] */
const SEATS: [number, number, number, number][] = [
  [9, 8.6, 0.62, -5],
  [22.5, 10.4, 0.8, 3],
  [35, 9.2, 0.7, -2],
  [65, 9.4, 0.74, 3],
  [77.5, 10.6, 0.82, -3],
  [91, 8.4, 0.6, 4],
]
/** Pause between swaps, cycled so the rhythm feels natural */
const GAPS = [1900, 2500, 1700, 2300, 2000, 2800, 1800]

function shuffle<T>(list: T[]) {
  const out = [...list]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

const seatStyle = (i: number) => {
  const [x, w, peek, tilt] = SEATS[i]
  return { '--x': `${x}%`, '--w': `${w}rem`, '--peek': peek, '--tilt': `${tilt}deg`, '--i': i } as CSSProperties
}

type Friend = Pick<Puppy, 'id' | 'slug' | 'displayName' | 'breed' | 'cover'>

/**
 * A row of puppies peeking over the hero's quilt. Every couple of seconds one
 * ducks down and a different puppy pops up in its place; hovering shows a name tag.
 */
export function HeroLineup({ friends }: { friends: Friend[] }) {
  const seats = Math.min(SEATS.length, friends.length)
  const [seated, setSeated] = useState(() => friends.slice(0, seats).map((_, i) => i))
  const [states, setStates] = useState<Record<number, 'duck' | 'pop' | undefined>>({})
  const [popped, setPopped] = useState<number | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  // the next puppy to come up is loaded early, out of sight, so it pops up instantly
  const [waiting, setWaiting] = useState<number | null>(friends.length > seats ? seats : null)
  const listRef = useRef<HTMLUListElement>(null)
  const wingsRef = useRef<HTMLSpanElement>(null)
  const seatedRef = useRef(seated)
  useEffect(() => {
    seatedRef.current = seated
  }, [seated])

  useEffect(() => {
    const list = listRef.current
    if (!list || !seats || prefersReducedMotion()) return
    const swapping = friends.length > seats
    const scene = list.closest<HTMLElement>('[data-pup-scene]')
    let onScreen = true
    let busyUntil = 0
    let alive = true
    const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting), { threshold: 0.35 })
    io.observe(list)
    // don't swap while the visitor is scrolling or pointing at the puppies
    const busy = () => (busyUntil = performance.now() + 1200)
    addEventListener('scroll', busy, { passive: true })
    addEventListener('pointerdown', busy, { passive: true })
    list.addEventListener('pointerover', busy, { passive: true })

    const benched = friends.map((_, i) => i).filter((i) => !seatedRef.current.includes(i))
    let queue = benched.includes(seats) ? [seats, ...shuffle(benched.filter((i) => i !== seats))] : shuffle(benched)
    let order: number[] = []
    let lastSeat = -1
    let gap = 0
    let tries = 0
    let timers: number[] = []
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms))

    const next = () => {
      const ready = !document.hidden && onScreen && performance.now() > busyUntil && scene?.dataset.here !== 'false'
      if (!ready) return later(next, 900)
      if (!swapping) return swap()
      if (!queue.length) queue = shuffle(friends.map((_, i) => i).filter((i) => !seatedRef.current.includes(i)))
      // wait until the incoming photo has actually loaded
      const img = wingsRef.current?.dataset.for === String(queue[0]) ? wingsRef.current.querySelector('img') : null
      if (!img || !img.complete || !img.naturalWidth) {
        if (++tries < 15) return later(next, 400)
        queue.push(queue.shift()!)
        setWaiting(queue[0] ?? null)
        tries = 0
        return later(next, 800)
      }
      tries = 0
      img.decode().then(swap, swap)
    }
    const swap = () => {
      if (!order.length) {
        const visible = [...list.children].map((el, i) => (el.getClientRects().length ? i : -1)).filter((i) => i >= 0)
        order = shuffle(visible).filter((s, i, a) => !(i === 0 && s === lastSeat && a.length > 1))
      }
      const seat = order.shift()
      if (seat === undefined) return later(next, 2000)
      lastSeat = seat
      const incoming = swapping ? queue.shift()! : seatedRef.current[seat]
      setStates((s) => ({ ...s, [seat]: 'duck' }))
      later(() => {
        if (swapping) {
          const outgoing = seatedRef.current[seat]
          setSeated((list) => list.map((f, i) => (i === seat ? incoming : f)))
          queue.push(outgoing)
          setWaiting(queue[0] ?? null)
        }
        setStates((s) => ({ ...s, [seat]: 'pop' }))
        setPopped(seat)
        later(() => setPopped((p) => (p === seat ? null : p)), 1800)
        later(() => setStates((s) => ({ ...s, [seat]: undefined })), 700)
      }, 360)
      later(next, GAPS[gap++ % GAPS.length])
    }

    if (swapping) setWaiting(queue[0] ?? null)
    // start once the puppies have finished peeking up for the first time
    const peeks = [...list.querySelectorAll('.tp-lineup__pup')].flatMap((el) => el.getAnimations()).filter((a) => (a as CSSAnimation).animationName === 'tp-peek')
    const start = () => alive && later(next, 250)
    Promise.all(peeks.map((a) => a.finished)).then(start, start)
    return () => {
      alive = false
      timers.forEach(clearTimeout)
      timers = []
      io.disconnect()
      removeEventListener('scroll', busy)
      removeEventListener('pointerdown', busy)
      list.removeEventListener('pointerover', busy)
    }
  }, [friends, seats])

  if (!seats) return null
  const unhover = (i: number) => () => setHovered((h) => (h === i ? null : h))
  return (
    <>
      <ul ref={listRef} className="tp-lineup" aria-label="Some of the puppies in our showroom">
        {seated.map((f, i) => {
          const pup = friends[f]
          return (
            <li key={i} className="tp-lineup__seat" style={seatStyle(i)}>
              <Link
                to={`/puppies/${pup.slug}`}
                className="tp-lineup__pup"
                data-pup-friend=""
                data-state={states[i]}
                aria-label={`Meet ${pup.displayName}, ${pup.breed}`}
                onPointerEnter={() => setHovered(i)}
                onPointerLeave={unhover(i)}
                onFocus={() => setHovered(i)}
                onBlur={unhover(i)}
              >
                <span className="tp-lineup__photo">{pup.cover && <Img key={pup.id} media={pup.cover} preload={i < 2} eager />}</span>
              </Link>
            </li>
          )
        })}
      </ul>
      <ul aria-hidden="true" className="tp-lineup tp-lineup--tags">
        {seated.map((f, i) => (
          <li key={i} className="tp-lineup__seat" style={seatStyle(i)}>
            <span className="tp-lineup__ghost" data-state={states[i]} data-tag={popped === i || hovered === i ? 'show' : undefined}>
              <span className="tp-lineup__name font-scrawl">{friends[f].displayName}</span>
            </span>
          </li>
        ))}
      </ul>
      {waiting !== null && friends[waiting].cover && (
        <span ref={wingsRef} aria-hidden="true" className="tp-lineup__wings" data-for={waiting}>
          <Img media={friends[waiting].cover} alt="" eager />
        </span>
      )}
    </>
  )
}
