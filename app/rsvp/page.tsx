import { Metadata } from 'next'
import RSVPFlow from '@/components/rsvp/RSVPFlow'
import CrossMotif from '@/components/CrossMotif'

export const metadata: Metadata = {
  title: 'RSVP',
  description: 'Please RSVP for Christine & Michael\'s wedding on September 12, 2026.',
}

export default function RSVPPage() {
  return (
    <div className="min-h-screen bg-ivory pt-32 sm:pt-36 pb-24 px-5 sm:px-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-8 mb-14 sm:mb-20">
          <p className="font-work-sans text-xs tracking-[0.18em] uppercase text-dark-taupe/90 font-medium">
            Christine &amp; Michael · September 12, 2026
          </p>

          <CrossMotif size={32} color="#D2C3A0" />

          <h1 className="font-poiret text-4xl sm:text-5xl md:text-6xl text-dark-taupe tracking-widest leading-tight">
            RSVP
          </h1>

          <p className="font-crimson text-lg sm:text-xl text-dark-taupe/90 max-w-md leading-relaxed">
            Please find your name below and let us know if you&apos;ll be joining us.
          </p>
        </div>

        {/* RSVP Form */}
        <RSVPFlow />

      </div>
    </div>
  )
}
