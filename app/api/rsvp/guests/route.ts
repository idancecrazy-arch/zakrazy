import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get('search')?.trim() ?? ''
  if (search.length < 2) {
    return NextResponse.json({ records: [] })
  }

  const airtableKey = process.env.AIRTABLE_API_KEY
  const airtableBase = process.env.AIRTABLE_BASE_ID
  const airtableTable = process.env.AIRTABLE_GUEST_TABLE ?? 'Guest List'

  if (!airtableKey || !airtableBase) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  console.log('Airtable lookup config — base:', airtableBase, 'table:', airtableTable)

  const safeSearch = search.replace(/"/g, '').replace(/'/g, '')
  const formula = encodeURIComponent(
    `FIND(LOWER("${safeSearch}"), LOWER({Name})) > 0`,
  )
  const fields = ['Name', 'Plus One Allowed'].map((f) => `fields[]=${encodeURIComponent(f)}`).join('&')
  const url = `https://api.airtable.com/v0/${encodeURIComponent(airtableBase)}/${encodeURIComponent(airtableTable)}?filterByFormula=${formula}&${fields}&maxRecords=10`

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${airtableKey}` },
    next: { revalidate: 0 },
  })

  if (!res.ok) {
    const errBody = await res.text().catch(() => '')
    console.error('Airtable guest lookup failed:', res.status, errBody)
    return NextResponse.json({ error: 'Lookup failed' }, { status: 502 })
  }

  const data = await res.json() as { records: { id: string; fields: Record<string, unknown> }[] }
  const records = (data.records ?? []).map((r) => ({
    id: r.id,
    name: r.fields['Name'] as string,
    plusOneAllowed: Boolean(r.fields['Plus One Allowed']),
  }))

  return NextResponse.json({ records })
}
