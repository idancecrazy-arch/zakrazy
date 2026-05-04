import { NextRequest, NextResponse } from 'next/server'

const KV_URL   = process.env.KV_REST_API_URL
const KV_TOKEN = process.env.KV_REST_API_TOKEN
const KEY      = 'planner-state'

async function kvPipeline(commands: unknown[][]): Promise<unknown[]> {
  if (!KV_URL || !KV_TOKEN) return []
  const res = await fetch(`${KV_URL}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commands),
    cache: 'no-store',
  })
  if (!res.ok) return []
  const json = await res.json() as { result: unknown }[]
  return json.map(r => r.result)
}

function plannerAuthed(req: NextRequest): boolean {
  return req.cookies.get('planner-auth')?.value === 'granted'
}

export async function GET(req: NextRequest) {
  if (!plannerAuthed(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const [raw] = await kvPipeline([['GET', KEY]])
  if (!raw || typeof raw !== 'string') {
    return NextResponse.json({ data: null })
  }
  try {
    return NextResponse.json({ data: JSON.parse(raw) })
  } catch {
    return NextResponse.json({ data: null })
  }
}

export async function POST(req: NextRequest) {
  if (!plannerAuthed(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }
  await kvPipeline([['SET', KEY, JSON.stringify(body)]])
  return NextResponse.json({ ok: true })
}
