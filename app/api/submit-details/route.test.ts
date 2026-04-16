import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

const AIRTABLE_ENV = {
  AIRTABLE_API_KEY: 'patTestKey123',
  AIRTABLE_BASE_ID: 'appTestBase456',
  AIRTABLE_TABLE_NAME: 'Submissions',
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

  beforeEach(() => {
    warnSpy.mockClear()
    delete process.env.AIRTABLE_API_KEY
    delete process.env.AIRTABLE_BASE_ID
    delete process.env.AIRTABLE_TABLE_NAME
  })

  afterEach(() => {
    warnSpy.mockClear()
    vi.unstubAllGlobals()
  })

  it('POSTs correct fields to Airtable when env vars are set', async () => {
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
      ([url]: [string]) => typeof url === 'string' && url.includes('airtable.com'),
    )
    expect(airtableCall).toBeDefined()

    const [url, options] = airtableCall as [string, RequestInit]
    expect(url).toContain('appTestBase456')
    expect(url).toContain('Submissions')
    expect(options.method).toBe('POST')

    const sent = JSON.parse(options.body as string) as { fields: Record<string, unknown> }
    expect(sent.fields['Full Name']).toBe('Jane Smith')
    expect(sent.fields['Email']).toBe('jane@example.com')
    expect(sent.fields['Hotel Block Interest']).toBe('Yes')
    expect(sent.fields['Kids Attending']).toBe(2)
  })

  it('returns airtableSync: null and warns when env vars are missing', async () => {
    vi.stubGlobal('fetch', vi.fn())

    const { POST } = await import('./route')
    const res = await POST(makeRequest(validPayload))
    const body = await res.json()

    expect(res.status).toBe(201)
    expect(body.airtableSync).toBeNull()
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('AIRTABLE_API_KEY'),
    )
  })

  it('returns airtableSync: false and still returns 201 when Airtable API errors', async () => {
    Object.assign(process.env, AIRTABLE_ENV)
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('Unauthorized', { status: 401 })),
    )

    const { POST } = await import('./route')
    const res = await POST(makeRequest(validPayload))
    const body = await res.json()

    expect(res.status).toBe(201)
    expect(body.airtableSync).toBe(false)
  })
})
