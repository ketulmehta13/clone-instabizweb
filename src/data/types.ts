/** A photo or video. `focalX/Y` (0–1) keep the interesting part in frame when cropped. */
export type Media = {
  id: string
  src: string
  kind: 'image' | 'video'
  width: number
  height: number
  alt: string
  caption?: string
  focalX: number
  focalY: number
  /** Average colour, shown while the image loads */
  color: string
  /** Tiny blurred preview, shown while the image loads */
  blur?: string
  /** Still frame for videos */
  poster?: Media
}

export type PuppyStatus = 'available' | 'reserved' | 'rehomed'

export type Puppy = {
  id: string
  slug: string
  /** Pet name, if the puppy has one (e.g. "Max"); empty otherwise */
  name: string
  /** What we call the puppy on the site: the name, or the breed when unnamed */
  displayName: string
  breed: string
  gender: 'male' | 'female' | 'male-female'
  genderLabel: string
  age: string
  description: string
  status: PuppyStatus
  /** "local" = in our Dubai showroom, "imported" = brought in on request */
  origin: 'local' | 'imported' | null
  /** Breed filter slugs this puppy belongs to */
  breeds: string[]
  collections: string[]
  cover: Media | null
  media: Media[]
}

export type Breed = { slug: string; name: string }

export type Faq = { id: string; question: string; answer: string }

export type Testimonial = { quote: string; author: string; location: string }

export type Journey = {
  key: 'local' | 'imported'
  label: string
  hint: string
  heading: string
  body: string
  note: string
  steps: { title: string; text: string }[]
}
