import type { CSSProperties } from 'react'
import { Link } from 'react-router'
import { STATUS_LABEL } from '../data/labels'
import type { Puppy } from '../data/types'
import { Img } from './Img'
import { PAW_PATH } from './pup/geometry'



const f2 = (n: number) => n.toFixed(2)

/** Same slug → same random numbers, so each puppy always gets the same sketch */
function seededRandom(seed: string) {
  let h = 0x811c9dc5
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 0x1000193)
  let s = h >>> 0
  return () => {
    let t = (s = (s + 0x6d2b79f5) >>> 0)
    t = Math.imul(t ^ (t >>> 15), 1 | t)
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t)
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000
  }
}

type P = [number, number]

/** Points around a slightly wobbly circle */
function wobble(rand: () => number, radius: number, amount: number, count = 40, from = 0, sweep = 2 * Math.PI): P[] {
  const phase = [6.28 * rand(), 6.28 * rand(), 6.28 * rand()]
  const squash = 1 + (rand() - 0.5) * 0.05
  const pts: P[] = []
  for (let i = 0; i < count; i++) {
    const a = from + (i / (sweep >= 2 * Math.PI ? count : count - 1)) * sweep
    const r = radius + amount * (0.55 * Math.sin(2 * a + phase[0]) + 0.3 * Math.sin(3 * a + phase[1]) + 0.15 * Math.sin(5 * a + phase[2]))
    pts.push([50 + Math.cos(a) * r * squash, 50 + (Math.sin(a) * r) / squash])
  }
  return pts
}

/** Smooth curve through points (Catmull-Rom → Bézier) */
function smooth(pts: P[], closed: boolean) {
  const n = pts.length
  const at = (i: number) => pts[closed ? (i + n) % n : Math.min(n - 1, Math.max(0, i))]
  let d = `M${f2(pts[0][0])} ${f2(pts[0][1])}`
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += `C${f2(c1[0])} ${f2(c1[1])} ${f2(c2[0])} ${f2(c2[1])} ${f2(p2[0])} ${f2(p2[1])}`
  }
  return closed ? `${d}Z` : d
}

const WASHES = ['#f2be6b', '#f9cdbf', '#bfddf5', '#fbe3b4', '#e8c39a']
const INKS = ['#c2622b', '#a24a1a', '#2a170e', '#d4893f']
const DOODLES = ['sparkle', 'heart', 'dashes', 'swirl', 'dots', 'paw'] as const
type Doodle = { kind: (typeof DOODLES)[number]; x: number; y: number; rot: number; size: number; ink: string }

function sketch(slug: string) {
  const rand = seededRandom(slug)
  const mask = smooth(wobble(rand, 45.5, 2.6), true)
  const outline = smooth(wobble(rand, 47.8, 3.1), true)
  const start = rand() * Math.PI * 2
  const retrace = smooth(wobble(rand, 49, 3.4, 30, start, Math.PI * (1.15 + 0.5 * rand())), false)
  const wash = { d: smooth(wobble(rand, 46.5, 3.6), true), dx: (rand() - 0.5) * 9, dy: 3 + 4 * rand(), color: WASHES[Math.floor(rand() * WASHES.length)] }
  const tilt = (rand() - 0.5) * 5
  // doodles go in a couple of these arcs around the frame
  const arcs = [
    [0.86, 1.08],
    [1.16, 1.42],
    [-0.08, 0.16],
  ]
    .map((z) => ({ z, k: rand() }))
    .sort((a, b) => a.k - b.k)
    .map((x) => x.z)
  const count = 2 + Math.floor(2 * rand())
  const doodles: Doodle[] = []
  const used = new Set<string>()
  for (let i = 0; i < count; i++) {
    let kind = DOODLES[Math.floor(rand() * DOODLES.length)]
    if (used.has(kind)) kind = DOODLES.find((k) => !used.has(k))!
    used.add(kind)
    const [lo, hi] = arcs[i]
    const a = Math.PI * (lo + rand() * (hi - lo))
    const r = 55 + 4 * rand()
    doodles.push({ kind, x: 50 + Math.cos(a) * r, y: 50 + Math.sin(a) * r, rot: (rand() - 0.5) * 50, size: 0.85 + 0.35 * rand(), ink: INKS[Math.floor(rand() * INKS.length)] })
  }
  return { mask, outline, retrace, wash, tilt, doodles }
}

