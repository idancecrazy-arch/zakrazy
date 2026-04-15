import { Metadata } from 'next'
import DetailForm from '@/components/DetailForm'
import FeatherDivider from '@/components/FeatherDivider'
import CrossMotif from '@/components/CrossMotif'

export const metadata: Metadata = {
  title: 'Confirm Your Details',
  description:
    'Please share your mailing address and contact details. Formal invitations to follow.',
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

          <FeatherDivider width={240} color="#D2C3A0" />

          <p className="font-crimson text-base text-deep-ivory max-w-sm leading-relaxed">
            Simply a way for us to make sure we have your current information
            on file.
          </p>
        </div>

        {/* Form */}
        <DetailForm />

      </div>
    </div>
  )
}
