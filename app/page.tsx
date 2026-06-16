import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import CrossMotif from '@/components/CrossMotif'
import CtaBounce from '@/components/CtaBounce'
import CountdownTimer from '@/components/CountdownTimer'
import PhotoCarousel from '@/components/PhotoCarousel'
import { VENUE, RECEPTION_VENUE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Home',
}

export default function HomePage() {
  return (
    <>
      {/* ── Invite Hero ───────────────────────────────────── */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">

        <Image
          src="/img-0021.jpg"
          alt="Christine & Michael at Bethesda Terrace"
          fill
          className="object-cover object-center"
          priority
        />

        {/* Overlay — darken ceiling/edges, keep couple visible */}
        <div
          className="absolute inset-0"
          style={{
            background: [
              'linear-gradient(to bottom,',
              '  rgba(0,0,0,0.52) 0%,',
              '  rgba(0,0,0,0.18) 38%,',
              '  rgba(0,0,0,0.18) 62%,',
              '  rgba(0,0,0,0.60) 100%)',
            ].join(' '),
          }}
        />

        {/* Invitation text — sits above the couple */}
        <div className="relative flex flex-col items-center text-center" style={{ marginTop: '-15vh', gap: '0.5rem' }}>
          <p className="font-cormorant text-white/90 tracking-[0.28em] uppercase"
            style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)' }}>
            Together with their families
          </p>
          <h1
            className="font-italiana text-white leading-snug"
            style={{ fontSize: 'clamp(2rem, 7vw, 3.2rem)', letterSpacing: '0.05em' }}
          >
            Christine<br />&amp;<br />Michael
          </h1>
          <p className="font-cormorant uppercase text-white/90 leading-snug"
            style={{ fontSize: 'clamp(1rem, 2.6vw, 1.4rem)', letterSpacing: '0.14em', marginTop: '3rem' }}>
            Request the Honor of Your Presence<br />at Their Wedding
          </p>
        </div>
      </section>

      {/* ── You're Invited ───────────────────────────────── */}
      <section className="bg-ivory pt-24 pb-16 px-6 flex flex-col items-center text-center gap-6">
        <h2 className="font-italiana text-5xl sm:text-6xl md:text-7xl text-dark-taupe tracking-wide leading-none">
          You&rsquo;re Invited
        </h2>

        <p className="font-italiana text-2xl sm:text-3xl text-[#5C4F72] tracking-[0.18em]">
          September 12, 2026
        </p>

        <div className="flex flex-col items-center gap-1">
          <p className="font-work-sans text-sm tracking-[0.2em] uppercase text-dark-taupe/90">
            <span className="text-gold-deep">Ceremony</span>
            &ensp;·&ensp;{VENUE.shortName}&ensp;·&ensp;{VENUE.neighborhood}
          </p>
          <p className="font-work-sans text-sm tracking-[0.2em] uppercase text-dark-taupe/90">
            <span className="text-gold-deep">Reception</span>
            &ensp;·&ensp;{RECEPTION_VENUE.shortName}&ensp;·&ensp;{RECEPTION_VENUE.neighborhood}
          </p>
          <p className="font-work-sans text-base font-bold tracking-[0.25em] uppercase text-dark-taupe/90 mt-1">
            {VENUE.city}, {VENUE.state}
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 mt-4">
          <CrossMotif size={64} color="#C3AF82" strokeWidth={5.5} />
          <CtaBounce />
        </div>
      </section>

      {/* ── Photo Carousel ───────────────────────────────── */}
      <PhotoCarousel />

      {/* ── Countdown ────────────────────────────────────── */}
      <section className="bg-ivory py-16 px-6 border-t border-pale-gold/30">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-6 text-center">
          <CountdownTimer />
          <p className="font-work-sans text-[12px] tracking-[0.3em] uppercase text-ink-muted">
            Until the Celebration
          </p>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────── */}
      <section className="bg-ivory py-16 flex flex-col items-center gap-6 text-center px-6">
        <p className="font-lora italic text-base text-deep-ivory max-w-xs leading-relaxed">
          We can&rsquo;t wait to celebrate with you. Please let us know you&rsquo;ll be joining us.
        </p>
        <Link
          href="/rsvp"
          className="
            font-work-sans text-[13px] tracking-[0.25em] uppercase
            px-10 py-5 bg-gold-deep text-ivory
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
