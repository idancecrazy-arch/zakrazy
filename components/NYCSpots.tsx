import { ReactNode } from 'react'

type Spot = {
  name: string
  beforeReception?: boolean
  description: ReactNode
}

const SPOTS: Spot[] = [
  {
    name: 'Staten Island Ferry',
    description: (
      <>
        The public ferry is free to take! Sit on the right side of the boat
        going towards Staten Island for lovely views of the Statue of Liberty.
      </>
    ),
  },
  {
    name: 'Washington Square Park',
    beforeReception: true,
    description: (
      <>
        A beautiful spot to wander, people watch, and relax under the arch. It
        is a short stroll from the ceremony, so it is a lovely place to spend
        some time before the reception.
      </>
    ),
  },
  {
    name: 'St. Joseph Adoration Chapel',
    beforeReception: true,
    description: (
      <>
        Our parish keeps a perpetual adoration chapel open for quiet prayer.
        You can find hours and more details on the{' '}
        <a
          href="https://www.stjosephgv.nyc/perpetual-adoration"
          target="_blank"
          rel="noopener noreferrer"
          className="text-rose-deep underline underline-offset-2 hover:text-dark-taupe transition-colors duration-200"
        >
          perpetual adoration page
        </a>
        .
      </>
    ),
  },
]

export default function NYCSpots() {
  return (
    <div className="mt-16 pt-10 border-t border-pale-gold/40 flex flex-col gap-6">
      <div className="flex flex-col items-center text-center gap-3 mb-2">
        <p className="font-work-sans text-xs tracking-[0.18em] uppercase text-ink-muted font-medium">
          Around Town
        </p>
        <h2 className="font-italiana text-3xl sm:text-4xl text-dark-taupe tracking-wide leading-tight">
          Our Recommended Spots in NYC
        </h2>
        <p className="font-crimson text-base text-dark-taupe/90 leading-relaxed max-w-md">
          A few of our favorite places to enjoy the city while you are here.
          The ones marked below are a lovely way to spend the afternoon before
          the wedding reception.
        </p>
      </div>

      <div className="flex flex-col divide-y divide-pale-gold/40">
        {SPOTS.map((spot) => (
          <div key={spot.name} className="py-5 flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <h3 className="font-cormorant text-2xl text-dark-taupe tracking-wide">
                {spot.name}
              </h3>
              {spot.beforeReception && (
                <span className="font-work-sans text-[10px] tracking-[0.14em] uppercase px-3 py-1 rounded-full bg-lilac/40 text-lilac-deep whitespace-nowrap">
                  Great to do before the wedding reception
                </span>
              )}
            </div>
            <p className="font-crimson text-base text-dark-taupe/90 leading-relaxed">
              {spot.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
