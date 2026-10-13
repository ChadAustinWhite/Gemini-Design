import { forwardRef } from 'react'
import { fontById, motionMs, voiceLabel, type Concept, type MotionId, type MotionStrength, type Shape } from './model'

function shapeFrame(shape: Shape) {
  switch (shape) {
    case 'diamond':
      return 'rotate(-16 100 100)'
    case 'square':
      return 'translate(100 100) scale(1.06) translate(-100 -100)'
    case 'oval':
      return 'translate(100 100) scale(1.14 0.86) translate(-100 -100)'
    case 'hexagon':
      return 'rotate(18 100 100)'
    case 'shield':
      return 'translate(100 100) scale(0.9 1.08) translate(-100 -100)'
    case 'arch':
      return 'translate(100 112) scale(1 0.9) translate(-100 -100)'
    default:
      return undefined
  }
}

function BassCut({
  concept,
  ink,
  ground,
  solid,
  font,
}: {
  concept: Concept
  ink: string
  ground: string
  solid: boolean
  font: string
}) {
  const coffee = concept.word === 'ARLO' || /coffee|cafe|cup/i.test(concept.word)
  const fill = solid ? ink : 'none'
  const stroke = solid ? 'none' : ink
  const sw = solid ? 0 : concept.style === 'minimal' ? 3 : 5
  const letter = (concept.letters || 'A').slice(0, 1)
  return (
    <g transform={shapeFrame(concept.shape)}>
      {coffee ? (
        <>
          <polygon points="92,24 118,64 74,64" fill={fill} stroke={stroke} strokeWidth={sw} className={solid ? 'ink' : 'draw'} />
          <path
            d="M58 76 H146 L132 154 Q100 170 68 154 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
            className={solid ? 'ink' : 'draw'}
            pathLength={360}
          />
          <path d="M146 98c22 0 22 36 0 36" fill="none" stroke={ink} strokeWidth={solid ? 8 : sw || 4} className="draw" pathLength={80} />
          <polygon points="64,78 98,78 76,104" fill={ground} />
        </>
      ) : (
        <>
          <circle cx="74" cy="58" r="24" fill={fill} stroke={stroke} strokeWidth={sw} className={solid ? 'ink' : 'draw'} />
          <path
            d="M46 92 L112 80 L128 168 L36 160 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
            className={solid ? 'ink' : 'draw'}
            pathLength={360}
          />
          <polygon points="108,98 164,70 154,108" fill={fill} stroke={stroke} strokeWidth={sw} className={solid ? 'ink' : 'draw'} />
          <polygon points="96,118 124,132 96,148" fill={ground} />
        </>
      )}
      {concept.showInitials && (
        <text
          className="ink"
          x={coffee ? 96 : 78}
          y={coffee ? 128 : 136}
          textAnchor="middle"
          fill={solid ? ground : ink}
          fontFamily={font}
          fontSize={coffee ? 52 : 40}
          fontWeight={700}
        >
          {letter}
        </text>
      )}
    </g>
  )
}

function RandPicture({
  concept,
  ink,
  solid,
  font,
}: {
  concept: Concept
  ink: string
  solid: boolean
  font: string
}) {
  const letter = (concept.letters || 'A').slice(0, 2)
  const fill = solid ? ink : 'none'
  const stroke = solid ? 'none' : ink
  return (
    <g transform={shapeFrame(concept.shape)}>
      <rect
        x="40"
        y="150"
        width={letter.length > 1 ? 120 : 96}
        height="12"
        rx="2"
        fill={fill}
        stroke={stroke}
        strokeWidth={solid ? 0 : 3}
        className={solid ? 'ink' : 'draw'}
      />
      <text
        className="ink"
        x="78"
        y="122"
        textAnchor="middle"
        fill={solid ? ink : 'none'}
        stroke={solid ? 'none' : ink}
        strokeWidth={solid ? 0 : 2}
        fontFamily={font}
        fontSize={letter.length > 1 ? 72 : 112}
        fontWeight={700}
      >
        {letter}
      </text>
      <circle cx="126" cy="72" r="16" fill={fill} stroke={stroke} strokeWidth={solid ? 0 : 3} className={solid ? 'ink' : 'draw'} />
    </g>
  )
}

