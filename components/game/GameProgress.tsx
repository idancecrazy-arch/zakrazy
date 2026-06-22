// Mini backgammon board showing progress through the game.
// Reuses the geometry from BackgammonBoard.tsx but animates checkers in
// as each of the 3 scenes is completed.

const W = 360
const H = 200
const FRAME_PAD = 10
const BAR_X = 165
const BAR_W = 30
const HALF_W = BAR_X - FRAME_PAD          // 155
const PT_W = HALF_W / 6
const TOP_Y = FRAME_PAD
const BOT_Y = H - FRAME_PAD
const TRI_H = 75
const R = 9

const DARK = '#5A5044'
const GOLD = '#C3AF82'
const LILAC = '#B4A5C3'
const CREAM = '#FAF5EB'
const WARM = '#F5EEE1'
const BAR_CLR = '#786E5F'

function halfX(col: number, right: boolean) {
  const base = right ? BAR_X + BAR_W : FRAME_PAD
  return base + col * PT_W + PT_W / 2
}

function pointCX(p: number) {
  if (p >= 1 && p <= 6)   return halfX(6 - p, true)
  if (p >= 7 && p <= 12)  return halfX(p - 7, false)
  if (p >= 13 && p <= 18) return halfX(18 - p, false)
  return halfX(p - 19, true)
}

function pointCY(p: number, k: number) {
  if (p <= 12) return BOT_Y - R - k * (R * 2 + 1)
  return TOP_Y + R + k * (R * 2 + 1)
}

function triPath(p: number) {
  const cx = pointCX(p)
  const half = PT_W / 2 - 1
  if (p <= 12) return `M${cx - half},${BOT_Y} L${cx + half},${BOT_Y} L${cx},${BOT_Y - TRI_H}Z`
  return `M${cx - half},${TOP_Y} L${cx + half},${TOP_Y} L${cx},${TOP_Y + TRI_H}Z`
}

// Starting checker positions — revealed incrementally by scene
// scene 0 = none, 1 = dark checkers, 2 = + light checkers, 3 = all
const ALL_CHECKERS: Array<{ point: number; count: number; color: string; revealAt: number }> = [
  { point: 24, count: 2, color: DARK,  revealAt: 1 },
  { point: 13, count: 5, color: DARK,  revealAt: 1 },
  { point: 8,  count: 3, color: DARK,  revealAt: 2 },
  { point: 6,  count: 5, color: DARK,  revealAt: 3 },
  { point: 1,  count: 2, color: CREAM, revealAt: 1 },
  { point: 12, count: 5, color: CREAM, revealAt: 2 },
  { point: 17, count: 3, color: CREAM, revealAt: 2 },
  { point: 19, count: 5, color: CREAM, revealAt: 3 },
]

interface GameProgressProps {
  scenesCompleted: number // 0-3
}

export default function GameProgress({ scenesCompleted }: GameProgressProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <p className="font-work-sans text-xs tracking-widest uppercase text-[#736C62]">
        Progress
      </p>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ maxWidth: W }}
        aria-label="Backgammon board showing game progress"
        role="img"
      >
        {/* Frame */}
        <rect x={0} y={0} width={W} height={H} rx={4} fill={DARK} />

        {/* Left field */}
        <rect x={FRAME_PAD} y={FRAME_PAD} width={HALF_W} height={H - FRAME_PAD * 2} fill={WARM} />

        {/* Right field */}
        <rect x={BAR_X + BAR_W} y={FRAME_PAD} width={HALF_W} height={H - FRAME_PAD * 2} fill={WARM} />

        {/* Bar */}
        <rect x={BAR_X} y={0} width={BAR_W} height={H} fill={BAR_CLR} />

        {/* Points (triangles) */}
        {Array.from({ length: 24 }, (_, i) => i + 1).map(p => (
          <path
            key={p}
            d={triPath(p)}
            fill={p % 2 === 0 ? GOLD : LILAC}
            opacity={0.75}
          />
        ))}

        {/* Checkers — animate in as scenes complete */}
        {ALL_CHECKERS.flatMap(({ point, count, color, revealAt }) =>
          scenesCompleted >= revealAt
            ? Array.from({ length: count }, (_, k) => {
                const cx = pointCX(point)
                const cy = pointCY(point, k)
                const isLight = color === CREAM
                return (
                  <circle
                    key={`${point}-${k}-${color}`}
                    cx={cx}
                    cy={cy}
                    r={R}
                    fill={color}
                    stroke={isLight ? GOLD : WARM}
                    strokeWidth={1.5}
                    style={{ transition: 'opacity 0.6s', opacity: 1 }}
                  />
                )
              })
            : []
        )}

        {/* Scene milestone labels */}
        {[
          { x: FRAME_PAD + 8, label: '⚖️', done: scenesCompleted >= 1 },
          { x: W / 2,         label: '🤿', done: scenesCompleted >= 2 },
          { x: W - 28,        label: '🐾', done: scenesCompleted >= 3 },
        ].map(({ x, label, done }) => (
          <text
            key={label}
            x={x}
            y={H / 2 + 4}
            textAnchor="middle"
            fontSize="14"
            opacity={done ? 1 : 0.25}
          >
            {label}
          </text>
        ))}
      </svg>
    </div>
  )
}
