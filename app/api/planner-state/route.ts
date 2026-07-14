import { createClient } from 'redis'
import { NextRequest, NextResponse } from 'next/server'
import { isPlannerAuthed } from '../../../lib/plannerAuth'

const KEY = 'planner-state'

let _client: ReturnType<typeof createClient> | null = null

// Connect with a short, bounded timeout and NO endless reconnect loop. Without
// this, an unreachable REDIS_URL makes connect() (and every later command) hang
// forever: the route never responds, Vercel kills the function after 300s, and
// the planner page — which awaits this fetch before rendering — is stuck on
// "Loading…" indefinitely. Failing fast lets the route return and the portal load.
const CONNECT_TIMEOUT_MS = 2000

async function getRedis() {
  if (!process.env.REDIS_URL) return null
  if (_client?.isReady) return _client
  // Any non-ready client (never connected, or dropped) is discarded so each
  // attempt starts from a clean socket rather than a half-open, hanging one.
  if (_client) {
    try {
      await _client.destroy()
    } catch {
      /* already torn down */
    }
    _client = null
  }
  const client = createClient({
    url: process.env.REDIS_URL,
    socket: {
      connectTimeout: CONNECT_TIMEOUT_MS,
      // No reconnect loop: fail fast on the request path. An unreachable Redis
      // must not hang the route (that caused the 300s Vercel timeout and the
      // stuck "Loading…" screen). A fresh client is created on the next request.
      reconnectStrategy: false,
    },
  })
  // An 'error' listener is required, otherwise a socket error would throw as an
  // unhandled exception rather than surfacing through connect()/commands.
  client.on('error', (e) => console.error('[redis]', e))
  try {
    await client.connect()
  } catch (e) {
    console.error('[redis] connect failed', e)
    try {
      await client.destroy()
    } catch {
      /* already torn down */
    }
    return null
  }
  _client = client
  return _client
}

function plannerAuthed(req: NextRequest): Promise<boolean> {
  return isPlannerAuthed(req.cookies.get('planner-auth')?.value)
}

export async function GET(req: NextRequest) {
  if (!(await plannerAuthed(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const redis = await getRedis()
  if (!redis) {
    // No REDIS_URL at all → not configured. Configured but unreachable →
    // transient error. Either way we respond immediately so the page still loads.
    if (!process.env.REDIS_URL) return NextResponse.json({ data: null, kvMissing: true })
    return NextResponse.json({ data: null, kvError: true })
  }
  try {
    const raw = await redis.get(KEY)
    if (!raw) return NextResponse.json({ data: null })
    return NextResponse.json({ data: JSON.parse(raw) })
  } catch (e) {
    console.error('[redis] read failed', e)
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
  const redis = await getRedis()
  if (!redis) {
    if (!process.env.REDIS_URL) {
      return NextResponse.json({ error: 'Redis not configured', kvMissing: true }, { status: 503 })
    }
    return NextResponse.json({ error: 'Redis unreachable', kvError: true }, { status: 503 })
  }
  try {
    await redis.set(KEY, JSON.stringify(body))
  } catch (e) {
    console.error('[redis] write failed', e)
    return NextResponse.json({ error: 'Redis write failed', kvError: true }, { status: 503 })
  }
  return NextResponse.json({ ok: true })
}
