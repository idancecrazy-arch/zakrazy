import { Metadata } from 'next'
import Link from 'next/link'
import CrossMotif from '@/components/CrossMotif'
import ArchMotif from '@/components/ArchMotif'
import ChurchImage from '@/components/ChurchImage'
import { VENUE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Ceremony Details',
  description:
    'Ceremony details for the wedding of Christine Liu and Michael Zakrajsek at St. Joseph\'s Church in Greenwich Village.',
}

export default function CeremonyPage() {
  return (
    <div className="min-h-screen bg-ivory pt-36 sm:pt-40 pb-24 px-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-6 mb-16">
          <p className="font-work-sans text-[10px] tracking-[0.3em] uppercase text-soft-gray">
            The Wedding Ceremony
          </p>
          <h1 className="font-italiana text-5xl sm:text-6xl text-dark-taupe tracking-wide leading-tight">
            Ceremony Details
          </h1>
        </div>

        {/* Church name + cross */}
        <div className="flex flex-col items-center text-center gap-5 mb-14">
          <CrossMotif size={44} color="#C3AF82" />
          <h2 className="font-italiana text-3xl sm:text-4xl text-dark-taupe tracking-wide leading-snug max-w-md">
            {VENUE.name}
          </h2>
          <p className="font-crimson text-lg text-deep-ivory">
            {VENUE.address}
          </p>
          <p className="font-crimson text-base text-deep-ivory">
            {VENUE.city}, {VENUE.state} {VENUE.zip}
          </p>
          <Link
            href={VENUE.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              font-work-sans text-[10px] tracking-[0.2em] uppercase
              text-muted-rose hover:text-dusty-lilac
              transition-colors duration-300
              pb-px border-b border-muted-rose/40 hover:border-dusty-lilac/40
            "
          >
            View on Google Maps
          </Link>
        </div>

        {/* Map embed */}
        <div className="border border-pale-gold/40 overflow-hidden mb-14">
          <iframe
            title="St. Joseph's Church location"
            src={VENUE.googleMapsEmbed}
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="bg-warm-cream"
          />
          {/* Fallback: static link shown if map doesn't load */}
          <p className="text-center py-3 font-work-sans text-[9px] tracking-[0.2em] uppercase text-soft-gray">
            371 Sixth Avenue · Greenwich Village · New York, NY 10014
          </p>
        </div>

        <div className="mb-14" />

        {/* Details grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-pale-gold/30 border border-pale-gold/30 mb-14">
          {[
            {
              label: 'Date',
              value: 'Saturday, September 12, 2026',
              italic: false,
            },
            {
              label: 'Time',
              value: 'Ceremony time to be announced',
              italic: true,
            },
            {
              label: 'Dress Code',
              value: 'Details coming soon',
              italic: true,
            },
            {
              label: 'Mass Type',
              value: 'Nuptial Mass',
              italic: false,
            },
          ].map(({ label, value, italic }) => (
            <div
              key={label}
              className="bg-ivory p-8 flex flex-col gap-2"
            >
              <p className="font-work-sans text-[9px] tracking-[0.3em] uppercase text-soft-gray">
                {label}
              </p>
              <p
                className={`font-crimson text-lg text-dark-taupe ${italic ? 'italic text-deep-ivory' : ''}`}
              >
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Church exterior photo */}
        <div className="mb-14 border border-pale-gold/40 overflow-hidden">
          <div className="aspect-[16/9] bg-warm-cream">
            <ChurchImage
              src="/images/st-josephs-exterior.jpg"
              alt="St. Joseph's Church, Greenwich Village"
            />
          </div>
          <p className="text-center py-3 font-work-sans text-[9px] tracking-[0.2em] uppercase text-soft-gray">
            St. Joseph&apos;s Church · Built 1833 · Greek Revival
          </p>
        </div>

        <div className="mb-14" />

        {/* What to Expect */}
        <div className="flex flex-col gap-6 mb-16">
          <div className="flex flex-col items-center gap-4 text-center">
            <ArchMotif width={80} height={70} color="#D2C3A0" />
            <h2 className="font-italiana text-3xl text-dark-taupe tracking-wide">
              What to Expect
            </h2>
          </div>
          <div className="space-y-4">
            <p className="font-crimson text-lg text-deep-ivory leading-relaxed">
              The ceremony will be a traditional Catholic Nuptial Mass, celebrated
              in the Roman Rite. The Mass typically lasts approximately one hour.
              Non-Catholic guests are warmly welcome and are asked simply to
              participate as they feel comfortable — standing and sitting with
              the congregation, and remaining in the pew during the Communion
              rite.
            </p>
            <p className="font-crimson text-lg text-deep-ivory leading-relaxed">
              We invite everyone to arrive a few minutes early to be seated and
              take in the beauty of this extraordinary space before the
              procession begins. Ushers will be on hand to assist.
            </p>
            <p className="font-crimson italic text-base text-muted-rose leading-relaxed">
              Photography guidelines will be posted here closer to the wedding.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 mt-10">
          <p className="font-lora italic text-base text-deep-ivory text-center">
            September 12, 2026 · St. Joseph&apos;s Church · New York
          </p>
        </div>
      </div>
    </div>
  )
}
