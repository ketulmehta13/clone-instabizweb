import { useEffect, useRef } from 'react'
import { onFrame, prefersReducedMotion } from '../../lib/motion'
import type { PupCue } from './cue'
import { FLOOR, PAW_PATH, POSES, W } from './geometry'
import { measure, settledScroll, spotAt } from './journey'
import type { Plan, Rect, Spot, StopMeta } from './journey'
import { PupDrawing } from './PupDrawing'
import { PupRig } from './PupRig'
import { TRICKS, hearts, pickTrick } from './tricks'
import type { Cue, TrickContext, TrickName } from './tricks'

const FOOT_X = W / 2
/** what he does when clicked mid-walk */
const WALK_TRICKS = ['jump', 'woof', 'love', 'sneeze'] as const
type WalkTrick = (typeof WALK_TRICKS)[number]
const PRINT_COUNT = 24

const setData = (el: HTMLElement, key: string, value: string) => el.dataset[key] !== value && (el.dataset[key] = value)
const pick = <T,>(list: readonly T[], not: T | null) => {
  const options = list.filter((x) => x !== not)
  return options[Math.floor(Math.random() * options.length)]
}
const seconds = () => performance.now() / 1000

// only one walker at a time (StrictMode mounts effects twice in development)
let stopActive: (() => void) | null = null

/**
 * Teddy walks down the home page as you scroll: from stop to stop ([data-pup-stop]),
 * hopping out from behind things, leaving paw prints, glancing at what's nearby and
 * doing tricks when clicked. Turned off for reduced motion, where the sitting Teddys stay.
 */
