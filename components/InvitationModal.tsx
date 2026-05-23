'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
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
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(58, 50, 42, 0.78)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
      role="dialog"
      aria-modal="true"
      aria-label="Wedding Invitation"
    >
      {/* Wrapper — constrains size and stacks image + button */}
      <div
        className="relative flex flex-col items-center"
        style={{ width: 'min(90vw, 660px)' }}
      >
        {/* Close button — sits above the image, top-right */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close invitation"
          className="absolute top-0 right-0 z-20 w-9 h-9 flex items-center justify-center text-white/70 hover:text-white transition-colors duration-200"
          style={{ transform: 'translate(30%, -30%)' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <line x1="1" y1="1" x2="13" y2="13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="13" y1="1" x2="1" y2="13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        {/* Invitation image with soft vignette edges */}
        <div
          className="w-full"
          style={{
            maskImage: [
              'radial-gradient(ellipse 88% 84% at 50% 46%,',
              '  black 42%,',
              '  rgba(0,0,0,0.88) 57%,',
              '  rgba(0,0,0,0.5) 72%,',
              '  transparent 100%)',
            ].join(''),
            WebkitMaskImage: [
              'radial-gradient(ellipse 88% 84% at 50% 46%,',
              '  black 42%,',
              '  rgba(0,0,0,0.88) 57%,',
              '  rgba(0,0,0,0.5) 72%,',
              '  transparent 100%)',
            ].join(''),
          }}
        >
          <Image
            src="/invite-hero.png"
            alt="Christine & Michael wedding invitation"
            width={1320}
            height={880}
            className="w-full h-auto"
            priority
          />
        </div>

        {/* RSVP button — floats in the faded bottom portion of the image */}
        <div
          className="absolute"
          style={{ bottom: '10%', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}
        >
          <Link
            href="/rsvp"
            onClick={() => setOpen(false)}
            className="font-work-sans tracking-[0.25em] uppercase px-10 py-3.5 min-h-[48px] flex items-center justify-center bg-[#4A5068] text-white hover:bg-[#3a3f55] transition-colors duration-200 shadow-lg"
            style={{ fontSize: 'clamp(0.6rem, 1.8vw, 0.72rem)' }}
          >
            RSVP Now
          </Link>
        </div>
      </div>
    </div>
  )
}