const maskUrl = (d: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${d}" fill="#000"/></svg>`)}")`

function DoodleMark({ d }: { d: Doodle }) {
  const stroke = { fill: 'none', stroke: d.ink, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
  return (
    <g transform={`translate(${d.x.toFixed(1)} ${d.y.toFixed(1)}) rotate(${d.rot.toFixed(0)}) scale(${d.size.toFixed(2)})`}>
      <g className="tp-sketch__doodle">
        {d.kind === 'sparkle' && <path d="M0 -6c.6 3.6 2.4 5.4 6 6-3.6.6-5.4 2.4-6 6-.6-3.6-2.4-5.4-6-6 3.6-.6 5.4-2.4 6-6z" fill={d.ink} />}
        {d.kind === 'heart' && (
          <path d="M0 5C-4.6 1.8-6.4-.8-6.4-3.2c0-1.9 1.5-3.3 3.3-3.3 1.3 0 2.4.7 3.1 1.9.7-1.2 1.8-1.9 3.1-1.9 1.8 0 3.3 1.4 3.3 3.3C6.4-.8 4.6 1.8 0 5z" {...stroke} />
        )}
        {d.kind === 'dashes' && <path d="M-5 -5l4 2M-6 0h5M-5 5l4 -2" {...stroke} />}
        {d.kind === 'swirl' && <path d="M0 0c1.6-.6 2.4 1.4.8 2.6-2 1.4-4.6-.4-4-3 .7-3 4.8-3.8 6.8-1.2 2.4 3-0.2 7.4-3.8 7.2" {...stroke} />}
        {d.kind === 'dots' && (
          <g fill={d.ink}>
            <circle cx="-4" cy="1" r="1.2" />
            <circle cx="0" cy="-2" r="1.2" />
            <circle cx="4" cy="1" r="1.2" />
          </g>
        )}
        {d.kind === 'paw' && <path d={PAW_PATH} transform="scale(.17) translate(-32 -34)" fill={d.ink} opacity={0.85} />}
      </g>
    </g>
  )
}

type Props = { pup: Puppy; index?: number; preload?: boolean; small?: boolean }

/**
 * A puppy drawn as a hand-sketched round portrait: wobbly ink outline, watercolour
 * wash and little doodles, all generated from the puppy's slug.
 */
export function PuppyCard({ pup, index = 0, preload = false, small = false }: Props) {
  const s = sketch(pup.slug)
  const hasVideo = pup.media.some((m) => m.kind === 'video')
  const label = `${pup.displayName}${pup.name ? `, ${pup.breed}` : ''}, ${pup.genderLabel.toLowerCase()}${pup.age ? `, ${pup.age}` : ''}, ${STATUS_LABEL[pup.status].toLowerCase()}`
  return (
    <Link
      to={`/puppies/${pup.slug}`}
      className={`tp-sketch${small ? ' tp-sketch--small' : ''}`}
      data-reveal=""
      style={{ '--tilt': `${s.tilt.toFixed(2)}deg`, '--d': `${(index % 8) * 70}ms`, '--wash': s.wash.color } as CSSProperties}
      aria-label={label}
    >
      <span className="tp-sketch__frame">
        <svg aria-hidden="true" viewBox="0 0 100 100" className="tp-sketch__wash" style={{ translate: `${s.wash.dx.toFixed(1)}% ${s.wash.dy.toFixed(1)}%` }}>
          <path d={s.wash.d} />
        </svg>
        <span className="tp-sketch__photo" style={{ maskImage: maskUrl(s.mask), WebkitMaskImage: maskUrl(s.mask) }}>
          {pup.cover && <Img media={pup.cover} alt="" preload={preload} />}
        </span>
        <svg aria-hidden="true" viewBox="0 0 100 100" className="tp-sketch__ink">
          <path d={s.outline} pathLength={1} className="tp-sketch__line" />
          <path d={s.retrace} pathLength={1} className="tp-sketch__line tp-sketch__line--retrace" />
          {s.doodles.map((d, i) => (
            <DoodleMark key={i} d={d} />
          ))}
        </svg>
        {!small && <span className="tp-sketch__sticker font-scrawl">{STATUS_LABEL[pup.status]}</span>}
        {hasVideo && !small && <span className="tp-sketch__video">▶ video</span>}
        {small && <span className="tp-sketch__sticker tp-sketch__sticker--home font-scrawl">gone home ♥</span>}
      </span>
      <span className="tp-sketch__name font-plush">{pup.displayName}</span>
      {!small && (
        <span className="tp-sketch__meta">
          {pup.name ? `${pup.breed} · ` : ''}
          {pup.genderLabel.toLowerCase()}
          {pup.age ? ` · ${pup.age}` : ''}
        </span>
      )}
    </Link>
  )
}
