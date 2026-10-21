// The maths behind the walking Teddy (PupJourney): where each stop is, which stretch of
// scrolling he spends sitting at each one, and the path he walks between them.
// "Foot" = the point between his feet (150, 228) in the 300 × 240 drawing.

import { FLOOR, W } from './geometry'
import type { PoseName } from './geometry'

type Point = { x: number; y: number }
/** left, top, right, bottom of the visible drawing, in drawing units */
export type Box = [number, number, number, number]
export type Rect = { left: number; top: number; right: number; bottom: number }

const FOOT: Point = { x: W / 2, y: FLOOR }
/** where his foot point sits when peeking over something (only head and paws show) */
const PEEK_LEDGE = 159
/** the drawing's outline while walking */
export const WALK_BOX: Box = [48, 30, 288, 236]
const BOXES: Partial<Record<string, Box>> = {
  sit: [50, 26, 284, 234],
  peek: [148, 34, 280, 163],
  snug: [148, 40, 280, 163],
  bow: [58, 56, 292, 236],
}
const boxFor = (pose: string) => BOXES[pose] ?? WALK_BOX
/** on phones he peeks up from behind the WhatsApp bar, sunk this far */
const SINK = FLOOR - PEEK_LEDGE
/** a stop is "held" while its middle is between these fractions of the screen height */
const BAND: [number, number] = [0.42, 0.78]
const LANE_BAND: [number, number] = [0.6, 0.86]

export const clamp01 = (n: number) => Math.min(1, Math.max(0, n))
const smooth = (t: number) => t * t * (3 - 2 * t)
/** 0 → 1 as x goes from a to b, smoothed */
export const ramp = (a: number, b: number, x: number) => (b === a ? +(x >= b) : smooth(clamp01((x - a) / (b - a))))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const lerpBox = (a: Box, b: Box, t: number): Box => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t), lerp(a[3], b[3], t)]
// a max/min with rounded corners, so he eases against the screen edges instead of bumping
const softMax = (x: number, floor: number, k: number) => {
  const s = (x - floor) / k
  return s > 20 ? x : floor + k * Math.log1p(Math.exp(s))
}
const softMin = (x: number, ceil: number, k: number) => -softMax(-x, -ceil, k)

function bezier(p0: Point, c1: Point, c2: Point, p1: Point, t: number): Point {
  const u = 1 - t
  const a = u * u * u
  const b = 3 * u * u * t
  const c = 3 * u * t * t
  const d = t * t * t
  return { x: a * p0.x + b * c1.x + c * c2.x + d * p1.x, y: a * p0.y + b * c1.y + c * c2.y + d * p1.y }
}

/**
 * How a stop moves with scrolling: "page" scrolls with the page, "screen" stays put,
 * "pin" scrolls in, holds still between `from` and `to` (a sticky section), then scrolls out.
 */
type Track = { kind: 'page'; top: number } | { kind: 'screen'; top: number } | { kind: 'pin'; top: number; from: number; to: number }

export type Stop = { x: number; track: Track; s: number; behind: boolean; sink: number; box: Box }
export type StopMeta = {
  scene: HTMLElement | null
  pose: PoseName
  facing: number
  act: string
  /** things on the scene he glances at while sitting there */
  looks: Element[]
  /** the moving strip he walks on (the pinned "meet the pups" row) */
  track: HTMLElement | null
}
export type Plan = {
  lane: boolean
  stops: Stop[]
  meta: StopMeta[]
  /** [start, end] scroll range he sits at each stop; he walks in the gaps between */
  holds: [number, number][]
  blend: number
  mainTop: number
}
export type Spot = { x: number; y: number; s: number; front: boolean; airborne: boolean; k: number; t: number; walked: number }

function trackTop(track: Track, scroll: number) {
  if (track.kind === 'page') return track.top - scroll
  if (track.kind === 'screen') return track.top
  if (scroll < track.from) return track.top - (scroll - track.from)
  if (scroll > track.to) return track.top - (scroll - track.to)
  return track.top
}

/** On-screen foot point of a stop at a given scroll position */
function footAt(stop: Stop, scroll: number): Point {
  return { x: stop.x + FOOT.x * stop.s, y: trackTop(stop.track, scroll) + FOOT.y * stop.s }
}

/** Which stop (k) he's at, and how far (t, 0–1) he's walked towards the next one */
export function segmentAt(holds: [number, number][], scroll: number) {
  if (!holds.length || scroll <= holds[0][1]) return { k: 0, t: 0 }
  for (let k = 0; k < holds.length - 1; k++) {
    const leave = holds[k][1]
    const reach = holds[k + 1][0]
    if (scroll < reach) return { k, t: clamp01((scroll - leave) / Math.max(1, reach - leave)) }
    if (scroll <= holds[k + 1][1]) return { k: k + 1, t: 0 }
  }
  return { k: holds.length - 1, t: 0 }
}

