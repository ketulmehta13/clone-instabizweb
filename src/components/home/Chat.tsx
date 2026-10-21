import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { journeyMedia } from '../../data/families'
import { journeySection } from '../../data/home'
import { breeds } from '../../data/puppies'
import { site, whatsappLink } from '../../data/site'
import type { Media } from '../../data/types'
import { useMediaQuery, useReducedMotion } from '../../lib/motion'
import { Img } from '../Img'
import { PAW_PATH } from '../pup/geometry'
import { cuePup } from '../pup/cue'
import { PupStop } from '../pup/PupStop'
import { Scene } from '../Scene'

const photos = journeyMedia.filter((m) => m.kind === 'image').slice(0, 4)
const video = journeyMedia.find((m) => m.kind === 'video') ?? null

/** A video bubble that plays/pauses when tapped */
function Clip({ media }: { media: Media }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  return (
    <div className="tp-msg tp-msg--them tp-msg--media">
      <div className="tp-clip">
        <video ref={ref} src={media.src} poster={media.poster?.src} muted loop playsInline preload="none" aria-label={media.alt || 'A puppy video'} onEnded={() => setPlaying(false)} />
        <button
          type="button"
          className="tp-clip__play"
          onClick={() => {
            const v = ref.current
            if (!v) return
            if (v.paused)
              v.play()
                .then(() => setPlaying(true))
                .catch(() => {})
            else {
              v.pause()
              setPlaying(false)
            }
          }}
          aria-pressed={playing}
          aria-label={playing ? 'Pause video' : 'Play video'}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {playing ? <path d="M7 5h3v14H7zM14 5h3v14h-3z" /> : <path d="M8 5v14l11-7z" />}
          </svg>
        </button>
      </div>
    </div>
  )
}

/**
 * Three steps beside a pretend WhatsApp chat. On large screens each step's
 * reply "types" into the phone as you scroll down to it.
 */
export function Chat() {
  const steps = journeySection.steps
  const wide = useMediaQuery('(min-width: 1024px)')
  const still = useReducedMotion() || !wide
  const [step, setStep] = useState(-1)
  const [typing, setTyping] = useState(false)
  const listRef = useRef<HTMLOListElement>(null)
  const screenRef = useRef<HTMLDivElement>(null)
  const current = still ? steps.length - 1 : step

  // which step is in the middle band of the screen
  useEffect(() => {
    if (still || !listRef.current) return
    const items = [...listRef.current.children]
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setStep(items.indexOf(e.target))
      },
      { rootMargin: '-28% 0px -62% 0px' },
    )
    items.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [still, steps.length])

  // moving forward: show "typing…" for a moment, then the reply
  const lastStep = useRef(-1)
  useEffect(() => {
    if (still) return
    const forward = step > lastStep.current
    lastStep.current = step
    if (!forward || step < 0) return
    setTyping(true)
    const t = setTimeout(() => {
      setTyping(false)
      const group = screenRef.current?.querySelector(`[data-step="${step}"]`)
      if (group) cuePup({ look: group, secs: 1.4, say: step === 1 ? 'ooh, photos!' : step === 2 ? 'home soon!' : undefined })
    }, 750)
    return () => clearTimeout(t)
  }, [step, still])

  return (
    <Scene tone={{ top: '#f7d18d', bottom: '#f0b866' }} aria-labelledby="journey-title" className="tp-chat">
      <div className="tp-chat__grid gutter" data-pin-range="">
        <div className="tp-chat__story">
          <h2 id="journey-title" className="font-plush text-huge">
            {journeySection.heading}
          </h2>
          <p className="text-lede mt-5 max-w-[42ch] text-[var(--ink-soft)]">{journeySection.body}</p>
          <ol ref={listRef} className="tp-chat__steps">
            {steps.map((s, i) => (
              <li key={s.title} className="tp-chat__step" data-active={i === current || undefined} data-done={i < current || undefined}>
                <span className="tp-chat__num font-plush" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="font-plush tp-chat__title">{s.title}</h3>
                <p className="tp-chat__text">{s.text}</p>
              </li>
            ))}
          </ol>
          <Link to={journeySection.ctaHref} className="btn btn-ghost tp-chat__cta">
            {journeySection.ctaLabel}
          </Link>
        </div>
        <div className="tp-chat__side">
          <div className="tp-phone" aria-label={`A WhatsApp conversation with ${site.name}`} role="group">
            <div className="tp-phone__bar">
              <img src="/brand/logo.png" alt="" width={40} height={40} loading="lazy" className="tp-phone__avatar" />
              <span>
                <span className="tp-phone__name">{site.name}</span>
                <span className="tp-phone__status">{typing ? 'typing…' : 'online'}</span>
              </span>
            </div>
            <div ref={screenRef} className="tp-phone__screen">
              <p className="tp-msg tp-msg--me">{site.greeting}</p>
              {steps.map((s, i) => (
                <div key={s.title} className="tp-msg-group" data-step={i} data-show={i < current || (i === current && !typing) ? 'true' : 'false'}>
                  {i === 0 && (
                    <div className="tp-msg tp-msg--them">
                      <p>{s.text}</p>
                      <ul className="tp-chips" aria-label="Breeds we have now">
                        {breeds.slice(0, 6).map((b) => (
                          <li key={b.slug}>
                            <Link to={`/puppies?breed=${b.slug}`}>{b.name}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {i === 1 && (
                    <>
                      {photos.length > 0 && (
                        <div className="tp-msg tp-msg--them tp-msg--media">
                          <div className="tp-snaps">
                            {photos.map((m) => (
                              <span key={m.id} className="tp-snaps__one">
                                <Img media={m} />
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {video && <Clip media={video} />}
                      <p className="tp-msg tp-msg--them">{s.text}</p>
                    </>
                  )}
                  {i === 2 && (
                    <div className="tp-msg tp-msg--them">
                      <p>{s.text}</p>
                      <svg viewBox="0 0 220 70" className="tp-route" aria-hidden="true">
                        <path d="M14 52 C 60 6, 120 70, 170 28" className="tp-route__line" />
                        <circle cx="14" cy="52" r="5" className="tp-route__dot" />
                        <path d="M164 32 l12 -12 l12 12 v14 h-24 z" className="tp-route__home" />
                        <path d="M176 42 c-2-3-7-2-6 2c1 3 6 5 6 5s5-2 6-5c1-4-4-5-6-2z" className="tp-route__heart" />
                        <path d={PAW_PATH} transform="translate(70 22) scale(.3) rotate(70 32 32)" className="tp-route__paw" />
                        <path d={PAW_PATH} transform="translate(104 38) scale(.3) rotate(100 32 32)" className="tp-route__paw" />
                      </svg>
                    </div>
                  )}
                  {i > 2 && <p className="tp-msg tp-msg--them">{s.text}</p>}
                </div>
              ))}
              <p className="tp-typing" data-show={typing ? 'true' : 'false'} aria-hidden="true">
                <span />
                <span />
                <span />
              </p>
            </div>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="tp-phone__compose">
              <span>Say hello on WhatsApp</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 20l18-8L3 4v6l12 2-12 2z" />
              </svg>
            </a>
          </div>
          <PupStop pose="sit" className="tp-chat__teddy" />
        </div>
      </div>
    </Scene>
  )
}
