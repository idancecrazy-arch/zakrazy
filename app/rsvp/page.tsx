import { Metadata } from 'next'
import RSVPFlow from '@/components/rsvp/RSVPFlow'
import CrossMotif from '@/components/CrossMotif'
import { RSVP_DEADLINE_DISPLAY } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'RSVP',
  description: 'Please RSVP for Christine & Michael\'s wedding on September 12, 2026.',
}

function DeadlineBanner() {
  const deadline = process.env.NEXT_PUBLIC_RSVP_DEADLINE
  if (deadline) {
    const d = new Date(deadline)
    if (!isNaN(d.getTime()) && new Date() > d) return null
  }
  const displayDate = deadline
    ? new Date(deadline).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : RSVP_DEADLINE_DISPLAY

  return (
    <div className="bg-blush/25 border border-shell-pink/40 px-6 py-3 text-center mb-10">
      <p className="font-work-sans text-[11px] tracking-[0.18em] uppercase text-dark-taupe/85">
        Please RSVP by{' '}
        <span className="text-dark-taupe font-medium">{displayDate}</span>
      </p>
    </div>
  )
}

export default function RSVPPage() {
  return (
    <div className="min-h-screen bg-ivory pt-32 sm:pt-36 pb-24 px-5 sm:px-6">
      <div className="max-w-2xl mx-auto">

        <DeadlineBanner />

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-8 mb-14 sm:mb-20">
          <p className="font-work-sans text-xs tracking-[0.18em] uppercase text-dark-taupe/80 font-medium">
            Christine &amp; Michael · September 12, 2026
          </p>

          <CrossMotif size={32} color="#D2C3A0" />

          <h1 className="font-italiana text-4xl sm:text-5xl md:text-6xl text-dark-taupe tracking-wide leading-tight">
            RSVP
          </h1>

          <p className="font-crimson text-lg sm:text-xl text-dark-taupe/85 max-w-md leading-relaxed">
            We&apos;re so glad you&apos;re here. Please find your name below and let us know you&apos;ll be joining us.
          </p>
        </div>

        {/* RSVP Form */}
        <RSVPFlow />

      </div>
    </div>
  )
}
