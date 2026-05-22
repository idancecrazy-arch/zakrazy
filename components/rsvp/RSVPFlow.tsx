'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PartyComposition, { type Child } from './PartyComposition'
import HotelModal from './HotelModal'
import CeremonyReceptionDetails from './CeremonyReceptionDetails'

const sectionHeadingClass =
  'font-italiana text-2xl sm:text-3xl text-dark-taupe tracking-wide pb-2 border-b border-pale-gold/50'

const inputClass =
  'w-full bg-ivory border border-gold-line/60 px-4 py-3.5 min-h-[48px] font-crimson text-base sm:text-lg text-dark-taupe placeholder:text-soft-gray focus:border-gold-line focus:ring-0 transition-colors duration-200'

const checkboxLabel = 'flex items-center gap-3 cursor-pointer min-h-[44px]'
const checkboxClass = 'w-5 h-5 border border-gold-line/60 accent-gold-line cursor-pointer flex-shrink-0'

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

  const [guestName, setGuestName] = useState('')
  const [updateContact, setUpdateContact] = useState<boolean | null>(null)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')

  const [attending, setAttending] = useState<boolean | null>(null)
  const [plusOne, setPlusOne] = useState(false)
  const [plusOneName, setPlusOneName] = useState('')
  const [hasChildren, setHasChildren] = useState(false)
  const [children, setChildren] = useState<Child[]>([])
  const [dietary, setDietary] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')
  const [hotelInterest, setHotelInterest] = useState(false)
  const [hotelModalOpen, setHotelModalOpen] = useState(false)

  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [childErrors, setChildErrors] = useState<string[]>([])

  const nameEntered = guestName.trim().length >= 2

  const validate = () => {
    const e: Record<string, string> = {}
    const ce: string[] = []

    if (!guestName.trim()) e.guestName = 'Please enter your name.'
    if (updateContact === null && nameEntered) e.updateContact = 'Please answer this question.'
    if (attending === null && nameEntered) e.attending = 'Please let us know if you\'ll be attending.'

    if (attending) {
      if (plusOne && !plusOneName.trim()) e.plusOneName = 'Please enter your plus one\'s name.'
      if (hasChildren) {
        children.forEach((c, i) => {
          if (!c.name.trim() || !c.age.trim()) ce[i] = 'Please complete name and age.'
        })
      }
    }

    setErrors(e)
    setChildErrors(ce)
    return Object.keys(e).length === 0 && ce.filter(Boolean).length === 0
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
          guestName: guestName.trim(),
          attending,
          updateContact: updateContact ?? false,
          email: updateContact ? email : undefined,
          phone: updateContact ? phone : undefined,
          address1: updateContact ? address1 : undefined,
          address2: updateContact ? address2 : undefined,
          city: updateContact ? city : undefined,
          state: updateContact ? state : undefined,
          zip: updateContact ? zip : undefined,
          plusOneName: plusOne ? plusOneName.trim() : undefined,
          children: hasChildren && children.length > 0 ? children : undefined,
          dietaryRestrictions: dietary.trim() || undefined,
          specialRequests: specialRequests.trim() || undefined,
          hotelInterest,
        }),
      })

      if (!res.ok) throw new Error('Submit failed')

      const params = new URLSearchParams({
        name: guestName.trim().split(' ')[0],
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
        <h2 className="font-italiana text-3xl text-dark-taupe tracking-wide">RSVP Period Has Closed</h2>
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
        {/* ── Name ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-5">
          <h2 className={sectionHeadingClass}>Your Name</h2>
          <Field label="Full Name" error={errors.guestName}>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Your full name"
              autoComplete="name"
              className={inputClass}
            />
          </Field>
        </div>

        {/* ── Contact Info ─────────────────────────────────── */}
        {nameEntered && (
          <div className="flex flex-col gap-5">
            <h2 className={sectionHeadingClass}>Contact Information</h2>
            <p className="font-crimson text-base text-dark-taupe/85 leading-relaxed">
              Do you need to update your email, phone, or mailing address?
            </p>
            <div className="flex flex-col gap-3" role="group" aria-label="Contact update">
              {[
                { value: false, label: 'No, my info is up to date' },
                { value: true, label: 'Yes, I\'d like to update my details' },
              ].map(({ value, label }) => (
                <label key={label} className={checkboxLabel}>
                  <input
                    type="radio"
                    name="updateContact"
                    checked={updateContact === value}
                    onChange={() => setUpdateContact(value)}
                    className="w-5 h-5 accent-gold-line cursor-pointer flex-shrink-0"
                  />
                  <span className="font-crimson text-base sm:text-lg text-dark-taupe">{label}</span>
                </label>
              ))}
            </div>
            {errors.updateContact && (
              <p className="font-crimson italic text-sm text-muted-rose">{errors.updateContact}</p>
            )}

            {updateContact === true && (
              <div className="flex flex-col gap-5 pt-2">
                <Field label="Email Address" optional>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    autoComplete="email"
                    className={inputClass}
                  />
                </Field>
                <Field label="Phone Number" optional>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (212) 555-0100"
                    autoComplete="tel"
                    className={inputClass}
                  />
                </Field>
                <Field label="Street Address" optional>
                  <input
                    type="text"
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    placeholder="123 Main Street"
                    autoComplete="address-line1"
                    className={inputClass}
                  />
                </Field>
                <Field label="Apt / Suite" optional>
                  <input
                    type="text"
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                    placeholder="Apt 4B"
                    autoComplete="address-line2"
                    className={inputClass}
                  />
                </Field>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <Field label="City" optional>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="New York"
                      autoComplete="address-level2"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="State" optional>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="NY"
                      autoComplete="address-level1"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="ZIP" optional>
                    <input
                      type="text"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      placeholder="10001"
                      autoComplete="postal-code"
                      className={`${inputClass} col-span-2 sm:col-span-1`}
                    />
                  </Field>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Attending ────────────────────────────────────── */}
        {nameEntered && updateContact !== null && (
          <div className="flex flex-col gap-5">
            <h2 className={sectionHeadingClass}>Will You Be Attending?</h2>
            <div className="flex flex-col gap-3" role="group" aria-label="Attendance">
              {[
                { value: true, label: 'Joyfully accepts' },
                { value: false, label: 'Regretfully declines' },
              ].map(({ value, label }) => (
                <label key={label} className={checkboxLabel}>
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

        {/* ── Party (attending only) ────────────────────────── */}
        {attending === true && (
          <div className="flex flex-col gap-5">
            <h2 className={sectionHeadingClass}>Your Party</h2>
            <PartyComposition
              plusOneAllowed={true}
              plusOne={plusOne}
              plusOneName={plusOneName}
              hasChildren={hasChildren}
              children={children}
              onPlusOneToggle={setPlusOne}
              onPlusOneNameChange={setPlusOneName}
              onChildrenToggle={setHasChildren}
              onChildrenChange={setChildren}
              errors={{ plusOneName: errors.plusOneName, children: childErrors }}
            />
          </div>
        )}

        {/* ── Dietary (attending only) ─────────────────────── */}
        {attending === true && (
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
        {attending === true && (
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

        {/* ── Hotel (attending only) ───────────────────────── */}
        {attending === true && (
          <div className="flex flex-col gap-5">
            <h2 className={sectionHeadingClass}>Accommodations</h2>
            <p className="font-crimson text-base text-dark-taupe/85 leading-relaxed">
              We&apos;ve highlighted nearby hotels for out-of-town guests.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => { setHotelModalOpen(true); setHotelInterest(true) }}
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

        {/* ── Event Details ─────────────────────────────────── */}
        {nameEntered && updateContact !== null && attending !== null && (
          <div className="flex flex-col gap-5">
            <h2 className={sectionHeadingClass}>Event Details</h2>
            <CeremonyReceptionDetails />
          </div>
        )}

        {/* ── Dress Code (attending only) ───────────────────── */}
        {attending === true && (
          <div className="flex flex-col gap-3 bg-warm-cream/40 border border-pale-gold/30 p-5">
            <p className="font-work-sans text-[10px] tracking-[0.2em] uppercase text-gold-line">Dress Code</p>
            <p className="font-italiana text-xl text-dark-taupe tracking-wide">Formal Attire</p>
            <p className="font-crimson text-base text-dark-taupe/80 leading-relaxed">
              Tuxedos or dark suits for gentlemen; evening gowns or formal dresses for ladies.
              Everything is indoors — no need to worry about outdoor footwear.
            </p>
          </div>
        )}

        {/* ── Error ────────────────────────────────────────── */}
        {status === 'error' && (
          <p className="font-crimson italic text-muted-rose text-sm text-center">
            Something went wrong. Please try again or email us at{' '}
            <a href="mailto:christineandmichaelzak@gmail.com" className="underline">
              christineandmichaelzak@gmail.com
            </a>.
          </p>
        )}

        {/* ── Submit ───────────────────────────────────────── */}
        {nameEntered && updateContact !== null && attending !== null && (
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

      <HotelModal open={hotelModalOpen} onClose={() => setHotelModalOpen(false)} />
    </>
  )
}
