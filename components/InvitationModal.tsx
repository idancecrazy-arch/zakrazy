'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function InvitationModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Only auto-open once per session
    if (!sessionStorage.getItem('invitation-seen')) {
      setOpen(true)
      sessionStorage.setItem('invitation-seen', '1')
    }
  }, [])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
      style={{ background: 'rgba(90, 80, 68, 0.55)', backdropFilter: 'blur(3px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
      role="dialog"
      aria-modal="true"
      aria-label="Wedding Invitation"
    >
      {/* Envelope backing (slightly larger, off-white) */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="w-[340px] sm:w-[400px] h-[530px] sm:h-[580px]"
          style={{
            background: '#E8E4DD',
            boxShadow: '0 20px 60px rgba(90,80,68,0.35), 0 6px 20px rgba(90,80,68,0.2)',
            transform: 'rotate(-1deg)',
          }}
        />
      </div>

      {/* Card */}
      <div
        className="relative w-[320px] sm:w-[380px] flex flex-col"
        style={{
          background: '#FAFAF8',
          boxShadow: '0 12px 40px rgba(90,80,68,0.28), 0 2px 8px rgba(90,80,68,0.15)',
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close invitation"
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center text-dark-taupe/40 hover:text-dark-taupe transition-colors duration-200 z-10"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <line x1="1" y1="1" x2="13" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="13" y1="1" x2="1" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Card content */}
        <div className="px-10 pt-12 pb-10 flex flex-col items-center text-center gap-0">
          {/* Main script invitation text */}
          <p
            className="font-script leading-relaxed text-[#4A5068]"
            style={{ fontSize: 'clamp(1.45rem, 5vw, 1.7rem)' }}
          >
            Christine &amp; Michael
            <br />
            would love your company
            <br />
            at their wedding
            <br />
            celebration on
          </p>

          <p
            className="font-script text-[#4A5068] mt-1"
            style={{ fontSize: 'clamp(1.65rem, 5.5vw, 1.95rem)' }}
          >
            September 12, 2026
          </p>

          {/* Divider */}
          <div className="w-12 h-px bg-[#C3AF82]/60 my-5" />

          {/* Venue details */}
          <div className="flex flex-col gap-2.5 w-full">
            <div>
              <p className="font-work-sans text-[9px] tracking-[0.22em] uppercase text-[#C3AF82]">Ceremony · 1:30pm</p>
              <p
                className="font-script text-[#4A5068] leading-tight mt-0.5"
                style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.25rem)' }}
              >
                St. Joseph&apos;s Church
              </p>
              <p className="font-crimson text-xs text-dark-taupe/60 tracking-wide">Greenwich Village</p>
            </div>

            <div>
              <p className="font-work-sans text-[9px] tracking-[0.22em] uppercase text-[#C3AF82]">Cocktail Hour · 5pm</p>
              <p
                className="font-script text-[#4A5068] leading-tight mt-0.5"
                style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.25rem)' }}
              >
                Golden Unicorn
              </p>
              <p className="font-crimson text-xs text-dark-taupe/60 tracking-wide">Chinatown</p>
            </div>

            <p
              className="font-script text-[#4A5068] mt-1"
              style={{ fontSize: 'clamp(1.2rem, 4vw, 1.4rem)' }}
            >
              New York City.
            </p>
          </div>

          {/* Flourish */}
          <svg
            className="my-4 text-[#C3AF82]/70"
            width="60"
            height="24"
            viewBox="0 0 60 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5 12 C10 6, 20 3, 30 12 C40 21, 50 18, 55 12"
              stroke="currentColor"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="30" cy="12" r="1.5" fill="currentColor" />
          </svg>

          {/* RSVP deadline */}
          <p className="font-work-sans text-[9px] tracking-[0.22em] uppercase text-dark-taupe/50 mb-4">
            Kindly reply by July 15, 2026
          </p>

          {/* RSVP button */}
          <Link
            href="/rsvp"
            onClick={() => setOpen(false)}
            className="w-full font-work-sans text-[11px] tracking-[0.2em] uppercase px-8 py-3.5 min-h-[48px] flex items-center justify-center bg-[#4A5068] text-white hover:bg-dark-taupe transition-colors duration-200"
          >
            RSVP Now
          </Link>
        </div>
      </div>
    </div>
  )
}
