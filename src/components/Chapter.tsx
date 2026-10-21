import type { ReactNode } from 'react'

/** Small numbered, handwritten heading above a section ("1 hello, it's me") */
export function Chapter({ n, children }: { n: number; children: ReactNode }) {
  return (
    <p className="tp-chapter">
      <span aria-hidden="true" className="tp-chapter__n font-plush">
        {n}
      </span>
      <span className="font-scrawl">{children}</span>
    </p>
  )
}
