import { NextRequest, NextResponse } from 'next/server'
import { CONTACT_EMAIL } from '../../../../lib/constants'

// ── Daily RSVP summary cron handler ──────────────────────────────────
// GET /api/admin/daily-rsvp-summary
//
// Fetches all RSVP submissions from Airtable, computes a daily digest,
// and emails it via Resend.
//
// Triggered automatically by Vercel Cron (see vercel.json).
// Vercel injects:  Authorization: Bearer {CRON_SECRET}
//
// For manual testing use the query param instead:
//   /api/admin/daily-rsvp-summary?secret={CRON_SECRET}
//
// Required env vars:
//   CRON_SECRET, AIRTABLE_API_KEY, AIRTABLE_BASE_ID, RESEND_API_KEY
// Optional:
//   AIRTABLE_TABLE_NAME  (default: "Submissions")
//   NOTIFICATION_EMAIL   (default: CONTACT_EMAIL constant)

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) {
    return NextResponse.json({ error: 'Cron not configured — set CRON_SECRET' }, { status: 503 })
  }

  const authHeader = req.headers.get('authorization')
  const secretParam = req.nextUrl.searchParams.get('secret')
  const authorized =
    authHeader === `Bearer ${cronSecret}` || secretParam === cronSecret

  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const airtableKey = process.env.AIRTABLE_API_KEY
  const airtableBase = process.env.AIRTABLE_BASE_ID
  const airtableTable = process.env.AIRTABLE_TABLE_NAME ?? 'Submissions'

  if (!airtableKey || !airtableBase) {
    return NextResponse.json(
      { error: 'Airtable not configured — set AIRTABLE_API_KEY and AIRTABLE_BASE_ID' },
      { status: 503 },
    )
  }

  // Fetch all records from Airtable (handles pagination).
  const records: { createdTime: string; fields: Record<string, unknown> }[] = []
  let offset: string | undefined

  do {
    const url = new URL(
      `https://api.airtable.com/v0/${encodeURIComponent(airtableBase)}/${encodeURIComponent(airtableTable)}`,
    )
    if (offset) url.searchParams.set('offset', offset)

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${airtableKey}` },
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Airtable fetch failed:', err)
      return NextResponse.json({ error: `Airtable error: ${res.status}` }, { status: 502 })
    }

    const data = (await res.json()) as {
      records: { id: string; createdTime: string; fields: Record<string, unknown> }[]
      offset?: string
    }

    for (const record of data.records) {
      records.push({ createdTime: record.createdTime, fields: record.fields })
    }
    offset = data.offset
  } while (offset)

  // Compute summary stats using records from the last 24 hours.
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const newRecords = records.filter((r) => r.createdTime > cutoff)

  const totalRSVPs = records.length
  const newToday = newRecords.length
  const totalKids = records.reduce((sum, r) => {
    const kids = parseInt(String(r.fields.kidsAttending ?? '0'), 10)
    return sum + (isNaN(kids) ? 0 : kids)
  }, 0)
  const hotelYes = records.filter((r) => r.fields.hotelBlockInterest === 'Yes').length
  const newGuestLines = newRecords.map(
    (r) => `  - ${r.fields.fullName} <${r.fields.email}>`,
  )

  const resendKey = process.env.RESEND_API_KEY
  const recipient = process.env.NOTIFICATION_EMAIL ?? CONTACT_EMAIL
  let emailSent = false

  if (resendKey) {
    const dateStr = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })

    const newGuestsSection =
      newGuestLines.length > 0
        ? `\nNew submissions (last 24 hours):\n${newGuestLines.join('\n')}`
        : '\nNo new submissions in the last 24 hours.'

    try {
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Wedding Website <noreply@resend.dev>',
          to: recipient,
          subject: `Daily RSVP Summary — ${dateStr} (${totalRSVPs} total)`,
          text: [
            `Daily RSVP Summary — ${dateStr}`,
            '',
            `Total RSVPs:          ${totalRSVPs}`,
            `New in last 24 hours: ${newToday}`,
            `Total kids attending: ${totalKids}`,
            `Hotel block interest: ${hotelYes}`,
            newGuestsSection,
          ].join('\n'),
        }),
      })
      if (emailRes.ok) {
        emailSent = true
      } else {
        console.warn('Resend digest failed:', await emailRes.text())
      }
    } catch (err) {
      console.warn('Resend digest failed:', err)
    }
  }

  return NextResponse.json({ success: true, totalRSVPs, newToday, totalKids, hotelYes, emailSent })
}
