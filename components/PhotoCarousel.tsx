'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const PHOTOS = [
  { src: '/gallery-0231.jpg', alt: 'Christine & Michael' },
  { src: '/gallery-0248.jpg', alt: 'Christine & Michael' },
  { src: '/gallery-0305.jpg', alt: 'Christine & Michael' },
  { src: '/gallery-0180.jpg', alt: 'Christine & Michael' },
  { src: '/gallery-0234.jpg', alt: 'Christine & Michael' },
  { src: '/gallery-0396.jpg', alt: 'Christine & Michael' },
  { src: '/gallery-0235.jpg', alt: 'Christine & Michael' },
  { src: '/gallery-0423.jpg', alt: 'Christine & Michael' },
  { src: '/gallery-0031.jpg', alt: 'Christine & Michael' },
  { src: '/gallery-0214.jpg', alt: 'Christine & Michael' },
]

export default function PhotoCarousel() {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setCurrent(i => (i + 1) % PHOTOS.length)
        setFading(false)
      }, 600)
    }, 4500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-[85vh] sm:h-screen overflow-hidden">
      {PHOTOS.map((photo, i) => (
        <div
          key={photo.src}
          className="absolute inset-0 transition-opacity duration-700 bg-[#faf6f0]"
          style={{ opacity: i === current ? (fading ? 0 : 1) : 0 }}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            className="object-contain object-center"
            priority={i === 0}
          />
        </div>
      ))}
      {/* Subtle ivory fade at top and bottom to blend with sections */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(250,246,240,0.3) 0%, transparent 15%, transparent 85%, rgba(250,246,240,0.5) 100%)',
        }}
      />
      {/* Dot indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
        {PHOTOS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{ background: i === current ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)' }}
            aria-label={`Photo ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
