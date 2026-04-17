interface CrossMotifProps {
  className?: string
  size?: number
  color?: string
  strokeWidth?: number
}

export default function CrossMotif({
  className = '',
  size = 32,
  color = '#C3AF82',
  strokeWidth = 2.8,
}: CrossMotifProps) {
  const serif = strokeWidth * 0.65
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
      <line x1="20" y1="2" x2="20" y2="58" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="4" y1="18" x2="36" y2="18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="15" y1="2" x2="25" y2="2" stroke={color} strokeWidth={serif} strokeLinecap="round" />
      <line x1="15" y1="58" x2="25" y2="58" stroke={color} strokeWidth={serif} strokeLinecap="round" />
      <line x1="4" y1="14" x2="4" y2="22" stroke={color} strokeWidth={serif} strokeLinecap="round" />
      <line x1="36" y1="14" x2="36" y2="22" stroke={color} strokeWidth={serif} strokeLinecap="round" />
    </svg>
  )
}
