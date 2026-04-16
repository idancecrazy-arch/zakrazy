import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

// Hoist mock variables so they're available inside vi.mock() factories
const { mockAppend, MockJWT } = vi.hoisted(() => ({
  mockAppend: vi.fn().mockResolvedValue({}),
  // Must use a regular function (not arrow) so `new MockJWT(...)` works
  MockJWT: vi.fn(function MockJWT(this: Record<string, unknown>) {}),
}))

vi.mock('googleapis', () => ({
  google: {
    auth: { JWT: MockJWT },
    sheets: vi.fn(() => ({
      spreadsheets: { values: { append: mockAppend } },
    })),
  },
}))

const SHEET_ENV = {
  GOOGLE_SHEET_ID: 'test-sheet-id',
  GOOGLE_SERVICE_ACCOUNT_EMAIL: 'svc@test.iam.gserviceaccount.com',
  GOOGLE_PRIVATE_KEY: '-----BEGIN RSA PRIVATE KEY-----\\nfake\\n-----END RSA PRIVATE KEY-----',
}

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

describe('Google Sheets sync in /api/submit-details', () => {
  const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

  beforeEach(() => {
    mockAppend.mockClear()
    MockJWT.mockClear()
    warnSpy.mockClear()
    delete process.env.GOOGLE_SHEET_ID
    delete process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
    delete process.env.GOOGLE_PRIVATE_KEY
    delete process.env.AIRTABLE_API_KEY
    delete process.env.AIRTABLE_BASE_ID
    delete process.env.AIRTABLE_TABLE_NAME
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 200 })))
  })

  afterEach(() => {
    warnSpy.mockClear()
    vi.unstubAllGlobals()
  })

  it('appends a correctly-shaped row when Google Sheets env vars are set', async () => {
    Object.assign(process.env, SHEET_ENV)

    const { POST } = await import('./route')
    const res = await POST(makeRequest(validPayload))
    const body = await res.json()

    expect(res.status).toBe(201)
    expect(body.sheetsSync).toBe(true)
    expect(mockAppend).toHaveBeenCalledOnce()

    const call = mockAppend.mock.calls[0][0]
    expect(call.spreadsheetId).toBe('test-sheet-id')
    expect(call.range).toBe('Sheet1')

    const row: unknown[] = call.requestBody.values[0]
    // Index 0 is the ISO timestamp — just verify it looks like a date string
    expect(typeof row[0]).toBe('string')
    expect((row[0] as string).length).toBeGreaterThan(10)

    expect(row[1]).toBe('Jane Smith')       // fullName
    expect(row[2]).toBe('jane@example.com') // email
    expect(row[3]).toBe('123 Main St')      // address1
    expect(row[4]).toBe('Apt 4B')           // address2
    expect(row[5]).toBe('New York')         // city
    expect(row[6]).toBe('NY')              // state
    expect(row[7]).toBe('10001')            // zip
    expect(row[8]).toBe('United States')    // country
    expect(row[9]).toBe(2)                  // kidsAttending
    expect(row[10]).toBe('Yes')             // hotelBlockInterest
    expect(row[11]).toBe('Recently moved')  // notes
  })

  it('does not call Google Sheets when env vars are absent and warns', async () => {
    // env vars already deleted in beforeEach
    const { POST } = await import('./route')
    const res = await POST(makeRequest(validPayload))
    const body = await res.json()

    expect(res.status).toBe(201)
    expect(body.sheetsSync).toBeNull()
    expect(mockAppend).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('GOOGLE_SHEET_ID'),
    )
  })

  it('returns sheetsSync: false and still returns 201 when the Sheets API throws', async () => {
    Object.assign(process.env, SHEET_ENV)
    mockAppend.mockRejectedValueOnce(new Error('network error'))

    const { POST } = await import('./route')
    const res = await POST(makeRequest(validPayload))
    const body = await res.json()

    expect(res.status).toBe(201)
    expect(body.sheetsSync).toBe(false)
  })
})

describe('Airtable sync in /api/submit-details', () => {
  const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

  beforeEach(() => {
    warnSpy.mockClear()
    MockJWT.mockClear()
    mockAppend.mockClear()
    delete process.env.GOOGLE_SHEET_ID
    delete process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
    delete process.env.GOOGLE_PRIVATE_KEY
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
