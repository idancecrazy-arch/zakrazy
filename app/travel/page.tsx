import { Metadata } from 'next'
import { HOTELS, VENUE, RECEPTION_VENUE } from '@/lib/constants'
import FeatherDivider from '@/components/FeatherDivider'

export const metadata: Metadata = {
  title: 'Travel & Accommodations',
  description: 'Hotel and travel information for Christine & Michael\'s wedding.',
}

export default function TravelPage() {
  return (
    <div className="min-h-screen bg-ivory pt-36 sm:pt-40 pb-24 px-5 sm:px-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-6 mb-14 sm:mb-20">
          <p className="font-work-sans text-xs tracking-[0.18em] uppercase text-dark-taupe/80 font-medium">
            Christine &amp; Michael · September 12, 2026
          </p>
          <h1 className="font-italiana text-4xl sm:text-5xl text-dark-taupe tracking-wide leading-tight">
            Travel &amp; Accommodations
          </h1>
          <p className="font-crimson text-lg text-dark-taupe/85 max-w-md leading-relaxed">
            New York City in September is beautiful. Here&apos;s everything you need to plan your stay.
          </p>
          <FeatherDivider />
        </div>

        {/* Venues */}
        <div className="flex flex-col gap-10 mb-16">
          <h2 className="font-italiana text-2xl sm:text-3xl text-dark-taupe tracking-wide pb-2 border-b border-pale-gold/50">
            Venues
          </h2>

          <div className="flex flex-col gap-4">
            <p className="font-work-sans text-[10px] tracking-[0.25em] uppercase text-gold-line">
              Ceremony
            </p>
            <p className="font-italiana text-xl text-dark-taupe tracking-wide">{VENUE.shortName}</p>
            <p className="font-crimson text-base text-dark-taupe/80">
              {VENUE.address}, {VENUE.neighborhood}
              <br />
              {VENUE.city}, {VENUE.state} {VENUE.zip}
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

          <div className="flex flex-col gap-4">
            <p className="font-work-sans text-[10px] tracking-[0.25em] uppercase text-gold-line">
              Reception
            </p>
            <p className="font-italiana text-xl text-dark-taupe tracking-wide">{RECEPTION_VENUE.shortName}</p>
            <p className="font-crimson text-base text-dark-taupe/80">
              {RECEPTION_VENUE.address}, {RECEPTION_VENUE.neighborhood}
              <br />
              {RECEPTION_VENUE.city}, {RECEPTION_VENUE.state} {RECEPTION_VENUE.zip}
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

        {/* Getting There */}
        <div className="flex flex-col gap-6 mb-16">
          <h2 className="font-italiana text-2xl sm:text-3xl text-dark-taupe tracking-wide pb-2 border-b border-pale-gold/50">
            Getting There
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <p className="font-work-sans text-[10px] tracking-[0.2em] uppercase text-gold-line">
                By Subway
              </p>
              <p className="font-crimson text-base text-dark-taupe/80 leading-relaxed">
                St. Joseph&apos;s: A/C/E to West 4th St, or 1 to Christopher St.
                <br /><br />
                Golden Unicorn: J/Z/N/Q/R/6 to Canal St.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-work-sans text-[10px] tracking-[0.2em] uppercase text-gold-line">
                By Car & Rideshare
              </p>
              <p className="font-crimson text-base text-dark-taupe/80 leading-relaxed">
                Parking is limited in both neighborhoods. We recommend rideshare (Uber, Lyft, or
                a car service) for a stress-free arrival.
              </p>
            </div>
          </div>
        </div>

        {/* Hotels */}
        <div className="flex flex-col gap-8">
          <h2 className="font-italiana text-2xl sm:text-3xl text-dark-taupe tracking-wide pb-2 border-b border-pale-gold/50">
            Recommended Hotels
          </h2>
          <p className="font-crimson text-base text-dark-taupe/80 leading-relaxed">
            We&apos;ve highlighted nearby hotels for your convenience. Rates and availability vary —
            book early as September in New York fills quickly.
          </p>

          {HOTELS.map((hotel, i) => (
            <div
              key={hotel.name}
              className={`flex flex-col gap-3 pb-8 ${i < HOTELS.length - 1 ? 'border-b border-pale-gold/40' : ''}`}
            >
              <p className="font-italiana text-xl text-dark-taupe tracking-wide">{hotel.name}</p>
              <p className="font-work-sans text-[10px] tracking-[0.18em] uppercase text-gold-line">
                {hotel.neighborhood}
              </p>
              <p className="font-crimson text-sm text-dark-taupe/70">{hotel.address}</p>
              <p className="font-crimson italic text-sm text-muted-rose">{hotel.distanceToCeremony}</p>
              {hotel.note && (
                <p className="font-crimson text-base text-dark-taupe/85">{hotel.note}</p>
              )}
              <p className="font-crimson text-sm text-dark-taupe/70 leading-relaxed">{hotel.bookingInfo}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
