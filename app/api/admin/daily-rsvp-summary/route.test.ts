import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

const CRON_SECRET = 'test-cron-secret-123'

const AIRTABLE_ENV = {
  AIRTABLE_API_KEY: 'patTestKey123',
  AIRTABLE_BASE_ID: 'appTestBase456',
  AIRTABLE_TABLE_NAME: 'Submissions',
}

const RESEND_ENV = {
  RESEND_API_KEY: 're_testResendKey',
  NOTIFICATION_EMAIL: 'notify@example.com',
}

// Two records: one older than 24h, one recent
const OLD_TIME = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString()
const RECENT_TIME = new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()

const MOCK_RECORDS = [
  {
    id: 'rec1',
    createdTime: OLD_TIME,
    fields: { fullName: 'Alice Old', email: 'alice@example.com', kidsAttending: '2', hotelBlockInterest: 'Yes' },
  },
  {
    id: 'rec2',
    createdTime: RECENT_TIME,
    fields: { fullName: 'Bob New', email: 'bob@example.com', kidsAttending: '3', hotelBlockInterest: 'No' },
  },
]

function makeRequest(opts: { secret?: string; bearer?: string } = {}): NextRequest {
  const url = new URL('http://localhost/api/admin/daily-rsvp-summary')
  if (opts.secret) url.searchParams.set('secret', opts.secret)
  const headers: Record<string, string> = {}
  if (opts.bearer) headers['authorization'] = `Bearer ${opts.bearer}`
  return new NextRequest(url.toString(), { method: 'GET', headers })
}

function airtableOk(records = MOCK_RECORDS) {
  return new Response(JSON.stringify({ records }), { status: 200 })
}

function resendOk() {
  return new Response(JSON.stringify({ id: 'email_123' }), { status: 200 })
}

describe('Authentication — /api/admin/daily-rsvp-summary', () => {
  const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

  beforeEach(() => {
    warnSpy.mockClear()
    delete process.env.CRON_SECRET
    delete process.env.AIRTABLE_API_KEY
    delete process.env.AIRTABLE_BASE_ID
    delete process.env.AIRTABLE_TABLE_NAME
    delete process.env.RESEND_API_KEY
    delete process.env.NOTIFICATION_EMAIL
  })

  afterEach(() => {
    warnSpy.mockClear()
    vi.unstubAllGlobals()
  })

  it('returns 503 when CRON_SECRET env var is not set', async () => {
    vi.stubGlobal('fetch', vi.fn())
    const { GET } = await import('./route')
    const res = await GET(makeRequest())
    expect(res.status).toBe(503)
    const body = await res.json()
    expect(body.error).toContain('CRON_SECRET')
  })

  it('returns 401 when no secret is provided', async () => {
    process.env.CRON_SECRET = CRON_SECRET
    vi.stubGlobal('fetch', vi.fn())
    const { GET } = await import('./route')
    const res = await GET(makeRequest())
    expect(res.status).toBe(401)
  })

  it('returns 401 for a wrong secret in query param', async () => {
    process.env.CRON_SECRET = CRON_SECRET
    vi.stubGlobal('fetch', vi.fn())
    const { GET } = await import('./route')
    const res = await GET(makeRequest({ secret: 'wrong-secret' }))
    expect(res.status).toBe(401)
  })

  it('returns 401 for a wrong Bearer token', async () => {
    process.env.CRON_SECRET = CRON_SECRET
    vi.stubGlobal('fetch', vi.fn())
    const { GET } = await import('./route')
    const res = await GET(makeRequest({ bearer: 'wrong-secret' }))
    expect(res.status).toBe(401)
  })

  it('accepts a valid secret in the query param', async () => {
    process.env.CRON_SECRET = CRON_SECRET
    Object.assign(process.env, AIRTABLE_ENV)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(airtableOk()))
    const { GET } = await import('./route')
    const res = await GET(makeRequest({ secret: CRON_SECRET }))
    expect(res.status).toBe(200)
  })

  it('accepts a valid Bearer token (Vercel Cron style)', async () => {
    process.env.CRON_SECRET = CRON_SECRET
    Object.assign(process.env, AIRTABLE_ENV)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(airtableOk()))
    const { GET } = await import('./route')
    const res = await GET(makeRequest({ bearer: CRON_SECRET }))
    expect(res.status).toBe(200)
  })
})

