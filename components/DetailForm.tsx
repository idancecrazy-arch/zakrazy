'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
const GOOGLE_CAL_URL =
  'https://calendar.google.com/calendar/render?action=TEMPLATE' +
  '&text=Save+the+Date%3A+Christine+and+Michael+Wedding' +
  '&dates=20260912T140000%2F20260912T210000' +
  '&ctz=America%2FNew_York' +
  '&location=St.+Joseph%27s+Church%2C+371+Sixth+Avenue%2C+New+York+NY+10014' +
  '&details=Save+the+Date+%E2%80%94+Christine+Liu+%26+Michael+Zakrajsek'

const OUTLOOK_CAL_URL =
  'https://outlook.live.com/calendar/0/deeplink/compose?subject=Save+the+Date%3A+Christine+and+Michael+Wedding' +
  '&startdt=2026-09-12T14%3A00%3A00' +
  '&enddt=2026-09-12T21%3A00%3A00' +
  '&location=St.+Joseph%27s+Church%2C+New+York' +
  '&body=Save+the+Date+%E2%80%94+Christine+Liu+%26+Michael+Zakrajsek'

const ICS_CONTENT = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'CALSCALE:GREGORIAN',
  'PRODID:-//Christine & Michael Wedding//EN',
  'METHOD:PUBLISH',
  'BEGIN:VEVENT',
  'UID:christine-michael-wedding-20260912@zakrazy.vercel.app',
  'SUMMARY:Save the Date: Christine and Michael Wedding',
  'DTSTART;TZID=America/New_York:20260912T140000',
  'DTEND;TZID=America/New_York:20260912T210000',
  'DESCRIPTION:Save the Date — Christine Liu & Michael Zakrajsek',
  "LOCATION:St. Joseph's Church\\, 371 Sixth Avenue\\, New York\\, NY 10014",
  'STATUS:CONFIRMED',
  'END:VEVENT',
  'END:VCALENDAR',
].join('\r\n')

