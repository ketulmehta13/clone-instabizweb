import type { CSSProperties } from 'react'
import type { Media } from '../data/types'

/** Blurred version of the tiny preview, drawn behind the photo until it loads */
const blurBg = (src: string) =>
  `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 320'><filter id='b' color-interpolation-filters='sRGB'><feGaussianBlur stdDeviation='20'/><feColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/><feFlood x='0' y='0' width='100%' height='100%'/><feComposite operator='out' in='s'/><feComposite in2='SourceGraphic'/><feGaussianBlur stdDeviation='20'/></filter><image width='100%' height='100%' x='0' y='0' preserveAspectRatio='none' style='filter: url(#b);' href='${src}'/></svg>`,
  )}")`

type Props = {
  media: Media
  alt?: string
  className?: string
  /** load straight away with high priority (for the first big image on a page) */
  preload?: boolean
  /** load straight away, without waiting to scroll near it */
  eager?: boolean
  /** "fill" covers its (positioned) parent; "natural" keeps the photo's own shape */
  layout?: 'fill' | 'natural'
  style?: CSSProperties
}

/** A photo from the content files: cropped around its focal point, with a soft placeholder while loading */
export function Img({ media, alt, className, preload, eager, layout = 'fill', style }: Props) {
  const position = `${(100 * media.focalX).toFixed(1)}% ${(100 * media.focalY).toFixed(1)}%`
  const placeholder: CSSProperties = media.blur
    ? { backgroundSize: 'cover', backgroundPosition: position, backgroundRepeat: 'no-repeat', backgroundImage: blurBg(media.blur) }
    : {}
  const common = {
    src: media.src,
    alt: alt ?? media.alt,
    className,
    loading: preload || eager ? ('eager' as const) : ('lazy' as const),
    fetchPriority: preload ? ('high' as const) : undefined,
    decoding: 'async' as const,
    // drop the placeholder once the real photo is in
    onLoad: (e: React.SyntheticEvent<HTMLImageElement>) => (e.currentTarget.style.backgroundImage = 'none'),
  }
  if (layout === 'natural') {
    return (
      <img
        {...common}
        width={media.width}
        height={media.height}
        style={{ width: '100%', height: 'auto', color: 'transparent', backgroundColor: media.color, ...placeholder, ...style }}
      />
    )
  }
  return (
    <img
      {...common}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: position,
        color: 'transparent',
        backgroundColor: media.color,
        ...placeholder,
        ...style,
      }}
    />
  )
}