describe('Airtable fetch — /api/admin/daily-rsvp-summary', () => {
  const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

  beforeEach(() => {
    warnSpy.mockClear()
    errorSpy.mockClear()
    process.env.CRON_SECRET = CRON_SECRET
    delete process.env.AIRTABLE_API_KEY
    delete process.env.AIRTABLE_BASE_ID
    delete process.env.AIRTABLE_TABLE_NAME
    delete process.env.RESEND_API_KEY
    delete process.env.NOTIFICATION_EMAIL
  })

  afterEach(() => {
    warnSpy.mockClear()
    errorSpy.mockClear()
    vi.unstubAllGlobals()
  })

  it('returns 503 when Airtable env vars are missing', async () => {
    vi.stubGlobal('fetch', vi.fn())
    const { GET } = await import('./route')
    const res = await GET(makeRequest({ secret: CRON_SECRET }))
    expect(res.status).toBe(503)
    const body = await res.json()
    expect(body.error).toContain('Airtable not configured')
  })

  it('returns 502 when Airtable API returns an error', async () => {
    Object.assign(process.env, AIRTABLE_ENV)
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('Airtable error', { status: 401 })),
    )
    const { GET } = await import('./route')
    const res = await GET(makeRequest({ secret: CRON_SECRET }))
    expect(res.status).toBe(502)
  })

  it('follows Airtable pagination using the offset parameter', async () => {
    Object.assign(process.env, AIRTABLE_ENV)
    const page1 = new Response(
      JSON.stringify({ records: [MOCK_RECORDS[0]], offset: 'next-page' }),
      { status: 200 },
    )
    const page2 = new Response(
      JSON.stringify({ records: [MOCK_RECORDS[1]] }),
      { status: 200 },
    )
    const mockFetch = vi.fn().mockResolvedValueOnce(page1).mockResolvedValueOnce(page2)
    vi.stubGlobal('fetch', mockFetch)

    const { GET } = await import('./route')
    const res = await GET(makeRequest({ secret: CRON_SECRET }))
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body.totalRSVPs).toBe(2)

    // Second call must include the offset
    const secondUrl = (mockFetch.mock.calls[1] as [string])[0]
    expect(secondUrl).toContain('offset=next-page')
  })
})

describe('Stats computation — /api/admin/daily-rsvp-summary', () => {
  const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

  beforeEach(() => {
    warnSpy.mockClear()
    process.env.CRON_SECRET = CRON_SECRET
    Object.assign(process.env, AIRTABLE_ENV)
    delete process.env.RESEND_API_KEY
    delete process.env.NOTIFICATION_EMAIL
  })

  afterEach(() => {
    warnSpy.mockClear()
    vi.unstubAllGlobals()
  })

  it('correctly counts totalRSVPs, newToday, totalKids, and hotelYes', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(airtableOk()))
    const { GET } = await import('./route')
    const res = await GET(makeRequest({ secret: CRON_SECRET }))
    expect(res.status).toBe(200)

    const body = await res.json()
    // MOCK_RECORDS has 2 total records
    expect(body.totalRSVPs).toBe(2)
    // Only the RECENT_TIME record is within 24h
    expect(body.newToday).toBe(1)
    // Alice: 2 kids, Bob: 3 kids = 5 total
    expect(body.totalKids).toBe(5)
    // Only Alice has hotelBlockInterest: 'Yes'
    expect(body.hotelYes).toBe(1)
  })

  it('handles missing kidsAttending gracefully (treats as 0)', async () => {
    const records = [
      {
        id: 'rec1',
        createdTime: OLD_TIME,
        fields: { fullName: 'Carol', email: 'carol@example.com', hotelBlockInterest: 'No' },
      },
    ]
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(airtableOk(records)))
    const { GET } = await import('./route')
    const res = await GET(makeRequest({ secret: CRON_SECRET }))
    const body = await res.json()
    expect(body.totalKids).toBe(0)
  })

  it('returns emailSent: false when RESEND_API_KEY is not set', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(airtableOk()))
    const { GET } = await import('./route')
    const res = await GET(makeRequest({ secret: CRON_SECRET }))
    const body = await res.json()
    expect(body.emailSent).toBe(false)
  })
})

