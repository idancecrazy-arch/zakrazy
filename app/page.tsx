import Link from 'next/link'
import { Metadata } from 'next'
import SwanMotif from '@/components/SwanMotif'
import CrossMotif from '@/components/CrossMotif'
import CountdownTimer from '@/components/CountdownTimer'
import FeatherDivider from '@/components/FeatherDivider'
import ChurchImage from '@/components/ChurchImage'
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
        <h1 className="font-italiana text-6xl sm:text-7xl md:text-8xl text-dark-taupe tracking-wide leading-none mb-6">
          Save the Date
        </h1>

        {/* Date */}
        <p className="font-italiana text-2xl sm:text-3xl text-dusty-lilac tracking-[0.2em] mb-4">
          September 12, 2026
        </p>

        {/* Location */}
        <p className="font-crimson italic text-lg text-muted-rose tracking-wide mb-2">
          {VENUE.shortName}
        </p>
        <p className="font-crimson text-base text-muted-rose/80 tracking-[0.08em]">
          {VENUE.neighborhood} · {VENUE.city}
        </p>

        {/* Swan + Cross motifs */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <SwanMotif size={140} color="#C3AF82" />
          <CrossMotif size={28} color="#D2C3A0" />
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-10 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-8 bg-pale-gold/60" />
        </div>
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

          {/* CTA */}
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
        </div>
      </section>

      {/* ── Venue preview ────────────────────────────────── */}
      <section className="bg-warm-cream py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center gap-6 text-center mb-12">
            <p className="font-work-sans text-[10px] tracking-[0.3em] uppercase text-soft-gray">
              The Venue
            </p>
            <h2 className="font-italiana text-4xl sm:text-5xl text-dark-taupe tracking-wide">
              St. Joseph&apos;s Church
            </h2>
            <p className="font-crimson italic text-lg text-deep-ivory">
              Greenwich Village · New York City
            </p>
            <FeatherDivider width={200} color="#D2C3A0" />
          </div>

          {/* Church photo hero */}
          <div className="relative border border-pale-gold/40 overflow-hidden">
            <div className="aspect-[16/9] bg-warm-cream flex items-center justify-center">
              <ChurchImage
                src="/images/st-josephs-exterior.jpg"
                alt="The Church of St. Joseph of the Holy Family, Greenwich Village"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center pointer-events-none">
                <CrossMotif size={40} color="#D2C3A0" />
                <p className="font-work-sans text-[10px] tracking-[0.3em] uppercase text-soft-gray mt-2">
                  371 Sixth Avenue · New York, NY 10014
                </p>
              </div>
            </div>
          </div>

          {/* Interior trio */}
          <div className="grid grid-cols-3 gap-2 mt-2">
            {['st-josephs-interior-1.jpg', 'st-josephs-interior-2.jpg', 'st-josephs-interior-3.jpg'].map((img, i) => (
              <div key={img} className="aspect-[4/3] bg-warm-cream border border-pale-gold/30 overflow-hidden relative">
                <ChurchImage
                  src={`/images/${img}`}
                  alt={`St. Joseph's Church interior ${i + 1}`}
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-6 h-px bg-pale-gold/40" />
                </div>
              </div>
            ))}
          </div>

          <p className="text-center font-work-sans text-[9px] tracking-[0.2em] uppercase text-soft-gray mt-3">
            The Church of St. Joseph of the Holy Family · Est. 1833 · Greek Revival
          </p>
        </div>
      </section>

      {/* ── Final swan ───────────────────────────────────── */}
      <section className="bg-ivory py-16 flex flex-col items-center gap-6 text-center px-6">
        <SwanMotif size={100} color="#D2C3A0" />
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