export function PupJourney() {
  const layerRef = useRef<HTMLDivElement>(null)
  const actorRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const bubbleRef = useRef<HTMLSpanElement>(null)
  const bubbleAtRef = useRef<HTMLSpanElement>(null)
  const printsRef = useRef<HTMLDivElement>(null)
  const probeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    stopActive?.()
    const layer = layerRef.current!
    const actor = actorRef.current!
    const body = bodyRef.current!
    const bubble = bubbleRef.current!
    const bubbleAt = bubbleAtRef.current!
    const probe = probeRef.current!
    const svg = body.querySelector('svg')!
    const html = document.documentElement
    const header = document.getElementById('site-header')
    const prints = [...printsRef.current!.children] as HTMLElement[]
    let printIdx = 0

    let plan: Plan | null = null
    let d: PupRig | null = null
    let live = false
    let replanTimer = 0

    let bubbleUntil = 0
    const say = (text: string, now: number, secs = 1.4) => {
      bubble.textContent = text
      bubble.dataset.show = 'true'
      bubbleUntil = now + secs
    }

    let mouse: { x: number; y: number; t: number } | null = null
    let gaze: { el: Element; until: number } | null = null
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') mouse = { x: e.clientX, y: e.clientY, t: seconds() }
    }
    // a section asked him to look at something (only if he's sitting in that section)
    const onCue = (e: Event) => {
      const cue = (e as CustomEvent<PupCue>).detail
      const scene = here >= 0 ? plan?.meta[here]?.scene : null
      if (!scene || (cue.look && !scene.contains(cue.look))) return
      const now = seconds()
      if (cue.look) gaze = { el: cue.look, until: now + (cue.secs ?? 1.6) }
      if (cue.say) say(cue.say, now)
    }
    // keyboard users: he watches whatever gets focus
    const onFocus = (e: FocusEvent) => {
      const t = e.target
      if (t instanceof HTMLElement && t.matches('a, button, input, textarea, select, summary')) gaze = { el: t, until: seconds() + 1.4 }
    }

    let last = seconds()
    let lastScroll = scrollY
    let prev: { x: number; y: number } | null = null
    let spot: Spot | null = null
    /** offset that eases away, so re-plans and settling never make him jump */
    const drift = { x: 0, y: 0, s: 0 }
    let still = 0
    let here = -1
    let arrivedAt = 0
    let busyAt = 0
    let cues: Cue[] = []
    let lookedAt = 0
    let lookIdx = -1
    let trackLeft: number | null = null
    let trackStill = 0
    let printSeg = -1
    let printStep = 0
    let fidgetAt = 0
    let scrolledAt = seconds()
    let scrollDir = 1
    let settling = false
    let follow: { x: number; y: number } | null = null
    let followBar = 0
    let followWalked = 0
    let anchorTop = 0

    const barTop = () => {
      const bar = document.querySelector('[data-whatsapp-bar]')
      const r = bar?.getClientRects().length ? bar.getBoundingClientRect() : null
      return r && r.height ? r.top : innerHeight - 6
    }
    const safeArea = (p: Plan): Rect => {
      const vw = html.clientWidth
      const top = (header?.offsetHeight ?? 76) + 10
      if (p.lane) return { left: 10, top, right: vw - 10, bottom: barTop() + 40 }
      const bar = document.querySelector('[data-whatsapp-bar]')
      const barY = bar?.getClientRects().length ? bar.getBoundingClientRect().top : innerHeight
      return { left: 10, top, right: vw - 10, bottom: Math.min(innerHeight, barY) - 10 }
    }
    const place = (p: Plan, scroll: number) => {
      if (p.lane) {
        const bar = barTop()
        for (const s of p.stops) if (s.track.kind === 'screen') s.track.top = bar - 159 * s.s
      }
      return spotAt(p, scroll, safeArea(p))
    }
    const trickContext = (m: StopMeta): TrickContext => ({
      d: d!,
      rest: POSES[m.pose],
      facing: m.facing,
      say: (text, secs) => say(text, seconds(), secs),
      hearts: () =>
        spot &&
        hearts(layer, spot.x - FOOT_X * spot.s + (d!.facingDir > 0 ? 212 : W - 212) * spot.s, spot.y - (FLOOR - 40) * spot.s - anchorTop),
    })

    const frame = () => {
      if (!plan || !d) return
      const now = seconds()
      const dt = Math.min(0.05, now - last)
      last = now
      const scroll = scrollY
      const scrolled = scroll - lastScroll
      lastScroll = scroll
      if (Math.abs(scrolled) > 0.5) {
        scrolledAt = now
        scrollDir = scrolled > 0 ? 1 : -1
      }
      while (cues.length && cues[0][0] <= now) cues.shift()![1](now)

      const virtual = now - scrolledAt > 0.25 ? settledScroll(plan, scroll) : scroll
      const target = place(plan, virtual)
      // phones, between two bottom-edge peeks: he trots along the bar instead of following the curve
      const from = plan.stops[target.k]
      const to = target.t > 0 ? plan.stops[target.k + 1] : from
      const alongBar = plan.lane && from.track.kind === 'screen' && to?.track.kind === 'screen'

      const fade = Math.exp(-dt / 0.28)
      drift.x *= fade
      drift.y *= fade
      drift.s *= fade
      if (Math.abs(drift.x) < 0.05 && Math.abs(drift.y) < 0.05) drift.x = drift.y = 0
      const settled = virtual !== scroll
      if (settled !== settling && prev && !alongBar) {
        drift.x = prev.x - target.x
        drift.y = prev.y - target.y
      }
      settling = settled

      const s = target.s + drift.s
      let x = target.x + drift.x
      let y = target.y + drift.y
      const bar = plan.lane ? barTop() : 0
      let caughtUp = true
      if (alongBar) {
        follow ??= prev ? { x: prev.x, y: prev.y - followBar } : { x, y: y - bar }
        const k = 1 - Math.exp(-dt / 0.14)
        follow.x += (x - follow.x) * k
        follow.y += (y - bar - follow.y) * k
        caughtUp = Math.hypot(x - follow.x, y - bar - follow.y) < 1.5
        x = follow.x
        y = bar + follow.y
      } else if (follow) {
        drift.x = (prev?.x ?? x) - target.x
        drift.y = (prev?.y ?? y) - target.y
        x = target.x + drift.x
        y = target.y + drift.y
        follow = null
      }
      followBar = bar
      spot = { ...target, x, y, s }
      // on phones, pin the layer to the bottom so the browser's toolbar sliding doesn't shake him
      setData(layer, 'anchor', alongBar ? 'bottom' : 'top')
      anchorTop = alongBar ? layer.getBoundingClientRect().top : 0

      const resting = target.t === 0 && caughtUp
      const k = target.k
      if (resting) {
        const m = plan.meta[k]
        if (here !== k) {
          // just arrived at a stop
          cues = []
          gaze = null
          here = k
          arrivedAt = busyAt = now
          trackLeft = null
          d.reset()
          d.setPose(m.pose)
          d.face(m.facing, 0.14)
          d.stride(0)
          d.wag(m.act === 'basket' ? 0.3 : 0.7)
          d.jolt(0.4)
          fidgetAt = now + 2.4
        }
        if (m.track && !cues.length) {
          // walking on the spot while the row of puppies slides past
          const left = m.track.getBoundingClientRect().left
          const moved = trackLeft === null ? 0 : left - trackLeft
          trackLeft = left
          d.walkedTo(-left / s)
          if (Math.abs(moved) > 0.15) {
            trackStill = 0
            d.setPose('walk')
            d.stride(1)
            d.face(moved < 0 ? 1 : -1, 0.16)
          } else if ((trackStill += dt) > 0.25) {
            d.setPose('stand')
            d.stride(0)
          }
        }
        if (m.act === 'tilt' && !cues.length && now - arrivedAt > 1.2) {
          const w = Math.sin(0.9 * now)
          d.cock(w > 0.35 ? 13 : w < -0.35 ? -10 : 0)
        }
        if (m.act === 'basket' && !cues.length && now > fidgetAt) {
          fidgetAt = now + 4.5 + 3 * Math.random()
          if (Math.random() < 0.7) d.jolt(0.55)
          else d.yawn(now, 0.7)
        }
        const watching = (gaze && gaze.until > now) || (mouse && now - mouse.t < 2.5)
        if (m.looks.length && !watching && now - arrivedAt > 0.8 && now - lookedAt > 1.7) {
          lookedAt = now
          lookIdx = (lookIdx + 1) % (m.looks.length + 1)
          if (lookIdx < m.looks.length) gaze = { el: m.looks[lookIdx], until: now + 1.4 }
        }
        if (Math.abs(scrolled) > 0.5) busyAt = now
        // left alone for a while: a little something on his own
        if (!cues.length && !m.track && m.act !== 'basket' && now - busyAt > 9) {
          busyAt = now
          cues =
            Math.random() < 0.55
              ? TRICKS.tilt(trickContext(m), now)
              : [
                  [now, () => d!.wag(1)],
                  [now + 2.4, () => d!.wag(0.7)],
                ]
        }
      } else {
        if (here !== -1) {
          here = -1
          cues = []
          d.reset()
        }
        const moved = prev ? Math.hypot(x - prev.x, y - prev.y) : 0
        still = moved > 0.25 ? 0 : still + dt
        let airborne = target.airborne
        if (plan.lane && target.t > 0) {
          const a = plan.stops[k]
          const b = plan.stops[k + 1]
          if (a.sink && target.t < 0.22) airborne = scrollDir > 0
          else if (b?.sink && target.t > 0.78) airborne = scrollDir < 0
        }
        if (airborne) {
          d.setPose('hop')
          d.stride(0)
        } else if (still > 0.3) {
          // stopped scrolling halfway: he waits for you
          d.setPose('stand')
          d.stride(0)
          if (still > 2.6 && still - dt <= 2.6) say('coming?', now)
        } else {
          d.setPose('walk')
          d.stride(1)
        }
        d.walkedTo((alongBar ? (followWalked += moved) : target.walked) / Math.max(0.05, s))
        if (prev) {
          const dx = x - prev.x
          if (Math.abs(dx) > 0.6 && Math.abs(dx) > 0.35 * Math.abs(y - prev.y)) d.face(dx > 0 ? 1 : -1, 0.16)
        }
        // paw prints, one every 34 drawing units walked, left/right alternating
        if (!plan.lane) {
          const step = Math.floor(target.walked / (34 * s))
          if (printSeg === k && step !== printStep && !target.airborne && prev) {
            const odd = step & 1
            const pawX = odd ? 186 : 110
            const left = x - FOOT_X * s
            const top = y - FLOOR * s
            const px = left + (d.facingDir > 0 ? pawX : W - pawX) * s
            const py = top + 226 * s + scroll - plan.mainTop + (odd ? -4 : 4) * s
            const angle = Math.atan2(y - prev.y + scrolled, x - prev.x) + Math.PI / 2
            const size = 14 * Math.max(0.75, 1.5 * s)
            const print = prints[printIdx++ % prints.length]
            print.style.transform = `translate(${(px - size / 2).toFixed(1)}px, ${(py - size / 2).toFixed(1)}px) rotate(${angle.toFixed(3)}rad)`
            print.style.width = print.style.height = `${size.toFixed(1)}px`
            print.animate([{ opacity: 0 }, { opacity: 0.45, offset: 0.08 }, { opacity: 0.45, offset: 0.5 }, { opacity: 0 }], {
              duration: 2600,
              easing: 'ease-out',
            })
          }
          printSeg = k
          printStep = step
        }
      }
      prev = { x, y }

      // sections know whether he's there (or has been), for little reactions in CSS
      const t = target.t
      plan.meta.forEach((m, i) => {
        if (!m.scene) return
        setData(m.scene, 'here', String(resting && i === k))
        setData(m.scene, 'visited', String(i <= k || (i === k + 1 && t > 0.92)))
      })

      if (gaze && gaze.until > now) {
        const r = gaze.el.getBoundingClientRect()
        d.lookAt({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
      } else d.lookAt(mouse && now - mouse.t < 2.5 ? mouse : null)

      actor.style.transform = `translate3d(${(x - FOOT_X * s).toFixed(2)}px, ${(y - FLOOR * s - anchorTop).toFixed(2)}px, 0)`
      body.style.transform = `scale(${s.toFixed(4)})`
      setData(layer, 'front', String(target.front))
      setData(actor, 'holding', String(resting))
      if (bubble.dataset.show === 'true') {
        if (now > bubbleUntil) bubble.dataset.show = 'false'
        const bx = (d.facingDir > 0 ? 214 : W - 214) * s
        bubbleAt.style.transform = `translate(${bx.toFixed(1)}px, ${(30 * s).toFixed(1)}px)`
      }
      d.tick(dt, now)
    }

    let clicks = 0
    let lastClick = 0
    let lastTrick: TrickName | WalkTrick | null = null
    const onClick = () => {
      if (!d || !plan) return
      const rig = d
      const now = seconds()
      clicks = now - lastClick < 0.7 ? clicks + 1 : 1
      lastClick = now
      busyAt = now
      if (here < 0) {
        // mid-walk
        const ctx = trickContext(plan.meta[Math.max(0, spot?.k ?? 0)])
        const trick = pick(WALK_TRICKS, lastTrick as WalkTrick)
        lastTrick = trick
        cues =
          trick === 'jump'
            ? [
                [now, () => (rig.hop(1.35), ctx.say(pick(['wheee!', 'boing!', 'yip!'], null)))],
                [now + 0.5, () => rig.hop(0.7)],
              ]
            : trick === 'woof'
              ? [
                  [now, (t) => (rig.woof(t), ctx.say('woof!'))],
                  [now + 0.4, (t) => rig.woof(t)],
                ]
              : trick === 'love'
                ? [[now, () => (rig.wag(1), rig.hop(0.5), ctx.hearts(), ctx.say('I like you!'))]]
                : [[now, (t) => (rig.jolt(1.4), rig.hop(0.4), rig.yawn(t, 0.22), ctx.say('achoo!'))]]
        return
      }
      const m = plan.meta[here]
      let trick: TrickName = m.track
        ? pick(['woof', 'hop', 'love'] as const, lastTrick as TrickName)
        : m.act === 'basket'
          ? pick(['tilt', 'love', 'sneeze', 'woof'] as const, lastTrick as TrickName)
          : m.pose === 'peek'
            ? pick(['peekaboo', 'woof', 'tilt', 'sneeze'] as const, lastTrick as TrickName)
            : pickTrick(lastTrick as TrickName, clicks)
      // zoomies would dash him off his spot; spin instead
      if (trick === 'zoomies') trick = 'spin'
      if (trick === 'peekaboo' && cues.length) return
      lastTrick = trick
      rig.reset()
      cues = TRICKS[trick](trickContext(m), now)
    }
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && d && here >= 0) {
        d.petting(true)
        d.wag(1)
      }
    }
    const onLeave = () => {
      if (!d) return
      d.petting(false)
      if (here >= 0) d.wag(plan?.meta[here]?.act === 'basket' ? 0.3 : 0.7)
    }

    let stopFrames: (() => void) | null = null
    const start = () => {
      if (live || prefersReducedMotion()) return
      const p = measure(probe)
      if (p.stops.length < 2) return
      plan = p
      live = true
      html.dataset.pup = p.lane ? 'lane' : 'live'
      layer.hidden = false
      const first = p.meta[0]
      d = new PupRig(svg, first.pose, first.facing)
      lastScroll = scrollY
      prev = null
      scrolledAt = last = seconds()
      settling = false
      follow = null
      const now = last
      const at = place(p, scrollY)
      if (at.k === 0 && at.t === 0 && first.act === 'peekaboo') {
        // first thing on the home page: he pops up over the quilt and looks at his friends
        here = 0
        arrivedAt = now
        const rig = d
        const hidden = { ...POSES.peek, headY: 120 }
        const friends = first.scene?.querySelectorAll('[data-pup-friend]') ?? []
        const a = friends[0]
        const b = friends[friends.length - 1]
        cues = [
          [now + 0.1, () => rig.setPose(hidden)],
          [now + 0.7, (t) => (rig.setPose('peek'), rig.jolt(1.2), say('peekaboo!', t, 1.6))],
          [now + 1.5, (t) => a && (gaze = { el: a, until: t + 0.8 })],
          [now + 2.3, (t) => b && (gaze = { el: b, until: t + 0.8 })],
          [now + 3.1, () => ((gaze = null), rig.wag(1))],
        ]
      } else here = -1
      addEventListener('pointermove', onMove, { passive: true })
      addEventListener('pup:cue', onCue)
      addEventListener('focusin', onFocus)
      actor.addEventListener('click', onClick)
      actor.addEventListener('pointerenter', onEnter)
      actor.addEventListener('pointerleave', onLeave)
      stopFrames = onFrame(frame)
    }
    const stop = () => {
      if (!live) return
      live = false
      stopFrames?.()
      stopFrames = null
      delete html.dataset.pup
      layer.hidden = true
      delete layer.dataset.anchor
      anchorTop = 0
      plan?.meta.forEach((m) => {
        if (!m.scene) return
        delete m.scene.dataset.here
        delete m.scene.dataset.visited
      })
      plan = null
      d = null
      here = -1
      removeEventListener('pointermove', onMove)
      removeEventListener('pup:cue', onCue)
      removeEventListener('focusin', onFocus)
      actor.removeEventListener('click', onClick)
      actor.removeEventListener('pointerenter', onEnter)
      actor.removeEventListener('pointerleave', onLeave)
    }
    // the page changed size (images loaded, window resized): re-plan, without a jump
    const replan = () => {
      clearTimeout(replanTimer)
      replanTimer = window.setTimeout(() => {
        if (!live || !plan) return
        const p = measure(probe)
        if (p.stops.length < 2) return stop()
        const was = spot
        const laneChanged = p.lane !== plan.lane
        plan = p
        html.dataset.pup = p.lane ? 'lane' : 'live'
        if (laneChanged) here = -1
        if (was) {
          const now = place(p, scrollY)
          drift.x = was.x - now.x
          drift.y = was.y - now.y
          drift.s = was.s - now.s
        }
      }, 120)
    }
    const resize = new ResizeObserver(replan)
    resize.observe(document.body)
    addEventListener('resize', replan)
    const motionQuery = matchMedia('(prefers-reduced-motion: reduce)')
    const onMotionChange = () => (prefersReducedMotion() ? stop() : start())
    motionQuery.addEventListener('change', onMotionChange)
    start()
    document.fonts?.ready.then(replan)

    const cleanup = () => {
      stop()
      clearTimeout(replanTimer)
      resize.disconnect()
      removeEventListener('resize', replan)
      motionQuery.removeEventListener('change', onMotionChange)
      if (stopActive === cleanup) stopActive = null
    }
    stopActive = cleanup
    return cleanup
  }, [])

  return (
    <>
      <div ref={probeRef} aria-hidden="true" className="pup-probe" />
      <div ref={printsRef} aria-hidden="true" className="pup-prints">
        {Array.from({ length: PRINT_COUNT }, (_, i) => (
          <svg key={i} viewBox="0 0 64 64">
            <path d={PAW_PATH} />
          </svg>
        ))}
      </div>
      <div ref={layerRef} aria-hidden="true" className="pup-layer" hidden data-front="true">
        <div ref={actorRef} className="pup-actor">
          <div ref={bodyRef} className="pup-actor__body">
            <PupDrawing pose="peek" />
          </div>
          <span ref={bubbleAtRef} className="pup-bubble-at">
            <span ref={bubbleRef} className="pup-bubble" data-show="false" />
          </span>
        </div>
      </div>
    </>
  )
}
