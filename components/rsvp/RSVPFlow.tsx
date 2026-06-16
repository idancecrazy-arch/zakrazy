'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import GuestSelector, { type GuestRecord } from './GuestSelector'
import PartyComposition, { type Child } from './PartyComposition'
import CeremonyReceptionDetails from './CeremonyReceptionDetails'
import { parseGuestNames, isPlaceholderName } from '@/lib/guestNames'

const sectionHeadingClass =
  'font-cormorant text-2xl sm:text-3xl text-dark-taupe tracking-wide pb-2 border-b border-pale-gold/50'

const inputClass =
  'w-full bg-ivory border border-gold-line/60 px-4 py-3.5 min-h-[48px] font-crimson text-base sm:text-lg text-dark-taupe placeholder:text-soft-gray focus:border-gold-line focus:ring-0 transition-colors duration-200'

const checkboxLabel = 'flex items-center gap-3 cursor-pointer min-h-[44px]'

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

interface PartyMember {
  name: string
  attending: boolean | null
  /** True when the name was parsed from the guest record (read-only). */
  known: boolean
}

function AttendanceRadios({
  index,
  value,
  onChange,
  label,
}: {
  index: number
  value: boolean | null
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <div className="flex flex-col gap-3" role="group" aria-label={label}>
      {[
        { value: true, label: 'Joyfully accepts' },
        { value: false, label: 'Regretfully declines' },
      ].map((opt) => (
        <label key={opt.label} className={checkboxLabel}>
          <input
            type="radio"
            name={`attending-${index}`}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="w-5 h-5 accent-gold-line cursor-pointer flex-shrink-0"
          />
          <span className="font-crimson text-base sm:text-lg text-dark-taupe">{opt.label}</span>
        </label>
      ))}
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

  const [guest, setGuest] = useState<GuestRecord | null>(null)
  const [updateContact, setUpdateContact] = useState<boolean | null>(null)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')

  const [welcomeReception, setWelcomeReception] = useState<boolean | null>(null)
  const [hasChildren, setHasChildren] = useState(false)
  const [children, setChildren] = useState<Child[]>([])
  const [dietary, setDietary] = useState('')

  const [partyMembers, setPartyMembers] = useState<PartyMember[]>([])

  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [childErrors, setChildErrors] = useState<string[]>([])
  const [memberErrors, setMemberErrors] = useState<string[]>([])

  const guestSelected = guest !== null
  const isMultiParty = partyMembers.length > 1
  const anyAttending = partyMembers.some((m) => m.attending === true)
  const allAnswered = partyMembers.length > 0 && partyMembers.every((m) => m.attending !== null)

  const handleGuestSelect = (g: GuestRecord) => {
    const names = parseGuestNames(g.name, g.partySize)
    setPartyMembers(
      names.map((n) => {
        const placeholder = isPlaceholderName(n)
        return { name: placeholder ? '' : n.trim(), attending: null, known: !placeholder }
      }),
    )
    setGuest(g)
    setWelcomeReception(null)
    setHasChildren(false)
    setChildren([])
    setDietary('')
    setErrors({})
    setChildErrors([])
    setMemberErrors([])
  }

  const handleGuestClear = () => {
    setGuest(null)
    setUpdateContact(null)
    setWelcomeReception(null)
    setHasChildren(false)
    setChildren([])
    setDietary('')
    setPartyMembers([])
    setErrors({})
    setChildErrors([])
    setMemberErrors([])
  }

  const updateMember = (i: number, patch: Partial<PartyMember>) => {
    setPartyMembers((prev) => prev.map((m, idx) => (idx === i ? { ...m, ...patch } : m)))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    const ce: string[] = []
    const me: string[] = []

    if (!guest) e.guest = 'Please find your name to continue.'

    partyMembers.forEach((m, i) => {
      if (m.attending === null) {
        me[i] = isMultiParty
          ? 'Please indicate if this guest will attend.'
          : 'Please let us know if you\'ll be attending.'
      } else if (!m.known && m.attending === true && !m.name.trim()) {
        me[i] = 'Please enter this guest\'s name.'
      }
    })

    if (anyAttending && hasChildren) {
      children.forEach((c, i) => {
        if (!c.name.trim() || !c.age.trim()) ce[i] = 'Please complete name and age.'
      })
    }

    setErrors(e)
    setChildErrors(ce)
    setMemberErrors(me)
    return Object.keys(e).length === 0 && ce.filter(Boolean).length === 0 && me.filter(Boolean).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('loading')

    const members = partyMembers.map((m) => ({
      name: m.name.trim() || 'Guest',
      attending: m.attending ?? false,
    }))
    const primary = members[0]
    const additional = members.slice(1)

    try {
      const res = await fetch('/api/rsvp/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: primary.name,
          attending: primary.attending,
          updateContact: updateContact ?? false,
          email: updateContact ? email : undefined,
          phone: updateContact ? phone : undefined,
          address1: updateContact ? address1 : undefined,
          address2: updateContact ? address2 : undefined,
          city: updateContact ? city : undefined,
          state: updateContact ? state : undefined,
          zip: updateContact ? zip : undefined,
          children: anyAttending && hasChildren && children.length > 0 ? children : undefined,
          partyMembers: additional.length > 0 ? additional : undefined,
          dietaryRestrictions: anyAttending ? dietary.trim() || undefined : undefined,
          welcomeReception: anyAttending ? welcomeReception ?? undefined : undefined,
        }),
      })

      if (!res.ok) throw new Error('Submit failed')

      const params = new URLSearchParams({
        name: primary.name.split(' ')[0],
        attending: anyAttending ? '1' : '0',
      })
      const extraGuest = additional.find((m) => m.attending && m.name && m.name !== 'Guest')
      if (anyAttending && extraGuest) params.set('plusOne', extraGuest.name)

      router.push(`/rsvp/thank-you?${params.toString()}`)
    } catch {
      setStatus('error')
    }
  }

  if (isPastDeadline()) {
    return (
      <div className="flex flex-col items-center gap-6 text-center py-16 px-6">
        <h2 className="font-cormorant text-3xl text-dark-taupe tracking-wide">RSVP Period Has Closed</h2>
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

  const childrenSection = (
    <PartyComposition
      plusOneAllowed={false}
      plusOneName=""
      hasChildren={hasChildren}
      children={children}
      onPlusOneNameChange={() => {}}
      onChildrenToggle={setHasChildren}
      onChildrenChange={setChildren}
      errors={{ children: childErrors }}
    />
  )

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-10 max-w-xl mx-auto w-full"
      noValidate
      aria-label="RSVP form"
    >
      {/* ── Name Lookup ──────────────────────────────────── */}
      <div className="flex flex-col gap-5">
        <h2 className={sectionHeadingClass}>Your Name</h2>
        <p className="font-crimson text-base text-dark-taupe/85 leading-relaxed">
          Type your name to find yourself on the guest list.
        </p>
        <GuestSelector
          selected={guest}
          onSelect={handleGuestSelect}
          onClear={handleGuestClear}
          error={errors.guest}
        />
      </div>

      {/* ── Attendance: single guest ─────────────────────── */}
      {guestSelected && !isMultiParty && (
        <div className="flex flex-col gap-5">
          <h2 className={sectionHeadingClass}>Will You Be Attending?</h2>
          {!partyMembers[0].known && (
            <Field label="Full Name" error={memberErrors[0]}>
              <input
                type="text"
                value={partyMembers[0].name}
                onChange={(ev) => updateMember(0, { name: ev.target.value })}
                placeholder="First and last name"
                className={inputClass}
              />
            </Field>
          )}
          <AttendanceRadios
            index={0}
            value={partyMembers[0].attending}
            onChange={(v) => updateMember(0, { attending: v })}
            label="Attendance"
          />
          {memberErrors[0] && partyMembers[0].known && (
            <p className="font-crimson italic text-sm text-muted-rose">{memberErrors[0]}</p>
          )}
          {anyAttending && childrenSection}
        </div>
      )}

      {/* ── Attendance: full party ───────────────────────── */}
      {guestSelected && isMultiParty && (
        <div className="flex flex-col gap-6">
          <h2 className={sectionHeadingClass}>Your Party</h2>
          <p className="font-crimson text-base text-dark-taupe/85">
            Your reservation is for {guest?.partySize ?? partyMembers.length} guests. Please RSVP for each person below.
          </p>
          {partyMembers.map((member, i) => (
            <div key={i} className="flex flex-col gap-4 border border-pale-gold/40 p-5 bg-warm-cream/30">
              {member.known ? (
                <p className="font-cormorant text-xl sm:text-2xl text-dark-taupe">{member.name}</p>
              ) : (
                <Field label="Full Name" error={memberErrors[i]}>
                  <input
                    type="text"
                    value={member.name}
                    onChange={(ev) => updateMember(i, { name: ev.target.value })}
                    placeholder="First and last name"
                    className={inputClass}
                  />
                </Field>
              )}
              <AttendanceRadios
                index={i}
                value={member.attending}
                onChange={(v) => updateMember(i, { attending: v })}
                label={`Attendance for ${member.known ? member.name : `guest ${i + 1}`}`}
              />
              {memberErrors[i] && member.known && (
                <p className="font-crimson italic text-sm text-muted-rose">{memberErrors[i]}</p>
              )}
            </div>
          ))}
          {anyAttending && childrenSection}
        </div>
      )}

      {/* ── Welcome Reception (party-level) ──────────────── */}
      {anyAttending && (
        <div className="flex flex-col gap-5">
          <h2 className={sectionHeadingClass}>Welcome Reception</h2>
          <p className="font-crimson text-base text-dark-taupe/85 leading-relaxed">
            We are hosting a casual welcome reception on <strong>Friday, September 11th evening</strong>.
            Will you be joining us?
          </p>
          <p className="font-crimson italic text-sm text-dark-taupe/70">
            More details to follow.
          </p>
          <div className="flex flex-col gap-3" role="group" aria-label="Welcome reception">
            {[
              { value: true, label: 'Yes, I\'ll be there' },
              { value: false, label: 'No, I cannot make it' },
            ].map(({ value, label }) => (
              <label key={label} className={checkboxLabel}>
                <input
                  type="radio"
                  name="welcomeReception"
                  checked={welcomeReception === value}
                  onChange={() => setWelcomeReception(value)}
                  className="w-5 h-5 accent-gold-line cursor-pointer flex-shrink-0"
                />
                <span className="font-crimson text-base sm:text-lg text-dark-taupe">{label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ── Dietary (attending only) ─────────────────────── */}
      {anyAttending && (
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
              placeholder="List any allergies or dietary restrictions…"
              className={`${inputClass} resize-none`}
            />
          </Field>
        </div>
      )}

      {/* ── Travel & Accommodations (attending only) ─────── */}
      {anyAttending && (
        <div className="flex flex-col gap-4 bg-warm-cream/40 border border-pale-gold/30 p-5">
          <h2 className={sectionHeadingClass}>Travel &amp; Accommodations</h2>
          <p className="font-crimson text-base text-dark-taupe/85 leading-relaxed">
            September 12th is a busy weekend in NYC. Book flights and hotels early.
          </p>
          <Link
            href="/travel"
            target="_blank"
            rel="noopener noreferrer"
            className="self-start font-work-sans text-[10px] tracking-[0.18em] uppercase text-muted-rose hover:text-dusty-lilac transition-colors duration-200 underline underline-offset-4"
          >
            View hotel block &amp; travel info
          </Link>
        </div>
      )}

      {/* ── Event Details ─────────────────────────────────── */}
      {guestSelected && allAnswered && (
        <div className="flex flex-col gap-5">
          <h2 className={sectionHeadingClass}>Event Details</h2>
          <CeremonyReceptionDetails />
        </div>
      )}

      {/* ── Dress Code (attending only) ───────────────────── */}
      {anyAttending && (
        <div className="flex flex-col gap-3 bg-warm-cream/40 border border-pale-gold/30 p-5">
          <h2 className={sectionHeadingClass}>Dress Code</h2>
          <p className="font-crimson text-base text-dark-taupe/80 leading-relaxed">
            Semi-formal Attire: Suits and cocktail dresses.
          </p>
        </div>
      )}

      {/* ── Contact Info ─────────────────────────────────── */}
      {guestSelected && allAnswered && (
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
      {guestSelected && allAnswered && (
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
  )
}
