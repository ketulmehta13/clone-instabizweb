import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { Variants } from 'motion/react'
import type { Media } from '../data/types'
import { ViewerPhoto } from './ViewerPhoto'

const slide: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: 70 * dir, rotate: 5 * dir, scale: 0.92 }),
  center: { opacity: 1, x: 0, rotate: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 26 } },
  exit: (dir: number) => ({ opacity: 0, x: -70 * dir, rotate: -5 * dir, scale: 0.92, transition: { duration: 0.22 } }),
}

/**
 * Click-to-enlarge photo viewer. Returns `open(index)` and the dialog element to
 * render. Arrow keys or swiping move between photos.
 */
export function usePhotoViewer(photos: Media[]) {
  const ref = useRef<HTMLDialogElement>(null)
  const [at, setAt] = useState<number | null>(null)
  const [dir, setDir] = useState(1)
  const n = photos.length
  const wrap = useCallback((i: number) => ((i % n) + n) % n, [n])
  const go = useCallback(
    (i: number, d: number) => {
      setDir(d)
      setAt(wrap(i))
    },
    [wrap],
  )

  useEffect(() => {
    if (at === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(at + 1, 1)
      if (e.key === 'ArrowLeft') go(at - 1, -1)
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [at, go])

  const photo = at === null ? null : photos[at]
  const viewer = (
    <dialog
      ref={ref}
      aria-label="Photo viewer"
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-cocoa/95 p-0 text-milk backdrop:bg-cocoa/70"
      onClose={() => setAt(null)}
      onClick={(e) => e.target === ref.current && ref.current?.close()}
      data-lenis-prevent=""
    >
      {photo && at !== null && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <p className="font-scrawl text-lg">
              {at + 1} / {n}
              {photo.caption ? ` — ${photo.caption}` : ''}
            </p>
            <button type="button" onClick={() => ref.current?.close()} className="h-11 rounded-full bg-milk px-5 font-semibold text-cocoa">
              Close
            </button>
          </div>
          <div className="relative flex-1 overflow-hidden">
            <AnimatePresence initial={false} custom={dir}>
              <motion.div
                key={photo.id}
                custom={dir}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 touch-pan-y"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) go(at + 1, 1)
                  else if (info.offset.x > 80) go(at - 1, -1)
                }}
              >
                <ViewerPhoto media={photo} />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex justify-center gap-3 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3">
            <button type="button" onClick={() => go(at - 1, -1)} className="h-12 rounded-full border-2 border-milk px-6 font-semibold">
              Previous
            </button>
            <button type="button" onClick={() => go(at + 1, 1)} className="h-12 rounded-full bg-honey px-6 font-semibold text-cocoa">
              Next
            </button>
          </div>
        </div>
      )}
    </dialog>
  )

  return {
    open: (i: number) => {
      setDir(1)
      setAt(i)
      ref.current?.showModal()
    },
    viewer,
  }
}
