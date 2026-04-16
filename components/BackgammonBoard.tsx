// Standard backgammon starting position, styled with the site's color palette.
// Points are numbered 1–24: 1 = bottom-right, 24 = top-right (from dark player's view).

const W = 520
const H = 320
const FRAME_PAD = 15
const BAR_X = 240
const BAR_W = 40
// Left half: x=FRAME_PAD to BAR_X, right half: x=BAR_X+BAR_W to W-FRAME_PAD
const HALF_W = BAR_X - FRAME_PAD          // 225
const PT_W = HALF_W / 6                    // 37.5
const TOP_Y = FRAME_PAD
const BOT_Y = H - FRAME_PAD               // 305
const TRI_H = 115
const CHECKER_R = 13

const DARK = '#5A5044'    // dark-taupe
const GOLD = '#C3AF82'    // gold-line
const LILAC = '#B4A5C3'   // dusty-lilac
const CREAM = '#FAF5EB'   // ivory
const WARM = '#F5EEE1'    // warm-cream
const BAR_CLR = '#786E5F' // deep-ivory

// Compute center-x for a point column (0-based within a half, left-to-right)
function halfX(col: number, right: boolean) {
  const base = right ? BAR_X + BAR_W : FRAME_PAD
  return base + col * PT_W + PT_W / 2
}

// All 24 point centers: points 1-6 bottom-right, 7-12 bottom-left, 13-18 top-left, 19-24 top-right
function pointCX(p: number): number {
  if (p >= 1 && p <= 6)   return halfX(6 - p, true)   // 1=col5, 6=col0
  if (p >= 7 && p <= 12)  return halfX(p - 7, false)   // 7=col0, 12=col5
  if (p >= 13 && p <= 18) return halfX(18 - p, false)  // 13=col5, 18=col0
  /* 19-24 */              return halfX(p - 19, true)   // 19=col0, 24=col5
}

function pointCY(p: number, k: number): number {
  // k = stack index (0-based)
  if (p <= 12) return BOT_Y - CHECKER_R - k * (CHECKER_R * 2 + 1)
  return TOP_Y + CHECKER_R + k * (CHECKER_R * 2 + 1)
}

// Triangle path for a point
function triPath(p: number): string {
  const cx = pointCX(p)
  const half = PT_W / 2 - 1
  if (p <= 12) {
    // pointing up from bottom
    return `M${cx - half},${BOT_Y} L${cx + half},${BOT_Y} L${cx},${BOT_Y - TRI_H}Z`
  }
  // pointing down from top
  return `M${cx - half},${TOP_Y} L${cx + half},${TOP_Y} L${cx},${TOP_Y + TRI_H}Z`
}

function triColor(p: number): string {
  return p % 2 === 0 ? GOLD : LILAC
}

// Starting checkers: [point, count, color]
const CHECKERS: [number, number, string][] = [
  [24, 2, DARK],
  [13, 5, DARK],
  [8,  3, DARK],
  [6,  5, DARK],
  [1,  2, CREAM],
  [12, 5, CREAM],
  [17, 3, CREAM],
  [19, 5, CREAM],
]

export default function BackgammonBoard() {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ maxWidth: 520 }}
      aria-label="Backgammon board in starting position"
      role="img"
    >
      {/* Board frame */}
      <rect x={0} y={0} width={W} height={H} rx={6} fill={DARK} />

      {/* Playing field — left half */}
      <rect x={FRAME_PAD} y={FRAME_PAD} width={HALF_W} height={H - FRAME_PAD * 2} fill={WARM} />

      {/* Playing field — right half */}
      <rect x={BAR_X + BAR_W} y={FRAME_PAD} width={HALF_W} height={H - FRAME_PAD * 2} fill={WARM} />

      {/* Bar */}
      <rect x={BAR_X} y={0} width={BAR_W} height={H} fill={BAR_CLR} />

      {/* Points (triangles) */}
      {Array.from({ length: 24 }, (_, i) => i + 1).map(p => (
        <path key={p} d={triPath(p)} fill={triColor(p)} opacity={0.85} />
      ))}

      {/* Checkers */}
      {CHECKERS.flatMap(([point, count, color]) =>
        Array.from({ length: count }, (_, k) => {
          const cx = pointCX(point)
          const cy = pointCY(point, k)
          const isLight = color === CREAM
          return (
            <g key={`${point}-${k}`}>
              <circle cx={cx} cy={cy} r={CHECKER_R} fill={color} stroke={isLight ? GOLD : WARM} strokeWidth={1.5} />
            </g>
          )
        })
      )}
    </svg>
  )
}
