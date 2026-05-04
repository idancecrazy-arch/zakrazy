import { NextRequest, NextResponse } from 'next/server'

const KEY = 'planner-state'

function getKvCredentials(): { url: string; token: string } | null {
  // Standard Vercel KV env vars (default / first store)
  const url   = process.env.KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN
  if (url && token) return { url, token }

  // Named store "redis-cordovan-kettle" → REDIS_CORDOVAN_KETTLE_ prefix
  const pUrl   = process.env.REDIS_CORDOVAN_KETTLE_KV_REST_API_URL
  const pToken = process.env.REDIS_CORDOVAN_KETTLE_KV_REST_API_TOKEN
  if (pUrl && pToken) return { url: pUrl, token: pToken }

  // Log which KV/Redis env vars ARE present so we can identify the right name
  const present = Object.keys(process.env).filter(
    k => k.includes('KV') || k.includes('REDIS') || k.includes('UPSTASH')
  )
  console.warn('[planner-state] KV credentials missing. Present KV/Redis vars:', present)
  return null
}

async function kvPipeline(commands: unknown[][]): Promise<unknown[]> {
  const creds = getKvCredentials()
  if (!creds) return []
  const res = await fetch(`${creds.url}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${creds.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commands),
    cache: 'no-store',
  })
  if (!res.ok) {
    console.error('[planner-state] KV request failed:', res.status)
    return []
  }
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
  const creds = getKvCredentials()
  if (!creds) {
    return NextResponse.json({ data: null, kvMissing: true })
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
  const creds = getKvCredentials()
  if (!creds) {
    return NextResponse.json({ error: 'KV not configured', kvMissing: true }, { status: 503 })
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
