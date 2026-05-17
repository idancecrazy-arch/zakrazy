import { VENUE, RECEPTION_VENUE } from '@/lib/constants'

export default function CeremonyReceptionDetails() {
  return (
    <div className="flex flex-col gap-8">
      {/* Ceremony */}
      <div className="flex flex-col gap-3">
        <p className="font-work-sans text-[10px] tracking-[0.25em] uppercase text-gold-line">
          Ceremony
        </p>
        <p className="font-italiana text-2xl text-dark-taupe tracking-wide">
          {VENUE.shortName}
        </p>
        <p className="font-crimson text-base text-dark-taupe/80 leading-relaxed">
          {VENUE.address}, {VENUE.neighborhood}
          <br />
          {VENUE.city}, {VENUE.state} {VENUE.zip}
        </p>
        <p className="font-lora italic text-base text-deep-ivory">
          Time: <span className="font-crimson not-italic text-dark-taupe/70">TBD — details to follow</span>
        </p>
        <a
          href={VENUE.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start font-work-sans text-[10px] tracking-[0.18em] uppercase text-muted-rose hover:text-dusty-lilac transition-colors duration-200 underline underline-offset-4"
        >
          View on Google Maps
        </a>
      </div>

      <div className="h-px bg-pale-gold/40" />

      {/* Reception */}
      <div className="flex flex-col gap-3">
        <p className="font-work-sans text-[10px] tracking-[0.25em] uppercase text-gold-line">
          Reception
        </p>
        <p className="font-italiana text-2xl text-dark-taupe tracking-wide">
          {RECEPTION_VENUE.shortName}
        </p>
        <p className="font-crimson text-base text-dark-taupe/80 leading-relaxed">
          {RECEPTION_VENUE.address}, {RECEPTION_VENUE.neighborhood}
          <br />
          {RECEPTION_VENUE.city}, {RECEPTION_VENUE.state} {RECEPTION_VENUE.zip}
        </p>
        <p className="font-lora italic text-base text-deep-ivory">
          Time: <span className="font-crimson not-italic text-dark-taupe/70">TBD — details to follow</span>
        </p>
        <p className="font-crimson italic text-sm text-muted-rose">
          Family-style dining · Everything is indoors
        </p>
        <a
          href={RECEPTION_VENUE.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start font-work-sans text-[10px] tracking-[0.18em] uppercase text-muted-rose hover:text-dusty-lilac transition-colors duration-200 underline underline-offset-4"
        >
          View on Google Maps
        </a>
      </div>
    </div>
  )
}
