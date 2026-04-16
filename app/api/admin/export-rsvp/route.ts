import { NextRequest, NextResponse } from 'next/server'

// ── Admin CSV export ──────────────────────────────────────────────────
// GET /api/admin/export-rsvp
//
// Fetches all RSVP submissions from Airtable and returns them as a
// downloadable CSV file.
//
// Required env vars (same as submit-details route):
//   AIRTABLE_API_KEY, AIRTABLE_BASE_ID
// Optional:
//   AIRTABLE_TABLE_NAME  (default: "Submissions")
//   ADMIN_SECRET         — if set, requests must include ?secret=<value>
//                          to prevent public access

const CSV_COLUMNS = [
  'Submitted At',
  'Full Name',
  'Email',
  'Address 1',
  'Address 2',
  'City',
  'State',
  'ZIP',
  'Country',
  'Kids Attending',
  'Hotel Block Interest',
  'Notes',
]

function escapeCSV(value: unknown): string {
  const str = value == null ? '' : String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

interface SubmissionPayload {
  name?: string
  email?: string
  address1?: string
  address2?: string
  city?: string
  state?: string
  zip?: string
  country?: string
  kidsAttending?: number
  hotelBlockInterest?: string
  notes?: string
  submittedAt?: string
}

export async function GET(req: NextRequest) {
  // Optional secret check
  const adminSecret = process.env.ADMIN_SECRET
  if (adminSecret) {
    const provided = req.nextUrl.searchParams.get('secret')
    if (provided !== adminSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
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
  // No sort param — records come back in Airtable's default order; we sort
  // client-side by createdTime (always present in the API response metadata).
  const records: { createdTime: string; payload: SubmissionPayload }[] = []
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
      return NextResponse.json(
        { error: `Airtable error: ${res.status}` },
        { status: 502 },
      )
    }

    const data = (await res.json()) as {
      records: { id: string; createdTime: string; fields: Record<string, unknown> }[]
      offset?: string
    }

    for (const record of data.records) {
      // The submission is stored as a JSON string in the primary field
      // (whichever field that happens to be). Find the first string value.
      const jsonValue = Object.values(record.fields).find(
        (v) => typeof v === 'string' && v.startsWith('{'),
      ) as string | undefined

      let payload: SubmissionPayload = {}
      try {
        payload = JSON.parse(jsonValue ?? '{}') as SubmissionPayload
      } catch {
        // malformed record — keep empty payload
      }

      records.push({ createdTime: record.createdTime, payload })
    }
    offset = data.offset
  } while (offset)

  // Sort chronologically using createdTime from the API response metadata
  records.sort((a, b) => a.createdTime.localeCompare(b.createdTime))

  // Build CSV
  const header = CSV_COLUMNS.map(escapeCSV).join(',')
  const rows = records.map(({ createdTime, payload }) =>
    [
      payload.submittedAt ?? createdTime,
      payload.name,
      payload.email,
      payload.address1,
      payload.address2,
      payload.city,
      payload.state,
      payload.zip,
      payload.country,
      payload.kidsAttending,
      payload.hotelBlockInterest,
      payload.notes,
    ]
      .map(escapeCSV)
      .join(','),
  )
  const csv = [header, ...rows].join('\r\n')

  const filename = `rsvp-submissions-${new Date().toISOString().slice(0, 10)}.csv`

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
