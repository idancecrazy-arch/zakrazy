// Cross-references the two Airtable tables behind the wedding site:
//   Table 1 (invites)   — one row per invited household ("Zach & Mindy")
//   Table 2 (responses) — one row per guest who submitted an RSVP ("Zach")
//
// The site collects RSVPs as individual people while invitations go out per
// household, so producing an "RSVP status of invites sent out" view means
// matching response rows back to the household they belong to and flagging the
// households that have not replied yet. This module is a pure function so the
// matching can be unit tested without hitting Airtable.

export type Invite = {
  name: string
  partySize: number
  plusOneAllowed: boolean
  email?: string
  hasEmail: boolean
}

export type RsvpResponse = {
  guestName: string
  status: string // "Accepted" | "Declined" | anything else counts as pending
  primaryGuest?: string
  submittedAt?: string
  dietary?: string
  childrenCount?: number // kids attached to this row (stored on the primary guest)
}

export type HouseholdStatus = 'attending' | 'declined' | 'awaiting'

export type HouseholdRow = {
  name: string
  partySize: number
  hasEmail: boolean
  email?: string
  status: HouseholdStatus
  acceptedCount: number
  declinedCount: number
  childCount: number // kids joining from this household
}

export type RsvpDashboard = {
  // Household-level (based on invites sent out)
  householdsInvited: number
  householdsResponded: number
  householdsAwaiting: number
  householdsAttending: number
  householdsDeclined: number
  responseRate: number // 0-100, share of invited households that replied
  // Guest-level head counts
  invitedGuests: number // sum of party sizes across all invites
  acceptedGuests: number
  declinedGuests: number
  // Accepted head count, split by adult vs child
  acceptedAdults: number // accepted response rows: named guests and plus ones
  acceptedKids: number // children joining, from attending households
  acceptedTotalGuests: number // acceptedAdults + acceptedKids
  // Follow-up helpers
  households: HouseholdRow[] // every invite, sorted by status then name
  awaiting: HouseholdRow[] // invites with no reply yet
  invitesMissingEmail: HouseholdRow[] // can't be chased by email
  unmatchedResponses: { guestName: string; status: string }[] // replies with no invite match
  dietary: string[] // "Name: restriction" lines from attending guests
}

function normalize(s: string | undefined | null): string {
  return (s ?? '').replace(/\s+/g, ' ').trim().toLowerCase()
}

// "Zach & Mindy" -> ["zach", "mindy"];  "Nikki & John Cary" -> ["nikki", "john cary"]
function householdMembers(name: string): string[] {
  return name
    .split(/\s*&\s*|\s+and\s+|\s*,\s*/i)
    .map((p) => normalize(p))
    .filter(Boolean)
}

function isAccepted(status: string): boolean {
  return normalize(status) === 'accepted'
}
function isDeclined(status: string): boolean {
  return normalize(status) === 'declined'
}

// Keep the most recent response per person: the RSVP form lets guests resubmit,
// producing duplicate rows for the same name that would otherwise be double
// counted. Latest submission wins.
function dedupeResponses(responses: RsvpResponse[]): RsvpResponse[] {
  const byName = new Map<string, RsvpResponse>()
  for (const r of responses) {
    const key = normalize(r.guestName)
    if (!key) continue
    const existing = byName.get(key)
    if (!existing) {
      byName.set(key, r)
      continue
    }
    const a = r.submittedAt ?? ''
    const b = existing.submittedAt ?? ''
    if (a >= b) byName.set(key, r)
  }
  return Array.from(byName.values())
}

// Find the invite index a response belongs to, or -1. Matches a response's own
// name or its linked primary guest against each household's member names.
function matchInviteIndex(response: RsvpResponse, memberSets: string[][]): number {
  const candidates = [normalize(response.guestName), normalize(response.primaryGuest)].filter(Boolean)
  if (candidates.length === 0) return -1
  // Prefer an exact member-name match.
  for (let i = 0; i < memberSets.length; i++) {
    if (memberSets[i].some((m) => candidates.includes(m))) return i
  }
  // Fall back to a containment match ("john" in a household member "john cary").
  for (let i = 0; i < memberSets.length; i++) {
    if (memberSets[i].some((m) => candidates.some((c) => m.includes(c) || c.includes(m)))) return i
  }
  return -1
}