/** Nudge a foot point so the whole drawing stays inside the safe area */
function keepInside(x: number, y: number, s: number, box: Box, safe: Rect, k = 8): Point {
  const l = (FOOT.x - box[0]) * s
  const r = (box[2] - FOOT.x) * s
  const t = (FOOT.y - box[1]) * s
  const b = (box[3] - FOOT.y) * s
  return {
    x: safe.right - safe.left > l + r ? softMin(softMax(x, safe.left + l, k), safe.right - r, k) : (safe.left + safe.right) / 2 - (r - l) / 2,
    y: safe.bottom - safe.top > t + b ? softMin(softMax(y, safe.top + t, k), safe.bottom - b, k) : safe.bottom - b,
  }
}

function stickyParent(el: Element) {
  for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) if (getComputedStyle(p).position === 'sticky') return p
  return null
}

function trackFor(el: Element, rect: DOMRect): Track {
  const sticky = stickyParent(el)
  if (!sticky) return { kind: 'page', top: rect.top + scrollY }
  const stickTop = parseFloat(getComputedStyle(sticky).top) || 0
  const inside = rect.top - sticky.getBoundingClientRect().top
  // measure where the sticky box would sit if it weren't stuck
  const was = sticky.style.position
  sticky.style.position = 'relative'
  const box = sticky.getBoundingClientRect()
  const parent = sticky.parentElement!
  const parentEnd = parent.getBoundingClientRect().bottom - (parseFloat(getComputedStyle(parent).paddingBottom) || 0)
  sticky.style.position = was
  const from = box.top + scrollY - stickTop
  const to = parentEnd + scrollY - box.height - stickTop
  return to <= from ? { kind: 'page', top: box.top + scrollY + inside } : { kind: 'pin', top: stickTop + inside, from, to }
}

/** The scroll range during which a stop sits comfortably on screen */
function holdRange(stop: Stop, safe: Rect, band: [number, number]): [number, number] {
  if (stop.track.kind === 'pin') return [stop.track.from, stop.track.to]
  const top = stop.track.top + stop.box[1] * stop.s
  const bottom = stop.track.top + stop.box[3] * stop.s
  const mid = (top + bottom) / 2
  const h = safe.bottom - safe.top
  let start = Math.max(mid - (safe.top + band[1] * h), bottom - safe.bottom)
  let end = Math.min(mid - (safe.top + band[0] * h), top - safe.top)
  if (start > end) start = end = mid - (safe.top + h / 2)
  return [start, end]
}

/**
 * Turn the wanted hold ranges into ones that don't overlap and leave each walk
 * enough scrolling (`gaps`) to look like a walk rather than a teleport.
 */
function fitHolds(ranges: [number, number][], gaps: number[], maxScroll: number) {
  const holds = ranges.map(([a, b]): [number, number] => (a <= b ? [a, b] : [(a + b) / 2, (a + b) / 2]))
  if (!holds.length) return holds
  holds[0][0] = -Infinity
  const last = holds[holds.length - 1]
  last[1] = Infinity
  last[0] = Math.min(last[0], maxScroll - 1)
  for (let i = 0; i < holds.length - 1; i++) {
    const cur = holds[i]
    const next = holds[i + 1]
    if (next[0] < cur[1]) {
      const mid = (cur[1] + next[0]) / 2
      cur[1] = Math.max(cur[0], mid)
      next[0] = Math.min(next[1], mid)
      if (next[0] < cur[1]) next[0] = cur[1]
    }
    let need = (gaps[i] ?? 0) - (next[0] - cur[1])
    if (need > 0) {
      const fromCur = Math.min(need / 2, cur[1] - cur[0])
      const fromNext = Math.min(need / 2, next[1] - next[0])
      cur[1] -= fromCur
      next[0] += fromNext
      need -= fromCur + fromNext
      const more = Math.min(need, next[1] - next[0])
      next[0] += more
      need -= more
      if (need > 0) cur[1] -= Math.min(need, cur[1] - cur[0])
    }
  }
  for (const h of holds) if (h[1] < h[0]) h[1] = h[0]
  return holds
}

