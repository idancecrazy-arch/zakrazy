interface CloudMotifProps {
  className?: string
  fill?: string
  opacity?: number
  width?: number
  height?: number
}

export default function CloudMotif({
  className = '',
  fill = '#FFE5CC',
  opacity = 0.3,
  width = 200,
  height = 80,
}: CloudMotifProps) {
  return (
    <svg
      viewBox="0 0 200 80"
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      style={{ opacity }}
    >
      {/* Traditional Chinese ruyi-cloud form — looping mushroom-cap bumps */}
      <path
        d="
          M 20 70
          C 20 55 30 45 42 45
          C 42 35 50 28 60 28
          C 60 18 70 12 82 14
          C 90 8 100 6 108 12
          C 116 6 128 8 134 14
          C 146 12 156 18 156 28
          C 168 28 178 35 178 45
          C 190 45 200 55 200 70 Z
        "
        fill={fill}
      />
      {/* Ruyi curling lips at base left */}
      <path
        d="M 20 70 C 15 74 10 78 18 80 C 26 82 30 77 26 73"
        fill={fill}
      />
      {/* Ruyi curling lips at base right */}
      <path
        d="M 200 70 C 205 74 210 78 202 80 C 194 82 190 77 194 73"
        fill={fill}
      />
    </svg>
  )
}
