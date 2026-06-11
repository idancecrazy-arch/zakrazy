import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Our Story',
  description: 'The story of Christine and Michael.',
}

const MONTAGE = [
  { src: '/gallery-0377.jpg', tall: false },
  { src: '/gallery-0093.jpg', tall: true },
  { src: '/gallery-0100.jpg', tall: true },
  { src: '/gallery-0134.jpg', tall: false },
  { src: '/gallery-0180.jpg', tall: false },
  { src: '/gallery-0136.jpg', tall: true },
  { src: '/gallery-0208.jpg', tall: false },
  { src: '/gallery-0274.jpg', tall: true },
  { src: '/gallery-0031.jpg', tall: false },
  { src: '/gallery-0248.jpg', tall: false },
  { src: '/gallery-0231.jpg', tall: false },
  { src: '/gallery-0234.jpg', tall: false },
  { src: '/gallery-0235.jpg', tall: false },
  { src: '/gallery-0305.jpg', tall: false },
  { src: '/gallery-0396.jpg', tall: false },
  { src: '/gallery-0423.jpg', tall: false },
]

export default function OurStoryPage() {
  return (
    <div className="min-h-screen bg-ivory pt-36 pb-24">

      {/* Header */}
      <div className="flex flex-col items-center text-center gap-6 mb-14 sm:mb-20 px-6">
        <h1 className="font-italiana text-5xl sm:text-6xl text-dark-taupe tracking-wide leading-tight">
          Our<br />Story
        </h1>
        <p className="font-lora italic text-lg text-deep-ivory leading-relaxed max-w-xs">
          A few moments from the beginning.
        </p>
      </div>

      {/* Montage grid */}
      <div className="columns-2 sm:columns-3 gap-2 sm:gap-3 px-2 sm:px-4 max-w-5xl mx-auto">
        {MONTAGE.map(({ src }) => (
          <div key={src} className="break-inside-avoid mb-2 sm:mb-3 overflow-hidden">
            <Image
              src={src}
              alt="Christine & Michael"
              width={800}
              height={1000}
              className="w-full h-auto object-cover block"
            />
          </div>
        ))}
      </div>

    </div>
  )
}