/** Read every [data-pup-stop] on the page and work out Teddy's whole route */
export function measure(probe: HTMLElement): Plan {
  const lane = matchMedia('(max-width: 767px), (pointer: coarse) and (max-height: 519px)').matches
  const vw = document.documentElement.clientWidth
  const vh = probe.getBoundingClientRect().height || innerHeight
  const headerH = document.getElementById('site-header')?.offsetHeight ?? 76
  const bar = document.querySelector('[data-whatsapp-bar]')
  const safe: Rect = { left: 10, top: headerH + 10, right: vw - 10, bottom: vh - 10 - (bar?.getClientRects().length ? bar.getBoundingClientRect().height : 0) }
  const main = document.getElementById('main')
  const stops: Stop[] = []
  const meta: StopMeta[] = []
  const ranges: [number, number][] = []

  const add = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect()
    const pose = (el.dataset.pose || 'sit') as PoseName
    const act = el.dataset.act ?? ''
    const fit = rect.width / W
    // the walker is drawn a little bigger than the sitting Teddy, except in the basket and on phones
    const s = act === 'basket' || lane ? fit : 1.12 * fit
    const anchor = pose === 'peek' ? { x: FOOT.x, y: PEEK_LEDGE } : FOOT
    const track = trackFor(el, rect)
    track.top += anchor.y * (fit - s)
    const stop: Stop = { x: rect.left + anchor.x * (fit - s), track, s, behind: el.dataset.behind === 'true', sink: 0, box: boxFor(pose) }
    const scene = el.closest<HTMLElement>('[data-pup-scene]')
    stops.push(stop)
    meta.push({
      scene,
      pose,
      facing: el.dataset.facing === 'left' ? -1 : 1,
      act,
      looks: scene ? [...scene.querySelectorAll('[data-pup-look]')] : [],
      track: act === 'treadmill' ? (scene?.querySelector<HTMLElement>('[data-treadmill]') ?? null) : null,
    })
    let range = holdRange(stop, safe, lane ? LANE_BAND : BAND)
    // leave a stop before its section has scrolled away, so he's walking while the next one comes in
    if (!lane && scene && stop.track.kind === 'page' && act !== 'basket' && act !== 'peekaboo') {
      const h = safe.bottom - safe.top
      const sceneTop = scene.getBoundingClientRect().top + scrollY - safe.top + 0.08 * h
      const bottomOut = stop.track.top + stop.box[3] * stop.s - safe.bottom
      if (range[1] > sceneTop) {
        const end = Math.max(sceneTop, bottomOut + 0.12 * h)
        range = [Math.max(bottomOut, end - Math.max(range[1] - range[0], 0.2 * h)), end]
      }
    }
    ranges.push(range)
  }

  const els = [...document.querySelectorAll<HTMLElement>('[data-pup-stop]')].filter((el) => el.getClientRects().length)
  if (lane) {
    // phones: start and end at the real stops; in between he peeks up from the bottom edge, one scene at a time
    const laneStops = els.filter((el) => el.dataset.lane === 'true')
    const first = laneStops[0]
    const last = laneStops.length > 1 ? laneStops[laneStops.length - 1] : undefined
    if (first) add(first)
    const firstScene = meta[0]?.scene ?? null
    const scenes = [...document.querySelectorAll<HTMLElement>('#main [data-pup-scene]')].filter((el) => el !== firstScene && el.getClientRects().length)
    const s = Math.min(0.62, Math.max(0.5, vw / 650))
    const box = boxFor('peek')
    scenes.forEach((scene, i) => {
      const left = i % 2 === 0
      stops.push({ x: left ? safe.left + 2 - box[0] * s : safe.right - 2 - box[2] * s, track: { kind: 'screen', top: 0 }, s, behind: false, sink: SINK, box })
      meta.push({ scene, pose: 'peek', facing: left ? 1 : -1, act: 'lane', looks: [], track: null })
      const r = scene.getBoundingClientRect()
      const a = r.top + scrollY - 0.42 * vh
      const b = r.bottom + scrollY - 0.58 * vh
      ranges.push(a <= b ? [a, b] : [(a + b) / 2, (a + b) / 2])
    })
    if (last) add(last)
  } else els.forEach(add)

  // how much scrolling each walk gets: roughly its length, within limits
  const gaps = stops.slice(1).map((to, i) => {
    const from = stops[i]
    const dx = Math.abs(to.x + FOOT.x * to.s - (from.x + FOOT.x * from.s))
    return Math.min(1.4 * vh, Math.max((lane ? 0.32 : 0.5) * vh, 1.15 * Math.hypot(dx, (BAND[1] - BAND[0]) * vh)))
  })
  return {
    lane,
    stops,
    meta,
    holds: fitHolds(ranges, gaps, document.documentElement.scrollHeight - innerHeight),
    blend: 0.12 * vh,
    mainTop: main ? main.getBoundingClientRect().top + scrollY : 0,
  }
}

