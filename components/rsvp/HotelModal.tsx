'use client'

import { useEffect } from 'react'
import { HOTELS } from '@/lib/constants'

interface HotelModalProps {
  open: boolean
  onClose: () => void
}

export default function HotelModal({ open, onClose }: HotelModalProps) {
  // Trap focus and handle ESC
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Hotel options"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-dark-taupe/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 bg-ivory w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto sm:rounded-none shadow-xl">
        <div className="sticky top-0 bg-ivory border-b border-pale-gold/50 px-6 py-4 flex items-center justify-between">
          <h2 className="font-italiana text-2xl text-dark-taupe tracking-wide">Hotel Options</h2>
          <button
            type="button"
            onClick={onClose}
            className="font-work-sans text-[10px] tracking-[0.2em] uppercase text-dark-taupe hover:text-muted-rose transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close hotel options"
          >
            Close
          </button>
        </div>

        <div className="px-6 py-6 flex flex-col gap-6">
          <p className="font-crimson text-base text-dark-taupe/85 leading-relaxed">
            We&apos;ve highlighted nearby hotels for your convenience. Rates and availability vary —
            book early as September fills quickly in New York.
          </p>

          {HOTELS.map((hotel) => (
            <div key={hotel.name} className="flex flex-col gap-2 pb-6 border-b border-pale-gold/40 last:border-0 last:pb-0">
              <h3 className="font-italiana text-xl text-dark-taupe tracking-wide">{hotel.name}</h3>
              <p className="font-work-sans text-[10px] tracking-[0.18em] uppercase text-gold-line">
                {hotel.neighborhood}
              </p>
              <p className="font-crimson text-sm text-dark-taupe/75">{hotel.address}</p>
              <p className="font-crimson italic text-sm text-muted-rose">{hotel.distanceToCeremony}</p>
              {hotel.note && (
                <p className="font-crimson text-base text-dark-taupe/85">{hotel.note}</p>
              )}
              <p className="font-crimson text-sm text-dark-taupe/70 mt-1 leading-relaxed">
                {hotel.bookingInfo}
              </p>
            </div>
          ))}

          <p className="font-lora italic text-sm text-deep-ivory text-center mt-2">
            Questions about accommodations? Email us at{' '}
            <a
              href="mailto:christineandmichaelzak@gmail.com"
              className="underline hover:text-dusty-lilac transition-colors duration-200"
            >
              christineandmichaelzak@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