function downloadICS() {
  const blob = new Blob([ICS_CONTENT], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'christine-michael-wedding.ics'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const schema = z.object({
  fullName: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email address'),
  address1: z.string().min(3, 'Please enter your street address'),
  address2: z.string().optional(),
  city: z.string().min(1, 'Please enter your city'),
  state: z.string().min(1, 'Please enter your state or province'),
  zip: z.string().min(3, 'Please enter your ZIP or postal code'),
  country: z.string().min(1, 'Please select your country'),
  kidsAttending: z.number().int().min(0).optional(),
  hotelBlockInterest: z.boolean().optional(),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const COUNTRIES = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'France',
  'Germany',
  'Italy',
  'Japan',
  'China',
  'Brazil',
  'Mexico',
  'Other',
]

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
      {error && (
        <p className="font-crimson italic text-sm text-muted-rose">{error}</p>
      )}
    </div>
  )
}

const inputClass = `
  w-full bg-ivory border border-gold-line/60
  px-4 py-3.5 min-h-[48px]
  font-crimson text-base sm:text-lg text-dark-taupe
  placeholder:text-soft-gray
  focus:border-gold-line focus:ring-0
  transition-colors duration-200
`

const sectionHeadingClass =
  'font-italiana text-2xl sm:text-3xl text-dark-taupe tracking-wide pb-2 border-b border-pale-gold/50'

export default function DetailForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [submittedName, setSubmittedName] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { country: 'United States' },
  })

  const onSubmit = async (data: FormData) => {
    setStatus('loading')
    try {
      const res = await fetch('/api/submit-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Server error')
      setSubmittedName(data.fullName.split(' ')[0])
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-8 text-center py-12 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="font-italiana text-4xl text-dark-taupe tracking-wide">
            Thank you, {submittedName}!
          </h2>
          <p className="font-lora italic text-lg text-dark-taupe/85 max-w-md leading-relaxed">
            Your details have been saved. A formal invitation will follow closer to the date.
          </p>
        </div>
        <p className="font-work-sans text-xs tracking-[0.18em] uppercase text-dark-taupe/80 font-medium">
          September 12, 2026 · New York
        </p>

        {/* Calendar downloads */}
        <div className="flex flex-col items-center gap-3 w-full max-w-xs">
          <p className="font-work-sans text-[10px] tracking-[0.2em] uppercase text-soft-gray">
            Add to calendar
          </p>
          <a
            href={GOOGLE_CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full font-work-sans text-[11px] tracking-[0.18em] uppercase px-6 py-3 border border-gold-line/50 text-dark-taupe hover:bg-blush transition-colors duration-200 text-center"
          >
            Google Calendar
          </a>
          <a
            href={OUTLOOK_CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full font-work-sans text-[11px] tracking-[0.18em] uppercase px-6 py-3 border border-gold-line/50 text-dark-taupe hover:bg-blush transition-colors duration-200 text-center"
          >
            Outlook
          </a>
          <button
            onClick={downloadICS}
            className="w-full font-work-sans text-[11px] tracking-[0.18em] uppercase px-6 py-3 border border-gold-line/50 text-dark-taupe hover:bg-blush transition-colors duration-200"
          >
            Apple Calendar (iCal)
          </button>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-8 max-w-xl mx-auto w-full"
      noValidate
    >
      {/* Personal */}
      <div className="flex flex-col gap-6">
        <h2 className={sectionHeadingClass}>Contact Information</h2>

        <Field label="Full Name" error={errors.fullName?.message}>
          <input
            {...register('fullName')}
            type="text"
            placeholder="Your full name"
            autoComplete="name"
            className={inputClass}
          />
        </Field>

        <Field label="Email Address" error={errors.email?.message}>
          <input
            {...register('email')}
            type="email"
            placeholder="your@email.com"
            autoComplete="email"
            className={inputClass}
          />
        </Field>
      </div>

      {/* Address */}
      <div className="flex flex-col gap-6">
        <h2 className={sectionHeadingClass}>Mailing Address</h2>

        <Field label="Street Address" error={errors.address1?.message}>
          <input
            {...register('address1')}
            type="text"
            placeholder="123 Main Street"
            autoComplete="address-line1"
            className={inputClass}
          />
        </Field>

        <Field label="Apt / Suite / Unit" error={errors.address2?.message} optional>
          <input
            {...register('address2')}
            type="text"
            placeholder="Apt 4B"
            autoComplete="address-line2"
            className={inputClass}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4">
          <Field label="City" error={errors.city?.message}>
            <input
              {...register('city')}
              type="text"
              placeholder="New York"
              autoComplete="address-level2"
              className={inputClass}
            />
          </Field>

          <Field label="State / Province" error={errors.state?.message}>
            <input
              {...register('state')}
              type="text"
              placeholder="NY"
              autoComplete="address-level1"
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4">
          <Field label="ZIP / Postal Code" error={errors.zip?.message}>
            <input
              {...register('zip')}
              type="text"
              placeholder="10001"
              autoComplete="postal-code"
              className={inputClass}
            />
          </Field>

          <Field label="Country" error={errors.country?.message}>
            <select
              {...register('country')}
              autoComplete="country-name"
              className={inputClass}
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </div>

      {/* A Couple of Questions */}
      <div className="flex flex-col gap-6">
        <h2 className={sectionHeadingClass}>A Couple of Questions</h2>

        <Field
          label="Will any young children be joining you? If so, how many?"
          error={errors.kidsAttending?.message}
          optional
        >
          <p className="font-crimson italic text-base text-muted-rose">Children are warmly welcome.</p>
          <input
            {...register('kidsAttending', {
              setValueAs: (v) => {
                if (v === '' || v == null) return undefined
                const n = Number(v)
                return Number.isNaN(n) ? undefined : n
              },
            })}
            type="number"
            min="0"
            placeholder="0"
            className={inputClass}
          />
        </Field>

        <div className="flex flex-col gap-3">
          <p className="font-work-sans text-xs sm:text-[13px] tracking-[0.12em] uppercase text-dark-taupe/85 font-medium">
            Hotel block interest
            <span className="ml-2 normal-case tracking-normal font-crimson italic text-sm text-muted-rose">
              optional
            </span>
          </p>
          <p className="font-crimson text-base text-dark-taupe/85 leading-relaxed">
            We&apos;re looking into a hotel block nearby. Would you be interested?{' '}
            <span className="italic text-muted-rose">(No commitment; we&apos;ll follow up with details.)</span>
          </p>
          <label className="flex items-center gap-3 cursor-pointer mt-1 min-h-[44px]">
            <input
              {...register('hotelBlockInterest')}
              type="checkbox"
              className="w-5 h-5 border border-gold-line/60 accent-gold-line cursor-pointer"
            />
            <span className="font-crimson text-base sm:text-lg text-dark-taupe">
              Yes, I&apos;m interested in hotel options
            </span>
          </label>
        </div>
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-6">
        <Field
          label="Any updates to your name or address?"
          error={errors.notes?.message}
          optional
        >
          <textarea
            {...register('notes')}
            rows={3}
            placeholder="e.g. Recently moved, preferred name, etc."
            className={`${inputClass} resize-none`}
          />
        </Field>
      </div>

      {/* Error state */}
      {status === 'error' && (
        <p className="font-crimson italic text-muted-rose text-sm text-center">
          Something went wrong. Please try again or email us directly.
        </p>
      )}

      {/* Submit */}
      <div className="flex justify-center pt-2">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="
            w-full sm:w-auto
            font-work-sans text-sm tracking-[0.18em] uppercase font-medium
            px-10 py-4 min-h-[52px] border border-gold-line text-dark-taupe
            hover:bg-blush hover:border-shell-pink
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-300
          "
        >
          {status === 'loading' ? 'Saving…' : 'Confirm My Details'}
        </button>
      </div>
    </form>
  )
}