/** The path between two stops: a gentle S-curve, bowed sideways if they're nearly stacked */
function arc(p0: Point, p1: Point, safe: Rect) {
  const dx = p1.x - p0.x
  const reach = Math.max(0.45 * Math.abs(dx), 0)
  const dir = dx >= 0 ? 1 : -1
  let c1 = { x: p0.x + dir * reach, y: p0.y }
  let c2 = { x: p1.x - dir * reach, y: p1.y }
  const min = 0.14 * (safe.right - safe.left)
  if (Math.abs(dx) < min) {
    const bow = ((p0.x + p1.x) / 2 < (safe.left + safe.right) / 2 ? 1 : -1) * (min - Math.abs(dx)) * 0.9
    c1 = { x: c1.x + bow, y: lerp(p0.y, p1.y, 0.2) }
    c2 = { x: c2.x + bow, y: lerp(p0.y, p1.y, 0.8) }
  }
  const inside = (p: Point) => ({ x: Math.min(safe.right, Math.max(safe.left, p.x)), y: Math.min(safe.bottom, Math.max(safe.top, p.y)) })
  return { p0, c1: inside(c1), c2: inside(c2), p1 }
}

/** Where Teddy is, how big, and what he's doing, at a scroll position */
export function spotAt(plan: Plan, scroll: number, safe: Rect): Spot {
  const { stops, holds } = plan
  const { k, t } = segmentAt(holds, scroll)
  if (t <= 0 || k >= stops.length - 1) {
    const stop = stops[k]
    const foot = footAt(stop, scroll)
    const p = keepInside(foot.x, foot.y, stop.s, stop.box, safe)
    return { x: p.x, y: p.y, s: stop.s, front: !stop.behind, airborne: false, k, t: 0, walked: 0 }
  }
  const from = stops[k]
  const to = stops[k + 1]
  const leave = holds[k][1]
  const reach = holds[k + 1][0]
  const len = Math.max(1, reach - leave)
  const v = clamp01((scroll - leave) / len)
  const a = footAt(from, leave)
  const b = footAt(to, reach)
  const path = arc({ x: a.x, y: a.y - from.sink * from.s }, { x: b.x, y: b.y - to.sink * to.s }, safe)
  const w = v * v * v * (v * (6 * v - 15) + 10)
  const p = bezier(path.p0, path.c1, path.c2, path.p1, w)
  const s = lerp(from.s, to.s, smooth(clamp01(v / 0.65)))
  // near each end, follow the stop as it keeps scrolling, so the hand-over is seamless
  const edge = Math.min(0.3, Math.max(0.06, plan.blend / len))
  let y = p.y + (1 - ramp(0, edge, v)) * (footAt(from, scroll).y - a.y) + ramp(1 - edge, 1, v) * (footAt(to, scroll).y - b.y)
  y += from.sink * from.s * (1 - ramp(0, 0.22, v)) + to.sink * to.s * ramp(0.78, 1, v)
  let airborne = false
  // hop out from behind / back in behind things
  if (from.behind && v < 0.36) {
    y -= Math.sin((v / 0.36) * Math.PI) * Math.min(64 * from.s, 72)
    airborne = v < 0.32
  }
  if (to.behind && v > 0.68) {
    y -= Math.sin(((v - 0.68) / 0.32) * Math.PI) * Math.min(56 * to.s, 60)
    airborne = true
  }
  if (from.sink && v < 0.2) airborne = true
  const front = !((from.behind && v < 0.12) || (to.behind && v > 0.92))
  const box =
    v < 0.5
      ? lerpBox(from.box, WALK_BOX, ramp(0, from.sink ? 0.22 : from.behind ? 0.36 : 0.06, v))
      : lerpBox(WALK_BOX, to.box, ramp(to.sink ? 0.78 : to.behind ? 0.68 : 0.94, 1, v))
  const q = keepInside(p.x, y, s, box, safe)
  let walked = 0
  let prev = path.p0
  const steps = Math.max(1, Math.ceil(32 * clamp01(w)))
  for (let i = 1; i <= steps; i++) {
    const pt = bezier(path.p0, path.c1, path.c2, path.p1, (i / steps) * clamp01(w))
    walked += Math.hypot(pt.x - prev.x, pt.y - prev.y)
    prev = pt
  }
  return { x: q.x, y: q.y, s, front, airborne, k, t: v, walked }
}

/**
 * Once scrolling stops, don't leave him frozen mid-hop: settle on the nearer end of
 * the hop (or sink) so he's either behind the thing or clear of it.
 */
export function settledScroll(plan: Plan, scroll: number) {
  const { stops, holds } = plan
  const { k, t } = segmentAt(holds, scroll)
  if (t <= 0 || k >= stops.length - 1) return scroll
  const from = stops[k]
  const to = stops[k + 1]
  const out = from.sink ? 0.22 : from.behind ? 0.36 : 0
  const back = to.sink ? 0.78 : to.behind ? 0.68 : 1
  let v = t
  if (t < out) v = t < out / 2 ? 0 : out
  else if (t > back) v = t > (1 + back) / 2 ? 1 : back
  return v === t ? scroll : holds[k][1] + v * (holds[k + 1][0] - holds[k][1])
}
