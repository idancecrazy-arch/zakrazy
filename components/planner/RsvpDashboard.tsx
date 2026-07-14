'use client'

import { useEffect, useState } from 'react'
import type { RsvpDashboard as RsvpDashboardData, HouseholdRow, HouseholdStatus } from '../../lib/rsvpDashboard'

// Read-only view of RSVP status across every invitation sent out. Pulls from the
// planner-authed /api/planner/rsvp-dashboard route, which matches individual
// guest responses back to the household they were invited under.

const STATUS_PILL: Record<HouseholdStatus, string> = {
  attending: 'bg-lilac/20 text-lilac-deep border border-lilac/40',
  declined: 'bg-muted-rose/15 text-rose-deep border border-muted-rose/40',
  awaiting: 'bg-soft-gray/15 text-ink-muted border border-soft-gray/40',
}
const STATUS_LABEL: Record<HouseholdStatus, string> = {
  attending: 'Attending',
  declined: 'Declined',
  awaiting: 'Awaiting',
}

type Filter = 'all' | HouseholdStatus

function StatCard({ label, value, sub, color = 'text-dark-taupe' }: {
  label: string
  value: string | number
  sub?: string
  color?: string
}) {
  return (
    <div className="bg-warm-cream border border-soft-gray/20 rounded px-3 py-2.5">
      <p className={`font-crimson text-2xl sm:text-3xl ${color} leading-none mb-0.5`}>{value}</p>
      <p className="font-work-sans text-[11px] tracking-[0.2em] uppercase text-ink-muted">{label}</p>
      {sub && <p className="font-crimson text-sm text-ink-muted mt-0.5">{sub}</p>}
    </div>
  )
}

function HouseholdItem({ h }: { h: HouseholdRow }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2.5 border-b border-soft-gray/15 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="font-crimson text-base text-dark-taupe truncate">{h.name}</p>
        <p className="font-work-sans text-xs tracking-wide uppercase text-ink-muted">
          {h.partySize} {h.partySize === 1 ? 'guest' : 'guests'} invited
          {h.status === 'attending' && h.acceptedCount > 0 && ` · ${h.acceptedCount} coming`}
          {h.status === 'attending' && h.childCount > 0 && ` · ${h.childCount} ${h.childCount === 1 ? 'kid' : 'kids'}`}
          {h.declinedCount > 0 && ` · ${h.declinedCount} declined`}
          {!h.hasEmail && ' · no email on file'}
        </p>
      </div>
      <span className={`flex-shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-work-sans tracking-wider uppercase ${STATUS_PILL[h.status]}`}>
        {STATUS_LABEL[h.status]}
      </span>
    </div>
  )
}

