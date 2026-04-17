'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CtaBounce() {
  const [bouncing, setBouncing] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setBouncing(true), 5000)
    return () => clearTimeout(t)
  }, [])

  return (
    <Link
      href="/rsvp"
      onClick={() => setBouncing(false)}
      className={`
        font-work-sans text-[12px] tracking-[0.25em] uppercase
        px-10 py-5 bg-gold-line text-ivory
        hover:bg-dark-taupe hover:-translate-y-0.5 hover:shadow-md
        transition-all duration-300
        ${bouncing ? 'animate-bounce' : ''}
      `}
    >
      Confirm Your Details
    </Link>
  )
}
