'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export interface SelectedGuest {
  id: string
  name: string
  email: string
  phone: string
  rsvpStatus: string
  plusOneAllowed: boolean
}

interface GuestSelectorProps {
  onSelect: (guest: SelectedGuest) => void
  selectedGuest: SelectedGuest | null
}

const inputClass =
  'w-full bg-ivory border border-gold-line/60 px-4 py-3.5 min-h-[48px] font-crimson text-base sm:text-lg text-dark-taupe placeholder:text-soft-gray focus:border-gold-line focus:ring-0 transition-colors duration-200'

export default function GuestSelector({ onSelect, selectedGuest }: GuestSelectorProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SelectedGuest[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([])
      setOpen(false)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/rsvp/guests?search=${encodeURIComponent(q)}`)
      if (!res.ok) throw new Error('Search failed')
      const data = (await res.json()) as { records: SelectedGuest[] }
      setResults(data.records)
      setOpen(data.records.length > 0)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(query), 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, search])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (guest: SelectedGuest) => {
    onSelect(guest)
    setQuery('')
    setOpen(false)
    setResults([])
  }

  const handleClear = () => {
    onSelect({ id: '', name: '', email: '', phone: '', rsvpStatus: '', plusOneAllowed: false })
    setQuery('')
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  if (selectedGuest?.id) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between bg-warm-cream/60 border border-gold-line/40 px-4 py-3.5">
          <span className="font-crimson text-lg text-dark-taupe">{selectedGuest.name}</span>
          <button
            type="button"
            onClick={handleClear}
            className="font-work-sans text-[10px] tracking-[0.15em] uppercase text-muted-rose hover:text-dark-taupe transition-colors duration-200 ml-4"
            aria-label="Change guest selection"
          >
            Change
          </button>
        </div>
        {selectedGuest.rsvpStatus && (
          <p className="font-crimson italic text-sm text-deep-ivory">
            Current status:{' '}
            <span className={
              selectedGuest.rsvpStatus === 'Accepted'
                ? 'text-dusty-lilac'
                : selectedGuest.rsvpStatus === 'Declined'
                ? 'text-muted-rose'
                : 'text-soft-gray'
            }>
              {selectedGuest.rsvpStatus}
            </span>
          </p>
        )}
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Begin typing your name…"
          autoComplete="off"
          aria-label="Search for your name"
          aria-expanded={open}
          aria-haspopup="listbox"
          className={inputClass}
        />
        {loading && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-work-sans text-[10px] tracking-[0.15em] uppercase text-soft-gray">
            Searching…
          </span>
        )}
      </div>

      {open && results.length > 0 && (
        <ul
          role="listbox"
          aria-label="Guest search results"
          className="absolute z-20 top-full left-0 right-0 mt-1 bg-warm-cream border border-gold-line/40 shadow-md max-h-60 overflow-y-auto"
        >
          {results.map((guest) => (
            <li key={guest.id} role="option" aria-selected={false}>
              <button
                type="button"
                onClick={() => handleSelect(guest)}
                className="w-full text-left px-4 py-3 font-crimson text-base text-dark-taupe hover:bg-blush/40 transition-colors duration-150 min-h-[44px]"
              >
                {guest.name}
              </button>
            </li>
          ))}
        </ul>
      )}

      {!loading && query.length >= 2 && results.length === 0 && !open && (
        <p className="mt-2 font-crimson italic text-sm text-muted-rose">
          No guests found. Please check your spelling or contact us at{' '}
          <a href="mailto:christineandmichaelzak@gmail.com" className="underline">
            christineandmichaelzak@gmail.com
          </a>
          .
        </p>
      )}
    </div>
  )
}
