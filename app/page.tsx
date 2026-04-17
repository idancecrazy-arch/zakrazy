import Link from 'next/link'
import { Metadata } from 'next'
import RoseMotif from '@/components/RoseMotif'
import CrossMotif from '@/components/CrossMotif'
import CountdownTimer from '@/components/CountdownTimer'
import FeatherDivider from '@/components/FeatherDivider'
import { COUPLE, VENUE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Save the Date',
}

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-screen bg-ivory flex flex-col items-center justify-center text-center px-6 overflow-hidden">

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

        {/* Gold rule */}
        <div className="w-20 h-px bg-gold-line gold-rule mb-10" />

        {/* Main heading */}
        <h1 className="font-italiana text-6xl sm:text-7xl md:text-8xl text-dark-taupe tracking-wide leading-none mb-4">
          Save the Date
        </h1>

        {/* Date */}
        <p className="font-italiana text-2xl sm:text-3xl text-dusty-lilac tracking-[0.2em] mb-2">
          September 12, 2026
        </p>

        {/* Venue line */}
        <p className="font-work-sans text-[10px] tracking-[0.25em] uppercase text-soft-gray mb-10">
          {VENUE.shortName}&ensp;·&ensp;{VENUE.neighborhood}&ensp;·&ensp;{VENUE.city}
        </p>

        {/* Rose + Cross motifs */}
        <div className="flex flex-col items-center gap-3">
          <RoseMotif size={160} />
          <CrossMotif size={28} color="#D2C3A0" />
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-10 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-8 bg-pale-gold/60" />
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="bg-ivory py-10 flex justify-center px-6">
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

      {/* ── Feather divider ──────────────────────────────── */}
      <div className="flex justify-center py-8 bg-ivory">
        <FeatherDivider width={280} color="#D2C3A0" />
      </div>

      {/* ── Countdown ────────────────────────────────────── */}
      <section className="bg-ivory py-16 px-6">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-10 text-center">
          <p className="font-work-sans text-[10px] tracking-[0.3em] uppercase text-soft-gray">
            Until the Celebration
          </p>

          <CountdownTimer />

          {/* Invitation line */}
          <p className="font-lora italic text-xl text-deep-ivory max-w-md leading-relaxed">
            We joyfully invite you to celebrate with us
          </p>

          {/* Names */}
          <div className="flex flex-col items-center gap-1">
            <p className="font-italiana text-3xl sm:text-4xl text-dark-taupe tracking-wide">
              {COUPLE.partner1.first} {COUPLE.partner1.last}
            </p>
            <p className="font-lora italic text-gold-line text-xl">&amp;</p>
            <p className="font-italiana text-3xl sm:text-4xl text-dark-taupe tracking-wide">
              {COUPLE.partner2.first} {COUPLE.partner2.last}
            </p>
          </div>

          {/* Gold rule */}
          <div className="w-16 h-px bg-pale-gold" />
        </div>
      </section>

      {/* ── Final rose ───────────────────────────────────── */}
      <section className="bg-ivory py-16 flex flex-col items-center gap-6 text-center px-6">
        <RoseMotif size={100} />
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
