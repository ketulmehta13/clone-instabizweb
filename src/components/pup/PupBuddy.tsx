import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { onFrame, useReducedMotion } from '../../lib/motion'
import { POSES } from './geometry'
import type { PoseName } from './geometry'
import { PupDrawing } from './PupDrawing'
import { PupRig } from './PupRig'
import { TRICKS, hearts, pickTrick } from './tricks'
import type { Cue, TrickContext, TrickName } from './tricks'

const PEEK_TRICKS: TrickName[] = ['peekaboo', 'woof', 'tilt', 'sneeze']
const SNUG_TRICKS: TrickName[] = ['tilt', 'love', 'sneeze', 'woof']

type Props = {
  pose?: PoseName
  facing?: 'left' | 'right'
  /** "tilt" = keeps cocking his head curiously */
  act?: string
  label?: string
  className?: string
  style?: CSSProperties
  /** Part of the walking-Teddy journey: stays still while the walking Teddy is active */
  asStop?: boolean
}

/** A Teddy that sits in one place: blinks, wags, watches the mouse and does tricks when clicked. */
export function PupBuddy({ pose = 'sit', facing = 'right', act, label, className = '', style, asStop = false }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const bubbleRef = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const host = ref.current!
    const bubble = bubbleRef.current!
    const dir = facing === 'left' ? -1 : 1
    const d = new PupRig(host.querySelector('svg')!, pose, dir)
    d.wag(0.6)
    let cues: Cue[] = []
    let last = performance.now() / 1000
    let idleSince = last
    let bubbleUntil = 0
    let mouse: { x: number; y: number; t: number } | null = null
    let lastTrick: TrickName | null = null
    let clicks = 0
    let lastClick = 0
    const ctx: TrickContext = {
      d,
      rest: POSES[pose],
      facing: dir,
      say: (text, secs = 1.4) => {
        bubble.textContent = text
        bubble.dataset.show = 'true'
        bubbleUntil = performance.now() / 1000 + secs
      },
      hearts: () => hearts(host, host.clientWidth * (dir > 0 ? 0.7 : 0.3), 0.25 * host.clientHeight),
    }
    let playing = false
    let playUntil = 0

    const frame = () => {
      const now = performance.now() / 1000
      const dt = Math.min(0.05, now - last)
      last = now
      while (cues.length && cues[0][0] <= now) cues.shift()![1](now)
      if (playing !== now < playUntil) {
        playing = !playing
        host.toggleAttribute('data-playing', playing)
      }
      d.lookAt(mouse && now - mouse.t < 3 ? mouse : null)
      if (act === 'tilt' && !cues.length) {
        const s = Math.sin(0.9 * now)
        d.cock(s > 0.35 ? 13 : s < -0.35 ? -10 : 0)
      }
      // every so often, do something on his own
      if (!cues.length && now - idleSince > 9) {
        idleSince = now
        cues =
          Math.random() < 0.5
            ? TRICKS.tilt(ctx, now)
            : [
                [now, () => d.wag(1)],
                [now + 2.2, () => d.wag(0.6)],
              ]
      }
      if (bubble.dataset.show === 'true' && now > bubbleUntil) bubble.dataset.show = 'false'
      d.tick(dt, now)
    }

    // only animate while on screen
    let stop: (() => void) | null = null
    const run = (on: boolean) => {
      if (asStop && document.documentElement.dataset.pup) on = false
      if (on === !!stop) return
      if (on) {
        last = performance.now() / 1000
        stop = onFrame(frame)
      } else {
        stop?.()
        stop = null
      }
    }
    const io = new IntersectionObserver(([e]) => run(e.isIntersecting))
    io.observe(host)

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') mouse = { x: e.clientX, y: e.clientY, t: performance.now() / 1000 }
    }
    const onClick = () => {
      const now = performance.now() / 1000
      clicks = now - lastClick < 0.7 ? clicks + 1 : 1
      lastClick = now
      const set = pose === 'peek' ? PEEK_TRICKS : pose === 'snug' ? SNUG_TRICKS : null
      const options = set?.filter((t) => t !== lastTrick) ?? []
      const trick = set ? options[Math.floor(Math.random() * options.length)] : pickTrick(lastTrick, clicks)
      lastTrick = trick
      d.reset()
      cues = TRICKS[trick](ctx, now)
      playUntil = cues[cues.length - 1][0] + 0.4
      idleSince = now
    }
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') {
        d.petting(true)
        d.wag(1)
      }
    }
    const onLeave = () => {
      d.petting(false)
      d.wag(0.6)
    }
    addEventListener('pointermove', onMove, { passive: true })
    host.addEventListener('click', onClick)
    host.addEventListener('pointerenter', onEnter)
    host.addEventListener('pointerleave', onLeave)
    return () => {
      run(false)
      host.removeAttribute('data-playing')
      io.disconnect()
      removeEventListener('pointermove', onMove)
      host.removeEventListener('click', onClick)
      host.removeEventListener('pointerenter', onEnter)
      host.removeEventListener('pointerleave', onLeave)
    }
  }, [reduced, pose, facing, act, asStop])

  return (
    <div ref={ref} className={`pup-buddy ${className}`} style={style} data-live={reduced ? undefined : ''} data-facing={facing}>
      {/* re-mount the drawing when motion is switched off so it snaps back to the still pose */}
      <PupDrawing key={String(reduced)} pose={pose} facing={facing} label={label} />
      <span ref={bubbleRef} aria-hidden="true" className="pup-bubble" data-show="false" />
    </div>
  )
}
