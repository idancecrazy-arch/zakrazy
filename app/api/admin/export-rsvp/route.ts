import { NextRequest, NextResponse } from 'next/server'

// ── Admin CSV export ──────────────────────────────────────────────────
// GET /api/admin/export-rsvp
//
// Fetches all RSVP submissions from Airtable and returns them as a
// downloadable CSV file.
//
// Required env vars:
//   AIRTABLE_API_KEY, AIRTABLE_BASE_ID, ADMIN_SECRET
// Optional:
//   AIRTABLE_TABLE_NAME  (default: "Submissions")

// Field names match the Airtable table columns exactly (camelCase).
// "Submitted At" comes from Airtable's createdTime record metadata.
const AIRTABLE_FIELDS = [
  'fullName',
  'email',
  'address1',
  'address2',
  'city',
  'state',
  'zip',
  'country',
  'kidsAttending',
  'hotelBlockInterest',
  'notes',
] as const

const CSV_HEADERS = [
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

export async function GET(req: NextRequest) {
  const adminSecret = process.env.ADMIN_SECRET
  if (!adminSecret) {
    return NextResponse.json({ error: 'Admin access not configured' }, { status: 503 })
  }
  const provided = req.nextUrl.searchParams.get('secret')
  if (provided !== adminSecret) {
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
  // Sorted client-side by createdTime (always in the API response metadata).
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
      records.push({ createdTime: record.createdTime, fields: record.fields })
    }
    offset = data.offset
  } while (offset)

  // Sort chronologically using createdTime from the API response metadata
  records.sort((a, b) => a.createdTime.localeCompare(b.createdTime))

  // Build CSV — first column is createdTime, rest are table fields
  const header = CSV_HEADERS.map(escapeCSV).join(',')
  const rows = records.map(({ createdTime, fields }) =>
    [createdTime, ...AIRTABLE_FIELDS.map((f) => fields[f])].map(escapeCSV).join(','),
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
