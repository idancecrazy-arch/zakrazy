import { Metadata } from 'next'
import FeatherDivider from '@/components/FeatherDivider'
import SwanMotif from '@/components/SwanMotif'
import ChurchImage from '@/components/ChurchImage'
import { CHURCH_HISTORY, VENUE } from '@/lib/constants'

export const metadata: Metadata = {
  title: "Our Story at St. Joseph's",
  description:
    "The story of Christine and Michael's connection to St. Joseph's Church in Greenwich Village, New York.",
}

function ChurchPhoto({
  src,
  alt,
  caption,
  wide = false,
}: {
  src: string
  alt: string
  caption: string
  wide?: boolean
}) {
  return (
    <figure className={`flex flex-col gap-3 ${wide ? 'col-span-2' : ''}`}>
      <div className="border border-pale-gold/40 overflow-hidden aspect-[4/3] bg-warm-cream">
        <ChurchImage src={src} alt={alt} />
      </div>
      <figcaption className="font-work-sans text-[9px] tracking-[0.2em] uppercase text-soft-gray text-center">
        {caption}
      </figcaption>
    </figure>
  )
}

export default function OurStoryPage() {
  return (
    <div className="min-h-screen bg-ivory pt-16">

      {/* ── Hero image ──────────────────────────────────── */}
      <div className="relative w-full aspect-[21/9] overflow-hidden bg-warm-cream">
        <ChurchImage
          src="/images/st-josephs-exterior.jpg"
          alt="St. Joseph's Church, Greenwich Village at twilight"
        />
        {/* Text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center bg-dark-taupe/20">
          <p className="font-work-sans text-[10px] tracking-[0.35em] uppercase text-ivory/80">
            Our Story
          </p>
          <h1 className="font-italiana text-4xl sm:text-6xl text-ivory tracking-wide drop-shadow-sm">
            St. Joseph&apos;s Church
          </h1>
          <p className="font-lora italic text-lg text-ivory/90">
            Greenwich Village · New York City
          </p>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-6 py-20">

        {/* Section: How We Found It */}
        <div className="flex flex-col items-center text-center gap-8 mb-16">
          <FeatherDivider width={200} color="#D2C3A0" />
          <h2 className="font-italiana text-4xl text-dark-taupe tracking-wide">
            How We Found St. Joseph&apos;s
          </h2>
          <div className="text-left space-y-5">
            <p className="font-crimson text-lg text-deep-ivory leading-relaxed">
              <span className="font-italiana text-2xl text-dark-taupe float-left mr-2 leading-none mt-1">S</span>ome
              places choose you before you choose them. We first walked through
              the doors of St. Joseph&apos;s on a quiet Sunday morning — drawn in
              partly by curiosity, partly by the timeless pull of a Greek Revival
              façade rising above the bustle of Sixth Avenue. What we found inside
              stopped us cold: coffered ceilings, crystal chandeliers, the warm
              amber glow of beeswax candles reflected in polished wood. A silence
              that held.
            </p>
            <p className="font-crimson text-lg text-deep-ivory leading-relaxed">
              We sat in the pews for a long time that morning, saying very little.
              By the time we stepped back out into the Village, we already knew
              this was our place.
            </p>
          </div>
        </div>

        {/* Photo 1 */}
        <div className="mb-16">
          <ChurchPhoto
            src="/images/st-josephs-interior-2.jpg"
            alt="The nave of St. Joseph's Church looking toward the altar"
            caption="The nave of St. Joseph's · looking toward the Transfiguration altarpiece"
            wide
          />
        </div>

        <FeatherDivider width={200} color="#D2C3A0" className="mx-auto mb-16" />

        {/* Section: What This Place Means */}
        <div className="flex flex-col items-center text-center gap-8 mb-16">
          <h2 className="font-italiana text-4xl text-dark-taupe tracking-wide">
            What This Place Means to Us
          </h2>
          <div className="text-left space-y-5">
            <p className="font-crimson text-lg text-deep-ivory leading-relaxed">
              Over the years, St. Joseph&apos;s became woven into the fabric of
              our life together in New York. We have come here for quiet when the
              city grew too loud, for gratitude when good things happened, and for
              steadiness when they did not. The Marian devotion of this parish —
              its candlelit side chapel, the luminous quality of late-afternoon
              light through its windows — spoke to something neither of us could
              quite name but both of us recognized.
            </p>
            <p className="font-crimson text-lg text-deep-ivory leading-relaxed">
              To be married here is not simply to choose a beautiful venue. It is
              to give our vows a home that already holds our history.
            </p>
          </div>
        </div>

        {/* Two photos */}
        <div className="grid grid-cols-2 gap-4 mb-16">
          <ChurchPhoto
            src="/images/st-josephs-interior-1.jpg"
            alt="Crystal chandeliers inside St. Joseph's Church"
            caption="Crystal chandeliers · warm ivory and crystal light"
          />
          <ChurchPhoto
            src="/images/st-josephs-interior-3.jpg"
            alt="Decorative arched windows and confessional at St. Joseph's"
            caption="Arched windows · Marian iconography"
          />
        </div>

        <FeatherDivider width={200} color="#D2C3A0" className="mx-auto mb-16" />

        {/* Section: Brief History */}
        <div className="flex flex-col items-center text-center gap-8 mb-16">
          <h2 className="font-italiana text-4xl text-dark-taupe tracking-wide">
            A Brief History
          </h2>
          <p className="font-crimson text-lg text-deep-ivory leading-relaxed text-left">
            {CHURCH_HISTORY}
          </p>
          <p className="font-crimson text-lg text-deep-ivory leading-relaxed text-left">
            The church has served the Greenwich Village community without
            interruption for nearly two centuries — through waves of immigration,
            through the artistic and cultural revolutions that made the Village
            legendary, and through the quiet, ordinary Sundays that are the true
            substance of a parish&apos;s life. We are honored to add our day to
            its story.
          </p>
        </div>

        {/* Address block */}
        <div className="border border-pale-gold/40 bg-warm-cream p-8 text-center flex flex-col gap-3">
          <p className="font-work-sans text-[10px] tracking-[0.3em] uppercase text-soft-gray">
            The Venue
          </p>
          <p className="font-italiana text-2xl text-dark-taupe tracking-wide">
            {VENUE.name}
          </p>
          <p className="font-crimson text-base text-deep-ivory">
            {VENUE.address} · {VENUE.city}, {VENUE.state} {VENUE.zip}
          </p>
        </div>

        {/* Swan close */}
        <div className="flex flex-col items-center gap-6 mt-20">
          <SwanMotif size={100} color="#D2C3A0" />
          <p className="font-lora italic text-base text-deep-ivory text-center max-w-xs leading-relaxed">
            September 12, 2026
          </p>
        </div>
      </div>
    </div>
  )
}
