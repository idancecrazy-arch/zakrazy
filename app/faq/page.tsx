import { Metadata } from 'next'
import FAQAccordion from '@/components/FAQAccordion'
import FeatherDivider from '@/components/FeatherDivider'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about Christine & Michael\'s wedding.',
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-ivory pt-36 sm:pt-40 pb-24 px-5 sm:px-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-6 mb-14 sm:mb-20">
          <p className="font-work-sans text-xs tracking-[0.18em] uppercase text-dark-taupe/80 font-medium">
            Christine &amp; Michael · September 12, 2026
          </p>
          <h1 className="font-italiana text-4xl sm:text-5xl text-dark-taupe tracking-wide leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="font-crimson text-lg text-dark-taupe/85 max-w-md leading-relaxed">
            Everything you need to know for a wonderful day.
          </p>
          <FeatherDivider />
        </div>

        {/* FAQ */}
        <FAQAccordion />

        {/* Still have questions */}
        <div className="mt-16 pt-10 border-t border-pale-gold/40 flex flex-col items-center gap-4 text-center">
          <p className="font-italiana text-2xl text-dark-taupe tracking-wide">
            Still have questions?
          </p>
          <p className="font-crimson text-base text-dark-taupe/80 leading-relaxed max-w-sm">
            We&apos;d love to hear from you. Reach out and we&apos;ll get back to you as soon as we can.
          </p>
          <a
            href="mailto:christineandmichaelzak@gmail.com"
            className="font-work-sans text-[11px] tracking-[0.18em] uppercase px-8 py-4 min-h-[52px] flex items-center border border-gold-line text-dark-taupe hover:bg-blush transition-colors duration-200 mt-2"
          >
            Email Us
          </a>
        </div>

      </div>
    </div>
  )
}
