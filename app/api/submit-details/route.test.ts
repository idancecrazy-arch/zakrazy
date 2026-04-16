import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

const AIRTABLE_ENV = {
  AIRTABLE_API_KEY: 'patTestKey123',
  AIRTABLE_BASE_ID: 'appTestBase456',
  AIRTABLE_TABLE_NAME: 'Submissions',
  AIRTABLE_PRIMARY_FIELD: 'Title',
}

const validPayload = {
  fullName: 'Jane Smith',
  email: 'jane@example.com',
  address1: '123 Main St',
  address2: 'Apt 4B',
  city: 'New York',
  state: 'NY',
  zip: '10001',
  country: 'United States',
  kidsAttending: 2,
  hotelBlockInterest: true,
  notes: 'Recently moved',
}

function makeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/submit-details', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('Airtable sync in /api/submit-details', () => {
  const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

  beforeEach(() => {
    warnSpy.mockClear()
    logSpy.mockClear()
    delete process.env.AIRTABLE_API_KEY
    delete process.env.AIRTABLE_BASE_ID
    delete process.env.AIRTABLE_TABLE_NAME
    delete process.env.AIRTABLE_PRIMARY_FIELD
  })

  afterEach(() => {
    warnSpy.mockClear()
    logSpy.mockClear()
    vi.unstubAllGlobals()
  })

  it('POSTs correct data to Airtable when all env vars are set', async () => {
    Object.assign(process.env, AIRTABLE_ENV)
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ id: 'recTest' }), { status: 200 }),
    )
    vi.stubGlobal('fetch', mockFetch)

    const { POST } = await import('./route')
    const res = await POST(makeRequest(validPayload))
    const body = await res.json()

    expect(res.status).toBe(201)
    expect(body.airtableSync).toBe(true)

    const airtableCall = mockFetch.mock.calls.find(
      ([url]: [string]) => typeof url === 'string' && url.includes('airtable.com/v0'),
    )
    expect(airtableCall).toBeDefined()

    const [url, options] = airtableCall as [string, RequestInit]
    expect(url).toContain('appTestBase456')
    expect(url).toContain('Submissions')
    expect(options.method).toBe('POST')

    // All data stored as JSON in the configured primary field
    const sent = JSON.parse(options.body as string) as { fields: Record<string, string> }
    expect(sent.fields['Title']).toBeDefined()
    const payload = JSON.parse(sent.fields['Title']) as Record<string, unknown>
    expect(payload['name']).toBe('Jane Smith')
    expect(payload['email']).toBe('jane@example.com')
    expect(payload['hotelBlockInterest']).toBe('Yes')
    expect(payload['kidsAttending']).toBe(2)
  })

  it('skips Airtable and warns when AIRTABLE_PRIMARY_FIELD is missing', async () => {
    Object.assign(process.env, { ...AIRTABLE_ENV })
    delete process.env.AIRTABLE_PRIMARY_FIELD
    vi.stubGlobal('fetch', vi.fn())

    const { POST } = await import('./route')
    const res = await POST(makeRequest(validPayload))
    const body = await res.json()

    expect(res.status).toBe(201)
    expect(body.airtableSync).toBeNull()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('AIRTABLE_PRIMARY_FIELD'))
  })

  it('returns airtableSync: null when Airtable env vars are absent', async () => {
    vi.stubGlobal('fetch', vi.fn())

    const { POST } = await import('./route')
    const res = await POST(makeRequest(validPayload))
    const body = await res.json()

    expect(res.status).toBe(201)
    expect(body.airtableSync).toBeNull()
  })

  it('returns airtableSync: false and warns (not errors) when Airtable API fails', async () => {
    Object.assign(process.env, AIRTABLE_ENV)
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ error: { type: 'UNKNOWN_FIELD_NAME' } }), { status: 422 }),
      ),
    )

    const { POST } = await import('./route')
    const res = await POST(makeRequest(validPayload))
    const body = await res.json()

    expect(res.status).toBe(201)
    expect(body.airtableSync).toBe(false)
    // Must warn, not error
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Airtable write failed'),
      expect.anything(),
    )
  })

  it('always logs submission to console regardless of Airtable status', async () => {
    vi.stubGlobal('fetch', vi.fn())

    const { POST } = await import('./route')
    await POST(makeRequest(validPayload))

    expect(logSpy).toHaveBeenCalledWith(
      'RSVP_SUBMISSION',
      expect.stringContaining('jane@example.com'),
    )
  })
})