function GeismarLock({
  concept,
  ink,
  ground,
  solid,
  font,
}: {
  concept: Concept
  ink: string
  ground: string
  solid: boolean
  font: string
}) {
  const fill = solid ? ink : 'none'
  const stroke = solid ? 'none' : ink
  const sw = solid ? 0 : 6
  const round = concept.shape === 'circle' || concept.shape === 'oval' ? 40 : concept.shape === 'arch' ? 28 : 8
  return (
    <g transform={shapeFrame(concept.shape)}>
      <circle cx="78" cy="100" r="56" fill={fill} stroke={stroke} strokeWidth={sw} className={solid ? 'ink' : 'draw'} />
      {concept.shape === 'diamond' ? (
        <polygon points="118,46 172,100 118,154 96,100" fill={fill} stroke={stroke} strokeWidth={sw} className={solid ? 'ink' : 'draw'} />
      ) : (
        <rect
          x="96"
          y="54"
          width="72"
          height="92"
          rx={round}
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
          className={solid ? 'ink' : 'draw'}
        />
      )}
      <circle cx="112" cy="100" r="26" fill={ground} />
      {concept.showInitials && (
        <text
          className="ink"
          x="112"
          y="104"
          textAnchor="middle"
          dominantBaseline="central"
          fill={ink}
          fontFamily={font}
          fontSize={concept.letters.length > 2 ? 14 : 18}
          fontWeight={700}
          letterSpacing={concept.tracking}
        >
          {concept.letters.slice(0, 3)}
        </text>
      )}
    </g>
  )
}

function VignelliGrid({
  concept,
  ink,
  font,
}: {
  concept: Concept
  ink: string
  font: string
}) {
  const word = concept.word || concept.letters
  const frame = concept.shape === 'circle' || concept.shape === 'oval' ? (
    <ellipse cx="100" cy="100" rx="74" ry={concept.shape === 'oval' ? 58 : 74} fill="none" stroke={ink} strokeWidth="2.5" className="draw" pathLength={360} />
  ) : (
    <g transform={shapeFrame(concept.shape)}>
      <rect x="30" y="30" width="140" height="140" fill="none" stroke={ink} strokeWidth="2.5" className="draw" pathLength={360} />
    </g>
  )
  return (
    <g>
      {frame}
      {concept.showInitials && (
        <text
          className="ink"
          x="100"
          y="96"
          textAnchor="middle"
          fill={ink}
          fontFamily={font}
          fontSize={concept.letters.length > 1 ? 48 : 64}
          fontWeight={500}
          letterSpacing={concept.tracking}
        >
          {concept.letters.slice(0, 3)}
        </text>
      )}
      <line x1="56" y1="124" x2="144" y2="124" stroke={ink} strokeWidth="2.5" className="draw" pathLength={88} />
      <text
        className="ink"
        x="100"
        y={concept.showInitials ? 148 : 108}
        textAnchor="middle"
        fill={ink}
        fontFamily={font}
        fontSize={word.length > 8 ? 14 : 18}
        fontWeight={500}
        letterSpacing={Math.max(concept.tracking, 2)}
      >
        {word}
      </text>
    </g>
  )
}

export const LogoMark = forwardRef<
  SVGSVGElement,
  {
    concept: Concept
    pixelSize?: number
    animate?: boolean
    motion?: MotionId
    strength?: MotionStrength
    preview?: boolean
    className?: string
  }
>(function LogoMark({ concept, pixelSize, animate, motion = 'draw', strength = 'natural', preview, className }, ref) {
  const px = pixelSize ?? Math.round(concept.size * 2.25)
  const font = fontById(concept.fontId)
  const solid = concept.voice !== 'vignelli' && concept.style !== 'outlined' && concept.style !== 'minimal'
  const ink = concept.fg
  const ground = concept.bg

  return (
    <svg
      ref={ref}
      data-motion={motion}
      data-strength={strength}
      style={{ ['--motion-ms' as string]: `${motionMs(motion, strength)}ms` }}
      className={`logo-svg ${animate ? 'is-animating' : ''} ${preview ? 'is-preview' : ''} ${className ?? ''}`}
      width={px}
      height={px}
      viewBox="0 0 200 200"
      role="img"
      aria-label={`${concept.name}, in the manner of ${voiceLabel(concept.voice)}`}
    >
      {concept.voice === 'bass' && <BassCut concept={concept} ink={ink} ground={ground} solid={solid} font={font.stack} />}
      {concept.voice === 'rand' && <RandPicture concept={concept} ink={ink} solid={solid} font={font.stack} />}
      {concept.voice === 'geismar' && (
        <GeismarLock concept={concept} ink={ink} ground={ground} solid={solid} font={font.stack} />
      )}
      {concept.voice === 'vignelli' && <VignelliGrid concept={concept} ink={ink} font={font.stack} />}
    </svg>
  )
})
