interface CrossMotifProps {
  className?: string
  size?: number
  color?: string
}

export default function CrossMotif({
  className = '',
  size = 32,
  color = '#C3AF82',
}: CrossMotifProps) {
  return (
    <svg
      viewBox="0 0 40 60"
      width={size * 0.67}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Vertical bar */}
      <line x1="20" y1="2" x2="20" y2="58" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
      {/* Horizontal bar (upper third) */}
      <line x1="4" y1="18" x2="36" y2="18" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
      {/* Serif flourishes on vertical ends */}
      <line x1="15" y1="2" x2="25" y2="2" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="15" y1="58" x2="25" y2="58" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      {/* Serif flourishes on horizontal ends */}
      <line x1="4" y1="14" x2="4" y2="22" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="36" y1="14" x2="36" y2="22" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
