import { Metadata } from 'next'
import DetailForm from '@/components/DetailForm'
import FeatherDivider from '@/components/FeatherDivider'
import CrossMotif from '@/components/CrossMotif'
import { COUPLE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Confirm Your Details',
  description:
    'Please share your mailing address and contact details so we can send your save-the-date.',
}

export default function RSVPPage() {
  return (
    <div className="min-h-screen bg-ivory pt-24 pb-24 px-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-6 mb-16">
          <p className="font-work-sans text-[10px] tracking-[0.3em] uppercase text-soft-gray">
            Save the Date
          </p>

          <CrossMotif size={32} color="#D2C3A0" />

          <h1 className="font-italiana text-5xl sm:text-6xl text-dark-taupe tracking-wide leading-tight">
            Confirm Your Details
          </h1>

          <p className="font-lora italic text-lg text-deep-ivory max-w-md leading-relaxed">
            We&apos;re collecting mailing addresses and emails so we can send
            your save&#8209;the&#8209;date for{' '}
            <span className="not-italic font-crimson text-dusty-lilac">
              {COUPLE.displayNames}
            </span>
            .
          </p>

          <FeatherDivider width={240} color="#D2C3A0" />

          <p className="font-crimson text-base text-deep-ivory max-w-sm leading-relaxed">
            This is not a formal RSVP — simply a way for us to make sure we
            have your current information. A formal invitation will follow.
          </p>
        </div>

        {/* Form */}
        <DetailForm />

      </div>
    </div>
  )
}
