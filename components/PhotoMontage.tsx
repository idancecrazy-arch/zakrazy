'use client'

import { useState } from 'react'
import Image from 'next/image'

interface MontageItem {
  src: string
  tall: boolean
}

interface PhotoMontageProps {
  items: MontageItem[]
}

export default function PhotoMontage({ items }: PhotoMontageProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <>
      {/* Montage grid */}
      <div className="columns-2 sm:columns-3 gap-2 sm:gap-3 px-2 sm:px-4 max-w-5xl mx-auto">
        {items.map(({ src }) => (
          <div
            key={src}
            className="break-inside-avoid mb-2 sm:mb-3 overflow-hidden rounded cursor-pointer group"
            onClick={() => setSelectedImage(src)}
          >
            <Image
              src={src}
              alt="Christine & Michael"
              width={800}
              height={1000}
              sizes="(max-width: 640px) 50vw, 33vw"
              className="w-full h-auto object-cover block transition-transform duration-200 group-hover:scale-105"
            />
          </div>
        ))}
      </div>

      {/* Lightbox modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 text-3xl leading-none"
              aria-label="Close modal"
            >
              ×
            </button>
            <Image
              src={selectedImage}
              alt="Christine & Michael"
              width={1600}
              height={2000}
              className="w-full h-full object-contain"
              priority
            />
          </div>
        </div>
      )}
    </>
  )
}
