import { whatsappLink } from '../data/site'

// The original site posts enquiries to its own server. This clone is a static
// site, so instead it checks the form in the browser, writes the enquiry as a
// message and opens WhatsApp with that message ready to send.

export type EnquiryFields = { name: string; phone: string; email: string; area: string; puppy: string; message: string }
export type EnquiryErrors = Partial<Record<keyof EnquiryFields, string>>

export function readEnquiry(form: HTMLFormElement, puppyLabel?: string): EnquiryFields {
  const data = new FormData(form)
  const get = (k: string) => String(data.get(k) ?? '').trim()
  const select = form.querySelector<HTMLSelectElement>('select[name="puppyId"]')
  const chosen = select && select.value ? select.selectedOptions[0]?.textContent ?? '' : ''
  return { name: get('name'), phone: get('phone'), email: get('email'), area: get('area'), puppy: puppyLabel ?? chosen, message: get('message') }
}

export function checkEnquiry(f: EnquiryFields): EnquiryErrors {
  const errors: EnquiryErrors = {}
  if (f.name.length < 2) errors.name = 'Please tell us your name.'
  if (f.phone.replace(/\D/g, '').length < 7) errors.phone = 'Please add a phone or WhatsApp number, with the country code.'
  if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) errors.email = 'That email address doesn’t look quite right.'
  return errors
}

/** Turn the form into a friendly WhatsApp message and open the chat */
export function sendEnquiry(f: EnquiryFields) {
  const lines = [
    'Hi TeddyPups!',
    `My name is ${f.name}${f.area ? ` and I live in ${f.area}` : ''}.`,
    f.puppy && !f.message.includes(f.puppy) ? `I'm curious about: ${f.puppy}.` : '',
    f.message,
    `You can reach me on ${f.phone}${f.email ? ` or ${f.email}` : ''}.`,
  ]
  window.open(whatsappLink(lines.filter(Boolean).join('\n')), '_blank', 'noopener,noreferrer')
}

export const enquirySent = {
  heading: 'Your letter is ready!',
  body: 'We’ve opened WhatsApp with your message filled in — just press send and our team will get back to you promptly.',
}
