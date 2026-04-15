'use client'

interface ChurchImageProps {
  src: string
  alt: string
  className?: string
}

export default function ChurchImage({ src, alt, className = '' }: ChurchImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`w-full h-full object-cover ${className}`}
      onError={(e) => {
        ;(e.target as HTMLImageElement).style.display = 'none'
      }}
    />
  )
}
