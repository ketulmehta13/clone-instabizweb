import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { prefersReducedMotion } from '../../lib/motion'
import { BLUSH, COLLAR, CREAM, FLOOR, FUR, FUR_DARK, H, INK, JOINTS, LEGS, PATHS, PAW_PATH, W, toes } from '../pup/geometry'
import { curtainIntroTime } from './curtainState'

type State = 'intro' | 'covering' | 'covered' | 'snap' | 'lifting' | 'idle'

const line = { stroke: INK, strokeWidth: 3.4, strokeLinejoin: 'round', strokeLinecap: 'round' } as const
const outline = { ...line, fill: 'none' }

/** [left %, top px, angle°] of each paw print the runner leaves behind */
const PRINTS = [
  [18, 6, -76],
  [27, -4, -84],
  [36, 7, -72],
  [45, -3, -86],
  [54, 6, -74],
]

function RunnerLeg({ cls, at, d, len, fill }: { cls: string; at: readonly number[]; d: string; len: number; fill: string }) {
  return (
    <g className={`tp-runner__leg ${cls}`} style={{ transformOrigin: `${at[0]}px ${at[1]}px` }}>
      <g transform={`translate(${at[0]} ${at[1]})`}>
        <path d={`${d}Z`} fill={fill} />
        <path d={d} {...outline} />
        <path d={toes(len)} {...outline} strokeWidth={2.4} />
      </g>
    </g>
  )
}

/** Teddy mid-gallop, animated with CSS only (it runs while the page underneath is busy loading) */
function Runner() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="tp-runner" aria-hidden="true" focusable="false" style={{ overflow: 'visible' }}>
      <ellipse cx={150} cy={FLOOR + 2} rx={86} ry={7} fill={INK} opacity={0.12} className="tp-runner__shadow" />
      <g className="tp-runner__body">
        <RunnerLeg cls="tp-runner__leg--bf" at={JOINTS.hipF} d={LEGS.backFar} len={FLOOR - 192} fill={FUR_DARK} />
        <RunnerLeg cls="tp-runner__leg--ff" at={JOINTS.shoulderF} d={LEGS.frontFar} len={FLOOR - 192} fill={FUR_DARK} />
        <g className="tp-runner__tail" style={{ transformOrigin: `${JOINTS.tailBase[0]}px ${JOINTS.tailBase[1]}px` }}>
          <path d={PATHS.tailStem} {...outline} strokeWidth={9} />
          <path d={PATHS.tailStem} stroke={FUR} strokeWidth={4} fill="none" strokeLinecap="round" />
          <path d={PATHS.tail} fill={FUR} {...line} />
        </g>
        <RunnerLeg cls="tp-runner__leg--bn" at={JOINTS.hipN} d={LEGS.back} len={FLOOR - 194} fill={FUR} />
        <path d={PATHS.body} fill={FUR} {...line} />
        <path d={PATHS.chest} fill={FUR} {...line} />
        <RunnerLeg cls="tp-runner__leg--fn" at={JOINTS.shoulderN} d={LEGS.front} len={FLOOR - 194} fill={FUR} />
        <g className="tp-runner__head">
          <path d={PATHS.collar} fill={COLLAR} {...line} strokeWidth={3} />
          <path d={PATHS.tag} fill={CREAM} {...line} strokeWidth={2.4} />
          <path d={PATHS.earL} fill={FUR_DARK} {...line} className="tp-runner__ear" style={{ transformOrigin: '174px 82px' }} />
          <path d={PATHS.earR} fill={FUR_DARK} {...line} className="tp-runner__ear tp-runner__ear--r" style={{ transformOrigin: '250px 82px' }} />
          <path d={PATHS.head} fill={FUR} {...line} />
          <path d={PATHS.topknot} fill={FUR} {...line} strokeWidth={3} />
          <path d={PATHS.muzzle} fill={CREAM} />
          <circle cx={181} cy={116} r={7} fill={BLUSH} opacity={0.85} />
          <circle cx={243} cy={116} r={7} fill={BLUSH} opacity={0.85} />
          <path d="M186.5 101 Q194 91.5 201.5 101 M222.5 101 Q230 91.5 237.5 101" {...outline} />
          <path d={PATHS.nose} fill={INK} />
          <path d={PATHS.mouth} {...outline} strokeWidth={3} />
          <path d={PATHS.tongue} fill="#e98c8c" stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  )
}

/**
 * The quilt that drops over the screen while moving between pages (and lifts on first load),
 * with Teddy running across it. Clicks on internal links are caught here: cover first, then
 * change page, then lift once the new page has rendered.
 */
