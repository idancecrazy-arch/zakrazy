interface ArchMotifProps {
  className?: string
  width?: number
  height?: number
  color?: string
}

export default function ArchMotif({
  className = '',
  width = 120,
  height = 100,
  color = '#D2C3A0',
}: ArchMotifProps) {
  const pillarW = width * 0.12
  const archR = (width - pillarW * 2) / 2
  const archCx = width / 2
  const pillarH = height * 0.55
  const archBase = height - pillarH

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Left pillar */}
      <rect
        x={0}
        y={archBase}
        width={pillarW}
        height={pillarH}
        stroke={color}
        strokeWidth="0.8"
        fill="none"
      />
      {/* Right pillar */}
      <rect
        x={width - pillarW}
        y={archBase}
        width={pillarW}
        height={pillarH}
        stroke={color}
        strokeWidth="0.8"
        fill="none"
      />
      {/* Palladian arch (semicircle) */}
      <path
        d={`M ${pillarW} ${archBase} A ${archR} ${archR} 0 0 1 ${width - pillarW} ${archBase}`}
        stroke={color}
        strokeWidth="0.8"
        fill="none"
      />
      {/* Entablature (top beam) */}
      <line
        x1={0}
        y1={archBase}
        x2={width}
        y2={archBase}
        stroke={color}
        strokeWidth="0.8"
      />
      {/* Base step */}
      <line
        x1={0}
        y1={height}
        x2={width}
        y2={height}
        stroke={color}
        strokeWidth="0.8"
      />
    </svg>
  )
}
