import { PAW_PATH } from './pup/geometry'

/** Paw-print icon. Decorative unless given a `title`. */
export function Paw({ className, title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden={!title || undefined} role={title ? 'img' : undefined} fill="currentColor">
      {title ? <title>{title}</title> : null}
      <path d={PAW_PATH} />
    </svg>
  )
}
