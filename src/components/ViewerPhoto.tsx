import { useState } from 'react'
import type { Media } from '../data/types'
import { Img } from './Img'

/** The full-size photo, shown on top of the small one until it has loaded */
export function ViewerPhoto({ media }: { media: Media }) {
  const [sharp, setSharp] = useState(false)
  return (
    <>
      <Img
        media={media}
        alt=""
        eager
        className={sharp ? 'tp-viewer__first tp-viewer__first--done' : 'tp-viewer__first'}
        style={{ objectFit: 'contain', objectPosition: '50% 50%', backgroundColor: 'transparent', backgroundImage: 'none' }}
      />
      <img
        src={media.src}
        alt={media.alt}
        className="tp-viewer__sharp absolute inset-0 size-full object-contain"
        data-sharp={sharp || undefined}
        onLoad={(e) => {
          e.currentTarget
            .decode()
            .catch(() => {})
            .then(() => setSharp(true))
        }}
      />
    </>
  )
}
