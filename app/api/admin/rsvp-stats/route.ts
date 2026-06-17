import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { isPlannerAuthed } from '../../../../lib/plannerAuth'

export async function GET(req: NextRequest) {
  // Auth: require a valid planner-auth token
  const cookieStore = await cookies()
  if (!(await isPlannerAuthed(cookieStore.get('planner-auth')?.value))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const airtableKey = process.env.AIRTABLE_API_KEY
  const airtableBase = process.env.AIRTABLE_BASE_ID
  const airtableTable = process.env.AIRTABLE_RSVP_TABLE ?? 'table_2'

  if (!airtableKey || !airtableBase) {
    return NextResponse.json({ error: 'Airtable not configured' }, { status: 503 })
  }

  const records: Array<{ fields: Record<string, unknown> }> = []
  let offset: string | undefined

  do {
    const url = new URL(
      `https://api.airtable.com/v0/${encodeURIComponent(airtableBase)}/${encodeURIComponent(airtableTable)}`,
    )
    url.searchParams.append('fields[]', 'Guest Name')
    url.searchParams.append('fields[]', 'RSVP Status')
    url.searchParams.append('fields[]', 'Plus One Name')
    url.searchParams.append('fields[]', 'Children')
    url.searchParams.append('fields[]', 'Dietary Restrictions')
    url.searchParams.append('fields[]', 'Hotel Interest')
    if (offset) url.searchParams.set('offset', offset)

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${airtableKey}`, 'Cache-Control': 'no-store' },
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Airtable fetch failed' }, { status: 502 })
    }

    const data = (await res.json()) as {
      records: Array<{ fields: Record<string, unknown> }>
      offset?: string
    }
    records.push(...data.records)
    offset = data.offset
  } while (offset)

  let accepted = 0
  let declined = 0
  let pending = 0
  let plusOneCount = 0
  let totalChildren = 0
  let highChairCount = 0
  let hotelInterestCount = 0
  const dietaryList: string[] = []

  for (const r of records) {
    const status = String(r.fields['RSVP Status'] ?? '')
    if (status === 'Accepted') accepted++
    else if (status === 'Declined') declined++
    else pending++

    if (r.fields['Plus One Name']) plusOneCount++

    const childrenRaw = r.fields['Children']
    if (childrenRaw && typeof childrenRaw === 'string') {
      try {
        const children = JSON.parse(childrenRaw) as Array<{ name: string; age: string; highChair: boolean }>
        totalChildren += children.length
        highChairCount += children.filter((c) => c.highChair).length
      } catch {
        // malformed JSON, skip
      }
    }

    if (r.fields['Hotel Interest']) hotelInterestCount++

    const diet = String(r.fields['Dietary Restrictions'] ?? '').trim()
    if (diet) dietaryList.push(`${r.fields['Guest Name']}: ${diet}`)
  }

  return NextResponse.json({
    totalInvited: records.length,
    rsvpReceived: accepted + declined,
    accepted,
    declined,
    pending,
    totalHeads: accepted + plusOneCount + totalChildren,
    plusOnes: plusOneCount,
    totalChildren,
    highChairCount,
    hotelInterestCount,
    dietaryList,
  })
}
