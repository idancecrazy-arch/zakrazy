import { NextRequest, NextResponse } from 'next/server'
import { isPlannerAuthed } from '../../../lib/plannerAuth'

// The planner's saved state lives in Airtable — the same free store the site
// already uses for the guest list and RSVPs — so there is no separate Redis
// service to pay for. It is one row in the "Planner State" table, keyed by
// KEY below, whose "State" column holds the whole planner as a JSON blob.
const KEY = 'planner-state'

// Bounded timeout so an unreachable Airtable fails fast instead of hanging the
// route. Without this the planner page — which awaits this fetch before it
// renders — could sit on "Loading…" until the platform kills the function.
const REQUEST_TIMEOUT_MS = 4000

type AirtableConfig = { base: string; table: string; key: string }

function getConfig(): AirtableConfig | null {
  const key = process.env.AIRTABLE_API_KEY
  const base = process.env.AIRTABLE_BASE_ID
  if (!key || !base) return null
  const table = process.env.AIRTABLE_PLANNER_TABLE ?? 'Planner State'
  return { base, table, key }
}

function tableUrl({ base, table }: AirtableConfig): string {
  return `https://api.airtable.com/v0/${encodeURIComponent(base)}/${encodeURIComponent(table)}`
}

function plannerAuthed(req: NextRequest): Promise<boolean> {
  return isPlannerAuthed(req.cookies.get('planner-auth')?.value)
}

export async function GET(req: NextRequest) {
  if (!(await plannerAuthed(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const cfg = getConfig()
  // Not configured → missing. Configured but unreachable → transient error.
  // Either way we respond immediately so the page still loads and falls back
  // to its local snapshot. (kvMissing/kvError are kept as the response keys the
  // client already understands; they now mean Airtable, not Redis.)
  if (!cfg) return NextResponse.json({ data: null, kvMissing: true })

  // Find the single planner-state row. Airtable escapes single quotes inside a
  // formula string by doubling them; KEY has none, but keep the pattern safe.
  const formula = `{Key}='${KEY.replace(/'/g, "''")}'`
  const url = `${tableUrl(cfg)}?maxRecords=1&filterByFormula=${encodeURIComponent(formula)}`
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${cfg.key}` },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
    if (!res.ok) {
      console.error('[planner-state] read failed', res.status, await res.text().catch(() => ''))
      return NextResponse.json({ data: null, kvError: true })
    }
    const json = (await res.json()) as { records?: { fields?: { State?: string } }[] }
    const raw = json.records?.[0]?.fields?.State
    if (!raw) return NextResponse.json({ data: null })
    return NextResponse.json({ data: JSON.parse(raw) })
  } catch (e) {
    console.error('[planner-state] read failed', e)
    return NextResponse.json({ data: null, kvError: true })
  }
}

export async function POST(req: NextRequest) {
  if (!(await plannerAuthed(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }
  const cfg = getConfig()
  if (!cfg) {
    return NextResponse.json({ error: 'Airtable not configured', kvMissing: true }, { status: 503 })
  }

  // Upsert the single row keyed by "Key" — one call whether or not the row
  // exists yet, so we never have to look up its record id first.
  try {
    const res = await fetch(tableUrl(cfg), {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${cfg.key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        performUpsert: { fieldsToMergeOn: ['Key'] },
        records: [{ fields: { Key: KEY, State: JSON.stringify(body), Updated: new Date().toISOString() } }],
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
    if (!res.ok) {
      console.error('[planner-state] write failed', res.status, await res.text().catch(() => ''))
      return NextResponse.json({ error: 'Airtable write failed', kvError: true }, { status: 503 })
    }
  } catch (e) {
    console.error('[planner-state] write failed', e)
    return NextResponse.json({ error: 'Airtable write failed', kvError: true }, { status: 503 })
  }
  return NextResponse.json({ ok: true })
}
