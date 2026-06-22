import { Metadata } from 'next'
import { HOTELS, VENUE, RECEPTION_VENUE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Travel & Accommodations',
  description: 'Hotel and travel information for Christine & Michael\'s wedding.',
}

export default function TravelPage() {
  return (
    <div className="min-h-screen bg-ivory pt-36 sm:pt-40 pb-24 px-5 sm:px-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-14 sm:mb-20">
          <h1 className="font-italiana text-4xl sm:text-5xl text-dark-taupe tracking-wide leading-tight">
            Travel &amp; Accommodations
          </h1>
        </div>

        {/* Friday Welcome Reception */}
        <div className="flex flex-col gap-8 mb-16">
          <h2 className="font-cormorant text-2xl sm:text-3xl text-dark-taupe tracking-wide pb-2 border-b border-pale-gold/50">
            Friday Welcome Reception
          </h2>
               <p className="font-crimson text-base text-dark-taupe/90">
                We are finalizing details for a casual welcome cocktail reception in the evening on Friday, September 11 (also in lower Manhattan!). While we intend to have light fare, we encourage you to eat before.
              </p>
        </div>


        {/* Ceremony and Reception */}
        <div className="flex flex-col gap-8 mb-16">
          <h2 className="font-cormorant text-2xl sm:text-3xl text-dark-taupe tracking-wide pb-2 border-b border-pale-gold/50">
            Ceremony and Reception
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Ceremony */}
            <div className="flex flex-col gap-3">
              <p className="font-work-sans text-[12px] tracking-[0.25em] uppercase text-gold-deep">
                Ceremony
              </p>
              <p className="font-cormorant text-xl text-dark-taupe tracking-wide">{VENUE.shortName}</p>
              <p className="font-crimson text-sm italic text-dark-taupe/70">Please arrive by 1:30pm</p>
              <p className="font-crimson text-base text-dark-taupe/90">
                {VENUE.address}<br />
                {VENUE.neighborhood}<br />
                {VENUE.city}, {VENUE.state} {VENUE.zip}
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

            {/* Reception */}
            <div className="flex flex-col gap-3">
              <p className="font-work-sans text-[12px] tracking-[0.25em] uppercase text-gold-deep">
                Reception
              </p>
              <p className="font-cormorant text-xl text-dark-taupe tracking-wide">{RECEPTION_VENUE.shortName}</p>
              <p className="font-crimson text-sm italic text-dark-taupe/70">Cocktail hour starts at 5pm</p>
              <p className="font-crimson text-base text-dark-taupe/90">
                {RECEPTION_VENUE.address}<br />
                {RECEPTION_VENUE.neighborhood}<br />
                {RECEPTION_VENUE.city}, {RECEPTION_VENUE.state} {RECEPTION_VENUE.zip}
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
        </div>

        {/* Getting There */}
        <div className="flex flex-col gap-6 mb-16">
          <h2 className="font-cormorant text-2xl sm:text-3xl text-dark-taupe tracking-wide pb-2 border-b border-pale-gold/50">
            Getting There
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <p className="font-work-sans text-[12px] tracking-[0.2em] uppercase text-gold-deep">
                By Subway
              </p>
              <p className="font-crimson text-base text-dark-taupe/90 leading-relaxed">
                St. Joseph&apos;s: A/C/E to West 4th St, or 1 to Christopher St.
                <br /><br />
                Golden Unicorn: J/Z/N/Q/R/6 to Canal St.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-work-sans text-[12px] tracking-[0.2em] uppercase text-gold-deep">
                By Car &amp; Rideshare
              </p>
              <p className="font-crimson text-base text-dark-taupe/90 leading-relaxed">
                Parking is limited in both neighborhoods. We recommend rideshare (Uber, Lyft, or
                a car service) for a stress-free arrival.
              </p>
            </div>
          </div>
        </div>

        {/* Hotel */}
        <div className="flex flex-col gap-8">
          <h2 className="font-cormorant text-2xl sm:text-3xl text-dark-taupe tracking-wide pb-2 border-b border-pale-gold/50">
            Hotel Block
          </h2>

          <div className="bg-warm-cream/60 border border-pale-gold/50 p-6 flex flex-col gap-3">
            <p className="font-work-sans text-[12px] tracking-[0.2em] uppercase text-gold-deep">
              Book Early
            </p>
            <p className="font-crimson text-base text-dark-taupe/90 leading-relaxed">
              We highly recommend booking flights and hotels early. That weekend is the start of NYFW, which drives up travel prices significantly.
            </p>
          </div>

          {HOTELS.map((hotel) => (
            <div key={hotel.name} className="flex flex-col gap-3 pb-8 border-b border-pale-gold/30 last:border-b-0 last:pb-0">
              <p className="font-cormorant text-xl text-dark-taupe tracking-wide">{hotel.name}</p>
              <p className="font-work-sans text-[12px] tracking-[0.18em] uppercase text-gold-deep">
                {hotel.neighborhood}
              </p>
              <p className="font-crimson text-sm text-dark-taupe/90">{hotel.address}</p>
              <p className="font-crimson italic text-sm text-rose-deep">{hotel.distanceToCeremony}</p>
              {'rates' in hotel && hotel.rates && (
                <div className="flex flex-col gap-0.5">
                  {hotel.rates.split('\n').map((line) => (
                    <p key={line} className="font-crimson text-sm text-dark-taupe/90">{line}</p>
                  ))}
                </div>
              )}
              {'accessCode' in hotel && hotel.accessCode && (
                <p className="font-crimson text-sm text-dark-taupe/90">
                  Access code: <span className="font-work-sans tracking-widest text-dark-taupe">{hotel.accessCode}</span>
                </p>
              )}
              <p className="font-crimson text-sm italic text-dark-taupe/90">{hotel.note}</p>
              {'bookingUrl' in hotel && hotel.bookingUrl && (
                <a
                  href={hotel.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="self-start font-work-sans text-[12px] tracking-[0.18em] uppercase px-8 py-4 min-h-[52px] flex items-center border border-gold-line text-dark-taupe hover:bg-blush transition-colors duration-200 mt-2"
                >
                  Book Group Rate
                </a>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
