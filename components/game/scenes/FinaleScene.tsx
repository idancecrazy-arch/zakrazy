'use client'

import { useEffect, useState } from 'react'
import PixelCat from '../PixelCat'
import BackgammonBoard from '../../BackgammonBoard'

const CONFETTI_COLORS = ['#EBD2C8', '#C8B9D2', '#D2C3A0', '#C3AF82', '#FAF5EB', '#B4A5C3']
const CONFETTI_COUNT = 30

interface Piece {
  id: number
  x: number
  delay: number
  duration: number
  color: string
  size: number
}

function makeConfetti(): Piece[] {
  return Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2.5 + Math.random() * 2,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: 6 + Math.random() * 8,
  }))
}

const PIECES = makeConfetti()

interface FinaleSceneProps {
  onRestart: () => void
}

export default function FinaleScene({ onRestart }: FinaleSceneProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 200)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="relative flex flex-col items-center gap-5 overflow-hidden">

      {/* Confetti */}
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(340px) rotate(360deg); opacity: 0.3; }
        }
      `}</style>
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        {PIECES.map(p => (
          <div
            key={p.id}
            className="absolute rounded-sm"
            style={{
              left: `${p.x}%`,
              top: -10,
              width: p.size,
              height: p.size * 0.5,
              background: p.color,
              animation: `confettiFall ${p.duration}s ${p.delay}s ease-in infinite`,
            }}
          />
        ))}
      </div>

      <div
        className="relative text-center transition-all duration-700"
        style={{ opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(12px)' }}
      >
        <h2 className="font-italiana text-[#5A5044]" style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)' }}>
          And they lived happily ever after...
        </h2>
        <p className="font-script text-[#856A20] mt-1" style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.6rem)' }}>
          September 12, 2026
        </p>
      </div>

      {/* Both cats at the backgammon board */}
      <div
        className="relative flex items-end justify-center gap-2"
        style={{
          opacity: show ? 1 : 0,
          transform: show ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.7s 0.3s, transform 0.7s 0.3s',
        }}
      >
        <PixelCat accessory="party" />
        <PixelCat accessory="party" small />
      </div>

      {/* Backgammon board */}
      <div
        className="w-full"
        style={{
          maxWidth: 520,
          opacity: show ? 1 : 0,
          transform: show ? 'scale(1)' : 'scale(0.95)',
          transition: 'opacity 0.8s 0.5s, transform 0.8s 0.5s',
        }}
      >
        <BackgammonBoard />
      </div>

      <p
        className="font-crimson text-center text-[#736C62] max-w-sm"
        style={{
          fontSize: '1rem',
          opacity: show ? 1 : 0,
          transition: 'opacity 0.6s 0.8s',
        }}
      >
        Two cats, two law degrees, and countless adventures later —
        <br />
        <strong className="text-[#5A5044]">Christine &amp; Michael</strong> are getting married!
      </p>

      <button
        onClick={onRestart}
        className="font-work-sans tracking-widest uppercase text-sm px-7 py-3 rounded-full border-2 transition-all duration-200 hover:scale-105 active:scale-95"
        style={{
          background: 'transparent',
          color: '#856A20',
          borderColor: '#856A20',
          letterSpacing: '0.15em',
          opacity: show ? 1 : 0,
          transition: 'opacity 0.5s 1s',
        }}
      >
        Play Again
      </button>
    </div>
  )
}
