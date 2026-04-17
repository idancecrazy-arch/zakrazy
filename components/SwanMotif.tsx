interface SwanMotifProps {
  className?: string
  size?: number
  color?: string
}

export default function SwanMotif({
  className = '',
  size = 160,
  color = '#5A5044',
}: SwanMotifProps) {
  return (
    <svg
      viewBox="0 0 340 220"
      width={size}
      height={Math.round(size * 220 / 340)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Head */}
      <circle cx="50" cy="18" r="8" stroke={color} strokeWidth="1.6" fill="none" />
      {/* Eye */}
      <circle cx="45" cy="13" r="1.5" fill={color} />
      {/* Beak — small wedge pointing left */}
      <path
        d="M 42 16 C 24 12 15 18 21 23 C 25 26 42 20 42 16 Z"
        fill={color}
      />

      {/* Neck — outer breast curve (bold) */}
      <path
        d="M 44 24 C 14 48 8 84 26 112 C 42 132 76 142 104 146"
        stroke={color} strokeWidth="3.2" strokeLinecap="round"
      />
      {/* Neck — inner back curve (thin) */}
      <path
        d="M 60 22 C 50 44 50 74 58 98 C 66 116 88 128 114 134"
        stroke={color} strokeWidth="1.0" strokeLinecap="round"
      />

      {/* Body — 12 calligraphic pen-stroke paths, thin at top & bottom, boldest at center */}

      {/* Row 1  — hairline */}
      <path d="M 96 120 C 132 115 172 113 224 117 C 250 119 266 124 264 130"
        stroke={color} strokeWidth="0.8" strokeLinecap="round" />

      {/* Row 2 */}
      <path d="M 92 129 C 130 123 174 120 230 125 C 258 128 276 135 274 142"
        stroke={color} strokeWidth="1.2" strokeLinecap="round" />

      {/* Row 3 */}
      <path d="M 90 138 C 128 131 174 128 234 134 C 262 138 280 146 278 153"
        stroke={color} strokeWidth="1.6" strokeLinecap="round" />

      {/* Row 4 */}
      <path d="M 88 147 C 126 139 172 136 234 142 C 263 146 282 155 280 163"
        stroke={color} strokeWidth="2.0" strokeLinecap="round" />

      {/* Row 5 */}
      <path d="M 88 156 C 124 147 170 144 232 150 C 262 154 282 164 280 172"
        stroke={color} strokeWidth="2.3" strokeLinecap="round" />

      {/* Row 6 — boldest */}
      <path d="M 88 165 C 122 155 168 152 230 158 C 260 162 282 173 280 181"
        stroke={color} strokeWidth="2.5" strokeLinecap="round" />

      {/* Row 7 — boldest */}
      <path d="M 90 174 C 124 164 168 161 228 167 C 258 171 278 182 276 190"
        stroke={color} strokeWidth="2.5" strokeLinecap="round" />

      {/* Row 8 */}
      <path d="M 92 182 C 126 173 168 170 224 176 C 252 180 272 191 270 199"
        stroke={color} strokeWidth="2.2" strokeLinecap="round" />

      {/* Row 9 */}
      <path d="M 96 190 C 128 182 168 180 218 185 C 246 189 264 199 262 207"
        stroke={color} strokeWidth="1.8" strokeLinecap="round" />

      {/* Row 10 */}
      <path d="M 102 197 C 132 190 168 188 210 193 C 236 197 252 206 250 213"
        stroke={color} strokeWidth="1.4" strokeLinecap="round" />

      {/* Row 11 */}
      <path d="M 108 203 C 136 197 168 195 204 200 C 228 203 242 212 240 218"
        stroke={color} strokeWidth="1.0" strokeLinecap="round" />

      {/* Row 12 — hairline */}
      <path d="M 116 208 C 142 203 168 202 198 206 C 218 209 230 216 228 220"
        stroke={color} strokeWidth="0.7" strokeLinecap="round" />

      {/* Tail — 5 long strokes fanning right, descending weight */}
      <path d="M 272 122 C 298 140 318 164 324 200"
        stroke={color} strokeWidth="2.8" strokeLinecap="round" />
      <path d="M 268 120 C 292 140 310 166 314 200"
        stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M 263 118 C 286 140 302 168 304 200"
        stroke={color} strokeWidth="1.0" strokeLinecap="round" />
      <path d="M 258 116 C 280 140 294 170 295 200"
        stroke={color} strokeWidth="0.5" strokeLinecap="round" />
      <path d="M 252 114 C 273 140 285 172 285 200"
        stroke={color} strokeWidth="0.3" strokeLinecap="round" />
    </svg>
  )
}
