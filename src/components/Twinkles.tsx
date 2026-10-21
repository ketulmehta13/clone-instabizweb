/** [left %, top %, size] */
export type Star = [number, number, number]

/** Little twinkling stars scattered over a dark background */
export function Twinkles({ stars, scale = 1, className = 'pointer-events-none absolute inset-0' }: { stars: Star[]; scale?: number; className?: string }) {
  return (
    <div aria-hidden="true" className={className}>
      {stars.map(([left, top, size], i) => (
        <svg
          key={i}
          viewBox="0 0 40 40"
          className="tp-twinkle absolute text-honey"
          style={{ left: `${left}%`, top: `${top}%`, width: `${size * scale}px`, animationDelay: `${(0.4 * i).toFixed(2)}s` }}
          aria-hidden="true"
        >
          <path d="M20 3c1.6 9.4 7.6 15.4 17 17-9.4 1.6-15.4 7.6-17 17-1.6-9.4-7.6-15.4-17-17 9.4-1.6 15.4-7.6 17-17z" fill="currentColor" />
        </svg>
      ))}
    </div>
  )
}