export function RouteCurtain() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  // navigate() changes identity on every page change; the listeners below must not be re-made mid-transition
  const navigateRef = useRef(navigate)
  useLayoutEffect(() => {
    navigateRef.current = navigate
  }, [navigate])
  const ref = useRef<HTMLDivElement>(null)
  const coveredAt = useRef(0)
  const timers = useRef<number[]>([])
  const shownPath = useRef(pathname)
  const viaKeyboard = useRef(false)
  const lift = useRef(() => {})

  useEffect(() => {
    const curtain = ref.current!
    const html = document.documentElement
    let pending: string | null = null
    /** the page we're on or heading to (React's pathname can already be ahead of us on popstate) */
    let page = location.pathname
    const set = (state: State) => {
      curtain.dataset.state = state
      if (state === 'idle') delete html.dataset.curtain
      else html.dataset.curtain = state
    }
    const clear = () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
    }
    const after = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms))

    const up = () => {
      const state = curtain.dataset.state
      if (state === 'idle' || state === 'lifting') return
      clear()
      pending = null
      set('lifting')
      dispatchEvent(new Event('tp:arrived'))
      if (viaKeyboard.current) {
        viaKeyboard.current = false
        document.getElementById('main')?.focus({ preventScroll: true })
      }
      after(() => set('idle'), 460)
    }
    const go = (href: string) => {
      const url = new URL(href, location.href)
      if (url.pathname === location.pathname && url.search === location.search) {
        pending = null
        scrollTo({ top: 0, behavior: 'instant' })
        after(up, 120)
        return
      }
      page = url.pathname
      navigateRef.current(url.pathname + url.search + url.hash)
      after(up, 6000) // never leave the curtain down
    }

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href]')
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download') || a.dataset.noCurtain !== undefined) return
      const url = new URL(a.href, location.href)
      if (url.origin !== location.origin || /^\/(media|brand|cursor)(\/|$)/.test(url.pathname)) return
      // same page with a #section: let the smooth scroller handle it
      if (url.pathname === location.pathname && (url.hash || url.search !== location.search)) return
      if (prefersReducedMotion()) return
      e.preventDefault()
      e.stopPropagation()
      viaKeyboard.current = e.detail === 0
      dispatchEvent(new Event('tp:navigate'))
      pending = url.href
      const state = curtain.dataset.state
      if (state === 'covered' || state === 'snap') return go(url.href)
      if (state === 'covering') return
      clear()
      if (state === 'intro' && curtainIntroTime() < 1080) {
        set('covered')
        coveredAt.current = performance.now()
        go(url.href)
      } else {
        set('covering')
        after(() => {
          set('covered')
          coveredAt.current = performance.now()
          if (pending) go(pending)
        }, 300)
      }
    }
    // back/forward: the page is changing already, so just flash the curtain
    const onPopState = () => {
      if (location.pathname === page) return // only the #hash or ?filters changed
      page = location.pathname
      if (prefersReducedMotion()) return
      clear()
      set('snap')
      coveredAt.current = performance.now()
      // the router may have rendered the new page already (it handles popstate first)
      if (shownPath.current === page) after(() => requestAnimationFrame(up), 140)
      else after(up, 1400)
    }
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        clear()
        set('idle')
      }
    }

    if (curtain.dataset.state === 'intro') {
      const t = curtainIntroTime()
      after(() => dispatchEvent(new Event('tp:arrived')), Math.max(0, 560 - t))
      after(() => curtain.dataset.state === 'intro' && set('idle'), Math.max(0, 1080 - t))
    }
    if (prefersReducedMotion()) set('idle')
    addEventListener('click', onClick, true)
    addEventListener('popstate', onPopState, true)
    addEventListener('pageshow', onPageShow)
    lift.current = up
    return () => {
      clear()
      delete html.dataset.curtain
      removeEventListener('click', onClick, true)
      removeEventListener('popstate', onPopState, true)
      removeEventListener('pageshow', onPageShow)
    }
  }, [])

  // the new page has rendered: lift the curtain (but keep it down for a moment so it doesn't flicker)
  useEffect(() => {
    if (pathname === shownPath.current) return
    shownPath.current = pathname
    const state = ref.current?.dataset.state
    if (state !== 'covered' && state !== 'snap' && state !== 'covering') return
    const wait = state === 'covering' ? 340 : Math.max(0, 140 - (performance.now() - coveredAt.current))
    const timer = setTimeout(() => requestAnimationFrame(() => lift.current()), wait)
    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <div ref={ref} className="tp-curtain" data-state="intro" aria-hidden="true">
      <div className="tp-curtain__blanket">
        <svg className="tp-curtain__edge tp-curtain__edge--top" width="100%" height="40" preserveAspectRatio="none">
          <defs>
            <pattern id="tp-curtain-scallop" width="76" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 40V27A38 25 0 0 1 76 27V40Z" fill={CREAM} />
              <path d="M0 27A38 25 0 0 1 76 27" fill="none" stroke={INK} strokeWidth="3" />
              <path d="M11 33A27 19 0 0 1 65 33" fill="none" stroke={INK} strokeWidth="1.6" strokeDasharray="3.5 5.5" strokeLinecap="round" opacity=".42" />
            </pattern>
          </defs>
          <rect width="100%" height="40" fill="url(#tp-curtain-scallop)" />
        </svg>
        <div className="tp-curtain__stage">
          <div className="tp-curtain__prints">
            {PRINTS.map(([left, top, angle], i) => (
              <svg
                key={i}
                viewBox="0 0 64 64"
                className="tp-curtain__print"
                style={{ left: `${left}%`, top: `${top}px`, rotate: `${angle + 90}deg`, animationDelay: `${0.16 + 0.12 * i}s` }}
              >
                <path d={PAW_PATH} />
              </svg>
            ))}
          </div>
          <div className="tp-curtain__runner">
            <Runner />
          </div>
          <p className="tp-curtain__note font-scrawl">every puppy is family</p>
        </div>
        <svg className="tp-curtain__edge tp-curtain__edge--bottom" width="100%" height="40" preserveAspectRatio="none">
          <rect width="100%" height="40" fill="url(#tp-curtain-scallop)" />
        </svg>
      </div>
    </div>
  )
}
