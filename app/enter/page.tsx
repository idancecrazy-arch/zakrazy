'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import BackgammonBoard from '@/components/BackgammonBoard'

type Stage =
  | { name: 'idle' }
  | { name: 'loading' }
  | { name: 'success'; type: 'text' | 'board'; message: string }
  | { name: 'error'; message: string }

function EnterForm() {
  const searchParams = useSearchParams()
  const rawFrom = searchParams.get('from') ?? '/'
  // Sanitize to prevent open redirect
  const from = rawFrom.startsWith('/') && !rawFrom.startsWith('//') ? rawFrom : '/'

  const [password, setPassword] = useState('')
  const [stage, setStage] = useState<Stage>({ name: 'idle' })
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (stage.name !== 'success') return
    // Use window.location to force a full request so the middleware sees the new auth cookie.
    // router.push does a soft navigation that can use prefetched/cached payloads from before
    // the cookie was set, causing the middleware to redirect back to /enter.
    const t = setTimeout(() => { window.location.replace(from) }, 3000)
    return () => clearTimeout(t)
  }, [stage, from])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) return
    setStage({ name: 'loading' })

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setStage({ name: 'error', message: (data as { error?: string }).error ?? 'Incorrect password' })
        setPassword('')
        setTimeout(() => inputRef.current?.focus(), 50)
        return
      }

      const data = await res.json() as { type: 'text' | 'board'; message: string }
      setStage({ name: 'success', type: data.type, message: data.message })
    } catch {
      setStage({ name: 'error', message: 'Something went wrong. Please try again.' })
      setPassword('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  const handleContinue = () => { window.location.replace(from) }

  const showForm = stage.name === 'idle' || stage.name === 'loading' || stage.name === 'error'

  return (
    <div className="fixed inset-0 z-[9999] bg-ivory flex flex-col items-center justify-center px-6">
      {/* Subtle background wisp */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <path d="M 0 200 C 200 100, 400 300, 800 150" stroke="#C3AF82" strokeWidth="80" fill="none" />
        <path d="M 0 400 C 300 250, 500 450, 800 350" stroke="#C3AF82" strokeWidth="60" fill="none" />
        <path d="M 0 550 C 250 480, 550 520, 800 480" stroke="#C3AF82" strokeWidth="40" fill="none" />
      </svg>

      {/* Password form */}
      {showForm && (
        <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-sm">
          <h1 className="font-italiana text-5xl sm:text-6xl text-dark-taupe tracking-wide text-center leading-tight">
            Christine &amp; Michael
          </h1>

          <p className="font-lora italic text-base text-deep-ivory text-center">
            Enter the password to continue
          </p>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <input
              ref={inputRef}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="password"
              autoComplete="off"
              autoFocus
              disabled={stage.name === 'loading'}
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

            {stage.name === 'error' && (
              <p className="font-lora italic text-sm text-muted-rose text-center">
                {stage.message}
              </p>
            )}

            <button
              type="submit"
              disabled={stage.name === 'loading' || !password.trim()}
              className="
                mt-2 font-work-sans text-[11px] tracking-[0.25em] uppercase
                px-10 py-4 bg-gold-line text-ivory
                hover:bg-dark-taupe hover:-translate-y-0.5 hover:shadow-md
                disabled:opacity-50 disabled:cursor-not-allowed
                disabled:hover:translate-y-0 disabled:hover:shadow-none
                transition-all duration-300
              "
            >
              {stage.name === 'loading' ? 'Entering…' : 'Enter'}
            </button>
          </form>

        </div>
      )}

      {/* Success: text response */}
      {stage.name === 'success' && stage.type === 'text' && (
        <div className="relative z-10 flex flex-col items-center gap-10 text-center">
          <p className="font-italiana text-7xl sm:text-8xl md:text-9xl text-dark-taupe tracking-wide">
            {stage.message}
          </p>

          <button
            onClick={handleContinue}
            className="
              font-work-sans text-[11px] tracking-[0.25em] uppercase
              px-10 py-4 border border-gold-line text-dark-taupe
              hover:bg-blush hover:border-shell-pink
              transition-all duration-300
            "
          >
            Continue
          </button>

          <p className="font-lora italic text-sm text-soft-gray">
            Redirecting in a moment…
          </p>
        </div>
      )}

      {/* Success: backgammon board */}
      {stage.name === 'success' && stage.type === 'board' && (
        <div className="relative z-10 flex flex-col items-center gap-8 text-center w-full max-w-xl">
          <BackgammonBoard />

          <button
            onClick={handleContinue}
            className="
              font-work-sans text-[11px] tracking-[0.25em] uppercase
              px-10 py-4 border border-gold-line text-dark-taupe
              hover:bg-blush hover:border-shell-pink
              transition-all duration-300
            "
          >
            Continue
          </button>

          <p className="font-lora italic text-sm text-soft-gray">
            Redirecting in a moment…
          </p>
        </div>
      )}
    </div>
  )
}

export default function EnterPage() {
  return (
    <Suspense>
      <EnterForm />
    </Suspense>
  )
}
