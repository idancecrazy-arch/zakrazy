interface FeatherDividerProps {
  className?: string
  color?: string
  width?: number
}

export default function FeatherDivider({
  className = '',
  color = '#EAD0B1',
  width = 320,
}: FeatherDividerProps) {
  const h = 24
  const mid = h / 2
  const cx = Math.round(width / 2)
  const armLen = cx - 18

  return (
    <svg
      viewBox={`0 0 ${width} ${h}`}
      width={width}
      height={h}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Central diamond ornament */}
      <path
        d={`M ${cx} ${mid - 6} L ${cx + 5} ${mid} L ${cx} ${mid + 6} L ${cx - 5} ${mid} Z`}
        fill={color}
      />

      {/* Left arm — three layered lines of decreasing weight for feathered taper */}
      <line x1={cx - 14} y1={mid} x2={8}                        y2={mid} stroke={color} strokeWidth="0.4" strokeLinecap="round" />
      <line x1={cx - 14} y1={mid} x2={cx - 14 - armLen * 0.6}  y2={mid} stroke={color} strokeWidth="0.9" strokeLinecap="round" />
      <line x1={cx - 14} y1={mid} x2={cx - 14 - armLen * 0.25} y2={mid} stroke={color} strokeWidth="1.5" strokeLinecap="round" />

      {/* Right arm — mirror */}
      <line x1={cx + 14} y1={mid} x2={width - 8}                y2={mid} stroke={color} strokeWidth="0.4" strokeLinecap="round" />
      <line x1={cx + 14} y1={mid} x2={cx + 14 + armLen * 0.6}  y2={mid} stroke={color} strokeWidth="0.9" strokeLinecap="round" />
      <line x1={cx + 14} y1={mid} x2={cx + 14 + armLen * 0.25} y2={mid} stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
