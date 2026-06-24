'use client'

import { useEffect, useRef, useState } from 'react'
import PixelCat from '../PixelCat'

const COUNTDOWN = 12
const CAT_COUNT = 8        // total cats; one is the target (small cat with bow)
const TARGET_INDEX = Math.floor(Math.random() * CAT_COUNT)
const AREA_W = 440
const AREA_H = 200
const CAT_BIG_W = 96
const CAT_SMALL_W = 72    // small cat (0.75 scale)

interface CatState {
  x: number
  y: number
  vx: number
  vy: number
  isTarget: boolean
}

function initCats(): CatState[] {
  return Array.from({ length: CAT_COUNT }, (_, i) => ({
    x: 20 + Math.random() * (AREA_W - 120),
    y: 20 + Math.random() * (AREA_H - 80),
    vx: (Math.random() * 2 + 0.8) * (Math.random() < 0.5 ? 1 : -1),
    vy: (Math.random() * 1.5 + 0.5) * (Math.random() < 0.5 ? 1 : -1),
    isTarget: i === TARGET_INDEX,
  }))
}

interface AdoptionSceneProps {
  onComplete: () => void
}

export default function AdoptionScene({ onComplete }: AdoptionSceneProps) {
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN)
  const [found, setFound] = useState(false)
  const [failed, setFailed] = useState(false)
  const catsRef = useRef<CatState[]>(initCats())
  const catElemsRef = useRef<(HTMLDivElement | null)[]>([])
  const rafRef = useRef<number | null>(null)
  const lastTsRef = useRef<number | null>(null)
  const elapsedRef = useRef(0)
  const resolvedRef = useRef(false)

  useEffect(() => {
    const animate = (ts: number) => {
      if (lastTsRef.current === null) lastTsRef.current = ts
      const dt = (ts - lastTsRef.current) / 1000
      lastTsRef.current = ts
      elapsedRef.current += dt

      const remaining = Math.max(0, COUNTDOWN - elapsedRef.current)
      setTimeLeft(Math.ceil(remaining))

      catsRef.current = catsRef.current.map((cat, i) => {
        const catW = cat.isTarget ? CAT_SMALL_W : CAT_BIG_W
        let { x, y, vx, vy } = cat
        x += vx
        y += vy
        if (x <= 0) { x = 0; vx = Math.abs(vx) }
        if (x >= AREA_W - catW) { x = AREA_W - catW; vx = -Math.abs(vx) }
        if (y <= 0) { y = 0; vy = Math.abs(vy) }
        if (y >= AREA_H - 64) { y = AREA_H - 64; vy = -Math.abs(vy) }
        const updated = { ...cat, x, y, vx, vy }

        if (catElemsRef.current[i]) {
          catElemsRef.current[i]!.style.transform = `translate(${x}px, ${y}px)`
        }
        return updated
      })

      if (remaining <= 0 && !resolvedRef.current) {
        resolvedRef.current = true
        setFailed(true)
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        return
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  useEffect(() => {
    if (found) {
      const t = setTimeout(onComplete, 1200)
      return () => clearTimeout(t)
    }
  }, [found, onComplete])

  const handleCatClick = (isTarget: boolean) => {
    if (resolvedRef.current) return
    if (isTarget) {
      resolvedRef.current = true
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      setFound(true)
    }
  }

  const retry = () => {
    catsRef.current = initCats()
    elapsedRef.current = 0
    lastTsRef.current = null
    resolvedRef.current = false
    setTimeLeft(COUNTDOWN)
    setFailed(false)
    setFound(false)
    rafRef.current = requestAnimationFrame(function animate(ts) {
      if (lastTsRef.current === null) lastTsRef.current = ts
      const dt = (ts - lastTsRef.current) / 1000
      lastTsRef.current = ts
      elapsedRef.current += dt
      const remaining = Math.max(0, COUNTDOWN - elapsedRef.current)
      setTimeLeft(Math.ceil(remaining))
      catsRef.current = catsRef.current.map((cat, i) => {
        const catW = cat.isTarget ? CAT_SMALL_W : CAT_BIG_W
        let { x, y, vx, vy } = cat
        x += vx; y += vy
        if (x <= 0) { x = 0; vx = Math.abs(vx) }
        if (x >= AREA_W - catW) { x = AREA_W - catW; vx = -Math.abs(vx) }
        if (y <= 0) { y = 0; vy = Math.abs(vy) }
        if (y >= AREA_H - 64) { y = AREA_H - 64; vy = -Math.abs(vy) }
        const updated = { ...cat, x, y, vx, vy }
        if (catElemsRef.current[i]) {
          catElemsRef.current[i]!.style.transform = `translate(${x}px, ${y}px)`
        }
        return updated
      })
      if (remaining > 0 && !resolvedRef.current) rafRef.current = requestAnimationFrame(animate)
      else if (!resolvedRef.current) { resolvedRef.current = true; setFailed(true) }
    })
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-center">
        <h2 className="font-cormorant text-[#5A5044] font-semibold" style={{ fontSize: '1.5rem' }}>
          Adopt a Second Cat
        </h2>
        <p className="font-crimson text-[#736C62] text-base mt-1">
          The shelter was full of cats! Find the <strong>small one with the pink bow</strong> before time runs out!
        </p>
      </div>

      {/* Timer */}
      <div className="flex items-center gap-2">
        <span className="font-work-sans text-xs tracking-widest uppercase text-[#736C62]">Time:</span>
        <span
          className="font-cormorant font-bold text-xl"
          style={{ color: timeLeft <= 4 ? '#9A5F50' : '#5A5044' }}
        >
          {timeLeft}s
        </span>
      </div>

      {/* Cat arena */}
      <div
        className="relative overflow-hidden rounded-xl border-2"
        style={{
          width: '100%',
          maxWidth: AREA_W,
          height: AREA_H,
          background: 'linear-gradient(135deg, #F5EEE1 0%, #EBD2C8 100%)',
          borderColor: '#C3AF82',
        }}
      >
        {catsRef.current.map((cat, i) => (
          <div
            key={i}
            ref={el => { catElemsRef.current[i] = el }}
            className="absolute cursor-pointer select-none"
            style={{
              transform: `translate(${cat.x}px, ${cat.y}px)`,
              zIndex: cat.isTarget ? 10 : 5,
              filter: found && cat.isTarget ? 'drop-shadow(0 0 8px #856A20)' : undefined,
            }}
            onClick={() => handleCatClick(cat.isTarget)}
            role="button"
            aria-label={cat.isTarget ? 'Small cat with pink bow' : 'Big cat'}
          >
            <PixelCat small={cat.isTarget} />
          </div>
        ))}

        {found && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="text-center px-4 py-2 rounded-xl"
              style={{ background: 'rgba(133, 106, 32, 0.88)' }}
            >
              <p className="font-italiana text-white text-lg">Found her! 🐾</p>
            </div>
          </div>
        )}

        {failed && (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'rgba(90,80,68,0.5)' }}
          >
            <div className="text-center">
              <p className="font-italiana text-white text-lg mb-3">Time&apos;s up!</p>
              <button
                onClick={retry}
                className="font-work-sans tracking-widest uppercase text-xs px-5 py-2 rounded-full"
                style={{ background: '#856A20', color: '#FAF5EB', letterSpacing: '0.12em' }}
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
