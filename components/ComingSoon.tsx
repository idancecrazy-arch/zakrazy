import Link from 'next/link'

interface ComingSoonProps {
  title: string
  subtitle?: string
}

export default function ComingSoon({ title, subtitle }: ComingSoonProps) {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-6 pt-36">
      <div className="flex flex-col items-center text-center gap-8 max-w-md">

        <p className="font-work-sans text-[10px] tracking-[0.3em] uppercase text-soft-gray">
          {subtitle ?? 'Coming Soon'}
        </p>

        <h1 className="font-italiana text-5xl sm:text-6xl text-dark-taupe tracking-wide leading-tight">
          {title}
        </h1>

        <p className="font-lora italic text-xl text-deep-ivory leading-relaxed">
          Details coming soon — we can&apos;t wait to share more with you.
        </p>

        <Link
          href="/"
          className="
            font-work-sans text-[11px] tracking-[0.2em] uppercase
            text-deep-ivory hover:text-dusty-lilac
            pb-px border-b border-pale-gold/0 hover:border-pale-gold
            transition-all duration-300
          "
        >
          ← Return Home
        </Link>

      </div>
    </div>
  )
}
