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

// Discover the primary (first) field name of the Airtable table via the
// Metadata API. Falls back to the AIRTABLE_PRIMARY_FIELD env var, then "Name".
// Requires schema.bases:read scope on the personal access token.
async function getAirtablePrimaryField(
  apiKey: string,
  baseId: string,
  tableName: string,
): Promise<string> {
  if (process.env.AIRTABLE_PRIMARY_FIELD) return process.env.AIRTABLE_PRIMARY_FIELD

  try {
    const res = await fetch(
      `https://api.airtable.com/v0/meta/bases/${encodeURIComponent(baseId)}/tables`,
      { headers: { Authorization: `Bearer ${apiKey}` } },
    )
    if (res.ok) {
      const data = (await res.json()) as {
        tables: { id: string; name: string; fields: { name: string }[] }[]
      }
      const table = data.tables.find((t) => t.name === tableName || t.id === tableName)
      if (table?.fields?.[0]?.name) return table.fields[0].name
    }
  } catch {
    // fall through to default
  }

  return 'Name'
}

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

  // ── Airtable ──────────────────────────────────────────────────────
  // Primary storage — free tier handles thousands of RSVPs.
  // Set these env vars to enable:
  //   AIRTABLE_API_KEY    — personal access token (needs data.records:write
  //                          and schema.bases:read scopes)
  //   AIRTABLE_BASE_ID    — base ID from the URL (starts with "app…")
  //   AIRTABLE_TABLE_NAME — table name (default: "Submissions")
  //
  // No custom field setup required. All submission data is stored as JSON
  // in the table's primary field (auto-discovered via the Metadata API).
  // Optional override: AIRTABLE_PRIMARY_FIELD=<your field name>
  //
  // Use GET /api/admin/export-rsvp to download a structured CSV.
  const airtableKey = process.env.AIRTABLE_API_KEY
  const airtableBase = process.env.AIRTABLE_BASE_ID
  const airtableTable = process.env.AIRTABLE_TABLE_NAME ?? 'Submissions'

  let airtableSync: boolean | null = null

  if (airtableKey && airtableBase) {
    try {
      const primaryField = await getAirtablePrimaryField(airtableKey, airtableBase, airtableTable)

      const payload = {
        name: parsed.data.fullName,
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
        submittedAt: submission.submittedAt,
      }

      const res = await fetch(
        `https://api.airtable.com/v0/${encodeURIComponent(airtableBase)}/${encodeURIComponent(airtableTable)}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${airtableKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fields: { [primaryField]: JSON.stringify(payload) } }),
        },
      )
      if (!res.ok) {
        const errText = await res.text()
        throw new Error(`Airtable responded ${res.status}: ${errText}`)
      }
      airtableSync = true
    } catch (err) {
      airtableSync = false
      console.error('Airtable write failed:', err)
    }
  } else {
    const missing = [
      !airtableKey && 'AIRTABLE_API_KEY',
      !airtableBase && 'AIRTABLE_BASE_ID',
    ].filter(Boolean)
    console.warn(`Airtable sync disabled — missing env vars: ${missing.join(', ')}`)
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
      console.error('Resend notification failed:', err)
    }
  }

  return NextResponse.json({ success: true, airtableSync }, { status: 201 })
}