const STATUS_ORDER: Record<HouseholdStatus, number> = { awaiting: 0, attending: 1, declined: 2 }

export function buildDashboard(invites: Invite[], responsesRaw: RsvpResponse[]): RsvpDashboard {
  const responses = dedupeResponses(responsesRaw)
  const memberSets = invites.map((inv) => householdMembers(inv.name))

  // Bucket responses by matched household.
  const matched: RsvpResponse[][] = invites.map(() => [])
  const unmatchedResponses: { guestName: string; status: string }[] = []
  for (const r of responses) {
    const idx = matchInviteIndex(r, memberSets)
    if (idx === -1) unmatchedResponses.push({ guestName: r.guestName.trim(), status: r.status })
    else matched[idx].push(r)
  }

  const households: HouseholdRow[] = invites.map((inv, i) => {
    const rs = matched[i]
    const acceptedCount = rs.filter((r) => isAccepted(r.status)).length
    const declinedCount = rs.filter((r) => isDeclined(r.status)).length
    // Kids are recorded on the primary guest's row and only saved when the party
    // is attending, so summing across the household's rows gives its child count.
    const childCount = rs.reduce((sum, r) => sum + (r.childrenCount || 0), 0)
    let status: HouseholdStatus
    if (rs.length === 0) status = 'awaiting'
    else if (acceptedCount > 0) status = 'attending'
    else status = 'declined'
    return {
      name: inv.name.trim(),
      partySize: inv.partySize,
      hasEmail: inv.hasEmail,
      email: inv.email,
      status,
      acceptedCount,
      declinedCount,
      childCount,
    }
  })

  households.sort((a, b) => {
    const s = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
    return s !== 0 ? s : a.name.localeCompare(b.name)
  })

  const householdsResponded = households.filter((h) => h.status !== 'awaiting').length
  const householdsAttending = households.filter((h) => h.status === 'attending').length
  const householdsDeclined = households.filter((h) => h.status === 'declined').length
  const householdsInvited = invites.length

  // Head counts come straight off the deduped response rows (one row per person).
  const acceptedGuests = responses.filter((r) => isAccepted(r.status)).length
  const declinedGuests = responses.filter((r) => isDeclined(r.status)).length
  const invitedGuests = invites.reduce((sum, inv) => sum + (inv.partySize || 0), 0)

  // Adults are the accepted people-rows (guests and plus ones); kids come off
  // the Children field on attending households. Total = both, so the couple can
  // give the caterer a single confirmed head count.
  const acceptedAdults = acceptedGuests
  const acceptedKids = households
    .filter((h) => h.status === 'attending')
    .reduce((sum, h) => sum + h.childCount, 0)
  const acceptedTotalGuests = acceptedAdults + acceptedKids

  const dietary = responses
    .filter((r) => isAccepted(r.status) && r.dietary && r.dietary.trim())
    .map((r) => `${r.guestName.trim()}: ${r.dietary!.trim()}`)

  return {
    householdsInvited,
    householdsResponded,
    householdsAwaiting: householdsInvited - householdsResponded,
    householdsAttending,
    householdsDeclined,
    responseRate: householdsInvited > 0 ? Math.round((householdsResponded / householdsInvited) * 100) : 0,
    invitedGuests,
    acceptedGuests,
    declinedGuests,
    acceptedAdults,
    acceptedKids,
    acceptedTotalGuests,
    households,
    awaiting: households.filter((h) => h.status === 'awaiting'),
    invitesMissingEmail: households.filter((h) => !h.hasEmail),
    unmatchedResponses,
    dietary,
  }
}