describe('Email digest — /api/admin/daily-rsvp-summary', () => {
  const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

  beforeEach(() => {
    warnSpy.mockClear()
    process.env.CRON_SECRET = CRON_SECRET
    Object.assign(process.env, AIRTABLE_ENV, RESEND_ENV)
  })

  afterEach(() => {
    warnSpy.mockClear()
    vi.unstubAllGlobals()
    delete process.env.CRON_SECRET
    delete process.env.AIRTABLE_API_KEY
    delete process.env.AIRTABLE_BASE_ID
    delete process.env.AIRTABLE_TABLE_NAME
    delete process.env.RESEND_API_KEY
    delete process.env.NOTIFICATION_EMAIL
  })

  it('sends digest email to NOTIFICATION_EMAIL with correct subject and stats', async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce(airtableOk())
      .mockResolvedValueOnce(resendOk())
    vi.stubGlobal('fetch', mockFetch)

    const { GET } = await import('./route')
    const res = await GET(makeRequest({ secret: CRON_SECRET }))
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body.emailSent).toBe(true)

    const resendCall = mockFetch.mock.calls.find(
      ([url]: [string]) => typeof url === 'string' && url.includes('resend.com'),
    )
    expect(resendCall).toBeDefined()

    const sent = JSON.parse((resendCall as [string, RequestInit])[1].body as string)
    expect(sent.to).toBe('notify@example.com')
    expect(sent.subject).toContain('Daily RSVP Summary')
    expect(sent.subject).toContain('2 total')
    expect(sent.text).toContain('Total RSVPs:')
    expect(sent.text).toContain('Bob New')
    expect(sent.text).toContain('bob@example.com')
  })

  it('falls back to CONTACT_EMAIL when NOTIFICATION_EMAIL is not set', async () => {
    delete process.env.NOTIFICATION_EMAIL
    const mockFetch = vi.fn()
      .mockResolvedValueOnce(airtableOk())
      .mockResolvedValueOnce(resendOk())
    vi.stubGlobal('fetch', mockFetch)

    const { GET } = await import('./route')
    const res = await GET(makeRequest({ secret: CRON_SECRET }))
    expect(res.status).toBe(200)

    const resendCall = mockFetch.mock.calls.find(
      ([url]: [string]) => typeof url === 'string' && url.includes('resend.com'),
    )
    const sent = JSON.parse((resendCall as [string, RequestInit])[1].body as string)
    expect(sent.to).toBe('christineandmichaelzak@gmail.com')
  })

  it('shows "No new submissions" in email when all records are older than 24h', async () => {
    const allOld = MOCK_RECORDS.map((r) => ({ ...r, createdTime: OLD_TIME }))
    const mockFetch = vi.fn()
      .mockResolvedValueOnce(airtableOk(allOld))
      .mockResolvedValueOnce(resendOk())
    vi.stubGlobal('fetch', mockFetch)

    const { GET } = await import('./route')
    await GET(makeRequest({ secret: CRON_SECRET }))

    const resendCall = mockFetch.mock.calls.find(
      ([url]: [string]) => typeof url === 'string' && url.includes('resend.com'),
    )
    const sent = JSON.parse((resendCall as [string, RequestInit])[1].body as string)
    expect(sent.text).toContain('No new submissions')
  })

  it('warns but still returns success when Resend call fails', async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce(airtableOk())
      .mockResolvedValueOnce(new Response('error', { status: 500 }))
    vi.stubGlobal('fetch', mockFetch)

    const { GET } = await import('./route')
    const res = await GET(makeRequest({ secret: CRON_SECRET }))
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body.emailSent).toBe(false)
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Resend digest failed'),
      expect.anything(),
    )
  })
})
