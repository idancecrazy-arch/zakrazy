'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import PixelCat from '../PixelCat'

const DURATION = 10 // seconds
const SNAP_LIMIT = 3

interface Fish {
  id: number
  y: number          // 0-100 percentage
  size: 'small' | 'medium' | 'large'
  speed: number      // px per second
  startX: number     // offset so fish stagger their entry
  color: string
  spawnAt: number    // seconds after start to appear
}

const FISH_COLORS = ['#766588', '#856A20', '#9A5F50', '#436B8A', '#5A8A6B', '#B4783C']

const SIZE_POINTS = { small: 1, medium: 3, large: 5 }
const SIZE_PX = { small: 18, medium: 28, large: 40 }

function makeFish(count: number): Fish[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    y: 15 + Math.random() * 65,
    size: (['small', 'medium', 'large'] as const)[Math.floor(Math.random() * 3)],
    speed: 40 + Math.random() * 60,
    startX: 500,
    color: FISH_COLORS[i % FISH_COLORS.length],
    spawnAt: (i / count) * (DURATION - 2),
  }))
}

const FISH = makeFish(12)

interface SnorkelingSceneProps {
  onComplete: () => void
}

export default function SnorkelingScene({ onComplete }: SnorkelingSceneProps) {
  const [timeLeft, setTimeLeft] = useState(DURATION)
  const [snaps, setSnaps] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [lastSnapScore, setLastSnapScore] = useState<number | null>(null)
  const [done, setDone] = useState(false)
  const elapsedRef = useRef(0)
  const lastTimeRef = useRef<number | null>(null)
  const fishPosRef = useRef<number[]>(FISH.map(() => -80)) // x positions
  const containerRef = useRef<HTMLDivElement>(null)
  const fishElemsRef = useRef<(HTMLDivElement | null)[]>([])
  const rafRef = useRef<number | null>(null)
  const doneRef = useRef(false)

  useEffect(() => {
    const animate = (ts: number) => {
      if (lastTimeRef.current === null) lastTimeRef.current = ts
      const dt = (ts - lastTimeRef.current) / 1000
      lastTimeRef.current = ts
      elapsedRef.current += dt

      const elapsed = elapsedRef.current
      const remaining = Math.max(0, DURATION - elapsed)
      setTimeLeft(Math.ceil(remaining))

      FISH.forEach((fish, i) => {
        if (elapsed < fish.spawnAt) return
        const fishElapsed = elapsed - fish.spawnAt
        const x = 500 - fishElapsed * fish.speed
        fishPosRef.current[i] = x
        if (fishElemsRef.current[i]) {
          fishElemsRef.current[i]!.style.left = `${x}px`
          fishElemsRef.current[i]!.style.opacity = x > -60 && x < 520 ? '1' : '0'
        }
      })

      if (remaining <= 0 && !doneRef.current) {
        doneRef.current = true
        setDone(true)
      } else {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  useEffect(() => {
    if (done) {
      const t = setTimeout(onComplete, 2000)
      return () => clearTimeout(t)
    }
  }, [done, onComplete])

  const snap = useCallback(() => {
    if (done || snaps >= SNAP_LIMIT) return
    const containerWidth = containerRef.current?.offsetWidth ?? 480
    let score = 0
    FISH.forEach((fish, i) => {
      const x = fishPosRef.current[i]
      if (x > -20 && x < containerWidth) {
        score += SIZE_POINTS[fish.size]
      }
    })
    setLastSnapScore(score)
    setTotalScore(prev => prev + score)
    setSnaps(prev => prev + 1)
    setTimeout(() => setLastSnapScore(null), 900)
  }, [done, snaps])

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-center">
        <h2 className="font-cormorant text-[#5A5044] font-semibold" style={{ fontSize: '1.5rem' }}>
          Snorkeling Adventure
        </h2>
        <p className="font-crimson text-[#736C62] text-base mt-1">
          Christine &amp; Michael went snorkeling! Photograph fish — bigger fish = more points.
          <br />
          <em>You have {SNAP_LIMIT} shots and {DURATION} seconds. Go!</em>
        </p>
      </div>

      {/* Ocean container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-xl border-2"
        style={{
          width: '100%',
          maxWidth: 480,
          height: 140,
          background: 'linear-gradient(to bottom, #5B8FA8 0%, #2D6B8A 50%, #1A4F70 100%)',
          borderColor: '#C3AF82',
        }}
      >
        {/* Wave shimmer */}
        <div className="absolute inset-0 opacity-20"
          style={{ background: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.3) 42px)' }}
        />

        {/* Cat with snorkel in corner */}
        <div className="absolute left-2 top-2 opacity-90">
          <PixelCat accessory="snorkel" small />
        </div>

        {/* Fish */}
        {FISH.map((fish, i) => (
          <div
            key={fish.id}
            ref={el => { fishElemsRef.current[i] = el }}
            className="absolute opacity-0"
            style={{ top: `${fish.y}%`, left: -80, transition: 'none' }}
          >
            <svg
              width={SIZE_PX[fish.size]}
              height={SIZE_PX[fish.size] * 0.6}
              viewBox="0 0 40 24"
              aria-hidden
            >
              {/* Fish body */}
              <ellipse cx={22} cy={12} rx={16} ry={9} fill={fish.color} />
              {/* Tail */}
              <polygon points="8,12 0,4 0,20" fill={fish.color} opacity={0.8} />
              {/* Eye */}
              <circle cx={30} cy={9} r={2.5} fill="#FAF5EB" />
              <circle cx={30} cy={9} r={1.2} fill="#3C3228" />
              {/* Size indicator */}
              {fish.size === 'large' && <text x={18} y={15} fontSize="7" fill="#FAF5EB" textAnchor="middle">★</text>}
              {fish.size === 'medium' && <text x={18} y={15} fontSize="7" fill="#FAF5EB" textAnchor="middle">•</text>}
            </svg>
          </div>
        ))}

        {/* Flash on snap */}
        {lastSnapScore !== null && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div
              className="text-white font-bold text-2xl px-4 py-2 rounded-full"
              style={{
                background: 'rgba(133, 106, 32, 0.85)',
                fontFamily: 'serif',
                animation: 'fadeUp 0.9s ease-out forwards',
              }}
            >
              +{lastSnapScore} pts!
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeUp {
          0%   { opacity: 1; transform: translateY(0); }
          80%  { opacity: 1; transform: translateY(-20px); }
          100% { opacity: 0; transform: translateY(-30px); }
        }
      `}</style>

      {/* Controls */}
      <div className="flex items-center gap-6">
        <div className="text-center">
          <div className="font-work-sans text-xs tracking-widest uppercase text-[#736C62]">Time</div>
          <div
            className="font-cormorant font-bold text-2xl"
            style={{ color: timeLeft <= 3 ? '#9A5F50' : '#5A5044' }}
          >
            {timeLeft}s
          </div>
        </div>

        <button
          onClick={snap}
          disabled={done || snaps >= SNAP_LIMIT}
          className="font-work-sans tracking-widest uppercase text-sm px-6 py-3 rounded-full border-2 transition-all duration-150 active:scale-90 disabled:opacity-40"
          style={{
            background: '#856A20',
            color: '#FAF5EB',
            borderColor: '#856A20',
            letterSpacing: '0.12em',
          }}
        >
          📷 Snap! ({SNAP_LIMIT - snaps} left)
        </button>

        <div className="text-center">
          <div className="font-work-sans text-xs tracking-widest uppercase text-[#736C62]">Score</div>
          <div className="font-cormorant font-bold text-2xl text-[#5A5044]">{totalScore}</div>
        </div>
      </div>

      {done && (
        <p className="font-cormorant text-[#856A20] font-semibold text-xl animate-pulse">
          🤿 Great shots! Total: {totalScore} pts
        </p>
      )}
    </div>
  )
}
