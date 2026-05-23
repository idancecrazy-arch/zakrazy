'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'


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
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ background: 'rgba(62, 55, 47, 0.72)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
      role="dialog"
      aria-modal="true"
      aria-label="Wedding Invitation"
    >
      {/* Relative wrapper so envelope + card stack together */}
      <div className="relative flex items-center justify-center">

        {/* Envelope — slightly larger, rotated, with flap detail */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            /* 10% wider and 7% taller than the card via inset */
            inset: '-5% -5.5%',
            background: '#E6E0D4',
            transform: 'rotate(-2deg)',
            boxShadow: '0 32px 90px rgba(30,24,18,0.55), 0 8px 28px rgba(30,24,18,0.35)',
            zIndex: 0,
            overflow: 'hidden',
          }}
        >
          {/* Envelope structure lines */}
          <svg
            viewBox="0 0 110 118"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full"
          >
            {/* Open flap shadow at top (card pulled halfway out) */}
            <polygon points="0,0 110,0 55,28" fill="#DAD4C7" />
            {/* Crease from flap point to side corners */}
            <line x1="55" y1="28" x2="0" y2="0" stroke="#C8C2B5" strokeWidth="0.4" />
            <line x1="55" y1="28" x2="110" y2="0" stroke="#C8C2B5" strokeWidth="0.4" />
            {/* Bottom flap crease */}
            <line x1="0" y1="118" x2="55" y2="82" stroke="#C8C2B5" strokeWidth="0.4" />
            <line x1="110" y1="118" x2="55" y2="82" stroke="#C8C2B5" strokeWidth="0.4" />
            {/* Side flap creases */}
            <line x1="0" y1="0" x2="0" y2="118" stroke="#C8C2B5" strokeWidth="0.3" opacity="0.5" />
            <line x1="110" y1="0" x2="110" y2="118" stroke="#C8C2B5" strokeWidth="0.3" opacity="0.5" />
          </svg>
        </div>

        {/* Card — golden ratio portrait */}
        <div
          className="relative flex flex-col overflow-y-auto"
          style={{
            /*
             * Golden ratio: height = width × φ (1.618)
             * Constrain by whichever fills the screen — viewport-height drives on landscape/desktop,
             * viewport-width drives on portrait mobile.
             */
            width: 'min(88vw, calc(90svh / 1.618))',
            aspectRatio: '1 / 1.618',
            background: '#FAFAF6',
            zIndex: 1,
            boxShadow: '0 4px 24px rgba(30,24,18,0.22)',
          }}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close invitation"
            className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center text-[#4A5068]/50 hover:text-[#4A5068] transition-colors duration-200"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
              <line x1="1" y1="1" x2="12" y2="12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <line x1="12" y1="1" x2="1" y2="12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>

          {/* Content — distributed evenly through the golden ratio card */}
          <div
            className="relative z-10 flex flex-col items-center text-center"
            style={{ padding: 'clamp(2rem, 5%, 3.5rem) clamp(1.5rem, 7%, 3rem)', gap: 0, height: '100%', justifyContent: 'space-between' }}
          >
            {/* Main invitation text — Balzak italic */}
            <div className="flex flex-col items-center gap-0">
              <p
                className="font-italiana text-[#4A5068] leading-[1.55]"
                style={{ fontSize: 'clamp(1.25rem, 4.5vw, 1.7rem)', fontStyle: 'italic' }}
              >
                Christine &amp; Michael
              </p>
              <p
                className="font-italiana text-[#4A5068] leading-[1.55]"
                style={{ fontSize: 'clamp(1rem, 3.5vw, 1.35rem)', fontStyle: 'italic' }}
              >
                would love your company
                <br />
                at their wedding
                <br />
                celebration on
              </p>
            </div>

            {/* Date */}
            <p
              className="font-italiana text-[#4A5068]"
              style={{ fontSize: 'clamp(1.4rem, 5vw, 1.95rem)', fontStyle: 'italic' }}
            >
              September 12, 2026
            </p>

            {/* Divider */}
            <div style={{ width: 'clamp(2rem, 15%, 3.5rem)', height: '1px', background: '#C3AF82', opacity: 0.7 }} />

            {/* Venues */}
            <div className="flex flex-col items-center" style={{ gap: 'clamp(0.6rem, 2%, 1rem)' }}>
              <div className="flex flex-col items-center">
                <p
                  className="font-work-sans text-[#C3AF82] tracking-[0.22em] uppercase"
                  style={{ fontSize: 'clamp(0.5rem, 1.6vw, 0.65rem)' }}
                >
                  Ceremony · 1:30pm
                </p>
                <p
                  className="font-italiana text-[#4A5068]"
                  style={{ fontSize: 'clamp(1.1rem, 3.8vw, 1.45rem)', fontStyle: 'italic', lineHeight: 1.3 }}
                >
                  St. Joseph&apos;s Church
                </p>
                <p
                  className="font-crimson text-[#4A5068]/55 tracking-wide"
                  style={{ fontSize: 'clamp(0.65rem, 2vw, 0.85rem)' }}
                >
                  Greenwich Village
                </p>
              </div>

              <div className="flex flex-col items-center">
                <p
                  className="font-work-sans text-[#C3AF82] tracking-[0.22em] uppercase"
                  style={{ fontSize: 'clamp(0.5rem, 1.6vw, 0.65rem)' }}
                >
                  Cocktail Hour · 5pm
                </p>
                <p
                  className="font-italiana text-[#4A5068]"
                  style={{ fontSize: 'clamp(1.1rem, 3.8vw, 1.45rem)', fontStyle: 'italic', lineHeight: 1.3 }}
                >
                  Golden Unicorn
                </p>
                <p
                  className="font-crimson text-[#4A5068]/55 tracking-wide"
                  style={{ fontSize: 'clamp(0.65rem, 2vw, 0.85rem)' }}
                >
                  Chinatown
                </p>
              </div>

              <p
                className="font-italiana text-[#4A5068]"
                style={{ fontSize: 'clamp(1.1rem, 3.8vw, 1.4rem)', fontStyle: 'italic' }}
              >
                New York City.
              </p>
            </div>

            {/* Flourish */}
            <svg
              style={{ width: 'clamp(40px, 14%, 70px)', color: '#C3AF82', opacity: 0.8 }}
              viewBox="0 0 70 28"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 14 C12 5, 24 2, 35 14 C46 26, 58 23, 66 14"
                stroke="currentColor"
                strokeWidth="1.3"
                fill="none"
                strokeLinecap="round"
              />
              <circle cx="35" cy="14" r="1.8" fill="currentColor" />
            </svg>

            {/* RSVP button */}
            <Link
              href="/rsvp"
              onClick={() => setOpen(false)}
              className="w-full font-work-sans tracking-[0.22em] uppercase flex items-center justify-center bg-[#4A5068] text-white hover:bg-[#3a3f55] transition-colors duration-200"
              style={{ fontSize: 'clamp(0.6rem, 1.8vw, 0.75rem)', minHeight: 'clamp(2.8rem, 8%, 3.5rem)' }}
            >
              RSVP Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
