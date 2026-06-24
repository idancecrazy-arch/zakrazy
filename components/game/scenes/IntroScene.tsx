'use client'

import PixelCat from '../PixelCat'

interface IntroSceneProps {
  onStart: () => void
}

export default function IntroScene({ onStart }: IntroSceneProps) {
  return (
    <div className="flex flex-col items-center gap-6 text-center py-4">
      <h1 className="font-italiana text-[#5A5044]" style={{ fontSize: 'clamp(1.6rem, 5vw, 2.4rem)' }}>
        The Story of Christine &amp; Michael
      </h1>

      <p className="font-crimson text-[#736C62] max-w-sm" style={{ fontSize: '1.1rem' }}>
        Two law students, one snorkeling trip, and a very important second cat.
        Play through the milestones of our love story!
      </p>

      {/* Cat waving */}
      <div className="relative flex justify-center my-2">
        <PixelCat accessory="party" />
        <span
          className="absolute -right-6 top-0 text-2xl select-none"
          style={{
            animation: 'waveHand 0.6s ease-in-out infinite alternate',
            display: 'inline-block',
            transformOrigin: '70% 70%',
          }}
        >
          👋
        </span>
      </div>

      <style>{`
        @keyframes waveHand {
          from { transform: rotate(-15deg); }
          to   { transform: rotate(15deg); }
        }
      `}</style>

      <button
        onClick={onStart}
        className="font-work-sans tracking-widest uppercase text-sm px-8 py-3 rounded-full border-2 transition-all duration-200 hover:scale-105 active:scale-95"
        style={{
          background: '#856A20',
          color: '#FAF5EB',
          borderColor: '#856A20',
          letterSpacing: '0.15em',
        }}
      >
        Begin the Story
      </button>
    </div>
  )
}
