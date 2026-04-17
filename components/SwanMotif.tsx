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
  const h = Math.round(size * 220 / 380)
  return (
    <svg
      viewBox="0 0 380 220"
      width={size}
      height={h}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Head */}
      <circle cx="52" cy="22" r="9" fill={color} />
      {/* Eye */}
      <circle cx="47" cy="17" r="2" fill="white" />
      <circle cx="47" cy="17" r="1" fill={color} />
      {/* Beak — banana-wedge pointing left */}
      <path
        d="M 43 18 C 22 13 12 20 19 26 C 25 30 43 23 Z"
        fill={color}
      />

      {/* Neck — filled lens S-curve, thick at base tapering to head */}
      <path
        d="M 44 30 C 10 55 6 92 26 120 C 44 142 82 150 108 152
           C 118 150 92 134 72 114 C 54 94 52 62 62 30 Z"
        fill={color}
      />

      {/* Body — 6 filled lens brushstroke paths forming the calligraphic body */}

      {/* Stroke 1 — topmost, thinnest (~5px height) */}
      <path
        d="M 92 120 C 134 110 182 106 234 112 C 262 115 280 124 278 130
           C 276 136 256 132 226 128 C 175 122 128 126 92 134 Z"
        fill={color}
      />

      {/* Stroke 2 — broader (~8px height) */}
      <path
        d="M 90 135 C 128 122 180 118 236 124 C 265 128 287 138 286 147
           C 285 156 260 153 228 148 C 174 140 120 145 90 158 Z"
        fill={color}
      />

      {/* Stroke 3 — widest / boldest (~13px height, center of visual mass) */}
      <path
        d="M 88 150 C 122 136 176 132 234 138 C 265 143 292 154 291 165
           C 290 176 264 174 229 168 C 172 160 115 166 88 180 Z"
        fill={color}
      />

      {/* Stroke 4 — tapering back down (~9px height) */}
      <path
        d="M 91 168 C 126 158 174 154 228 160 C 256 164 280 174 279 183
           C 278 192 255 190 222 185 C 171 178 122 183 91 194 Z"
        fill={color}
      />

      {/* Stroke 5 — lower belly (~6px height) */}
      <path
        d="M 97 182 C 130 174 174 172 220 178 C 246 182 266 190 264 197
           C 262 204 244 202 215 198 C 168 192 126 196 97 206 Z"
        fill={color}
      />

      {/* Stroke 6 — waterline, finest (~3px height) */}
      <path
        d="M 106 196 C 136 192 172 190 212 194 C 234 197 250 203 249 207
           C 248 211 233 210 210 207 C 170 203 133 206 106 210 Z"
        fill={color}
      />

      {/* Tail — 3 stroked paths tapering from thick to whisper-thin */}
      <path
        d="M 282 120 C 318 148 348 178 352 220"
        stroke={color} strokeWidth="3.5" strokeLinecap="round" fill="none"
      />
      <path
        d="M 272 117 C 305 148 332 180 335 220"
        stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none"
      />
      <path
        d="M 261 114 C 291 146 316 178 318 220"
        stroke={color} strokeWidth="0.8" strokeLinecap="round" fill="none"
      />
    </svg>
  )
}
