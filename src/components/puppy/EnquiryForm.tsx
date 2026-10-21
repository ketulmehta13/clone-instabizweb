import { useId, useState } from 'react'
import type { InputHTMLAttributes } from 'react'
import { motion } from 'motion/react'
import { whatsappLink } from '../../data/site'
import { checkEnquiry, enquirySent, readEnquiry, sendEnquiry } from '../../lib/enquiry'
import type { EnquiryErrors } from '../../lib/enquiry'

type FieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string; name: string; error?: string; hint?: string }

function Field({ label, name, error, hint, ...input }: FieldProps) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="block text-[0.95rem] font-semibold">
        {label}
        {input.required ? <span className="text-toffee-ink"> *</span> : <span className="font-normal text-cocoa-soft"> (optional)</span>}
      </label>
      <input
        id={id}
        name={name}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
        className="mt-1.5 h-12 w-full rounded-2xl border-2 border-cocoa/60 bg-milk px-4 text-base outline-none transition-[border-color,box-shadow] focus:border-cocoa focus:shadow-[0_0_0_4px_rgb(242_190_107/0.6)] aria-[invalid=true]:border-[#b3261e]"
        {...input}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1 text-sm text-cocoa-soft">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} className="mt-1 text-sm font-semibold text-[#b3261e]">
          {error}
        </p>
      )}
    </div>
  )
}

/** "Ask about this puppy" form on each puppy's page */
export function EnquiryForm({ puppyLabel }: { puppyLabel: string }) {
  const [errors, setErrors] = useState<EnquiryErrors>({})
  const [sent, setSent] = useState(false)
  const messageId = useId()

  if (sent)
    return (
      <motion.div
        role="status"
        initial={{ rotateX: -80, opacity: 0, y: -10 }}
        animate={{ rotateX: 0, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 160, damping: 16 }}
        className="tp-sent rounded-[2rem] border-[3px] border-cocoa bg-honey p-8 text-center"
      >
        <svg viewBox="0 0 120 84" className="tp-envelope mx-auto w-32" aria-hidden="true">
          <path d="M6 10h108v68H6z" fill="#fffdf8" stroke="#2a170e" strokeWidth="3" strokeLinejoin="round" />
          <path d="M6 10l54 40 54-40" fill="none" stroke="#2a170e" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="94" cy="62" r="12" fill="#c2622b" stroke="#2a170e" strokeWidth="2.5" />
        </svg>
        <p className="font-plush mt-4 text-[2rem]">{enquirySent.heading}</p>
        <p className="mx-auto mt-2 max-w-[38ch] text-cocoa-soft">{enquirySent.body}</p>
        <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp mt-6">
          WhatsApp us
        </a>
      </motion.div>
    )

  return (
    <form
      noValidate
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault()
        const form = e.currentTarget
        const fields = readEnquiry(form, puppyLabel)
        const found = checkEnquiry(fields)
        setErrors(found)
        if (Object.keys(found).length) {
          requestAnimationFrame(() => form.querySelector<HTMLElement>('[aria-invalid=true]')?.focus())
          return
        }
        sendEnquiry(fields)
        setSent(true)
      }}
    >
      {Object.keys(errors).length > 0 && (
        <p role="alert" className="rounded-2xl bg-blush px-4 py-3 font-semibold">
          Please check the highlighted fields.
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" autoComplete="name" required minLength={2} maxLength={80} error={errors.name} />
        <Field
          label="Phone or WhatsApp"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          error={errors.phone}
          hint="With country code, e.g. +971 50 123 4567"
        />
        <Field label="Email" name="email" type="email" autoComplete="email" error={errors.email} />
        <Field label="Your area" name="area" autoComplete="address-level2" maxLength={80} error={errors.area} hint="e.g. Dubai Marina" />
      </div>
      <div>
        <label htmlFor={messageId} className="block text-[0.95rem] font-semibold">
          Message <span className="font-normal text-cocoa-soft">(optional)</span>
        </label>
        <textarea
          id={messageId}
          name="message"
          rows={4}
          maxLength={2000}
          className="mt-1.5 w-full rounded-2xl border-2 border-cocoa/60 bg-milk px-4 py-3 text-base outline-none focus:border-cocoa focus:shadow-[0_0_0_4px_rgb(242_190_107/0.6)]"
          defaultValue={`Hi! I'd love to know more about ${puppyLabel}.`}
        />
      </div>
      <button type="submit" className="btn btn-primary w-full sm:w-auto">
        Send enquiry
      </button>
    </form>
  )
}
