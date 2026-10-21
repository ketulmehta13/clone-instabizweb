// Teddy, the cartoon puppy: shapes, colours, poses, and the maths that turns a pose
// into SVG transforms. Everything is drawn in a 300 × 240 box.

export const W = 300
export const H = 240
/** y of the ground line */
export const FLOOR = 228
/** y of the eyes */
export const EYE_Y = 98
/** point the head turns around */
export const HEAD_PIVOT: Point = [212, 100]

export const INK = '#2a170e'
export const FUR = '#f2be6b'
export const FUR_DARK = '#e4a352'
export const CREAM = '#fbe3b4'
export const COLLAR = '#a24a1a'
export const BLUSH = '#f9b9a6'

type Point = [number, number]

/** A fluffy blob: an ellipse with `bumps` scalloped edges. */
function fluff(cx: number, cy: number, rx: number, ry: number, bumps: number, puff: number, start = -Math.PI / 2, tiltDeg = 0) {
  const tilt = (tiltDeg * Math.PI) / 180
  const pt = (a: number, out: number) => {
    const x = Math.cos(a) * (rx + out)
    const y = Math.sin(a) * (ry + (ry / rx) * out)
    return `${(cx + x * Math.cos(tilt) - y * Math.sin(tilt)).toFixed(1)} ${(cy + x * Math.sin(tilt) + y * Math.cos(tilt)).toFixed(1)}`
  }
  let d = ''
  for (let i = 0; i < bumps; i++) {
    const a0 = start + (i / bumps) * Math.PI * 2
    const a1 = start + ((i + 1) / bumps) * Math.PI * 2
    d += `${i === 0 ? `M${pt(a0, 0)}` : ''}Q${pt((a0 + a1) / 2, 2.1 * puff)} ${pt(a1, 0)}`
  }
  return `${d}Z`
}

const SHOULDER_NEAR: Point = [186, 194]
const SHOULDER_FAR: Point = [168, 192]
const HIP_NEAR: Point = [110, 194]
const HIP_FAR: Point = [94, 192]
const TAIL_BASE: Point = [84, 150]
const EAR_L: Point = [174, 82]
const EAR_R: Point = [250, 82]

export const JOINTS = { shoulderN: SHOULDER_NEAR, shoulderF: SHOULDER_FAR, hipN: HIP_NEAR, hipF: HIP_FAR, tailBase: TAIL_BASE }

export const PATHS = {
  body: fluff(140, 170, 64, 36, 15, 3.4, 0.95 * Math.PI),
  chest: fluff(192, 166, 30, 32, 9, 3.2, 0.6 * Math.PI),
  tail: fluff(70, 126, 17, 16, 9, 3.2),
  tailStem: 'M86 152 C80 146 76 140 74 136',
  haunch: fluff(110, 204, 30, 24, 10, 3.2, Math.PI),
  haunchPaw: 'M112 214 C126 212 142 214 146 221 C148 226 144 229 136 229 L116 229 C108 229 104 224 106 219 Z',
  head: fluff(212, 100, 51, 46, 16, 3.6),
  topknot: fluff(212, 52, 17, 12, 8, 2.9, Math.PI),
  earL: fluff(170, 112, 19, 34, 10, 3.2, -Math.PI / 2, 12),
  earR: fluff(254, 112, 19, 34, 10, 3.2, -Math.PI / 2, -12),
  muzzle: 'M188 120 C188 106 200 100 212 100 C224 100 236 106 236 120 C236 133 225 140 212 140 C199 140 188 133 188 120 Z',
  nose: 'M204.5 111.5 Q212 107.2 219.5 111.5 Q218.2 118.4 212 120 Q205.8 118.4 204.5 111.5 Z',
  mouth: 'M212 120 V124.5 M212 124.5 Q207.2 129.6 202.8 125.2 M212 124.5 Q216.8 129.6 221.2 125.2',
  mouthOpen: 'M203 126 Q212 122 221 126 Q219 138 212 139 Q205 138 203 126 Z',
  tongue: 'M207.6 127.4 Q212 136.6 216.4 127.4 Z',
  collar: 'M178 146 Q212 162 246 146 L246 154 Q212 170 178 154 Z',
  tag: 'M212 160 C212 156 206 155 206 159.4 C206 163 212 166.6 212 168.4 C212 166.6 218 163 218 159.4 C218 155 212 156 212 160 Z',
  ledgePaws: 'M175 159 C175 148 181 142 190 142 C199 142 205 148 205 159 Z M219 159 C219 148 225 142 234 142 C243 142 249 148 249 159 Z',
  ledgeToes: 'M186 153 v-4.5 M194 153 v-4.5 M230 153 v-4.5 M238 153 v-4.5',
  shadow: { cx: 150, cy: 230, rx: 92, ry: 7 },
}

