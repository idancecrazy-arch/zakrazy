'use client'

import { useState, useEffect, useRef } from 'react'

export interface GuestRecord {
  id: string
  name: string
  plusOneAllowed: boolean
  partySize: number
}

interface GuestSelectorProps {
  onSelect: (guest: GuestRecord) => void
  onClear: () => void
  selected: GuestRecord | null
  error?: string
}

const inputClass =
  'w-full bg-ivory border border-gold-line/60 px-4 py-3.5 min-h-[48px] font-crimson text-base sm:text-lg text-dark-taupe placeholder:text-ink-muted focus:border-gold-line focus:outline-none transition-colors duration-200'

export default function GuestSelector({ onSelect, onClear, selected, error }: GuestSelectorProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GuestRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [apiError, setApiError] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setOpen(false)
      return
    }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/rsvp/guests?search=${encodeURIComponent(query)}`)
        if (!res.ok) {
          setResults([])
          setApiError(true)
          setOpen(true)
          return
        }
        setApiError(false)
        const data = await res.json() as { records?: GuestRecord[] }
        setResults(data.records ?? [])
        setOpen(true)
      } catch {
        setResults([])
        setApiError(true)
        setOpen(true)
      } finally {
        setLoading(false)
      }
    }, 300)
  }, [query])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  if (selected) {
    return (
      <div className="flex items-center justify-between gap-4 bg-warm-cream/60 border border-pale-gold/50 px-4 py-3.5 min-h-[48px]">
        <span className="font-crimson text-base sm:text-lg text-dark-taupe">{selected.name}</span>
        <button
          type="button"
          onClick={() => { onClear(); setQuery('') }}
          className="font-work-sans text-[12px] tracking-[0.15em] uppercase text-rose-deep hover:text-dark-taupe transition-colors duration-200 flex-shrink-0"
        >
          Change
        </button>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative flex flex-col gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Start typing your name…"
        autoComplete="off"
        className={inputClass}
      />
      {error && <p className="font-crimson italic text-sm text-rose-deep">{error}</p>}

      {open && (
        <div className="absolute top-full left-0 right-0 z-20 bg-warm-cream border border-pale-gold/60 shadow-md mt-0.5 max-h-56 overflow-y-auto">
          {loading && (
            <p className="font-crimson italic text-sm text-dark-taupe/90 px-4 py-3">Searching…</p>
          )}
          {!loading && apiError && (
            <div className="px-4 py-4 flex flex-col gap-1">
              <p className="font-crimson text-base text-dark-taupe/90">Something went wrong searching the guest list.</p>
              <p className="font-crimson italic text-sm text-rose-deep">
                Please try again or{' '}
                <a href="mailto:christineandmichaelzak@gmail.com" className="underline hover:text-dark-taupe">
                  contact us
                </a>{' '}
                for help.
              </p>
            </div>
          )}
          {!loading && !apiError && results.length === 0 && (
            <div className="px-4 py-4 flex flex-col gap-1">
              <p className="font-crimson text-base text-dark-taupe/90">No match found for &ldquo;{query}&rdquo;.</p>
              <p className="font-crimson italic text-sm text-rose-deep">
                Please double-check your spelling or{' '}
                <a href="mailto:christineandmichaelzak@gmail.com" className="underline hover:text-dark-taupe">
                  contact us
                </a>{' '}
                for help.
              </p>
            </div>
          )}
          {!loading && !apiError && results.map((guest) => (
            <button
              key={guest.id}
              type="button"
              className="w-full text-left px-4 py-3 font-crimson text-base text-dark-taupe hover:bg-blush/50 transition-colors duration-150 min-h-[44px]"
              onClick={() => { onSelect(guest); setOpen(false) }}
            >
              {guest.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
