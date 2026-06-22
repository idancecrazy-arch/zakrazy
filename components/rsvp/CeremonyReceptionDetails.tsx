import { VENUE, RECEPTION_VENUE } from '@/lib/constants'

export default function CeremonyReceptionDetails() {
  return (
    <div className="flex flex-col gap-8">
      {/* Ceremony */}
      <div className="flex flex-col gap-3">
        <p className="font-work-sans text-[12px] tracking-[0.25em] uppercase text-gold-deep">
          Ceremony
        </p>
        <p className="font-crimson text-2xl font-bold text-dark-taupe">
          2:00 PM
        </p>
        <p className="font-cormorant text-2xl text-dark-taupe tracking-wide">
          {VENUE.shortName}
        </p>
        <p className="font-crimson text-base text-dark-taupe/90 leading-relaxed">
          {VENUE.address}, {VENUE.neighborhood}
          <br />
          {VENUE.city}, {VENUE.state} {VENUE.zip}
        </p>
        <p className="font-crimson text-base text-dark-taupe/90">
          Please arrive by 1:30pm.
        </p>
        <a
          href={VENUE.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start font-work-sans text-[12px] tracking-[0.18em] uppercase text-rose-deep hover:text-dusty-lilac transition-colors duration-200 underline underline-offset-4"
        >
          View on Google Maps
        </a>
      </div>

      <div className="h-px bg-pale-gold/40" />

      {/* Reception */}
      <div className="flex flex-col gap-3">
        <p className="font-work-sans text-[12px] tracking-[0.25em] uppercase text-gold-deep">
          Reception
        </p>
        <p className="font-crimson text-2xl font-bold text-dark-taupe">
          5:00 PM
        </p>
        <p className="font-cormorant text-2xl text-dark-taupe tracking-wide">
          {RECEPTION_VENUE.shortName}
        </p>
        <p className="font-crimson text-base text-dark-taupe/90 leading-relaxed">
          {RECEPTION_VENUE.address}, {RECEPTION_VENUE.neighborhood}
          <br />
          {RECEPTION_VENUE.city}, {RECEPTION_VENUE.state} {RECEPTION_VENUE.zip}
        </p>
        <p className="font-crimson text-base text-dark-taupe/90">
          Cocktail hour starts at 5:00 PM.
        </p>
        <a
          href={RECEPTION_VENUE.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start font-work-sans text-[12px] tracking-[0.18em] uppercase text-rose-deep hover:text-dusty-lilac transition-colors duration-200 underline underline-offset-4"
        >
          View on Google Maps
        </a>
      </div>
    </div>
  )
}