export default function RsvpDashboard() {
  const [data, setData] = useState<RsvpDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [filter, setFilter] = useState<Filter>('all')

  const load = () => {
    return fetch('/api/planner/rsvp-dashboard')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load RSVP data')
        return r.json() as Promise<RsvpDashboardData>
      })
      .then(setData)
      .catch(() => setError('Could not load RSVP data. Please refresh.'))
  }

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="font-work-sans text-xs tracking-[0.3em] uppercase text-ink-muted animate-pulse">
          Loading RSVPs…
        </p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <p className="font-crimson italic text-rose-deep">{error || 'No data.'}</p>
        <button
          onClick={() => { setError(''); setLoading(true); load().finally(() => setLoading(false)) }}
          className="font-work-sans text-xs tracking-[0.2em] uppercase px-4 py-2 border border-soft-gray/40 text-ink-muted hover:text-gold-deep hover:border-gold-line transition-colors rounded min-h-[44px]"
        >
          Retry
        </button>
      </div>
    )
  }

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: data.households.length },
    { key: 'attending', label: 'Attending', count: data.householdsAttending },
    { key: 'declined', label: 'Declined', count: data.householdsDeclined },
    { key: 'awaiting', label: 'Awaiting', count: data.householdsAwaiting },
  ]
  const visible = filter === 'all' ? data.households : data.households.filter((h) => h.status === filter)

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-work-sans text-sm tracking-[0.3em] uppercase text-gold-deep">
          RSVP Status
        </h2>
        <button
          onClick={async () => { setRefreshing(true); await load(); setRefreshing(false) }}
          disabled={refreshing}
          className="font-work-sans text-xs tracking-[0.2em] uppercase text-ink-muted hover:text-gold-deep transition-colors disabled:opacity-50"
        >
          {refreshing ? 'Refreshing…' : '↻ Refresh'}
        </button>
      </div>

      {/* Top-line household stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <StatCard label="Invites Sent" value={data.householdsInvited} sub="households" />
        <StatCard label="Responded" value={`${data.householdsResponded}`} sub={`${data.responseRate}% replied`} color="text-gold-deep" />
        <StatCard label="Attending" value={data.householdsAttending} sub="households" color="text-lilac-deep" />
        <StatCard label="Awaiting" value={data.householdsAwaiting} sub="no reply yet" color="text-rose-deep" />
      </div>

      {/* Response progress bar */}
      <div className="mb-6">
        <div className="h-2.5 w-full rounded-full bg-soft-gray/15 overflow-hidden flex">
          <div className="h-full bg-dusty-lilac" style={{ width: `${pct(data.householdsAttending, data.householdsInvited)}%` }} title="Attending" />
          <div className="h-full bg-muted-rose/70" style={{ width: `${pct(data.householdsDeclined, data.householdsInvited)}%` }} title="Declined" />
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
          <Legend color="bg-dusty-lilac" label={`Attending · ${data.householdsAttending}`} />
          <Legend color="bg-muted-rose/70" label={`Declined · ${data.householdsDeclined}`} />
          <Legend color="bg-soft-gray/25" label={`Awaiting · ${data.householdsAwaiting}`} />
        </div>
      </div>

      {/* Guest head counts */}
      <div className="grid grid-cols-3 gap-3 mb-4 bg-warm-cream border border-soft-gray/20 rounded-lg p-4">
        <div>
          <p className="font-work-sans text-[11px] tracking-[0.2em] uppercase text-ink-muted mb-1">Guests Coming</p>
          <p className="font-crimson text-xl sm:text-2xl text-lilac-deep leading-none">{data.acceptedGuests}</p>
        </div>
        <div>
          <p className="font-work-sans text-[11px] tracking-[0.2em] uppercase text-ink-muted mb-1">Declined</p>
          <p className="font-crimson text-xl sm:text-2xl text-rose-deep leading-none">{data.declinedGuests}</p>
        </div>
        <div>
          <p className="font-work-sans text-[11px] tracking-[0.2em] uppercase text-ink-muted mb-1">Guests Invited</p>
          <p className="font-crimson text-xl sm:text-2xl text-dark-taupe leading-none">{data.invitedGuests}</p>
        </div>
      </div>

      {/* Confirmed head count: adults, kids, and the grand total for the caterer */}
      <div className="grid grid-cols-3 gap-3 mb-7 bg-warm-cream border border-soft-gray/20 rounded-lg p-4">
        <div>
          <p className="font-work-sans text-[11px] tracking-[0.2em] uppercase text-ink-muted mb-1">Accepted Adults</p>
          <p className="font-crimson text-xl sm:text-2xl text-lilac-deep leading-none">{data.acceptedAdults}</p>
          <p className="font-crimson text-sm text-ink-muted mt-0.5">guests &amp; plus ones</p>
        </div>
        <div>
          <p className="font-work-sans text-[11px] tracking-[0.2em] uppercase text-ink-muted mb-1">Kids</p>
          <p className="font-crimson text-xl sm:text-2xl text-lilac-deep leading-none">{data.acceptedKids}</p>
          <p className="font-crimson text-sm text-ink-muted mt-0.5">children joining</p>
        </div>
        <div>
          <p className="font-work-sans text-[11px] tracking-[0.2em] uppercase text-ink-muted mb-1">Total Guests</p>
          <p className="font-crimson text-xl sm:text-2xl text-gold-deep leading-none">{data.acceptedTotalGuests}</p>
          <p className="font-crimson text-sm text-ink-muted mt-0.5">adults &amp; kids</p>
        </div>
      </div>

      {/* Awaiting follow-up — the actionable list */}
      {data.awaiting.length > 0 && (
        <div className="mb-7">
          <h3 className="font-work-sans text-xs tracking-[0.25em] uppercase text-deep-ivory mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-muted-rose inline-block" />
            Still Awaiting a Reply ({data.awaiting.length})
          </h3>
          <div className="border border-soft-gray/20 rounded-lg overflow-hidden bg-ivory">
            {data.awaiting.map((h) => (
              <div key={h.name} className="flex items-center gap-2 px-3 py-2.5 border-b border-soft-gray/15 last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="font-crimson text-base text-dark-taupe truncate">{h.name}</p>
                  <p className="font-work-sans text-xs tracking-wide uppercase text-ink-muted">
                    {h.partySize} {h.partySize === 1 ? 'guest' : 'guests'}
                  </p>
                </div>
                {h.hasEmail ? (
                  <a href={`mailto:${h.email}`} className="font-crimson text-sm text-gold-deep underline underline-offset-2 truncate max-w-[45%] flex-shrink-0">
                    {h.email}
                  </a>
                ) : (
                  <span className="font-work-sans text-[11px] tracking-wider uppercase text-rose-deep flex-shrink-0">no email</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full household list with status filter */}
      <div className="mb-7">
        <h3 className="font-work-sans text-xs tracking-[0.25em] uppercase text-deep-ivory mb-3">
          Every Invitation
        </h3>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`font-work-sans text-xs tracking-[0.15em] uppercase px-2.5 py-1.5 border rounded-full transition-colors min-h-[44px] ${
                filter === f.key
                  ? 'bg-dark-taupe text-ivory border-dark-taupe'
                  : 'bg-transparent text-deep-ivory border-soft-gray/40 hover:border-gold-line'
              }`}
            >
              {f.label} <span className="opacity-60">{f.count}</span>
            </button>
          ))}
        </div>
        <div className="border border-soft-gray/20 rounded-lg overflow-hidden bg-ivory">
          {visible.length === 0 ? (
            <p className="font-crimson italic text-sm text-ink-muted px-3 py-4 text-center">None in this group.</p>
          ) : (
            visible.map((h) => <HouseholdItem key={h.name} h={h} />)
          )}
        </div>
      </div>

      {/* Missing email — can't be chased by email */}
      {data.invitesMissingEmail.length > 0 && (
        <div className="mb-7">
          <h3 className="font-work-sans text-xs tracking-[0.25em] uppercase text-deep-ivory mb-2">
            No Email on File ({data.invitesMissingEmail.length})
          </h3>
          <p className="font-crimson italic text-sm text-ink-muted mb-2">
            These invites cannot be followed up by email. Reach out another way.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {data.invitesMissingEmail.map((h) => (
              <span key={h.name} className="font-work-sans text-xs tracking-wide uppercase px-2.5 py-1.5 border border-muted-rose/30 text-rose-deep rounded-full">
                {h.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Unmatched responses — surfaced so nothing is silently dropped */}
      {data.unmatchedResponses.length > 0 && (
        <div className="mb-7">
          <h3 className="font-work-sans text-xs tracking-[0.25em] uppercase text-deep-ivory mb-2">
            Replies Without a Matching Invite ({data.unmatchedResponses.length})
          </h3>
          <p className="font-crimson italic text-sm text-ink-muted mb-2">
            These RSVPs did not match any name on the guest list. Check for typos or add them.
          </p>
          <div className="border border-soft-gray/20 rounded-lg overflow-hidden bg-ivory">
            {data.unmatchedResponses.map((r, i) => (
              <div key={`${r.guestName}-${i}`} className="flex items-center justify-between gap-2 px-3 py-2 border-b border-soft-gray/15 last:border-0">
                <span className="font-crimson text-base text-dark-taupe truncate">{r.guestName || '(no name)'}</span>
                <span className="font-work-sans text-xs tracking-wider uppercase text-ink-muted flex-shrink-0">{r.status || 'pending'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dietary notes from attending guests */}
      {data.dietary.length > 0 && (
        <div>
          <h3 className="font-work-sans text-xs tracking-[0.25em] uppercase text-deep-ivory mb-2">
            Dietary Notes ({data.dietary.length})
          </h3>
          <ul className="space-y-1.5">
            {data.dietary.map((line, i) => (
              <li key={i} className="font-crimson text-base text-dark-taupe/85 leading-snug">{line}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-work-sans text-xs tracking-wide uppercase text-ink-muted">
      <span className={`w-2 h-2 rounded-full ${color} inline-block`} />
      {label}
    </span>
  )
}

function pct(n: number, total: number): number {
  return total > 0 ? (n / total) * 100 : 0
}
