import { EYE_Y, H, HEAD_PIVOT, POSES, STILL, W, lerpPose, rig } from './geometry'
import type { Motion, Pose, PoseName } from './geometry'

/** [element name, attribute, rig key] — what tick() writes each frame */
const BINDINGS: [string, string, string][] = [
  ['root', 'transform', 'root'],
  ['shadow', 'transform', 'shadow'],
  ['shadow', 'opacity', 'shadowOpacity'],
  ['body', 'transform', 'body'],
  ['body', 'opacity', 'side'],
  ['bf', 'transform', 'bf'],
  ['bf', 'opacity', 'backLegs'],
  ['bn', 'transform', 'bn'],
  ['bn', 'opacity', 'backLegs'],
  ['ff', 'transform', 'ff'],
  ['fn', 'transform', 'fn'],
  ['tail', 'transform', 'tail'],
  ['haunch', 'transform', 'haunch'],
  ['haunch', 'opacity', 'haunchOpacity'],
  ['head', 'transform', 'head'],
  ['earL', 'transform', 'earL'],
  ['earR', 'transform', 'earR'],
  ['eyes', 'transform', 'eyes'],
  ['open', 'opacity', 'openEyes'],
  ['blink', 'transform', 'blink'],
  ['happy', 'opacity', 'happyEyes'],
  ['shut', 'opacity', 'shutEyes'],
  ['tongue', 'opacity', 'tongue'],
  ['mouth', 'opacity', 'mouth'],
  ['ledge', 'opacity', 'ledge'],
]

/** Smoothing factor for an exponential ease with time constant `tau` */
const ease = (dt: number, tau: number) => 1 - Math.exp(-dt / tau)
const clamp = (n: number, lo = -1, hi = 1) => Math.max(lo, Math.min(hi, n))

/**
 * Brings a PupDrawing to life. Holds a target pose and eases towards it every
 * frame, layering on walking, wagging, blinking, gaze and little bounces.
 */
export class PupRig {
  svg: SVGSVGElement
  els = new Map<string, Element>()
  written = new Map<string, string>()
  pose: Pose
  target: Pose
  m: Motion = { ...STILL }
  facing: number
  facingTarget: number
  strideTarget = 0
  wagTarget = 0.35
  gazeTarget = { x: 0, y: 0 }
  tilt = 0
  tiltTarget = 0
  earV = 0
  nextBlink = 1.2
  blinkAt = -1
  woofUntil = 0
  bounce = 0
  bounceV = 0
  offset = 0
  offsetTarget = 0
  pet = 0
  petTarget = 0
  turn = 0.07
  lean = 0

  constructor(svg: SVGSVGElement, pose: PoseName = 'sit', facing = 1) {
    this.svg = svg
    svg.querySelectorAll<SVGElement>('[data-p]').forEach((el) => this.els.set(el.dataset.p!, el))
    this.pose = { ...POSES[pose] }
    this.target = this.pose
    this.facing = facing
    this.facingTarget = facing
  }

  setPose(p: PoseName | Pose) {
    this.target = typeof p === 'string' ? POSES[p] : p
  }
  jump(p: PoseName, facing?: number) {
    this.pose = { ...POSES[p] }
    this.target = POSES[p]
    if (facing) this.facing = this.facingTarget = facing
  }
  face(dir: number, speed = 0.07) {
    this.facingTarget = dir
    this.turn = speed
  }
  get facingDir() {
    return this.facingTarget
  }
  stride(n: number) {
    this.strideTarget = clamp(n, 0, 1)
  }
  advance(px: number) {
    this.m.phase += (px / 46) * Math.PI
  }
  walkedTo(px: number) {
    this.m.phase = (px / 46) * Math.PI
  }
  wag(n: number) {
    this.wagTarget = clamp(n, 0, 1)
  }
  cock(deg: number) {
    this.tiltTarget = deg
  }
  /** Turn the eyes towards a point on screen (or back to centre) */
  lookAt(p: { x: number; y: number } | null) {
    if (!p) {
      this.gazeTarget = { x: 0, y: 0 }
      return
    }
    const box = this.svg.getBoundingClientRect()
    const eyeX = this.facingTarget > 0 ? HEAD_PIVOT[0] : W - HEAD_PIVOT[0]
    const ex = box.left + (eyeX / W) * box.width
    const ey = box.top + (EYE_Y / H) * box.height
    const dx = p.x - ex
    const dy = p.y - ey
    const dist = Math.hypot(dx, dy) || 1
    const k = Math.min(1, dist / 160)
    this.gazeTarget = { x: (dx / dist) * k * this.facingTarget, y: (dy / dist) * k }
  }
  woof(now: number) {
    this.woofUntil = now + 0.34
    this.bounceV = -150
    this.earV += 260
  }
  jolt(n = 1) {
    this.earV += 220 * n
  }
  hop(n = 1) {
    this.bounceV = -230 * n
    this.earV += 200 * n
  }
  yawn(now: number, secs = 0.9) {
    this.woofUntil = now + secs
  }
  dash(px: number) {
    this.offsetTarget = px
  }
  petting(on: boolean) {
    this.petTarget = on ? 1 : 0
  }
  reset() {
    this.offsetTarget = 0
    this.tiltTarget = 0
    this.petTarget = 0
  }

