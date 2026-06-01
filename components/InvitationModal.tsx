'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const cardMask = [
  'radial-gradient(ellipse 80% 84% at 50% 50%,',
  '  black 38%,',
  '  rgba(0,0,0,0.80) 58%,',
  '  rgba(0,0,0,0.35) 76%,',
  '  transparent 100%)',
].join('')

export default function InvitationModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!sessionStorage.getItem('invitation-seen')) {
      setOpen(true)
      sessionStorage.setItem('invitation-seen', '1')
    }
  }, [])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 px-4"
      style={{ background: 'rgba(30, 24, 18, 0.80)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
      role="dialog"
      aria-modal="true"
      aria-label="Wedding Invitation"
    >
      <div className="relative flex flex-col items-center gap-5">

        {/* Close button */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close invitation"
          className="absolute z-20 flex items-center justify-center text-white/60 hover:text-white transition-colors duration-200"
          style={{ top: '-0.25rem', right: '-0.5rem', width: '2rem', height: '2rem' }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <line x1="1" y1="1" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="12" y1="1" x2="1" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Photo card — golden ratio portrait */}
        <div
          style={{
            width: 'min(78vw, 400px)',
            aspectRatio: '1 / 1.618',
            position: 'relative',
            maskImage: cardMask,
            WebkitMaskImage: cardMask,
            boxShadow: '0 12px 60px rgba(20,14,8,0.55), 0 2px 16px rgba(20,14,8,0.3)',
            overflow: 'hidden',
          }}
        >
          <Image
            src="/img-0021.jpg"
            alt="Christine & Michael at Bethesda Terrace"
            fill
            className="object-cover object-center"
            priority
          />

          {/* Gradient overlay so text sits on dark lower portion */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.12) 50%, rgba(0,0,0,0.68) 100%)',
            }}
          />

          {/* Invitation text overlay */}
          <div
            className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-1 text-center"
            style={{ padding: '0 8% 10%' }}
          >
            <p className="font-work-sans text-white/70 tracking-[0.2em] uppercase"
              style={{ fontSize: 'clamp(0.52rem, 1.4vw, 0.6rem)' }}>
              Together with their families
            </p>
            <h2
              className="font-italiana text-white leading-tight"
              style={{ fontSize: 'clamp(1.5rem, 5vw, 2.1rem)', letterSpacing: '0.04em' }}
            >
              Christine &amp; Michael
            </h2>
            <p className="font-crimson italic text-white/85"
              style={{ fontSize: 'clamp(0.8rem, 2.2vw, 0.95rem)' }}>
              request the honour of your presence
            </p>
            <div className="w-8 h-px bg-white/40 my-1" />
            <p className="font-crimson text-white/80"
              style={{ fontSize: 'clamp(0.75rem, 2vw, 0.88rem)' }}>
              Saturday, the twelfth of September
            </p>
            <p className="font-crimson text-white/80"
              style={{ fontSize: 'clamp(0.75rem, 2vw, 0.88rem)' }}>
              two thousand and twenty-six
            </p>
            <p className="font-crimson text-white/70 mt-1"
              style={{ fontSize: 'clamp(0.7rem, 1.8vw, 0.82rem)' }}>
              New York City
            </p>
          </div>
        </div>

        {/* RSVP button — below the card */}
        <Link
          href="/rsvp"
          onClick={() => setOpen(false)}
          className="font-work-sans tracking-[0.25em] uppercase px-12 py-4 min-h-[50px] flex items-center justify-center bg-[#4A5068] text-white hover:bg-[#3a3f55] transition-colors duration-200"
          style={{ fontSize: 'clamp(0.62rem, 1.8vw, 0.72rem)' }}
        >
          RSVP Now
        </Link>
      </div>
    </div>
  )
}