/** A leg hanging down from its joint, `length` long */
function leg(width: number, length: number) {
  const h = width / 2
  return `M${-h} -14 C${-h} 4 -12 ${length - 18} -12 ${length - 9} C-12 ${length - 2} -7 ${length} 0 ${length} C9 ${length} 13 ${length - 3} 13 ${length - 9} C13 ${length - 18} ${h} 4 ${h} -14`
}

export const LEGS = {
  front: leg(24, FLOOR - SHOULDER_NEAR[1]),
  frontFar: leg(22, FLOOR - SHOULDER_FAR[1]),
  back: leg(30, FLOOR - HIP_NEAR[1]),
  backFar: leg(28, FLOOR - HIP_FAR[1]),
}

/** Little toe lines at the bottom of a leg */
export const toes = (length: number) => `M-3.5 ${length - 7} v5 M4.5 ${length - 7} v5`

export type Pose = {
  bodyRot: number
  bodyX: number
  bodyY: number
  stretch: number
  headX: number
  headY: number
  headRot: number
  earL: number
  earR: number
  tail: number
  fn: number
  ff: number
  bn: number
  bf: number
  /** 0 = standing, 1 = sitting (back legs tucked under) */
  sit: number
  /** 1 = eyes open, 0 = asleep */
  eyes: number
  happy: number
  tongue: number
  mouth: number
  /** 1 = seen from the front, peeking over a ledge */
  front: number
}

const STAND: Pose = {
  bodyRot: 0, bodyX: 0, bodyY: 0, stretch: 1, headX: 0, headY: 0, headRot: 0, earL: 0, earR: 0, tail: 0,
  fn: 0, ff: 0, bn: 0, bf: 0, sit: 0, eyes: 1, happy: 0, tongue: 0, mouth: 0, front: 0,
}

export const POSES = {
  stand: STAND,
  walk: { ...STAND, tail: -6, tongue: 1 },
  sit: { ...STAND, bodyRot: -24, bodyY: -2, headX: -10, headY: -6, tail: 34, sit: 1, tongue: 1 },
  peek: { ...STAND, headY: 4, earL: -6, earR: 6, tail: -20, front: 1, tongue: 1 },
  snug: { ...STAND, headY: 9, headRot: 4, earL: 3, earR: -3, tail: -20, front: 1, tongue: 0 },
  lie: { ...STAND, bodyRot: -5, bodyY: 22, headX: 12, headY: 40, headRot: 3, fn: -84, ff: -80, sit: 1, tail: 58, tongue: 0 },
  sleep: { ...STAND, bodyRot: -5, bodyY: 22, headX: 14, headY: 44, headRot: -8, fn: -84, ff: -80, sit: 1, tail: 64, eyes: 0, earL: 4, earR: -4 },
  settle: { ...STAND, bodyRot: -5, bodyY: 22, headX: 10, headY: 16, fn: -84, ff: -80, sit: 1, tail: 40, tongue: 1 },
  hop: { ...STAND, bodyRot: -9, stretch: 1.06, headY: -6, fn: -42, ff: -32, bn: 40, bf: 30, earL: -26, earR: 26, tail: -24, tongue: 1 },
  sniff: { ...STAND, bodyRot: 7, headX: 16, headY: 32, headRot: 9, tail: -14, fn: 6, ff: 4 },
  bow: { ...STAND, bodyRot: 15, bodyY: 2, headX: 14, headY: 30, fn: -58, ff: -52, tail: -32, happy: 1, tongue: 1 },
  beg: { ...STAND, bodyRot: -36, bodyY: -6, headX: -18, headY: -18, sit: 1, fn: -70, ff: -64, tail: 30, happy: 1, tongue: 1 },
} satisfies Record<string, Pose>

export type PoseName = keyof typeof POSES

const POSE_KEYS = Object.keys(STAND) as (keyof Pose)[]

/** Moment-to-moment motion that sits on top of a pose */
export type Motion = {
  /** walk cycle angle */
  phase: number
  /** 0 = still, 1 = full stride */
  stride: number
  time: number
  wag: number
  gazeX: number
  gazeY: number
  blink: number
  ear: number
}

export const STILL: Motion = { phase: 0, stride: 0, time: 0, wag: 0, gazeX: 0, gazeY: 0, blink: 0, ear: 0 }

export function lerpPose(a: Pose, b: Pose, t: number): Pose {
  const out = { ...a }
  for (const k of POSE_KEYS) out[k] = a[k] + (b[k] - a[k]) * t
  return out
}

const r2 = (n: number) => Math.round(100 * n) / 100
const rot = (deg: number, [x, y]: Point) => `rotate(${r2(deg)} ${x} ${y})`

export type Rig = ReturnType<typeof rig>

