import type { CSSProperties } from 'react'
import type { PoseName } from './geometry'
import { PupBuddy } from './PupBuddy'

type Props = {
  pose: PoseName
  facing?: 'left' | 'right'
  /** what Teddy does here: "tilt", "basket", "treadmill", "peekaboo"… */
  act?: string
  /** Teddy sits behind something here, so he hops over it to arrive */
  behind?: boolean
  /** used on phones, where Teddy only visits the first and last stop */
  lane?: boolean
  className?: string
  style?: CSSProperties
  label?: string
}

/**
 * A spot on the page that the walking Teddy (PupJourney) visits as you scroll.
 * Until the walker arrives (or on reduced motion) a sitting Teddy is shown here.
 */
export function PupStop({ pose, facing = 'right', act, behind = false, lane = false, className = '', style, label }: Props) {
  return (
    <div
      data-pup-stop=""
      data-pose={pose}
      data-facing={facing}
      data-act={act}
      data-behind={behind || undefined}
      data-lane={lane || undefined}
      className={`pup-stop ${className}`}
      style={style}
    >
      <PupBuddy pose={pose} facing={facing} label={label} asStop />
    </div>
  )
}
