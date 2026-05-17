'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import GuestSelector, { type SelectedGuest } from './GuestSelector'
import PartyComposition, { type Child } from './PartyComposition'
import HotelModal from './HotelModal'
import CeremonyReceptionDetails from './CeremonyReceptionDetails'

const sectionHeadingClass =
  'font-italiana text-2xl sm:text-3xl text-dark-taupe tracking-wide pb-2 border-b border-pale-gold/50'

const inputClass =
  'w-full bg-ivory border border-gold-line/60 px-4 py-3.5 min-h-[48px] font-crimson text-base sm:text-lg text-dark-taupe placeholder:text-soft-gray focus:border-gold-line focus:ring-0 transition-colors duration-200'

const readOnlyClass =
  'w-full bg-warm-cream/60 border border-pale-gold/40 px-4 py-3.5 min-h-[48px] font-crimson text-base text-dark-taupe/70'

function Field({
  label,
  error,
  optional,
  children,
}: {
  label: string
  error?: string
  optional?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-work-sans text-xs sm:text-[13px] tracking-[0.12em] uppercase text-dark-taupe/85 font-medium flex flex-col gap-2">
        <span>
          {label}
          {optional && (
            <span className="ml-2 normal-case tracking-normal font-crimson italic text-sm text-muted-rose">
              optional
            </span>
          )}
        </span>
        {children}
      </label>
      {error && <p className="font-crimson italic text-sm text-muted-rose">{error}</p>}
    </div>
  )
}

function isPastDeadline() {
  const deadline = process.env.NEXT_PUBLIC_RSVP_DEADLINE
  if (!deadline) return false
  const d = new Date(deadline)
  return !isNaN(d.getTime()) && new Date() > d
}

