import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { isPlannerAuthed } from '../../../../lib/plannerAuth'

export async function GET(req: NextRequest) {
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

  try {
    const url = new URL(`https://api.airtable.com/v0/${encodeURIComponent(airtableBase)}/${encodeURIComponent(airtableTable)}`)
    url.searchParams.set('maxRecords', '100')
    url.searchParams.set('sort[0][field]', 'Submitted Timestamp')
    url.searchParams.set('sort[0][direction]', 'desc')

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${airtableKey}` },
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      console.error('Airtable fetch failed:', res.status, errText)
      return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 502 })
    }

    const data = await res.json() as {
      records: Array<{
        id: string
        fields: Record<string, unknown>
        createdTime: string
      }>
    }

    const submissions = (data.records ?? []).map((r) => ({
      id: r.id,
      name: r.fields['Guest Name'] as string,
      status: r.fields['RSVP Status'] as string,
      submittedAt: r.fields['Submitted Timestamp'] as string | undefined,
      createdTime: r.createdTime,
      email: r.fields['Email'] as string | undefined,
    }))

    return NextResponse.json({ submissions })
  } catch (err) {
    console.error('Error fetching submissions:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
