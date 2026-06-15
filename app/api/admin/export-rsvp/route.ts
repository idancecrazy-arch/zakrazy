import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const AIRTABLE_FIELDS = [
  'Guest Name',
  'RSVP Status',
  'Email',
  'Phone',
  'Address',
  'Plus One Name',
  'Children',
  'Dietary Restrictions',
  'Welcome Reception',
] as const

const CSV_HEADERS = [
  'Submitted At',
  'Guest Name',
  'RSVP Status',
  'Email',
  'Phone',
  'Address',
  'Plus One Name',
  'Children',
  'Dietary Restrictions',
  'Welcome Reception',
]

function escapeCSV(value: unknown): string {
  const str = value == null ? '' : String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export async function GET(req: NextRequest) {
  const cookieStore = await cookies()
  const auth = cookieStore.get('planner-auth')
  if (auth?.value !== 'granted') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const airtableKey = process.env.AIRTABLE_API_KEY
  const airtableBase = process.env.AIRTABLE_BASE_ID
  const airtableTable = process.env.AIRTABLE_RSVP_TABLE ?? 'table_2'

  if (!airtableKey || !airtableBase) {
    return NextResponse.json({ error: 'Airtable not configured' }, { status: 503 })
  }

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

  records.sort((a, b) => a.createdTime.localeCompare(b.createdTime))

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