export default function RSVPFlow() {
  const router = useRouter()

  // Guest
  const [guest, setGuest] = useState<SelectedGuest | null>(null)

  // Attending
  const [attending, setAttending] = useState<boolean | null>(null)

  // Party
  const [plusOne, setPlusOne] = useState(false)
  const [plusOneName, setPlusOneName] = useState('')
  const [hasChildren, setHasChildren] = useState(false)
  const [children, setChildren] = useState<Child[]>([])

  // Other
  const [dietary, setDietary] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')
  const [hotelInterest, setHotelInterest] = useState(false)
  const [hotelModalOpen, setHotelModalOpen] = useState(false)

  // UI state
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [childErrors, setChildErrors] = useState<string[]>([])

  const handleGuestSelect = useCallback((g: SelectedGuest) => {
    setGuest(g.id ? g : null)
    // Reset form on guest change
    setAttending(null)
    setPlusOne(false)
    setPlusOneName('')
    setHasChildren(false)
    setChildren([])
    setDietary('')
    setSpecialRequests('')
    setHotelInterest(false)
    setErrors({})
    setChildErrors([])
  }, [])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    const newChildErrors: string[] = []

    if (!guest?.id) newErrors.guest = 'Please select your name from the list.'
    if (attending === null) newErrors.attending = 'Please let us know if you\'ll be attending.'

    if (attending) {
      if (plusOne && !plusOneName.trim()) {
        newErrors.plusOneName = 'Please provide your plus one\'s name.'
      }
      if (hasChildren) {
        children.forEach((c, i) => {
          if (!c.name.trim() || !c.age.trim()) {
            newChildErrors[i] = 'Please complete child name and age.'
          }
        })
      }
    }

    setErrors(newErrors)
    setChildErrors(newChildErrors)
    return Object.keys(newErrors).length === 0 && newChildErrors.filter(Boolean).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setStatus('loading')

    try {
      const res = await fetch('/api/rsvp/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recordId: guest!.id,
          guestName: guest!.name,
          attending,
          plusOneName: plusOne ? plusOneName.trim() : undefined,
          children: hasChildren && children.length > 0 ? children : undefined,
          dietaryRestrictions: dietary.trim() || undefined,
          specialRequests: specialRequests.trim() || undefined,
          hotelInterest,
        }),
      })

      if (!res.ok) throw new Error('Submit failed')

      const params = new URLSearchParams({
        name: guest!.name.split(' ')[0],
        attending: attending ? '1' : '0',
      })
      if (attending && plusOne && plusOneName.trim()) params.set('plusOne', plusOneName.trim())
      if (attending && hotelInterest) params.set('hotel', '1')

      router.push(`/rsvp/thank-you?${params.toString()}`)
    } catch {
      setStatus('error')
    }
  }

  if (isPastDeadline()) {
    return (
      <div className="flex flex-col items-center gap-6 text-center py-16 px-6">
        <h2 className="font-italiana text-3xl text-dark-taupe tracking-wide">
          RSVP Period Has Closed
        </h2>
        <p className="font-crimson text-lg text-dark-taupe/80 max-w-sm leading-relaxed">
          Thank you for your interest. If you believe this is an error, please reach out directly.
        </p>
        <a
          href="mailto:christineandmichaelzak@gmail.com"
          className="font-work-sans text-[11px] tracking-[0.18em] uppercase px-8 py-4 border border-gold-line text-dark-taupe hover:bg-blush transition-colors duration-200"
        >
          Contact Us
        </a>
      </div>
    )
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-10 max-w-xl mx-auto w-full"
        noValidate
        aria-label="RSVP form"
      >
        {/* ── Guest Search ──────────────────────────────────── */}
        <div className="flex flex-col gap-5">
          <h2 className={sectionHeadingClass}>Find Your Name</h2>
          <p className="font-crimson text-base text-dark-taupe/80 leading-relaxed">
            Search for your name on our guest list to begin your RSVP.
          </p>
          <GuestSelector onSelect={handleGuestSelect} selectedGuest={guest} />
          {errors.guest && (
            <p className="font-crimson italic text-sm text-muted-rose">{errors.guest}</p>
          )}
        </div>

        {/* ── Contact Confirmation ─────────────────────────── */}
        {guest?.id && (
          <div className="flex flex-col gap-5">
            <h2 className={sectionHeadingClass}>Your Contact Information</h2>
            <p className="font-crimson italic text-sm text-deep-ivory">
              Your details on file — please contact us if anything needs updating.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="font-work-sans text-[11px] tracking-[0.12em] uppercase text-dark-taupe/70">
                  Email
                </span>
                <div className={readOnlyClass}>{guest.email || '—'}</div>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="font-work-sans text-[11px] tracking-[0.12em] uppercase text-dark-taupe/70">
                  Phone
                </span>
                <div className={readOnlyClass}>{guest.phone || '—'}</div>
              </div>
            </div>
          </div>
        )}

        {/* ── Attending ────────────────────────────────────── */}
        {guest?.id && (
          <div className="flex flex-col gap-5">
            <h2 className={sectionHeadingClass}>Will You Be Attending?</h2>
            <div className="flex flex-col gap-3" role="group" aria-label="Attendance">
              {[
                { value: true, label: 'Joyfully accepts' },
                { value: false, label: 'Regretfully declines' },
              ].map(({ value, label }) => (
                <label key={label} className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                  <input
                    type="radio"
                    name="attending"
                    checked={attending === value}
                    onChange={() => setAttending(value)}
                    className="w-5 h-5 accent-gold-line cursor-pointer flex-shrink-0"
                  />
                  <span className="font-crimson text-base sm:text-lg text-dark-taupe">{label}</span>
                </label>
              ))}
            </div>
            {errors.attending && (
              <p className="font-crimson italic text-sm text-muted-rose">{errors.attending}</p>
            )}
          </div>
        )}

        {/* ── Party Composition (attending only) ───────────── */}
        {guest?.id && attending === true && (
          <div className="flex flex-col gap-5">
            <h2 className={sectionHeadingClass}>Your Party</h2>
            <PartyComposition
              plusOneAllowed={guest.plusOneAllowed}
              plusOne={plusOne}
              plusOneName={plusOneName}
              hasChildren={hasChildren}
              children={children}
              onPlusOneToggle={setPlusOne}
              onPlusOneNameChange={setPlusOneName}
              onChildrenToggle={setHasChildren}
              onChildrenChange={setChildren}
              errors={{
                plusOneName: errors.plusOneName,
                children: childErrors,
              }}
            />
          </div>
        )}

        {/* ── Dietary (attending only) ─────────────────────── */}
        {guest?.id && attending === true && (
          <div className="flex flex-col gap-5">
            <h2 className={sectionHeadingClass}>Dietary Information</h2>
            <p className="font-crimson italic text-sm text-deep-ivory">
              Our reception features family-style dining.
            </p>
            <Field label="Food Allergies & Restrictions" optional>
              <textarea
                value={dietary}
                onChange={(e) => setDietary(e.target.value)}
                rows={3}
                placeholder="Please list any allergies, vegetarian/vegan preferences, or other dietary restrictions…"
                className={`${inputClass} resize-none`}
              />
            </Field>
          </div>
        )}

        {/* ── Special Requests (attending only) ────────────── */}
        {guest?.id && attending === true && (
          <div className="flex flex-col gap-5">
            <h2 className={sectionHeadingClass}>Anything Else?</h2>
            <Field label="Special Requests or Questions" optional>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                rows={3}
                placeholder="Is there anything else we should know? (transportation, seating preferences, accessibility needs, etc.)"
                className={`${inputClass} resize-none`}
              />
            </Field>
          </div>
        )}

        {/* ── Hotel Interest (attending only) ──────────────── */}
        {guest?.id && attending === true && (
          <div className="flex flex-col gap-5">
            <h2 className={sectionHeadingClass}>Accommodations</h2>
            <p className="font-crimson text-base text-dark-taupe/85 leading-relaxed">
              We&apos;ve highlighted nearby hotels for out-of-town guests.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => {
                  setHotelModalOpen(true)
                  setHotelInterest(true)
                }}
                className="font-work-sans text-[11px] tracking-[0.18em] uppercase px-8 py-4 min-h-[52px] border border-gold-line text-dark-taupe hover:bg-blush transition-colors duration-200"
              >
                View Hotel Options
              </button>
              {hotelInterest && (
                <p className="self-center font-crimson italic text-sm text-muted-rose">
                  ✓ Hotel options noted — we&apos;ll share details soon.
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── Ceremony & Reception Details ─────────────────── */}
        {guest?.id && (
          <div className="flex flex-col gap-5">
            <h2 className={sectionHeadingClass}>Event Details</h2>
            <CeremonyReceptionDetails />
          </div>
        )}

        {/* ── Dress Code ───────────────────────────────────── */}
        {guest?.id && attending === true && (
          <div className="flex flex-col gap-3 bg-warm-cream/40 border border-pale-gold/30 p-5">
            <p className="font-work-sans text-[10px] tracking-[0.2em] uppercase text-gold-line">
              Dress Code
            </p>
            <p className="font-italiana text-xl text-dark-taupe tracking-wide">Formal Attire</p>
            <p className="font-crimson text-base text-dark-taupe/80 leading-relaxed">
              Tuxedos or dark suits for gentlemen; evening gowns or formal dresses for ladies.
              Everything is indoors — no need to worry about outdoor footwear.
            </p>
          </div>
        )}

        {/* ── Error State ───────────────────────────────────── */}
        {status === 'error' && (
          <p className="font-crimson italic text-muted-rose text-sm text-center">
            Something went wrong. Please try again or email us at{' '}
            <a href="mailto:christineandmichaelzak@gmail.com" className="underline">
              christineandmichaelzak@gmail.com
            </a>
            .
          </p>
        )}

        {/* ── Submit ───────────────────────────────────────── */}
        {guest?.id && attending !== null && (
          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="
                w-full sm:w-auto
                font-work-sans text-sm tracking-[0.18em] uppercase font-medium
                px-12 py-4 min-h-[52px] bg-gold-line text-ivory
                hover:bg-dark-taupe hover:-translate-y-0.5 hover:shadow-md
                disabled:opacity-50 disabled:cursor-not-allowed
                disabled:hover:translate-y-0 disabled:hover:shadow-none
                transition-all duration-300
              "
            >
              {status === 'loading' ? 'Submitting…' : 'Submit RSVP'}
            </button>
          </div>
        )}
      </form>

      <HotelModal
        open={hotelModalOpen}
        onClose={() => setHotelModalOpen(false)}
      />
    </>
  )
}