  /** Advance the animation by `dt` seconds and write the result to the SVG */
  tick(dt: number, now: number) {
    dt = Math.min(dt, 0.05)
    const m = this.m
    m.time = now
    this.pose = lerpPose(this.pose, this.target, ease(dt, 0.16))
    this.facing += (this.facingTarget - this.facing) * ease(dt, this.turn)
    m.stride += (this.strideTarget - m.stride) * ease(dt, 0.12)
    if (m.stride < 0.012 && this.strideTarget === 0) m.stride = 0
    m.wag += (this.wagTarget - m.wag) * ease(dt, 0.4)
    m.gazeX += (this.gazeTarget.x - m.gazeX) * ease(dt, 0.07)
    m.gazeY += (this.gazeTarget.y - m.gazeY) * ease(dt, 0.07)
    this.tilt += (this.tiltTarget + 3 * m.gazeX - this.tilt) * ease(dt, 0.18)
    // springy ears and bounce
    this.earV += (-150 * m.ear - 10 * this.earV) * dt
    m.ear = clamp(m.ear + this.earV * dt, -28, 28)
    this.bounceV += (-260 * this.bounce - 16 * this.bounceV) * dt
    this.bounce += this.bounceV * dt

    const before = this.offset
    this.offset += (this.offsetTarget - this.offset) * ease(dt, 0.2)
    if (Math.abs(this.offsetTarget - this.offset) < 0.05) this.offset = this.offsetTarget
    const moved = Math.abs(this.offset - before)
    if (moved) this.advance(moved)
    const dashStride = dt > 0 ? Math.min(1, moved / dt / 180) : 0

    this.pet += (this.petTarget - this.pet) * ease(dt, 0.15)
    if (now > this.nextBlink && this.pose.eyes > 0.6) {
      this.blinkAt = now
      this.nextBlink = now + 2.2 + 3.8 * Math.random()
      if (Math.random() < 0.18) this.nextBlink = now + 0.32 // sometimes a double blink
    }
    const b = (now - this.blinkAt) / 0.15
    m.blink = b >= 0 && b <= 1 ? Math.sin(b * Math.PI) : 0

    const pose: Pose = {
      ...this.pose,
      headRot: this.pose.headRot + this.tilt,
      bodyRot: this.pose.bodyRot + this.lean,
      bodyY: this.pose.bodyY + this.bounce,
      headY: this.pose.headY + 1.15 * this.bounce,
      mouth: now < this.woofUntil ? 1 : this.pose.mouth,
      happy: Math.max(this.pose.happy, this.pet),
    }
    const out: Record<string, string | number> = rig(pose, dashStride > m.stride ? { ...m, stride: dashStride } : m)
    const flip = Math.abs(this.facing) < 0.02 ? 0.02 * Math.sign(this.facing || 1) : this.facing
    out.root = `translate(${this.offset.toFixed(1)} 0) translate(${W / 2} 0) scale(${flip.toFixed(3)} 1) translate(${-W / 2} 0)`
    for (const [name, attr, key] of BINDINGS) {
      const el = this.els.get(name)
      if (!el) continue
      const value = String(out[key])
      const id = `${name}:${attr}`
      if (this.written.get(id) !== value) {
        el.setAttribute(attr, value)
        this.written.set(id, value)
      }
    }
  }
}
