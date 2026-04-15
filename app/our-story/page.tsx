import { Metadata } from 'next'
import SwanMotif from '@/components/SwanMotif'
import FeatherDivider from '@/components/FeatherDivider'

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "The story of Christine and Michael.",
}

export default function OurStoryPage() {
  return (
    <div className="min-h-screen bg-ivory pt-16 flex flex-col items-center justify-center">
      <div className="max-w-xl mx-auto px-6 py-32 flex flex-col items-center gap-10 text-center">
        <FeatherDivider width={200} color="#D2C3A0" />
        <h1 className="font-italiana text-5xl sm:text-6xl text-dark-taupe tracking-wide">
          Our Story
        </h1>
        <p className="font-lora italic text-lg text-deep-ivory leading-relaxed max-w-xs">
          Coming soon — more to share before the big day.
        </p>
        <div className="w-16 h-px bg-pale-gold" />
        <SwanMotif size={100} color="#D2C3A0" />
        <p className="font-work-sans text-[9px] tracking-[0.3em] uppercase text-soft-gray">
          September 12, 2026
        </p>
      </div>
    </div>
  )
}
