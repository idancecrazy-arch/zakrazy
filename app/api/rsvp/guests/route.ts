import { NextRequest, NextResponse } from 'next/server'

export interface GuestRecord {
  id: string
  name: string
  email: string
  phone: string
  rsvpStatus: string
  plusOneAllowed: boolean
}

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get('search')?.trim() ?? ''
  if (search.length < 2) {
    return NextResponse.json({ records: [] })
  }

  const airtableKey = process.env.AIRTABLE_API_KEY
  const airtableBase = process.env.AIRTABLE_BASE_ID
  const airtableTable = process.env.AIRTABLE_GUEST_TABLE ?? 'Guest List'

  if (!airtableKey || !airtableBase) {
    return NextResponse.json({ error: 'Airtable not configured' }, { status: 503 })
  }

  const formula = `SEARCH(LOWER("${search.replace(/"/g, '\\"')}"), LOWER({Guest Name}))`
  const url = new URL(
    `https://api.airtable.com/v0/${encodeURIComponent(airtableBase)}/${encodeURIComponent(airtableTable)}`,
  )
  url.searchParams.set('filterByFormula', formula)
  url.searchParams.set('fields[]', 'Guest Name')
  url.searchParams.set('fields[]', 'Email')
  url.searchParams.set('fields[]', 'Phone')
  url.searchParams.set('fields[]', 'RSVP Status')
  url.searchParams.set('fields[]', 'Plus One Allowed')
  url.searchParams.set('maxRecords', '10')

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${airtableKey}`, 'Cache-Control': 'no-store' },
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('Airtable guest search failed:', err)
    return NextResponse.json({ error: 'Failed to search guests' }, { status: 502 })
  }

  const data = (await res.json()) as {
    records: Array<{
      id: string
      fields: Record<string, unknown>
    }>
  }

  const records: GuestRecord[] = data.records.map((r) => ({
    id: r.id,
    name: String(r.fields['Guest Name'] ?? ''),
    email: String(r.fields['Email'] ?? ''),
    phone: String(r.fields['Phone'] ?? ''),
    rsvpStatus: String(r.fields['RSVP Status'] ?? 'Not Yet Responded'),
    plusOneAllowed: Boolean(r.fields['Plus One Allowed']),
  }))

  return NextResponse.json({ records })
}
