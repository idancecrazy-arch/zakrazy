import Link from 'next/link'
import { COUPLE, CONTACT_EMAIL } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="bg-warm-cream border-t border-pale-gold/50 py-14">
      <div className="max-w-xl mx-auto px-6 flex flex-col items-center gap-6 text-center">

        {/* Names and date */}
        <p className="font-italiana text-xl text-dark-taupe tracking-wide">
          {COUPLE.displayNames}
        </p>

        <p className="font-lora italic text-sm text-deep-ivory">
          September 12, 2026
        </p>

        {/* Contact */}
        {CONTACT_EMAIL && (
          <Link
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-work-sans text-[10px] tracking-[0.15em] uppercase text-muted-rose hover:text-dusty-lilac transition-colors duration-300"
          >
            Questions? {CONTACT_EMAIL}
          </Link>
        )}

      </div>
    </footer>
  )
}
