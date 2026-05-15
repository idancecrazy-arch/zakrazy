'use client'

import { useEffect, useState } from 'react'
import { WEDDING_DATE } from '@/lib/constants'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeLeft(): TimeLeft {
  const now = Date.now()
  const diff = WEDDING_DATE.getTime() - now

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)

  useEffect(() => {
    setTimeLeft(getTimeLeft())
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!timeLeft) return null

  const units: { label: string; value: number }[] = [
    { label: 'Days',    value: timeLeft.days },
    { label: 'Hours',   value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ]

  return (
    <div className="flex items-center justify-center gap-4 sm:gap-8">
      {units.map(({ label, value }, i) => (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className="
                w-16 h-16 sm:w-20 sm:h-20
                border border-gold-line
                flex items-center justify-center
                font-poiret text-2xl sm:text-3xl
                text-dark-taupe tracking-widest
              "
            >
              {pad(value)}
            </div>
            <div className="mt-2 font-work-sans text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-soft-gray">
              {label}
            </div>
          </div>
          {i < units.length - 1 && (
            <span className="ml-4 sm:ml-8 font-italiana text-2xl text-pale-gold leading-none mb-4">
              ·
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
