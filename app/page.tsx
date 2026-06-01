import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import CrossMotif from '@/components/CrossMotif'
import CtaBounce from '@/components/CtaBounce'
import CountdownTimer from '@/components/CountdownTimer'
import InvitationModal from '@/components/InvitationModal'
import { VENUE, RECEPTION_VENUE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Home',
}

export default function HomePage() {
  return (
    <>
      <InvitationModal />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-start pt-52 text-center px-6 overflow-hidden">

        {/* Hero photo background */}
        <Image
          src="/img-0195.jpg"
          alt="Christine & Michael"
          fill
          className="object-cover object-center"
          priority
        />

        {/* Soft overlay — light at top, darker at bottom so text reads */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(250,246,240,0.55) 0%, rgba(250,246,240,0.30) 40%, rgba(30,24,18,0.45) 100%)',
          }}
        />

        {/* Main heading */}
        <h1 className="relative font-italiana text-6xl sm:text-7xl md:text-8xl text-dark-taupe tracking-wide leading-none mb-6 drop-shadow-sm">
          You&rsquo;re Invited
        </h1>

        {/* Date */}
        <p className="relative font-italiana text-2xl sm:text-3xl text-[#5C4F72] tracking-[0.2em] mb-4 drop-shadow-sm">
          September <span className="text-3xl sm:text-4xl">12, 2026</span>
        </p>

        {/* Venue lines */}
        <div className="relative flex flex-col items-center gap-1 mb-8 sm:mb-14">
          <p className="font-work-sans text-[10px] tracking-[0.25em] uppercase text-dark-taupe/80">
            <span className="text-gold-line">Ceremony</span>
            &ensp;·&ensp;{VENUE.shortName}&ensp;·&ensp;{VENUE.neighborhood}
          </p>
          <p className="font-work-sans text-[10px] tracking-[0.25em] uppercase text-dark-taupe/80">
            <span className="text-gold-line">Reception</span>
            &ensp;·&ensp;{RECEPTION_VENUE.shortName}&ensp;·&ensp;{RECEPTION_VENUE.neighborhood}
          </p>
          <p className="font-work-sans text-base font-bold tracking-[0.25em] uppercase text-dark-taupe/80 mt-1">
            {VENUE.city}, {VENUE.state}
          </p>
        </div>

        {/* Cross → CTA */}
        <div className="relative flex flex-col items-center gap-6 sm:gap-8">
          <CrossMotif size={72} color="#D2C3A0" strokeWidth={5.5} />
          <CtaBounce />
        </div>
      </section>

      {/* ── Countdown ────────────────────────────────────── */}
      <section className="bg-ivory py-20 px-6">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-6 text-center">
          <CountdownTimer />
          <p className="font-work-sans text-[10px] tracking-[0.3em] uppercase text-soft-gray">
            Until the Celebration
          </p>
        </div>
      </section>

      {/* ── Final section ────────────────────────────────── */}
      <section className="bg-ivory py-16 flex flex-col items-center gap-6 text-center px-6">
        <p className="font-lora italic text-base text-deep-ivory max-w-xs leading-relaxed">
          We cannot wait to celebrate with you — please let us know you&rsquo;ll be joining us.
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
          RSVP Now
        </Link>
      </section>
    </>
  )
}
