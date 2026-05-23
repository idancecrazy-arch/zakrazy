'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// Soft vignette applied to the paper card so edges dissolve into the backdrop
const cardMask = [
  'radial-gradient(ellipse 82% 86% at 50% 50%,',
  '  black 42%,',
  '  rgba(0,0,0,0.82) 60%,',
  '  rgba(0,0,0,0.38) 78%,',
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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 px-4"
      style={{ background: 'rgba(56, 48, 40, 0.75)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
      role="dialog"
      aria-modal="true"
      aria-label="Wedding Invitation"
    >
      {/* Card + button stacked vertically */}
      <div className="relative flex flex-col items-center gap-5">

        {/* Close button — top-right of the card area */}
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

        {/* Paper card — calligraphy floats on warm cotton-paper */}
        <div
          style={{
            width: 'min(82vw, 440px)',
            // Warm handmade-paper gradient
            background: [
              'radial-gradient(ellipse at 30% 25%, #F9F4EA 0%, transparent 55%),',
              'radial-gradient(ellipse at 72% 78%, #F3EDD8 0%, transparent 55%),',
              'linear-gradient(160deg, #FAF6ED 0%, #F5EEE0 55%, #FAF6ED 100%)',
            ].join(' '),
            // Dissolve all four edges into the backdrop
            maskImage: cardMask,
            WebkitMaskImage: cardMask,
            // Subtle depth
            boxShadow: '0 8px 48px rgba(40,32,22,0.35), 0 2px 12px rgba(40,32,22,0.2)',
          }}
        >
          {/* Calligraphy image — multiply blend makes white bg vanish */}
          <Image
            src="/invite-font.png"
            alt="Christine & Michael wedding invitation text"
            width={960}
            height={1200}
            className="w-full h-auto"
            style={{
              mixBlendMode: 'multiply',
              padding: '9% 10% 6%',
              display: 'block',
            }}
            priority
          />
        </div>

        {/* RSVP button — sits below the card, never covers it */}
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
