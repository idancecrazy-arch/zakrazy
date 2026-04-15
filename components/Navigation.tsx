'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { COUPLE } from '@/lib/constants'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/rsvp', label: 'RSVP' },
  { href: '/our-story', label: 'Our Story' },
  { href: '/ceremony', label: 'Ceremony' },
  { href: '/reception', label: 'Reception' },
  { href: '/travel', label: 'Travel' },
  { href: '/registry', label: 'Registry' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <>
      <nav
        className={`
          fixed top-0 inset-x-0 z-50
          transition-all duration-500
          ${scrolled || menuOpen ? 'bg-ivory shadow-sm' : 'bg-transparent'}
        `}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Names / logo */}
          <Link
            href="/"
            className="font-italiana text-xl text-dark-taupe tracking-wide hover:text-dusty-lilac transition-colors duration-300"
          >
            {COUPLE.partner1.first} <span className="text-gold-line font-crimson italic text-base">+</span> {COUPLE.partner2.first}
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-7">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`
                      font-work-sans text-[11px] tracking-[0.18em] uppercase
                      transition-colors duration-300 relative pb-0.5
                      ${active ? 'text-dusty-lilac' : 'text-dark-taupe hover:text-dusty-lilac'}
                    `}
                  >
                    {label}
                    {active && (
                      <span className="absolute bottom-0 left-0 right-0 h-px bg-gold-line" />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span
              className={`block w-6 h-px bg-dark-taupe transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2.5' : ''}`}
            />
            <span
              className={`block w-6 h-px bg-dark-taupe transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}
            />
            <span
              className={`block w-6 h-px bg-dark-taupe transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}
            />
          </button>
        </div>

        {/* Thin gold rule under nav when scrolled */}
        {scrolled && (
          <div className="h-px bg-pale-gold opacity-60" />
        )}
      </nav>

      {/* Mobile slide-in menu */}
      <div
        className={`
          fixed inset-0 z-40 bg-ivory flex flex-col items-center justify-center
          transition-all duration-400 md:hidden
          ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      >
        <ul className="flex flex-col items-center gap-8">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`
                    font-italiana text-3xl tracking-wide
                    ${active ? 'text-dusty-lilac' : 'text-dark-taupe'}
                  `}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}
