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

interface Submission {
  id: string
  name: string
  status: string
  submittedAt?: string
  createdTime: string
  email?: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<RSVPStats | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/rsvp-stats')
        .then((r) => {
          if (!r.ok) throw new Error('Failed to load stats')
          return r.json() as Promise<RSVPStats>
        }),
      fetch('/api/admin/submission-logs')
        .then((r) => {
          if (!r.ok) throw new Error('Failed to load submissions')
          return r.json() as Promise<{ submissions: Submission[] }>
        })
    ])
      .then(([statsData, submissionsData]) => {
        setStats(statsData)
        setSubmissions(submissionsData.submissions)
      })
      .catch(() => setError('Failed to load data. Please refresh.'))
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
            <span className="font-cormorant text-3xl text-dark-taupe tracking-wide">{value}</span>
          </div>
        ))}
      </div>

      {/* Response breakdown */}
      <div className="flex flex-col gap-4">
        <h2 className="font-cormorant text-2xl text-dark-taupe tracking-wide pb-2 border-b border-pale-gold/50">
          Response Breakdown
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Accepted', value: stats.accepted, color: 'text-dusty-lilac' },
            { label: 'Declined', value: stats.declined, color: 'text-muted-rose' },
            { label: 'Not Yet Responded', value: stats.pending, color: 'text-soft-gray' },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className={`font-cormorant text-4xl tracking-wide ${color}`}>{value}</span>
              <span className="font-work-sans text-[10px] tracking-[0.18em] uppercase text-dark-taupe/70">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Party counts */}
      <div className="flex flex-col gap-4">
        <h2 className="font-cormorant text-2xl text-dark-taupe tracking-wide pb-2 border-b border-pale-gold/50">
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
              <span className="font-cormorant text-3xl text-dark-taupe tracking-wide">{value}</span>
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
          <span className="font-cormorant text-2xl text-dark-taupe">{stats.hotelInterestCount}</span>
          <span className="font-crimson italic text-sm text-muted-rose">guests</span>
        </div>
      </div>

      {/* Dietary restrictions */}
      <div className="flex flex-col gap-4">
        <h2 className="font-cormorant text-2xl text-dark-taupe tracking-wide pb-2 border-b border-pale-gold/50">
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

      {/* Recent submissions log */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-pale-gold/50">
          <h2 className="font-cormorant text-2xl text-dark-taupe tracking-wide">
            Recent Submissions ({submissions.length})
          </h2>
          <button
            onClick={async () => {
              setRefreshing(true)
              try {
                const res = await fetch('/api/admin/submission-logs')
                if (res.ok) {
                  const data = await res.json() as { submissions: Submission[] }
                  setSubmissions(data.submissions)
                }
              } catch (e) {
                console.error('Failed to refresh:', e)
              } finally {
                setRefreshing(false)
              }
            }}
            disabled={refreshing}
            className="font-work-sans text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 border border-soft-gray/40 text-soft-gray hover:text-gold-line hover:border-gold-line transition-colors disabled:opacity-50 rounded"
            title="Refresh submissions"
          >
            {refreshing ? 'Refreshing…' : '↻ Refresh'}
          </button>
        </div>
        {submissions.length === 0 ? (
          <p className="font-crimson italic text-base text-deep-ivory">No submissions yet.</p>
        ) : (
          <div className="border border-soft-gray/20 rounded overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-pale-gold/10 border-b border-soft-gray/20">
                  <th className="text-left px-4 py-2 font-work-sans text-[10px] tracking-[0.2em] uppercase text-dark-taupe">Name</th>
                  <th className="text-left px-4 py-2 font-work-sans text-[10px] tracking-[0.2em] uppercase text-dark-taupe">Status</th>
                  <th className="text-left px-4 py-2 font-work-sans text-[10px] tracking-[0.2em] uppercase text-dark-taupe">Email</th>
                  <th className="text-left px-4 py-2 font-work-sans text-[10px] tracking-[0.2em] uppercase text-dark-taupe">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr key={sub.id} className="border-b border-soft-gray/10 hover:bg-warm-cream/30">
                    <td className="px-4 py-3 font-crimson text-dark-taupe">{sub.name}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-[10px] font-work-sans tracking-wider uppercase rounded ${
                        sub.status === 'Accepted' ? 'bg-dusty-lilac/20 text-dusty-lilac' :
                        sub.status === 'Declined' ? 'bg-muted-rose/20 text-muted-rose' :
                        'bg-soft-gray/20 text-soft-gray'
                      }`}>
                        {sub.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-crimson text-deep-ivory text-sm">{sub.email || '—'}</td>
                    <td className="px-4 py-3 font-work-sans text-[11px] text-soft-gray">
                      {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Export */}
      <div className="flex flex-col gap-3 pt-2">
        <h2 className="font-cormorant text-2xl text-dark-taupe tracking-wide pb-2 border-b border-pale-gold/50">
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
      </div>
    </div>
  )
}
