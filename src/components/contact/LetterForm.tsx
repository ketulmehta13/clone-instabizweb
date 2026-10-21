import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties, InputHTMLAttributes } from 'react'
import { puppies } from '../../data/puppies'
import { whatsappLink } from '../../data/site'
import { checkEnquiry, enquirySent, readEnquiry, sendEnquiry } from '../../lib/enquiry'
import type { EnquiryErrors } from '../../lib/enquiry'
import { prefersReducedMotion } from '../../lib/motion'
import { Paw } from '../Paw'

/** "(Maltipoo, boy)" style labels for the puppy picker */
const options = puppies.map((p) => ({
  id: p.id,
  label: p.name ? `${p.displayName} (${p.breed}, ${p.genderLabel.toLowerCase()})` : `${p.displayName} (${p.genderLabel.toLowerCase()})`,
}))

const FIELD_NAMES: Record<string, string> = { name: 'Your name', phone: 'Phone', email: 'Email', area: 'Area' }

/** A fill-in-the-blank input that sits inside a sentence */
function Blank({ name, label, error, size = 14, ...input }: InputHTMLAttributes<HTMLInputElement> & { name: string; label: string; error?: string; size?: number }) {
  return (
    <span className="tp-blank" style={{ '--size': `${size}ch` } as CSSProperties}>
      <input name={name} aria-label={label} aria-invalid={!!error || undefined} aria-describedby={error ? `${name}-err` : undefined} {...input} />
    </span>
  )
}

type Phase = 'writing' | 'sealing' | 'posting' | 'sent'

/**
 * The contact form, written as a letter ("Dear TeddyPups, my name is …").
 * When posted, it folds into an envelope and drops into a post box.
 */
