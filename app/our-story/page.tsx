import { Metadata } from 'next'
import PhotoMontage from '@/components/PhotoMontage'
import SecretGallery from '@/components/SecretGallery'

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
  { src: '/gallery-0124.jpg', tall: true },
  { src: '/gallery-0248.jpg', tall: false },
  { src: '/gallery-0231.jpg', tall: false },
  { src: '/gallery-0234.jpg', tall: false },
  { src: '/gallery-0235.jpg', tall: false },
  { src: '/gallery-0305.jpg', tall: false },
  { src: '/gallery-0396.jpg', tall: false },
  { src: '/gallery-0423.jpg', tall: false },
  { src: '/gallery-0184.jpg', tall: true },
  { src: '/gallery-0214.jpg', tall: false },
  { src: '/img-0021.jpg', tall: false },
  { src: '/img-0195.jpg', tall: true },
]

export default function OurStoryPage() {
  return (
    <div className="min-h-screen bg-ivory pt-36 pb-24">

      {/* Header */}
      <div className="flex flex-col items-center text-center gap-6 mb-14 sm:mb-20 px-6">
        <h1 className="font-italiana text-5xl sm:text-6xl text-dark-taupe tracking-wide leading-tight">
          Our<br />Story
        </h1>
      </div>

      {/* Montage grid with interactive hover and click enlargement */}
      <PhotoMontage items={MONTAGE} />

      {/* Hidden footer to the engagement shoot — click to unlock candids */}
      <SecretGallery />

    </div>
  )
}
