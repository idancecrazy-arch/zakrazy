'use client'

import { WEDDING_DATE } from '@/lib/constants'

interface RoseMotifProps {
  size?: number
  className?: string
  color?: string  // petal tint, default warm white
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function layerProgress(global: number, start: number, end: number) {
  return Math.min(1, Math.max(0, (global - start) / (end - start)))
}

// 0 = tight bud (≥365 days out), 1 = full bloom (wedding day)
function getBloomProgress(): number {
  const now = new Date()
  const daysUntil = (WEDDING_DATE.getTime() - now.getTime()) / 86_400_000
  if (daysUntil <= 0) return 1
  if (daysUntil >= 365) return 0
  return 1 - daysUntil / 365
}

// Simple teardrop petal path, pointing upward from origin, scaled by rx/ry
function petalPath(rx: number, ry: number): string {
  return `M 0 0 C ${-rx} ${-ry * 0.35}, ${-rx * 0.7} ${-ry}, 0 ${-ry} C ${rx * 0.7} ${-ry}, ${rx} ${-ry * 0.35}, 0 0 Z`
}

export default function RoseMotif({
  size = 120,
  className = '',
}: RoseMotifProps) {
  const p = getBloomProgress()

  // Per-layer progress: outer blooms first, inner last
  const outerP  = layerProgress(p, 0.0, 0.55)
  const midP    = layerProgress(p, 0.2, 0.75)
  const innerP  = layerProgress(p, 0.4, 0.90)
  const centerP = layerProgress(p, 0.55, 1.0)

  // Outer petals (5 petals, 72° apart)
  const outerDist = lerp(2,  26, outerP)
  const outerRx   = lerp(5,  17, outerP)
  const outerRy   = lerp(14, 23, outerP)

  // Mid petals (5 petals, offset 36°)
  const midDist = lerp(1,  17, midP)
  const midRx   = lerp(4,  12, midP)
  const midRy   = lerp(11, 18, midP)

  // Inner petals (5 petals, 72° apart, offset 18° from outer)
  const innerDist = lerp(1,  9, innerP)
  const innerRx   = lerp(3,  8, innerP)
  const innerRy   = lerp(8,  13, innerP)

  // Sepal opacity decreases as rose opens
  const sepalOpacity = lerp(0.9, 0.15, p)

  const angles5    = [0, 72, 144, 216, 288]
  const angles5off = [36, 108, 180, 252, 324]

  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      style={{ overflow: 'visible' }}
    >
      <g transform="translate(60,60)">

        {/* Sepals — green, fade as petals open */}
        {angles5.map((a) => (
          <ellipse
            key={`sep-${a}`}
            cx="0" cy="-22" rx="3.5" ry="13"
            fill="#8BAD7A"
            opacity={sepalOpacity}
            transform={`rotate(${a})`}
          />
        ))}

        {/* Outer petals */}
        {angles5.map((a) => (
          <path
            key={`out-${a}`}
            d={petalPath(outerRx, outerRy)}
            fill="#FDFAF7"
            stroke="#E8D2C4"
            strokeWidth="0.5"
            opacity={lerp(0.4, 1, outerP)}
            transform={`rotate(${a}) translate(0,${-outerDist})`}
          />
        ))}

        {/* Mid petals */}
        {angles5off.map((a) => (
          <path
            key={`mid-${a}`}
            d={petalPath(midRx, midRy)}
            fill="#FDFAF7"
            stroke="#E8D2C4"
            strokeWidth="0.4"
            opacity={lerp(0.3, 1, midP)}
            transform={`rotate(${a}) translate(0,${-midDist})`}
          />
        ))}

        {/* Inner petals */}
        {angles5.map((a) => (
          <path
            key={`inn-${a}`}
            d={petalPath(innerRx, innerRy)}
            fill="#FEFCFA"
            stroke="#E8D2C4"
            strokeWidth="0.3"
            opacity={lerp(0.2, 1, innerP)}
            transform={`rotate(${a + 18}) translate(0,${-innerDist})`}
          />
        ))}

        {/* Center stamens — appear near full bloom */}
        {centerP > 0 && (
          <circle
            r={lerp(0, 5.5, centerP)}
            fill="#F5E4A0"
            opacity={centerP}
          />
        )}

      </g>
    </svg>
  )
}
