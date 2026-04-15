'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import SwanMotif from './SwanMotif'

const schema = z.object({
  fullName: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email address'),
  address1: z.string().min(3, 'Please enter your street address'),
  address2: z.string().optional(),
  city: z.string().min(1, 'Please enter your city'),
  state: z.string().min(1, 'Please enter your state or province'),
  zip: z.string().min(3, 'Please enter your ZIP or postal code'),
  country: z.string().min(1, 'Please select your country'),
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
    <div className="flex flex-col gap-1.5">
      <label className="font-work-sans text-[10px] tracking-[0.2em] uppercase text-soft-gray">
        {label}
        {optional && (
          <span className="ml-2 normal-case tracking-normal font-crimson italic text-[11px] text-muted-rose/70">
            optional
          </span>
        )}
      </label>
      {children}
      {error && (
        <p className="font-crimson italic text-sm text-muted-rose">{error}</p>
      )}
    </div>
  )
}

const inputClass = `
  w-full bg-ivory border border-gold-line/60
  px-4 py-3
  font-crimson text-base text-dark-taupe
  placeholder:text-soft-gray/60
  focus:border-gold-line focus:ring-0
  transition-colors duration-200
`

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
        <SwanMotif size={120} color="#C3AF82" />
        <div className="flex flex-col gap-3">
          <h2 className="font-italiana text-4xl text-dark-taupe tracking-wide">
            Thank you, {submittedName}!
          </h2>
          <p className="font-lora italic text-lg text-deep-ivory max-w-md leading-relaxed">
            Your details have been saved. We&apos;ll be in touch soon with your
            save&#8209;the&#8209;date.
          </p>
        </div>
        <div className="w-16 h-px bg-pale-gold" />
        <p className="font-work-sans text-[10px] tracking-[0.2em] uppercase text-soft-gray">
          September 12, 2026 · St. Joseph&apos;s Church · New York
        </p>
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
        <p className="font-work-sans text-[10px] tracking-[0.3em] uppercase text-soft-gray border-b border-pale-gold/40 pb-3">
          Contact Information
        </p>

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
        <p className="font-work-sans text-[10px] tracking-[0.3em] uppercase text-soft-gray border-b border-pale-gold/40 pb-3">
          Mailing Address
        </p>

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

        <div className="grid grid-cols-2 gap-4">
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

        <div className="grid grid-cols-2 gap-4">
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
          Something went wrong — please try again or email us directly.
        </p>
      )}

      {/* Submit */}
      <div className="flex justify-center pt-2">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="
            font-work-sans text-[11px] tracking-[0.25em] uppercase
            px-10 py-4 border border-gold-line text-dark-taupe
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
