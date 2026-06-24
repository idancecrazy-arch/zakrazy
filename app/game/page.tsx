import type { Metadata } from 'next'
import WeddingGame from '@/components/game/WeddingGame'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'The Story of Christine & Michael',
  description: 'An interactive pixel-cat game celebrating the milestones of our love story.',
}

export default function GamePage() {
  return (
    <main className="min-h-screen py-12 px-4" style={{ background: '#F5EEE1' }}>
      <div className="max-w-2xl mx-auto">
        {/* Back link */}
        <div className="mb-6">
          <Link
            href="/"
            className="font-work-sans text-xs tracking-widest uppercase hover:underline"
            style={{ color: '#736C62', letterSpacing: '0.15em' }}
          >
            ← Back
          </Link>
        </div>

        <WeddingGame />

        <p className="text-center font-crimson mt-8 text-sm" style={{ color: '#736C62' }}>
          Made with love for our wedding guests ♡
        </p>
      </div>
    </main>
  )
}
