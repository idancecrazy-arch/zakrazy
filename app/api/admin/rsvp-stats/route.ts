import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  // Auth: require the planner-auth cookie
  const cookieStore = await cookies()
  const auth = cookieStore.get('planner-auth')
  if (auth?.value !== 'granted') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const airtableKey = process.env.AIRTABLE_API_KEY
  const airtableBase = process.env.AIRTABLE_BASE_ID
  const airtableTable = process.env.AIRTABLE_GUEST_TABLE ?? 'Guest List'

  if (!airtableKey || !airtableBase) {
    return NextResponse.json({ error: 'Airtable not configured' }, { status: 503 })
  }

  const records: Array<{ fields: Record<string, unknown> }> = []
  let offset: string | undefined

  do {
    const url = new URL(
      `https://api.airtable.com/v0/${encodeURIComponent(airtableBase)}/${encodeURIComponent(airtableTable)}`,
    )
    url.searchParams.set('fields[]', 'Guest Name')
    url.searchParams.set('fields[]', 'RSVP Status')
    url.searchParams.set('fields[]', 'Plus One Name')
    url.searchParams.set('fields[]', 'Children')
    url.searchParams.set('fields[]', 'Dietary Restrictions')
    url.searchParams.set('fields[]', 'Hotel Interest')
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
