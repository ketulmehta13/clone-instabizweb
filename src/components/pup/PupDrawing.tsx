import type { CSSProperties } from 'react'
import { COLLAR, CREAM, EYE_Y, FLOOR, FUR, FUR_DARK, BLUSH, H, INK, LEGS, PATHS, POSES, W, rig, toes } from './geometry'
import type { PoseName } from './geometry'

const line = { stroke: INK, strokeWidth: 3.4, strokeLinejoin: 'round', strokeLinecap: 'round' } as const
const outline = { ...line, fill: 'none' } as const

function Leg({ part, d, length, fill, transform, opacity }: { part: string; d: string; length: number; fill: string; transform: string; opacity?: number }) {
  return (
    <g data-p={part} transform={transform} opacity={opacity}>
      <path d={`${d}Z`} fill={fill} />
      <path d={d} {...outline} />
      <path d={toes(length)} {...outline} strokeWidth={2.4} />
    </g>
  )
}

function Eyes() {
  return (
    <>
      <ellipse cx={194} cy={EYE_Y} rx={7.4} ry={8.6} fill={INK} />
      <ellipse cx={230} cy={EYE_Y} rx={7.4} ry={8.6} fill={INK} />
      <circle cx={196.6} cy={EYE_Y - 3.4} r={2.7} fill="#fff" />
      <circle cx={232.6} cy={EYE_Y - 3.4} r={2.7} fill="#fff" />
      <circle cx={192} cy={EYE_Y + 3.2} r={1.2} fill="#fff" />
      <circle cx={228} cy={EYE_Y + 3.2} r={1.2} fill="#fff" />
    </>
  )
}

type Props = {
  pose?: PoseName
  facing?: 'left' | 'right'
  className?: string
  /** Accessible description; without it Teddy is decorative */
  label?: string
  style?: CSSProperties
}

/**
 * Teddy drawn in one pose. Every moving part has a `data-p` name so PupRig can
 * animate it later by rewriting transforms directly (no React re-renders).
 */
export function PupDrawing({ pose = 'sit', facing = 'right', className, label, style }: Props) {
  const r = rig(POSES[pose])
  const flip = facing === 'left' ? `translate(${W} 0) scale(-1 1)` : undefined
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      style={{ overflow: 'visible', ...style }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={!label || undefined}
      focusable="false"
    >
      <g data-p="root" transform={flip}>
        <ellipse
          data-p="shadow"
          {...PATHS.shadow}
          fill={INK}
          opacity={r.shadowOpacity}
          transform={r.shadow}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        />
        <g data-p="body" transform={r.body} opacity={r.side}>
          <Leg part="bf" d={LEGS.backFar} length={FLOOR - 192} fill={FUR_DARK} transform={r.bf} opacity={r.backLegs} />
          <Leg part="ff" d={LEGS.frontFar} length={FLOOR - 192} fill={FUR_DARK} transform={r.ff} />
          <g data-p="tail" transform={r.tail}>
            <path d={PATHS.tailStem} {...outline} strokeWidth={9} />
            <path d={PATHS.tailStem} stroke={FUR} strokeWidth={4} fill="none" strokeLinecap="round" />
            <path d={PATHS.tail} fill={FUR} {...line} />
          </g>
          <Leg part="bn" d={LEGS.back} length={FLOOR - 194} fill={FUR} transform={r.bn} opacity={r.backLegs} />
          <path d={PATHS.body} fill={FUR} {...line} />
          <path d={PATHS.chest} fill={FUR} {...line} />
          <Leg part="fn" d={LEGS.front} length={FLOOR - 194} fill={FUR} transform={r.fn} />
        </g>
        <g data-p="haunch" opacity={r.haunchOpacity} transform={r.haunch}>
          <path d={PATHS.haunch} fill={FUR} {...line} />
          <path d={PATHS.haunchPaw} fill={FUR} {...line} />
          <path d="M132 222v5M139 222v5" {...outline} strokeWidth={2.4} />
        </g>
        <g data-p="head" transform={r.head}>
          <path d={PATHS.collar} fill={COLLAR} {...line} strokeWidth={3} />
          <path d={PATHS.tag} fill={CREAM} {...line} strokeWidth={2.4} />
          <path data-p="earL" d={PATHS.earL} fill={FUR_DARK} {...line} transform={r.earL} />
          <path data-p="earR" d={PATHS.earR} fill={FUR_DARK} {...line} transform={r.earR} />
          <path d={PATHS.head} fill={FUR} {...line} />
          <path d={PATHS.topknot} fill={FUR} {...line} strokeWidth={3} />
          <path d={PATHS.muzzle} fill={CREAM} />
          <circle cx={181} cy={116} r={7} fill={BLUSH} opacity={0.85} />
          <circle cx={243} cy={116} r={7} fill={BLUSH} opacity={0.85} />
          <g data-p="eyes" transform={r.eyes}>
            <g data-p="open" opacity={r.openEyes}>
              <g data-p="blink" transform={r.blink}>
                <Eyes />
              </g>
            </g>
          </g>
          <path data-p="happy" d="M186.5 101 Q194 91.5 201.5 101 M222.5 101 Q230 91.5 237.5 101" {...outline} opacity={r.happyEyes} />
          <path data-p="shut" d="M186.5 97 Q194 103.5 201.5 97 M222.5 97 Q230 103.5 237.5 97" {...outline} opacity={r.shutEyes} />
          <path d={PATHS.nose} fill={INK} />
          <path d={PATHS.mouth} {...outline} strokeWidth={3} />
          <path data-p="tongue" d={PATHS.tongue} fill="#e98c8c" stroke={INK} strokeWidth={2.2} strokeLinejoin="round" opacity={r.tongue} />
          <g data-p="mouth" opacity={r.mouth}>
            <path d={PATHS.mouthOpen} fill="#6b2a1c" {...line} strokeWidth={2.6} />
            <path d="M206.5 133.5 Q212 130 217.5 133.5 Q215 138 212 138 Q209 138 206.5 133.5 Z" fill="#e98c8c" />
          </g>
        </g>
        <g data-p="ledge" opacity={r.ledge}>
          <path d={PATHS.ledgePaws} fill={FUR} {...line} />
          <path d={PATHS.ledgeToes} {...outline} strokeWidth={2.4} />
        </g>
      </g>
    </svg>
  )
}
