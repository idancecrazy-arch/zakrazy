'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import GuestSelector, { type GuestRecord } from './GuestSelector'
import PartyComposition, { type Child } from './PartyComposition'
import CeremonyReceptionDetails from './CeremonyReceptionDetails'

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

  const [attending, setAttending] = useState<boolean | null>(null)
  const [welcomeReception, setWelcomeReception] = useState<boolean | null>(null)
  const [plusOneName, setPlusOneName] = useState('')
  const [hasChildren, setHasChildren] = useState(false)
  const [children, setChildren] = useState<Child[]>([])
  const [dietary, setDietary] = useState('')

  interface PartyMember { name: string; attending: boolean | null; dietary: string; welcomeReception: boolean | null }
  const [partyMembers, setPartyMembers] = useState<PartyMember[]>([])

  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [childErrors, setChildErrors] = useState<string[]>([])
  const [memberErrors, setMemberErrors] = useState<string[]>([])

  const guestSelected = guest !== null

  const handleGuestSelect = (g: GuestRecord) => {
    setGuest(g)
    setPlusOneName('')
    setPartyMembers(
      g.partySize > 1
        ? Array.from({ length: g.partySize - 1 }, () => ({ name: '', attending: null, dietary: '', welcomeReception: null }))
        : []
    )
    setErrors({})
    setMemberErrors([])
  }

  const handleGuestClear = () => {
    setGuest(null)
    setUpdateContact(null)
    setAttending(null)
    setWelcomeReception(null)
    setPlusOneName('')
    setHasChildren(false)
    setChildren([])
    setDietary('')
    setPartyMembers([])
    setErrors({})
    setMemberErrors([])
  }

  const updateMember = (i: number, patch: Partial<{ name: string; attending: boolean | null; dietary: string; welcomeReception: boolean | null }>) => {
    setPartyMembers(prev => prev.map((m, idx) => idx === i ? { ...m, ...patch } : m))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    const ce: string[] = []
    const me: string[] = []

    if (!guest) e.guest = 'Please find your name to continue.'
    if (updateContact === null && guestSelected) e.updateContact = 'Please answer this question.'
    if (attending === null && guestSelected) e.attending = 'Please let us know if you\'ll be attending.'

    if (attending) {
      if (guest?.plusOneAllowed && partyMembers.length === 0 && !plusOneName.trim()) e.plusOneName = 'Please enter your plus one\'s name.'
      if (hasChildren) {
        children.forEach((c, i) => {
          if (!c.name.trim() || !c.age.trim()) ce[i] = 'Please complete name and age.'
        })
      }
      partyMembers.forEach((m, i) => {
        if (!m.name.trim()) me[i] = 'Please enter this guest\'s name.'
        else if (m.attending === null) me[i] = 'Please indicate if this guest will attend.'
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

    try {
      const res = await fetch('/api/rsvp/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: guest!.name,
          attending,
          updateContact: updateContact ?? false,
          email: updateContact ? email : undefined,
          phone: updateContact ? phone : undefined,
          address1: updateContact ? address1 : undefined,
          address2: updateContact ? address2 : undefined,
          city: updateContact ? city : undefined,
          state: updateContact ? state : undefined,
          zip: updateContact ? zip : undefined,
          plusOneName: guest?.plusOneAllowed && partyMembers.length === 0 ? plusOneName.trim() : undefined,
          children: hasChildren && children.length > 0 ? children : undefined,
          partyMembers: partyMembers.length > 0 ? partyMembers.map(m => ({
            name: m.name.trim(),
            attending: m.attending ?? false,
            dietaryRestrictions: m.dietary.trim() || undefined,
            welcomeReception: m.welcomeReception ?? undefined,
          })) : undefined,
          dietaryRestrictions: dietary.trim() || undefined,
          welcomeReception: attending ? (welcomeReception ?? undefined) : undefined,
        }),
      })

      if (!res.ok) throw new Error('Submit failed')

      const params = new URLSearchParams({
        name: guest!.name.split(' ')[0],
        attending: attending ? '1' : '0',
      })
      if (attending && guest?.plusOneAllowed && plusOneName.trim()) params.set('plusOne', plusOneName.trim())

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

      {/* ── Contact Info ─────────────────────────────────── */}
      {guestSelected && (
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
      {guestSelected && updateContact !== null && (
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

      {/* ── Welcome Reception (attending only) ───────────── */}
      {attending === true && (
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

      {/* ── Party (attending only, single guests only) ───── */}
      {attending === true && partyMembers.length === 0 && (
        <div className="flex flex-col gap-5">
          <h2 className={sectionHeadingClass}>Your Party</h2>
          <PartyComposition
            plusOneAllowed={guest?.plusOneAllowed ?? false}
            plusOneName={plusOneName}
            hasChildren={hasChildren}
            children={children}
            onPlusOneNameChange={setPlusOneName}
            onChildrenToggle={setHasChildren}
            onChildrenChange={setChildren}
            errors={{ plusOneName: errors.plusOneName, children: childErrors }}
          />
        </div>
      )}

      {/* ── Additional Party Members ─────────────────────── */}
      {attending === true && partyMembers.length > 0 && (
        <div className="flex flex-col gap-6">
          <h2 className={sectionHeadingClass}>Your Party</h2>
          <p className="font-crimson text-base text-dark-taupe/85">
            Your reservation is for {(guest?.partySize ?? 1)} guests. Please RSVP for each person below.
          </p>
          {partyMembers.map((member, i) => (
            <div key={i} className="flex flex-col gap-4 border border-pale-gold/40 p-5 bg-warm-cream/30">
              <p className="font-work-sans text-[10px] tracking-[0.2em] uppercase text-gold-line">
                Guest {i + 2}
              </p>
              <Field label="Full Name" error={memberErrors[i]}>
                <input
                  type="text"
                  value={member.name}
                  onChange={(e) => updateMember(i, { name: e.target.value })}
                  placeholder="First and last name"
                  className={inputClass}
                />
              </Field>
              <div className="flex flex-col gap-2">
                <span className="font-work-sans text-xs tracking-[0.12em] uppercase text-dark-taupe/85 font-medium">Will they be attending?</span>
                <div className="flex flex-col gap-2">
                  {([{ value: true, label: 'Joyfully accepts' }, { value: false, label: 'Regretfully declines' }] as const).map(({ value, label }) => (
                    <label key={label} className={checkboxLabel}>
                      <input
                        type="radio"
                        name={`member-attending-${i}`}
                        checked={member.attending === value}
                        onChange={() => updateMember(i, { attending: value })}
                        className="w-5 h-5 accent-gold-line cursor-pointer flex-shrink-0"
                      />
                      <span className="font-crimson text-base text-dark-taupe">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
              {member.attending === true && (
                <>
                  <div className="flex flex-col gap-2">
                    <span className="font-work-sans text-xs tracking-[0.12em] uppercase text-dark-taupe/85 font-medium">
                      Welcome Reception <span className="ml-2 normal-case tracking-normal font-crimson italic text-sm text-muted-rose">optional</span>
                    </span>
                    <div className="flex flex-col gap-2">
                      {([{ value: true, label: 'Yes, I\'ll be there' }, { value: false, label: 'No, can\'t make it' }] as const).map(({ value, label }) => (
                        <label key={label} className={checkboxLabel}>
                          <input
                            type="radio"
                            name={`member-welcome-${i}`}
                            checked={member.welcomeReception === value}
                            onChange={() => updateMember(i, { welcomeReception: value })}
                            className="w-5 h-5 accent-gold-line cursor-pointer flex-shrink-0"
                          />
                          <span className="font-crimson text-base text-dark-taupe">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <Field label="Dietary Restrictions" optional>
                    <textarea
                      value={member.dietary}
                      onChange={(e) => updateMember(i, { dietary: e.target.value })}
                      rows={2}
                      placeholder="List any allergies or dietary restrictions…"
                      className={`${inputClass} resize-none`}
                    />
                  </Field>
                </>
              )}
            </div>
          ))}
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
              placeholder="List any allergies or dietary restrictions…"
              className={`${inputClass} resize-none`}
            />
          </Field>
        </div>
      )}

      {/* ── Travel & Accommodations (attending only) ─────── */}
      {attending === true && (
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
      {guestSelected && updateContact !== null && attending !== null && (
        <div className="flex flex-col gap-5">
          <h2 className={sectionHeadingClass}>Event Details</h2>
          <CeremonyReceptionDetails />
        </div>
      )}

      {/* ── Dress Code (attending only) ───────────────────── */}
      {attending === true && (
        <div className="flex flex-col gap-3 bg-warm-cream/40 border border-pale-gold/30 p-5">
          <h2 className={sectionHeadingClass}>Dress Code</h2>
          <p className="font-crimson text-base text-dark-taupe/80 leading-relaxed">
            Semi-formal Attire: Suits and cocktail dresses.
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
      {guestSelected && updateContact !== null && attending !== null && (
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
