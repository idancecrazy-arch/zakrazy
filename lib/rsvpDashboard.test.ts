import { describe, it, expect } from 'vitest'
import { buildDashboard, type Invite, type RsvpResponse } from './rsvpDashboard'

function invite(name: string, partySize: number, email?: string): Invite {
  return { name, partySize, plusOneAllowed: partySize > 1, email, hasEmail: Boolean(email && email.trim()) }
}
function resp(guestName: string, status: string, extra: Partial<RsvpResponse> = {}): RsvpResponse {
  return { guestName, status, ...extra }
}

describe('buildDashboard', () => {
  it('matches individual responses back to their household', () => {
    const invites = [
      invite('Zach & Mindy', 2, 'z@example.com'),
      invite('Brendan Fang', 1, 'b@example.com'),
    ]
    const responses = [
      resp('Zach', 'Accepted'),
      resp('Mindy', 'Accepted', { primaryGuest: 'Zach' }),
      resp('Brendan Fang', 'Accepted'),
    ]
    const d = buildDashboard(invites, responses)
    expect(d.householdsInvited).toBe(2)
    expect(d.householdsResponded).toBe(2)
    expect(d.householdsAwaiting).toBe(0)
    expect(d.householdsAttending).toBe(2)
    expect(d.acceptedGuests).toBe(3)
    expect(d.responseRate).toBe(100)
  })

  it('flags households with no reply as awaiting', () => {
    const invites = [
      invite('Zach & Mindy', 2, 'z@example.com'),
      invite('Julie Zhang', 1, 'j@example.com'),
      invite('Tiger Zhang', 1), // no email → follow-up can't be emailed
    ]
    const responses = [resp('Julie Zhang', 'Accepted')]
    const d = buildDashboard(invites, responses)
    expect(d.householdsResponded).toBe(1)
    expect(d.householdsAwaiting).toBe(2)
    expect(d.awaiting.map((h) => h.name).sort()).toEqual(['Tiger Zhang', 'Zach & Mindy'])
    expect(d.invitesMissingEmail.map((h) => h.name)).toEqual(['Tiger Zhang'])
    expect(d.responseRate).toBe(33)
  })

  it('counts a household as declined only when every reply declined', () => {
    const invites = [
      invite('Nikki & John Cary', 2, 'n@example.com'), // mixed → attending
      invite('Barbara & David', 2, 'bd@example.com'), // both declined → declined
    ]
    const responses = [
      resp('Nikki', 'Accepted'),
      resp('John Cary', 'Declined', { primaryGuest: 'Nikki' }),
      resp('Barbara', 'Declined'),
      resp('David', 'Declined', { primaryGuest: 'Barbara' }),
    ]
    const d = buildDashboard(invites, responses)
    const nikki = d.households.find((h) => h.name === 'Nikki & John Cary')!
    const barbara = d.households.find((h) => h.name === 'Barbara & David')!
    expect(nikki.status).toBe('attending')
    expect(nikki.acceptedCount).toBe(1)
    expect(nikki.declinedCount).toBe(1)
    expect(barbara.status).toBe('declined')
    expect(d.householdsAttending).toBe(1)
    expect(d.householdsDeclined).toBe(1)
    expect(d.acceptedGuests).toBe(1)
    expect(d.declinedGuests).toBe(3)
  })

  it('dedupes resubmitted responses, keeping the latest', () => {
    const invites = [invite('Norman & RA', 2, 'norman@example.com')]
    const responses = [
      resp('Norman', 'Declined', { submittedAt: '2026-06-17T16:02:00.000Z' }),
      resp('Norman', 'Accepted', { submittedAt: '2026-06-17T16:05:00.000Z' }), // newer wins
      resp('RA', 'Accepted', { submittedAt: '2026-06-17T16:05:00.000Z' }),
    ]
    const d = buildDashboard(invites, responses)
    expect(d.acceptedGuests).toBe(2)
    expect(d.declinedGuests).toBe(0)
    const h = d.households[0]
    expect(h.status).toBe('attending')
    expect(h.acceptedCount).toBe(2)
  })

  it('surfaces responses that match no invite instead of dropping them', () => {
    const invites = [invite('Zach & Mindy', 2, 'z@example.com')]
    const responses = [resp('Zach', 'Accepted'), resp('Stranger Danger', 'Accepted')]
    const d = buildDashboard(invites, responses)
    expect(d.unmatchedResponses).toEqual([{ guestName: 'Stranger Danger', status: 'Accepted' }])
    expect(d.acceptedGuests).toBe(2)
  })

  it('handles the whitespace-wrapped names that Airtable stores', () => {
    const invites = [invite('\nBrendan Fang\n', 1, 'b@example.com')]
    const responses = [resp('Brendan Fang', 'Accepted')]
    const d = buildDashboard(invites, responses)
    expect(d.householdsResponded).toBe(1)
    expect(d.households[0].name).toBe('Brendan Fang')
  })

  it('collects dietary notes from attending guests only', () => {
    const invites = [invite('Cat & Adam Hosey', 2, 'c@example.com')]
    const responses = [
      resp('Cat', 'Accepted', { dietary: 'Vegetarian' }),
      resp('Adam Hosey', 'Declined', { dietary: 'n/a' }),
    ]
    const d = buildDashboard(invites, responses)
    expect(d.dietary).toEqual(['Cat: Vegetarian'])
  })

  it('reports zeroes cleanly with no invites', () => {
    const d = buildDashboard([], [])
    expect(d.responseRate).toBe(0)
    expect(d.householdsInvited).toBe(0)
  })
})