/** Turn a pose (+ motion) into the transform/opacity of every body part */
export function rig(p: Pose, m: Motion = STILL) {
  const swing = Math.sin(m.phase)
  const swingOpp = Math.sin(m.phase + Math.PI)
  const reach = 20 + 10 * m.stride
  const bob = (1 - Math.cos(2 * m.phase)) / 2
  const moving = m.stride > 0.01 ? 1 : 0
  const breathe = Math.sin(2.4 * m.time) * (1 - moving)
  const bodyY = p.bodyY - bob * (2.5 + 4 * m.stride) * moving + 0.6 * breathe
  const bodyRot = p.bodyRot + 1.6 * Math.sin(m.phase) * moving
  const counter = -p.bodyRot
  const wagSize = 5 + 17 * m.wag
  const wagSpeed = 1.2 + 2.6 * m.wag
  const tail = p.tail + Math.sin(m.time * wagSpeed * Math.PI * 2) * wagSize
  const headBob = (-(1 - Math.cos(2 * m.phase - 0.7)) / 2) * (2 + 3 * m.stride) * moving + 0.9 * breathe
  const pivot: Point = [196, 206]
  return {
    body: `translate(${r2(p.bodyX)} ${r2(bodyY)}) ${rot(bodyRot, pivot)} translate(${pivot[0]} 0) scale(${r2(p.stretch)} 1) translate(${-pivot[0]} 0)`,
    fn: `translate(${SHOULDER_NEAR[0]} ${SHOULDER_NEAR[1]}) rotate(${r2(p.fn + counter + swing * reach * moving)})`,
    ff: `translate(${SHOULDER_FAR[0]} ${SHOULDER_FAR[1]}) rotate(${r2(p.ff + counter + swingOpp * reach * moving)})`,
    bn: `translate(${HIP_NEAR[0]} ${HIP_NEAR[1]}) rotate(${r2(p.bn + swingOpp * reach * moving)})`,
    bf: `translate(${HIP_FAR[0]} ${HIP_FAR[1]}) rotate(${r2(p.bf + swing * reach * moving)})`,
    tail: rot(tail, TAIL_BASE),
    haunch: `translate(0 ${r2(-(0.06 * p.bodyRot))})`,
    head: `translate(${r2(p.headX)} ${r2(p.headY + headBob)}) ${rot(p.headRot + 1.4 * Math.sin(m.phase) * moving, HEAD_PIVOT)}`,
    earL: rot(p.earL + m.ear + 4 * Math.sin(2 * m.phase) * moving, EAR_L),
    earR: rot(p.earR - m.ear - 4 * Math.sin(2 * m.phase) * moving, EAR_R),
    eyes: `translate(${r2(3.4 * m.gazeX)} ${r2(2.6 * m.gazeY)})`,
    blink: `translate(0 ${r2(EYE_Y * m.blink * 0.92)}) scale(1 ${r2(1 - 0.92 * m.blink)})`,
    openEyes: r2(Math.max(0, p.eyes - p.happy)),
    happyEyes: r2(Math.min(p.happy, p.eyes)),
    shutEyes: r2(1 - p.eyes),
    tongue: r2(p.tongue * (1 - p.mouth)),
    mouth: r2(p.mouth),
    backLegs: r2(1 - p.sit),
    haunchOpacity: r2(p.sit * (1 - p.front)),
    side: r2(1 - p.front),
    ledge: r2(p.front),
    shadow: `translate(${r2(0.6 * p.bodyX)} 0) scale(${r2(1 - 0.05 * bob * moving)} 1)`,
    shadowOpacity: r2(0.12 * (1 - p.front)),
  }
}

/** A paw print: one big pad and four toe beans (64 × 64 box) */
function bean(cx: number, cy: number, rx: number, ry: number, deg: number) {
  const a = (deg * Math.PI) / 180
  const c = Math.cos(a)
  const s = Math.sin(a)
  const p = (x: number, y: number) => `${(cx + x * c - y * s).toFixed(2)} ${(cy + x * s + y * c).toFixed(2)}`
  const k = 0.5523
  return `M${p(rx, 0)}C${p(rx, k * ry)} ${p(k * rx, ry)} ${p(0, ry)}C${p(-(k * rx), ry)} ${p(-rx, k * ry)} ${p(-rx, 0)}C${p(-rx, -(k * ry))} ${p(-(k * rx), -ry)} ${p(0, -ry)}C${p(k * rx, -ry)} ${p(rx, -(k * ry))} ${p(rx, 0)}Z`
}

export const PAW_PATH =
  'M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5z' +
  bean(14.6, 29.2, 5.3, 6.9, -28) +
  bean(24.2, 16.6, 5.5, 7.3, -10) +
  bean(39.8, 16.6, 5.5, 7.3, 10) +
  bean(49.4, 29.2, 5.3, 6.9, 28)
