'use client'

import { useEffect, useRef, useState } from 'react'
import PixelCat from '../PixelCat'

const TRACK_WIDTH = 480
const BOOK_COUNT = 7
const CAT_SPEED = 2.2  // px per frame
const CAT_WIDTH = 96   // pixel cat natural width

const BOOK_XS = Array.from(
  { length: BOOK_COUNT },
  (_, i) => 40 + i * ((TRACK_WIDTH - 80) / (BOOK_COUNT - 1))
)

interface LawSchoolSceneProps {
  onComplete: () => void
}

export default function LawSchoolScene({ onComplete }: LawSchoolSceneProps) {
  const [catX, setCatX] = useState(-CAT_WIDTH)
  const [eaten, setEaten] = useState<boolean[]>(Array(BOOK_COUNT).fill(false))
  const [mouthOpen, setMouthOpen] = useState(false)
  const [done, setDone] = useState(false)
  const rafRef = useRef<number | null>(null)
  const catXRef = useRef(-CAT_WIDTH)
  const eatenRef = useRef<boolean[]>(Array(BOOK_COUNT).fill(false))
  const frameRef = useRef(0)
  const completedRef = useRef(false)

  useEffect(() => {
    const animate = () => {
      frameRef.current++
      catXRef.current += CAT_SPEED
      const newX = catXRef.current

      // Toggle mouth every 8 frames
      setMouthOpen(Math.floor(frameRef.current / 8) % 2 === 0)

      // Check which books are eaten
      const nextEaten = [...eatenRef.current]
      let changed = false
      BOOK_XS.forEach((bx, i) => {
        if (!nextEaten[i] && newX + CAT_WIDTH * 0.6 >= bx) {
          nextEaten[i] = true
          changed = true
        }
      })
      if (changed) {
        eatenRef.current = nextEaten
        setEaten([...nextEaten])
      }

      setCatX(newX)

      // Complete when cat exits right side
      if (newX > TRACK_WIDTH + 20 && !completedRef.current) {
        completedRef.current = true
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
      const t = setTimeout(onComplete, 800)
      return () => clearTimeout(t)
    }
  }, [done, onComplete])

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-center">
        <h2 className="font-cormorant text-[#5A5044] font-semibold" style={{ fontSize: '1.5rem' }}>
          Law School
        </h2>
        <p className="font-crimson text-[#736C62] text-base mt-1">
          Christine &amp; Michael both enrolled in law school.
          <br />
          <em>Eat all the law books to pass!</em>
        </p>
      </div>

      {/* Game track */}
      <div
        className="relative overflow-hidden rounded-xl border-2"
        style={{
          width: '100%',
          maxWidth: TRACK_WIDTH,
          height: 90,
          background: 'linear-gradient(to bottom, #EBD2C8 0%, #F5EEE1 100%)',
          borderColor: '#C3AF82',
        }}
      >
        {/* Books */}
        {BOOK_XS.map((bx, i) => (
          <div
            key={i}
            className="absolute flex flex-col items-center"
            style={{
              left: bx - 12,
              top: 18,
              opacity: eaten[i] ? 0 : 1,
              transition: 'opacity 0.15s',
            }}
          >
            {/* Book spine */}
            <div
              className="rounded-sm flex items-center justify-center"
              style={{
                width: 16,
                height: 44,
                background: i % 3 === 0 ? '#766588' : i % 3 === 1 ? '#856A20' : '#9A5F50',
                boxShadow: '2px 2px 0 rgba(0,0,0,0.2)',
              }}
            >
              <span style={{ fontSize: 10, color: '#FAF5EB', fontFamily: 'serif', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>LAW</span>
            </div>
          </div>
        ))}

        {/* Pixel cat */}
        <div
          className="absolute"
          style={{
            left: catX,
            top: 14,
            transition: 'none',
          }}
        >
          <PixelCat accessory="cap" mouthOpen={mouthOpen} />
        </div>

        {/* Floor line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: '#C3AF82' }}
        />
      </div>

      {done && (
        <p className="font-cormorant text-[#856A20] font-semibold text-xl animate-pulse">
          📚 Bar exam: aced!
        </p>
      )}
    </div>
  )
}
