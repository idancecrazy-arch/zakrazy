import { Metadata } from 'next'
import Link from 'next/link'
import RosePetals from '@/components/RosePetals'
import { CONTACT_EMAIL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Thank You',
  description: 'Thank you for your RSVP.',
}

interface Props {
  searchParams: Promise<{ name?: string; attending?: string; plusOne?: string; hotel?: string }>
}

export default async function ThankYouPage({ searchParams }: Props) {
  const params = await searchParams
  const name = params.name ?? 'Friend'
  const attending = params.attending === '1'
  const plusOneName = params.plusOne
  const wantsHotel = params.hotel === '1'

  return (
    <div className="relative min-h-screen bg-ivory flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
      <RosePetals />

      <div className="relative z-10 flex flex-col items-center gap-10 text-center max-w-lg">
        {/* Main message */}
        <div className="flex flex-col gap-4">
          <p className="font-work-sans text-[10px] tracking-[0.3em] uppercase text-soft-gray">
            Thank You
          </p>
          <h1 className="font-italiana text-5xl sm:text-6xl text-dark-taupe tracking-wide leading-tight">
            {attending ? `We'll see you there,` : `Until next time,`}
          </h1>
          <p className="font-italiana text-4xl sm:text-5xl text-dusty-lilac tracking-wide">
            {name}.
          </p>
        </div>

        <div className="h-px w-24 bg-gold-line" />

        {/* Attending message */}
        {attending ? (
          <p className="font-lora italic text-lg text-dark-taupe/85 leading-relaxed">
            Your RSVP has been received. We are so looking forward to celebrating with you
            on September 12th — it means the world to us.
          </p>
        ) : (
          <p className="font-lora italic text-lg text-dark-taupe/85 leading-relaxed">
            We&apos;re sorry you won&apos;t be able to make it, and we appreciate you letting us know.
            You&apos;ll be in our thoughts on our special day.
          </p>
        )}

        {/* RSVP summary */}
        {attending && (
          <div className="w-full bg-warm-cream/60 border border-pale-gold/40 p-6 flex flex-col gap-3 text-left">
            <p className="font-work-sans text-[10px] tracking-[0.2em] uppercase text-soft-gray text-center mb-1">
              Your RSVP Summary
            </p>
            <div className="flex justify-between font-crimson text-base text-dark-taupe border-b border-pale-gold/30 pb-2">
              <span className="text-dark-taupe/70">Attending</span>
              <span>Yes</span>
            </div>
            {plusOneName && (
              <div className="flex justify-between font-crimson text-base text-dark-taupe border-b border-pale-gold/30 pb-2">
                <span className="text-dark-taupe/70">Plus One</span>
                <span>{plusOneName}</span>
              </div>
            )}
            <div className="flex justify-between font-crimson text-base text-dark-taupe">
              <span className="text-dark-taupe/70">Date</span>
              <span>September 12, 2026</span>
            </div>
          </div>
        )}

        {/* Hotel note */}
        {attending && wantsHotel && (
          <p className="font-crimson italic text-base text-muted-rose">
            We&apos;ve noted your interest in hotel accommodations and will be in touch with details.
          </p>
        )}

        {/* Contact info */}
        <div className="flex flex-col gap-2">
          <p className="font-work-sans text-[10px] tracking-[0.2em] uppercase text-soft-gray">
            Questions?
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-crimson text-base text-dark-taupe underline underline-offset-4 hover:text-dusty-lilac transition-colors duration-200"
          >
            {CONTACT_EMAIL}
          </a>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
          <Link
            href="/"
            className="font-work-sans text-[11px] tracking-[0.18em] uppercase px-8 py-4 min-h-[52px] flex items-center border border-gold-line text-dark-taupe hover:bg-blush transition-colors duration-200"
          >
            Return Home
          </Link>
          <Link
            href="/faq"
            className="font-work-sans text-[11px] tracking-[0.18em] uppercase text-dark-taupe/70 hover:text-dusty-lilac transition-colors duration-200 underline underline-offset-4"
          >
            Read the FAQ
          </Link>
        </div>
      </div>
    </div>
  )
}
