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
      viewBox="0 0 260 172"
      width={size}
      height={Math.round(size * 172 / 260)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Head */}
      <ellipse
        cx="54" cy="18" rx="11" ry="12"
        stroke={color} strokeWidth="2.2" fill="none"
      />
      {/* Eye */}
      <circle cx="50" cy="14" r="1.8" fill={color} />
      {/* Beak — filled tapered shape pointing left */}
      <path
        d="M 43 13 C 22 10 13 17 20 22 C 26 25 43 20 43 15 Z"
        fill={color}
      />
      {/* Outer neck — the defining bold S-curve (chest/breast side) */}
      <path
        d="M 44 28 C 16 52 14 86 32 112 C 46 130 68 140 92 144"
        stroke={color}
        strokeWidth="5.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Inner neck — back-of-neck edge, thinner */}
      <path
        d="M 62 24 C 52 46 54 74 62 100 C 68 118 88 130 114 136"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Upper back arch — the swan's back ridge (dominant stroke) */}
      <path
        d="M 96 92 C 130 76 172 74 204 92 C 220 102 226 124 218 142"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      {/* Mid-body sweep */}
      <path
        d="M 102 126 C 134 110 174 106 208 116 C 226 122 234 146 224 162"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Lower body */}
      <path
        d="M 106 148 C 138 140 174 138 204 150 C 218 156 224 168 216 172"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Neck-to-body joining stroke */}
      <path
        d="M 92 140 C 108 138 130 136 156 140 C 176 144 192 156 188 166"
        stroke={color}
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />
      {/* Tail feather 1 — longest, boldest */}
      <path
        d="M 214 86 C 228 114 238 146 240 172"
        stroke={color}
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Tail feather 2 */}
      <path
        d="M 206 84 C 218 114 226 148 226 172"
        stroke={color}
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Tail feather 3 — finest */}
      <path
        d="M 197 82 C 206 112 212 148 212 170"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
