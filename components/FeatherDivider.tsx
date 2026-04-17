interface FeatherDividerProps {
  className?: string
  color?: string
  width?: number
}

export default function FeatherDivider({
  className = '',
  color = '#D2C3A0',
  width = 320,
}: FeatherDividerProps) {
  const barbs = Array.from({ length: 20 }, (_, i) => i)
  const spacing = width / (barbs.length + 1)
  const cy = 10

  return (
    <svg
      viewBox={`0 0 ${width} 20`}
      width={width}
      height={20}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Central rachis */}
      <line
        x1="0"
        y1={cy}
        x2={width}
        y2={cy}
        stroke={color}
        strokeWidth="0.5"
      />
      {/* Barbs radiating from center line */}
      {barbs.map((i) => {
        const x = spacing * (i + 1)
        return (
          <g key={i}>
            {/* Upper barb */}
            <line
              x1={x}
              y1={cy}
              x2={x - 4}
              y2={cy - 5}
              stroke={color}
              strokeWidth="0.5"
              strokeLinecap="round"
            />
            {/* Lower barb */}
            <line
              x1={x}
              y1={cy}
              x2={x - 4}
              y2={cy + 5}
              stroke={color}
              strokeWidth="0.5"
              strokeLinecap="round"
            />
          </g>
        )
      })}
      {/* Diamond end stops */}
      <path
        d={`M 6 ${cy} L 3 ${cy - 3} L 0 ${cy} L 3 ${cy + 3} Z`}
        fill={color}
      />
      <path
        d={`M ${width - 6} ${cy} L ${width - 3} ${cy - 3} L ${width} ${cy} L ${width - 3} ${cy + 3} Z`}
        fill={color}
      />
    </svg>
  )
}
