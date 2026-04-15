interface SwanMotifProps {
  className?: string
  size?: number
  color?: string
}

export default function SwanMotif({
  className = '',
  size = 160,
  color = '#C3AF82',
}: SwanMotifProps) {
  return (
    <svg
      viewBox="0 0 200 140"
      width={size}
      height={size * 0.7}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Left swan — neck curves from top-left down to centre, body sweeps left */}
      <path
        d="M 100 115 C 55 115 20 78 42 48 C 53 33 71 32 78 18"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Right swan — mirror */}
      <path
        d="M 100 115 C 145 115 180 78 158 48 C 147 33 129 32 122 18"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Left swan body */}
      <path
        d="M 42 48 C 28 58 18 78 32 96 C 46 112 72 116 100 115"
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
        fill="none"
      />
      {/* Right swan body (mirrored) */}
      <path
        d="M 158 48 C 172 58 182 78 168 96 C 154 112 128 116 100 115"
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
        fill="none"
      />
      {/* Left swan head */}
      <ellipse
        cx="78"
        cy="14"
        rx="5"
        ry="6"
        stroke={color}
        strokeWidth="1"
        fill="none"
      />
      {/* Left beak */}
      <path
        d="M 73 13 L 67 11"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Right swan head */}
      <ellipse
        cx="122"
        cy="14"
        rx="5"
        ry="6"
        stroke={color}
        strokeWidth="1"
        fill="none"
      />
      {/* Right beak */}
      <path
        d="M 127 13 L 133 11"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Tail flourish at the point where bodies meet */}
      <path
        d="M 100 115 C 96 124 100 130 100 130 C 100 130 104 124 100 115"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
