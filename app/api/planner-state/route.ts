import { createClient } from 'redis'
import { NextRequest, NextResponse } from 'next/server'

const KEY = 'planner-state'

let _client: ReturnType<typeof createClient> | null = null

async function getRedis() {
  if (!process.env.REDIS_URL) return null
  if (!_client) {
    _client = createClient({ url: process.env.REDIS_URL })
    _client.on('error', (e) => console.error('[redis]', e))
    await _client.connect()
  }
  return _client
}

function plannerAuthed(req: NextRequest): boolean {
  return req.cookies.get('planner-auth')?.value === 'granted'
}

export async function GET(req: NextRequest) {
  if (!plannerAuthed(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const redis = await getRedis()
  if (!redis) {
    return NextResponse.json({ data: null, kvMissing: true })
  }
  const raw = await redis.get(KEY)
  if (!raw) return NextResponse.json({ data: null })
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
  const redis = await getRedis()
  if (!redis) {
    return NextResponse.json({ error: 'Redis not configured', kvMissing: true }, { status: 503 })
  }
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }
  await redis.set(KEY, JSON.stringify(body))
  return NextResponse.json({ ok: true })
}
