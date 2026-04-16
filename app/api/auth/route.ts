import { NextRequest, NextResponse } from 'next/server'

const PASSWORDS: Record<string, { type: 'text' | 'board'; message: string }> = {
  bunny:      { type: 'text',  message: 'meow!' },
  backgammon: { type: 'board', message: 'backgammon' },
  bandit:     { type: 'text',  message: 'me yow' },
}

const COOKIE_MAX_AGE = 60 * 60 * 24 * 30

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    typeof (body as Record<string, unknown>).password !== 'string'
  ) {
    return NextResponse.json({ error: 'Missing password' }, { status: 400 })
  }

  const password = ((body as Record<string, unknown>).password as string).trim().toLowerCase()
  const match = PASSWORDS[password]

  if (!match) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
  }

  const response = NextResponse.json({ type: match.type, message: match.message })
  response.cookies.set('auth', 'granted', {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  })
  return response
}