export function LetterForm() {
  const [phase, setPhase] = useState<Phase>('writing')
  const [errors, setErrors] = useState<EnquiryErrors>({})
  const [height, setHeight] = useState<number>()
  const boxRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const sentRef = useRef<HTMLDivElement>(null)
  const selectId = useId()
  const noteId = useId()

  // once posted, bring the thank-you note into view
  useEffect(() => {
    const el = sentRef.current
    if (phase !== 'sent' || !el) return
    el.focus({ preventScroll: true })
    const top = el.getBoundingClientRect().top
    const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) * 16 || 76
    if (top < header + 8) scrollBy({ top: top - header - 24, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }, [phase])

  const post = () => {
    if (prefersReducedMotion()) return setPhase('sent')
    // keep the box the same height while the letter animates away
    setHeight(boxRef.current?.offsetHeight)
    setPhase('sealing')
    setTimeout(() => setPhase('posting'), 750)
    setTimeout(() => {
      setHeight(undefined)
      setPhase('sent')
    }, 1750)
  }

  const errorList = Object.entries(errors)

  return (
    <div ref={boxRef} className="tp-post" data-phase={phase} style={{ minHeight: height }}>
      {phase !== 'sent' && (
        <form
          ref={formRef}
          noValidate
          className="tp-letterform"
          aria-hidden={phase !== 'writing' || undefined}
          inert={phase !== 'writing'}
          onSubmit={(e) => {
            e.preventDefault()
            const fields = readEnquiry(e.currentTarget)
            const found = checkEnquiry(fields)
            setErrors(found)
            if (Object.keys(found).length) {
              requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid=true]')?.focus())
              return
            }
            sendEnquiry(fields)
            post()
          }}
        >
          <span aria-hidden="true" className="tp-letter__stamp">
            <Paw className="size-9" />
          </span>
          <p className="font-scrawl tp-letterform__greeting">Dear TeddyPups,</p>
          {errorList.length > 0 && (
            <div role="alert" className="tp-letterform__alert">
              <p className="font-semibold">A couple of blanks need another look:</p>
              <ul>
                {errorList.map(([k, msg]) => (
                  <li key={k} id={`${k}-err`}>
                    {FIELD_NAMES[k] ?? k}: {msg}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="tp-letterform__line">
            my name is <Blank name="name" label="Your name (required)" autoComplete="name" required minLength={2} maxLength={80} size={16} error={errors.name} />, and
            you can reach me on{' '}
            <Blank
              name="phone"
              label="Phone or WhatsApp number with country code (required)"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              size={15}
              placeholder="+971 50 123 4567"
              error={errors.phone}
            />{' '}
            or by email at <Blank name="email" label="Email (optional)" type="email" autoComplete="email" size={20} placeholder="optional" error={errors.email} />.
          </p>
          <p className="tp-letterform__line">
            I live in{' '}
            <Blank name="area" label="Your area (optional)" autoComplete="address-level2" maxLength={80} size={13} placeholder="e.g. Dubai Marina" error={errors.area} />, and
            I'm curious about{' '}
            <span className="tp-blank tp-blank--select">
              <label htmlFor={selectId} className="sr-only">
                Puppy you're interested in (optional)
              </label>
              <select id={selectId} name="puppyId" defaultValue="">
                <option value="">any puppy (not sure yet)</option>
                {options.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </span>
            .
          </p>
          <label htmlFor={noteId} className="sr-only">
            Your message (optional)
          </label>
          <textarea id={noteId} name="message" rows={4} maxLength={2000} placeholder="Anything else you'd like to tell us…" className="tp-letterform__note" />
          <div className="tp-letterform__sign">
            <p className="font-scrawl">with love, a future puppy parent</p>
            <button type="submit" className="btn btn-primary">
              Post my letter
            </button>
          </div>
        </form>
      )}
      {(phase === 'sealing' || phase === 'posting') && (
        <div aria-hidden="true" className="tp-post__scene">
          <svg viewBox="0 0 160 112" className="tp-post__envelope">
            <rect x="4" y="18" width="152" height="90" rx="6" fill="#fffdf8" stroke="#2a170e" strokeWidth="4" />
            <path d="M6 104 64 62M154 104 96 62" fill="none" stroke="#2a170e" strokeWidth="3" strokeLinecap="round" />
            <path className="tp-post__flap" d="M6 22 80 74 154 22" fill="#fbe3b4" stroke="#2a170e" strokeWidth="4" strokeLinejoin="round" />
            <circle cx="80" cy="72" r="11" fill="#a24a1a" stroke="#2a170e" strokeWidth="3" />
          </svg>
          <svg viewBox="0 0 200 260" className="tp-post__box">
            <rect x="86" y="170" width="28" height="86" fill="#5a3a28" stroke="#2a170e" strokeWidth="4" />
            <path d="M30 70a70 54 0 0 1 140 0v104H30z" fill="#c2622b" stroke="#2a170e" strokeWidth="5" strokeLinejoin="round" />
            <rect x="58" y="86" width="84" height="14" rx="7" fill="#2a170e" />
            <path d="M44 128h112" stroke="#2a170e" strokeWidth="3" strokeLinecap="round" opacity=".35" />
            <g className="tp-post__flag">
              <path d="M170 120V64" stroke="#2a170e" strokeWidth="5" strokeLinecap="round" />
              <path d="M170 64h22v16h-22" fill="#f2be6b" stroke="#2a170e" strokeWidth="4" strokeLinejoin="round" />
            </g>
          </svg>
        </div>
      )}
      {phase === 'sent' && (
        <div ref={sentRef} tabIndex={-1} role="status" className="tp-post__sent">
          <svg viewBox="0 0 200 150" aria-hidden="true" className="tp-post__box tp-post__box--sent">
            <rect x="86" y="96" width="28" height="52" fill="#5a3a28" stroke="#2a170e" strokeWidth="4" />
            <path d="M30 50a70 44 0 0 1 140 0v52H30z" fill="#c2622b" stroke="#2a170e" strokeWidth="5" strokeLinejoin="round" />
            <rect x="58" y="58" width="84" height="12" rx="6" fill="#2a170e" />
            <path d="M170 92V22" stroke="#2a170e" strokeWidth="5" strokeLinecap="round" />
            <path d="M170 22h22v16h-22" fill="#f2be6b" stroke="#2a170e" strokeWidth="4" strokeLinejoin="round" />
          </svg>
          <p className="font-plush mt-4 text-[2rem]">{enquirySent.heading}</p>
          <p className="mx-auto mt-2 max-w-[40ch] text-cocoa-soft">{enquirySent.body}</p>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp mt-6">
            WhatsApp us
          </a>
        </div>
      )}
    </div>
  )
}
