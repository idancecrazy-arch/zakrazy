// Pixel art cat: white body, brown spot over left eye, raccoon-striped tail.
// Accessories drawn on top per scene.
import type { CSSProperties } from 'react'

const P = 8 // pixel size in SVG units

const W = '#FAF5EB' // white body
const S = '#A0784A' // brown spot / ear / tail stripe 1
const D = '#3C3228' // dark eye
const N = '#C3A59E' // pink nose
const T = '#5A5044' // tail stripe 2 (dark taupe)
const _ = null      // transparent

type Color = string | null

// 8×8 body grid
const BODY: Color[][] = [
  [_, S, _, _, _, _, S, _],   // row 0: ear tips
  [_, W, W, W, W, W, W, _],   // row 1: head top
  [W, S, S, W, W, W, W, W],   // row 2: brown spot (left)
  [W, S, D, W, W, D, W, W],   // row 3: eyes + spot
  [W, W, W, W, W, W, W, W],   // row 4: face
  [W, W, W, N, W, W, W, W],   // row 5: nose
  [W, W, W, W, W, W, W, W],   // row 6: chin
  [_, W, W, W, W, W, W, _],   // row 7: neck
]

// tail: 3 wide × 8 tall, alternating S/T stripes, sits to right of body
const TAIL: Color[][] = [
  [S, S, S],
  [T, T, T],
  [S, S, S],
  [T, T, T],
  [S, S, S],
  [T, T, T],
  [S, S, S],
  [T, T, T],
]

type Accessory = 'none' | 'cap' | 'snorkel' | 'party'

interface PixelCatProps {
  accessory?: Accessory
  small?: boolean   // smaller version for adopted cat (adds pink bow)
  mouthOpen?: boolean  // for pac-man animation
  className?: string
  style?: CSSProperties
}

function renderGrid(grid: Color[][], offsetX: number, offsetY: number) {
  return grid.flatMap((row, r) =>
    row.map((color, c) =>
      color ? (
        <rect
          key={`${offsetX}-${offsetY}-${r}-${c}`}
          x={offsetX + c * P}
          y={offsetY + r * P}
          width={P}
          height={P}
          fill={color}
        />
      ) : null
    )
  )
}

export default function PixelCat({
  accessory = 'none',
  small = false,
  mouthOpen = false,
  className,
  style,
}: PixelCatProps) {
  const scale = small ? 0.75 : 1
  const bodyW = 8 * P  // 64
  const tailW = 3 * P  // 24
  const totalW = bodyW + tailW + P // 96 (gap + tail)
  const totalH = 8 * P // 64

  return (
    <svg
      viewBox={`0 0 ${totalW} ${totalH}`}
      width={totalW * scale}
      height={totalH * scale}
      className={className}
      style={style}
      aria-hidden
    >
      {/* Body */}
      {renderGrid(BODY, 0, 0)}

      {/* Mouth open: cover bottom-center with dark rect */}
      {mouthOpen && (
        <rect x={2 * P} y={6 * P} width={4 * P} height={P} fill={D} />
      )}

      {/* Tail (offset right of body, vertically centered slightly) */}
      {renderGrid(TAIL, bodyW + P, 0)}

      {/* === Accessories === */}

      {accessory === 'cap' && (
        <g>
          {/* Mortarboard: flat brim */}
          <rect x={-P} y={-P * 2} width={bodyW + 2 * P} height={P} fill={D} rx={1} />
          {/* Cap top */}
          <rect x={P} y={-P * 3} width={bodyW - 2 * P} height={P + 2} fill={D} />
          {/* Tassel */}
          <line x1={bodyW - P} y1={-P * 2} x2={bodyW + P} y2={-P} stroke={S} strokeWidth={2} />
          <rect x={bodyW + P - 2} y={-P - 2} width={4} height={6} fill={S} />
        </g>
      )}

      {accessory === 'snorkel' && (
        <g>
          {/* Mask: gold oval overlay on face */}
          <rect x={P} y={P * 2} width={bodyW - 2 * P} height={P * 3} fill="none"
            stroke="#C3AF82" strokeWidth={3} rx={6} />
          {/* Snorkel tube: goes from mask up and over */}
          <line x1={bodyW - 2 * P} y1={P * 2} x2={bodyW - 2 * P} y2={-P * 2} stroke="#C3AF82" strokeWidth={4} strokeLinecap="round" />
          <line x1={bodyW - 2 * P} y1={-P * 2} x2={bodyW - P} y2={-P * 2} stroke="#C3AF82" strokeWidth={4} strokeLinecap="round" />
        </g>
      )}

      {accessory === 'party' && (
        <g>
          {/* Party hat: triangle */}
          <polygon
            points={`${bodyW / 2},${-P * 4} ${P},${-P} ${bodyW - P},${-P}`}
            fill="#766588"
          />
          {/* Hat stripe */}
          <line x1={bodyW / 2 - P} y1={-P * 3} x2={bodyW / 2 + P} y2={-P * 1.5} stroke="#C3AF82" strokeWidth={2} />
          {/* Pom-pom */}
          <circle cx={bodyW / 2} cy={-P * 4} r={4} fill="#EBD2C8" />
        </g>
      )}

      {/* Pink bow for small (adopted) cat */}
      {small && (
        <g>
          {/* Bow center */}
          <rect x={bodyW / 2 - 2} y={-P - 2} width={4} height={4} fill="#C3A59E" />
          {/* Left wing */}
          <polygon points={`${bodyW / 2 - 2},${-P} ${bodyW / 2 - 12},${-P - 6} ${bodyW / 2 - 12},${-P + 6}`} fill="#EBD2C8" />
          {/* Right wing */}
          <polygon points={`${bodyW / 2 + 2},${-P} ${bodyW / 2 + 12},${-P - 6} ${bodyW / 2 + 12},${-P + 6}`} fill="#EBD2C8" />
        </g>
      )}
    </svg>
  )
}
