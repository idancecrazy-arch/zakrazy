import { NextRequest, NextResponse } from 'next/server'
import { isPlannerAuthed } from '../../../../lib/plannerAuth'
import { buildDashboard, type Invite, type RsvpResponse } from '../../../../lib/rsvpDashboard'

type AirtableRecord = { id: string; fields: Record<string, unknown> }

// Page through an Airtable table, pulling only the requested fields.
async function fetchAll(
  base: string,
  table: string,
  key: string,
  fields: string[],
): Promise<AirtableRecord[]> {
  const records: AirtableRecord[] = []
  let offset: string | undefined
  do {
    const url = new URL(`https://api.airtable.com/v0/${encodeURIComponent(base)}/${encodeURIComponent(table)}`)
    for (const f of fields) url.searchParams.append('fields[]', f)
    if (offset) url.searchParams.set('offset', offset)
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${key}`, 'Cache-Control': 'no-store' },
      next: { revalidate: 0 },
    })
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      throw new Error(`Airtable ${table} fetch failed: ${res.status} ${body}`)
    }
    const data = (await res.json()) as { records?: AirtableRecord[]; offset?: string }
    records.push(...(data.records ?? []))
    offset = data.offset
  } while (offset)
  return records
}

function str(v: unknown): string | undefined {
  return typeof v === 'string' ? v : undefined
}

// The submit route saves children as a JSON array string on the primary guest's
// row. Count its entries; treat anything unparseable as zero kids.
function childrenCount(v: unknown): number {
  if (typeof v !== 'string' || !v.trim()) return 0
  try {
    const parsed = JSON.parse(v)
    return Array.isArray(parsed) ? parsed.length : 0
  } catch {
    return 0
  }
}

export async function GET(req: NextRequest) {
  if (!(await isPlannerAuthed(req.cookies.get('planner-auth')?.value))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const airtableKey = process.env.AIRTABLE_API_KEY
  const airtableBase = process.env.AIRTABLE_BASE_ID
  // Table 1 (invites) and Table 2 (responses) share the same base. Names default
  // to the values already used elsewhere in the app; override via env if renamed.
  const inviteTable = process.env.AIRTABLE_GUEST_TABLE ?? 'Guest List'
  const responseTable = process.env.AIRTABLE_RSVP_TABLE ?? 'table_2'

  if (!airtableKey || !airtableBase) {
    return NextResponse.json({ error: 'Airtable not configured' }, { status: 503 })
  }

  let inviteRecords: AirtableRecord[]
  let responseRecords: AirtableRecord[]
  try {
    ;[inviteRecords, responseRecords] = await Promise.all([
      fetchAll(airtableBase, inviteTable, airtableKey, [
        'Name',
        'Total Party Size',
        'Plus One Allowed',
        'Invite Email',
        'Invite Status',
      ]),
      fetchAll(airtableBase, responseTable, airtableKey, [
        'Guest Name',
        'RSVP Status',
        'Primary Guest',
        'Submitted Timestamp',
        'Dietary Restrictions',
        'Children',
      ]),
    ])
  } catch (e) {
    console.error('[rsvp-dashboard]', e)
    return NextResponse.json({ error: 'Airtable fetch failed' }, { status: 502 })
  }

  const invites: Invite[] = inviteRecords.map((r) => {
    const email = str(r.fields['Invite Email'])?.trim()
    // "Primary Guest" comes back as a single-select object; other fields are plain.
    return {
      name: str(r.fields['Name']) ?? '',
      partySize: typeof r.fields['Total Party Size'] === 'number' ? (r.fields['Total Party Size'] as number) : 1,
      plusOneAllowed: Boolean(r.fields['Plus One Allowed']),
      email: email || undefined,
      inviteStatus: str(r.fields['Invite Status']),
      hasEmail: Boolean(email),
    }
  })

  const responses: RsvpResponse[] = responseRecords.map((r) => {
    const primary = r.fields['Primary Guest']
    const primaryName =
      typeof primary === 'string'
        ? primary
        : primary && typeof primary === 'object' && 'name' in primary
          ? String((primary as { name: unknown }).name)
          : undefined
    return {
      guestName: str(r.fields['Guest Name']) ?? '',
      status: str(r.fields['RSVP Status']) ?? '',
      primaryGuest: primaryName,
      submittedAt: str(r.fields['Submitted Timestamp']),
      dietary: str(r.fields['Dietary Restrictions']),
      childrenCount: childrenCount(r.fields['Children']),
    }
  })

  const dashboard = buildDashboard(invites, responses)
  return NextResponse.json(dashboard)
}
