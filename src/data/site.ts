// Business and contact details used across the site (header, footer, WhatsApp buttons).

export const site = {
  name: 'TeddyPups U.A.E.',
  tagline: 'every puppy is family',
  about:
    'TeddyPups U.A.E. is a Dubai-based brand specializing in miniature puppies, offering premium services and worldwide shipping.',
  phone: '+971541676733',
  phoneDisplay: '+971 54 167 6733',
  whatsappNumber: '971541676733',
  email: 'teddypupsadmin@gmail.com',
  address: 'Downtown Dubai, United Arab Emirates',
  mapsUrl: 'https://maps.app.goo.gl/ZdJvwHBSQWWZT54s7',
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/teddypups.worldwide/' },
    { label: 'TikTok', href: 'https://www.tiktok.com/@teddypupsuae' },
    { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61567496944539' },
  ],
  greeting: "Hi TeddyPups! I'd love to know more about your puppies.",
  askGreeting: 'Hi TeddyPups! I have a question:',
  /** Shown after an enquiry letter is posted */
  success: {
    heading: 'Message received!',
    body: 'Thank you — our team will get back to you promptly. For the quickest reply, message us on WhatsApp.',
  },
}

/** Main menu, in order (Home is added in front of these) */
export const navLinks = [
  { href: '/puppies', label: 'Puppies' },
  { href: '/happy-families', label: 'Happy families' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Visit & contact' },
]

/** A wa.me link that opens a WhatsApp chat with a ready-made message */
export function whatsappLink(message: string = site.greeting) {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`
}
