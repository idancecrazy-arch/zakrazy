'use client'

import { useEffect, useState } from 'react'

interface RSVPStats {
  totalInvited: number
  rsvpReceived: number
  accepted: number
  declined: number
  pending: number
  totalHeads: number
  plusOnes: number
  totalChildren: number
  highChairCount: number
  hotelInterestCount: number
  dietaryList: string[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<RSVPStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/rsvp-stats')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load')
        return r.json() as Promise<RSVPStats>
      })
      .then(setStats)
      .catch(() => setError('Failed to load RSVP data. Please refresh.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="font-work-sans text-[11px] tracking-[0.2em] uppercase text-soft-gray">
          Loading…
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="font-crimson italic text-muted-rose">{error}</p>
      </div>
    )
  }

  if (!stats) return null

  const responseRate = stats.totalInvited > 0
    ? Math.round((stats.rsvpReceived / stats.totalInvited) * 100)
    : 0

  return (
    <div className="flex flex-col gap-10">
      {/* Top stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Invited', value: stats.totalInvited },
          { label: 'RSVPs In', value: `${stats.rsvpReceived} (${responseRate}%)` },
          { label: 'Pending', value: stats.pending },
          { label: 'Total Heads', value: stats.totalHeads },
        ].map(({ label, value }) => (
          <div key={label} className="bg-warm-cream/60 border border-pale-gold/40 p-5 flex flex-col gap-1">
            <span className="font-work-sans text-[10px] tracking-[0.2em] uppercase text-soft-gray">
              {label}
            </span>
            <span className="font-italiana text-3xl text-dark-taupe tracking-wide">{value}</span>
          </div>
        ))}
      </div>

      {/* Response breakdown */}
      <div className="flex flex-col gap-4">
        <h2 className="font-italiana text-2xl text-dark-taupe tracking-wide pb-2 border-b border-pale-gold/50">
          Response Breakdown
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Accepted', value: stats.accepted, color: 'text-dusty-lilac' },
            { label: 'Declined', value: stats.declined, color: 'text-muted-rose' },
            { label: 'Not Yet Responded', value: stats.pending, color: 'text-soft-gray' },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className={`font-italiana text-4xl tracking-wide ${color}`}>{value}</span>
              <span className="font-work-sans text-[10px] tracking-[0.18em] uppercase text-dark-taupe/70">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Party counts */}
      <div className="flex flex-col gap-4">
        <h2 className="font-italiana text-2xl text-dark-taupe tracking-wide pb-2 border-b border-pale-gold/50">
          Guest Counts
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Accepted Guests', value: stats.accepted },
            { label: 'Plus Ones', value: stats.plusOnes },
            { label: 'Children', value: stats.totalChildren },
            { label: 'High Chairs', value: stats.highChairCount },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="font-italiana text-3xl text-dark-taupe tracking-wide">{value}</span>
              <span className="font-work-sans text-[10px] tracking-[0.18em] uppercase text-dark-taupe/70">
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-2">
          <span className="font-work-sans text-[10px] tracking-[0.18em] uppercase text-dark-taupe/70">
            Hotel Interest:
          </span>
          <span className="font-italiana text-2xl text-dark-taupe">{stats.hotelInterestCount}</span>
          <span className="font-crimson italic text-sm text-muted-rose">guests</span>
        </div>
      </div>

      {/* Dietary restrictions */}
      <div className="flex flex-col gap-4">
        <h2 className="font-italiana text-2xl text-dark-taupe tracking-wide pb-2 border-b border-pale-gold/50">
          Dietary Restrictions ({stats.dietaryList.length})
        </h2>
        {stats.dietaryList.length === 0 ? (
          <p className="font-crimson italic text-base text-deep-ivory">None reported yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {stats.dietaryList.map((item, i) => (
              <li key={i} className="font-crimson text-base text-dark-taupe/85 leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Export */}
      <div className="flex flex-col gap-3 pt-2">
        <h2 className="font-italiana text-2xl text-dark-taupe tracking-wide pb-2 border-b border-pale-gold/50">
          Export
        </h2>
        <p className="font-crimson text-base text-dark-taupe/80">
          Download a full CSV of all guest RSVP data from Airtable.
        </p>
        <a
          href="/api/admin/export-rsvp"
          className="self-start font-work-sans text-[11px] tracking-[0.18em] uppercase px-8 py-4 min-h-[52px] flex items-center border border-gold-line text-dark-taupe hover:bg-blush transition-colors duration-200"
        >
          Download CSV
        </a>
        <p className="font-crimson italic text-xs text-deep-ivory">
          Note: The CSV export uses the Submissions table. Ensure ADMIN_SECRET is set for the export endpoint.
        </p>
      </div>
    </div>
  )
}
