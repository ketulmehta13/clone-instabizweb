import { useRef } from 'react'
import { motion, useScroll } from 'motion/react'

/** A ribbon down the side of the puppy page that fills in as you read */
export function StoryRibbon() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 30%', 'end end'] })
  return (
    <div ref={ref} aria-hidden="true" className="tp-ribbon">
      <div className="tp-ribbon__track">
        <motion.span className="tp-ribbon__band" style={{ scaleY: scrollYProgress }} />
      </div>
    </div>
  )
}
