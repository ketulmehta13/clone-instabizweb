import { useSyncExternalStore } from 'react'

const REDUCED = '(prefers-reduced-motion: reduce)'

/** True when the visitor has asked their device for less movement */
export const prefersReducedMotion = () => matchMedia(REDUCED).matches

const subscribers = new Map<string, (cb: () => void) => () => void>()
function subscribe(query: string) {
  let fn = subscribers.get(query)
  if (!fn) {
    fn = (cb) => {
      const mq = matchMedia(query)
      mq.addEventListener('change', cb)
      return () => mq.removeEventListener('change', cb)
    }
    subscribers.set(query, fn)
  }
  return fn
}

export function useReducedMotion() {
  return useSyncExternalStore(subscribe(REDUCED), () => matchMedia(REDUCED).matches)
}

export function useMediaQuery(query: string) {
  return useSyncExternalStore(subscribe(query), () => matchMedia(query).matches)
}

// One shared requestAnimationFrame loop for everything that animates every frame.
const callbacks = new Set<(now: number) => void>()
let raf = 0
function loop(now: number) {
  callbacks.forEach((cb) => cb(now))
  raf = callbacks.size ? requestAnimationFrame(loop) : 0
}

/** Run `cb` every animation frame until the returned function is called */
export function onFrame(cb: (now: number) => void) {
  callbacks.add(cb)
  if (!raf) raf = requestAnimationFrame(loop)
  return () => {
    callbacks.delete(cb)
  }
}
