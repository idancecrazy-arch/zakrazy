import { Metadata } from 'next'
import DetailForm from '@/components/DetailForm'
import FeatherDivider from '@/components/FeatherDivider'
import CrossMotif from '@/components/CrossMotif'

export const metadata: Metadata = {
  title: 'Confirm Your Details',
  description:
    'Please share your mailing address and contact details.',
}

export default function RSVPPage() {
  return (
    <div className="min-h-screen bg-ivory pt-20 sm:pt-24 pb-24 px-5 sm:px-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-6 mb-12 sm:mb-16">
          <p className="font-work-sans text-xs tracking-[0.18em] uppercase text-dark-taupe/80 font-medium">
            Save the Date
          </p>

          <CrossMotif size={32} color="#D2C3A0" />

          <h1 className="font-italiana text-4xl sm:text-5xl md:text-6xl text-dark-taupe tracking-wide leading-tight">
            Confirm Your Details
          </h1>

          <FeatherDivider width={240} color="#D2C3A0" />

          <p className="font-crimson text-lg sm:text-xl text-dark-taupe/85 max-w-md leading-relaxed">
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
