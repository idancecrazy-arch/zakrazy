'use client'

import { useState, useRef } from 'react'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/planner-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError((data as { error?: string }).error ?? 'Incorrect access code')
        setPassword('')
        setLoading(false)
        setTimeout(() => inputRef.current?.focus(), 50)
        return
      }

      window.location.replace('/admin')
    } catch {
      setError('Something went wrong. Please try again.')
      setPassword('')
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  return (
    <div className="min-h-screen bg-warm-cream flex items-center justify-center px-6">
      <div className="w-full max-w-xs">
        <div className="mb-10 text-center">
          <div className="inline-block mb-6">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect x="6" y="14" width="20" height="14" rx="2" stroke="#C3AF82" strokeWidth="1.5" fill="none" />
              <path d="M11 14V10a5 5 0 0 1 10 0v4" stroke="#C3AF82" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <circle cx="16" cy="21" r="2" fill="#C3AF82" />
            </svg>
          </div>
          <p className="font-work-sans text-[10px] tracking-[0.35em] uppercase text-soft-gray">
            RSVP Dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="access code"
            autoComplete="off"
            autoFocus
            disabled={loading}
            className="
              w-full bg-transparent border-b border-gold-line
              px-0 py-3
              font-crimson text-xl text-dark-taupe text-center
              placeholder:text-soft-gray/50
              focus:border-dark-taupe
              disabled:opacity-50
              transition-colors duration-200
              tracking-widest
            "
          />

          {error && (
            <p className="font-lora italic text-sm text-muted-rose text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password.trim()}
            className="
              mt-1 font-work-sans text-[11px] tracking-[0.25em] uppercase
              px-10 py-4 bg-gold-line text-ivory
              hover:bg-dark-taupe hover:-translate-y-0.5 hover:shadow-md
              disabled:opacity-50 disabled:cursor-not-allowed
              disabled:hover:translate-y-0 disabled:hover:shadow-none
              transition-all duration-300
            "
          >
            {loading ? 'Verifying…' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  )
}
