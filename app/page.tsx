import Link from 'next/link'
import { Metadata } from 'next'
import CrossMotif from '@/components/CrossMotif'
import CtaBounce from '@/components/CtaBounce'
import CountdownTimer from '@/components/CountdownTimer'
import { VENUE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Save the Date',
}

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-screen bg-ivory flex flex-col items-center justify-start pt-40 text-center px-6 overflow-hidden">

        {/* Celestial wisp background texture */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none"
          viewBox="0 0 800 600"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <path d="M 0 200 C 200 100, 400 300, 800 150" stroke="#C3AF82" strokeWidth="80" fill="none" />
          <path d="M 0 400 C 300 250, 500 450, 800 350" stroke="#C3AF82" strokeWidth="60" fill="none" />
          <path d="M 0 550 C 250 480, 550 520, 800 480" stroke="#C3AF82" strokeWidth="40" fill="none" />
          <path d="M 100 50 C 300 120, 600 20, 800 80" stroke="#C3AF82" strokeWidth="50" fill="none" />
        </svg>

        {/* Main heading */}
        <h1 className="font-italiana text-6xl sm:text-7xl md:text-8xl text-dark-taupe tracking-wide leading-none mb-6">
          Save the Date
        </h1>

        {/* Date */}
        <p className="font-italiana text-2xl sm:text-3xl text-dusty-lilac tracking-[0.2em] mb-4">
          September 12, 2026
        </p>

        {/* Venue line */}
        <p className="font-work-sans text-[10px] tracking-[0.25em] uppercase text-soft-gray mb-2">
          {VENUE.shortName}&ensp;·&ensp;{VENUE.neighborhood}
        </p>
        <p className="font-work-sans text-base font-bold tracking-[0.25em] uppercase text-soft-gray mb-14">
          {VENUE.city}
        </p>

        {/* Cross → CTA */}
        <div className="flex flex-col items-center gap-8">
          <div className="p-5 border border-gold-line/50 shadow-[0_0_0_6px_rgba(195,175,130,0.12)]">
            <CrossMotif size={72} color="#D2C3A0" strokeWidth={5.5} />
          </div>
          <CtaBounce />
        </div>
      </section>

      {/* ── Countdown ────────────────────────────────────── */}
      <section className="bg-ivory py-20 px-6">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-10 text-center">
          <p className="font-work-sans text-[10px] tracking-[0.3em] uppercase text-soft-gray">
            Until the Celebration
          </p>
          <CountdownTimer />
        </div>
      </section>

      {/* ── Final section ────────────────────────────────── */}
      <section className="bg-ivory py-16 flex flex-col items-center gap-6 text-center px-6">
        <p className="font-lora italic text-base text-deep-ivory max-w-xs leading-relaxed">
          More details coming soon — we cannot wait to celebrate with you.
        </p>
        <Link
          href="/rsvp"
          className="
            font-work-sans text-[12px] tracking-[0.25em] uppercase
            px-10 py-5 bg-gold-line text-ivory
            hover:bg-dark-taupe hover:-translate-y-0.5 hover:shadow-md
            transition-all duration-300
          "
        >
          Confirm Your Details
        </Link>
      </section>
    </>
  )
}
