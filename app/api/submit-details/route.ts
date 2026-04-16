import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  address1: z.string().min(3),
  address2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  zip: z.string().min(3),
  country: z.string().min(1),
  kidsAttending: z.coerce.number().int().min(0).optional(),
  hotelBlockInterest: z.boolean().optional(),
  notes: z.string().optional(),
})

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 422 },
    )
  }

  const submission = {
    ...parsed.data,
    submittedAt: new Date().toISOString(),
    ip: req.headers.get('x-forwarded-for') ?? 'unknown',
  }

  // ── Permanent record in Vercel logs ───────────────────────────────
  // Every submission is logged regardless of whether Airtable or email
  // is configured. Use /api/admin/export-rsvp to download a CSV from
  // Airtable, or grep these logs as a fallback.
  console.log('RSVP_SUBMISSION', JSON.stringify(submission))

  // ── Airtable ──────────────────────────────────────────────────────
  // Set AIRTABLE_API_KEY + AIRTABLE_BASE_ID to enable.
  // Token needs data.records:write scope.
  // AIRTABLE_TABLE_NAME defaults to "Submissions".
  //
  // Table field names must match the form field names exactly:
  //   fullName, email, address1, address2, city, state, zip, country,
  //   kidsAttending, hotelBlockInterest, notes
  const airtableKey = process.env.AIRTABLE_API_KEY
  const airtableBase = process.env.AIRTABLE_BASE_ID
  const airtableTable = process.env.AIRTABLE_TABLE_NAME ?? 'Submissions'

  let airtableSync: boolean | null = null

  if (airtableKey && airtableBase) {
    try {
      const res = await fetch(
        `https://api.airtable.com/v0/${encodeURIComponent(airtableBase)}/${encodeURIComponent(airtableTable)}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${airtableKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fields: {
              fullName: parsed.data.fullName,
              email: parsed.data.email,
              address1: parsed.data.address1,
              address2: parsed.data.address2 ?? '',
              city: parsed.data.city,
              state: parsed.data.state,
              zip: parsed.data.zip,
              country: parsed.data.country,
              kidsAttending: parsed.data.kidsAttending ?? 0,
              hotelBlockInterest: parsed.data.hotelBlockInterest ? 'Yes' : 'No',
              notes: parsed.data.notes ?? '',
            },
          }),
        },
      )
      if (!res.ok) {
        const errText = await res.text()
        console.warn('Airtable write failed (submission saved to logs):', errText)
        airtableSync = false
      } else {
        airtableSync = true
      }
    } catch (err) {
      console.warn('Airtable write failed (submission saved to logs):', err)
      airtableSync = false
    }
  }

  // ── Email notification via Resend ────────────────────────────────
  // Set RESEND_API_KEY and NOTIFICATION_EMAIL env vars to enable.
  const resendKey = process.env.RESEND_API_KEY
  const notifyEmail = process.env.NOTIFICATION_EMAIL

  if (resendKey && notifyEmail) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Wedding Website <noreply@resend.dev>',
          to: notifyEmail,
          subject: `New RSVP detail submission — ${parsed.data.fullName}`,
          text: [
            `Name: ${parsed.data.fullName}`,
            `Email: ${parsed.data.email}`,
            `Address: ${parsed.data.address1}${parsed.data.address2 ? ', ' + parsed.data.address2 : ''}`,
            `         ${parsed.data.city}, ${parsed.data.state} ${parsed.data.zip}`,
            `         ${parsed.data.country}`,
            parsed.data.kidsAttending != null ? `Kids attending: ${parsed.data.kidsAttending}` : '',
            `Hotel block interest: ${parsed.data.hotelBlockInterest ? 'Yes' : 'No'}`,
            parsed.data.notes ? `Notes: ${parsed.data.notes}` : '',
            `Submitted: ${submission.submittedAt}`,
          ]
            .filter(Boolean)
            .join('\n'),
        }),
      })
    } catch (err) {
      console.warn('Resend notification failed:', err)
    }
  }

  return NextResponse.json({ success: true, airtableSync }, { status: 201 })
}
