import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

// Hoist mock variables so they're available inside vi.mock() factories
const { mockAppend, mockGet, mockUpdate, MockJWT } = vi.hoisted(() => ({
  mockAppend: vi.fn().mockResolvedValue({}),
  // Default: A1 already has content → headers not re-written
  mockGet: vi.fn().mockResolvedValue({ data: { values: [['Timestamp']] } }),
  mockUpdate: vi.fn().mockResolvedValue({}),
  // Must use a regular function (not arrow) so `new MockJWT(...)` works
  MockJWT: vi.fn(function MockJWT(this: Record<string, unknown>) {}),
}))

vi.mock('googleapis', () => ({
  google: {
    auth: { JWT: MockJWT },
    sheets: vi.fn(() => ({
      spreadsheets: { values: { append: mockAppend, get: mockGet, update: mockUpdate } },
    })),
  },
}))

vi.mock('fs', () => ({
  promises: {
    mkdir: vi.fn().mockResolvedValue(undefined),
    readFile: vi.fn().mockRejectedValue(new Error('ENOENT')),
    writeFile: vi.fn().mockResolvedValue(undefined),
  },
}))

const SHEET_ENV = {
  GOOGLE_SHEET_ID: 'test-sheet-id',
  GOOGLE_SERVICE_ACCOUNT_EMAIL: 'svc@test.iam.gserviceaccount.com',
  GOOGLE_PRIVATE_KEY: '-----BEGIN RSA PRIVATE KEY-----\\nfake\\n-----END RSA PRIVATE KEY-----',
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
    mockGet.mockClear()
    mockUpdate.mockClear()
    MockJWT.mockClear()
    warnSpy.mockClear()
    delete process.env.GOOGLE_SHEET_ID
    delete process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
    delete process.env.GOOGLE_PRIVATE_KEY
  })

  afterEach(() => {
    warnSpy.mockClear()
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
    expect(row[6]).toBe('NY')               // state
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

  it('writes header row when A1 is empty (first-ever submission)', async () => {
    Object.assign(process.env, SHEET_ENV)
    mockGet.mockResolvedValueOnce({ data: {} }) // A1 empty

    const { POST } = await import('./route')
    await POST(makeRequest(validPayload))

    expect(mockUpdate).toHaveBeenCalledOnce()
    const updateCall = mockUpdate.mock.calls[0][0]
    expect(updateCall.range).toBe('Sheet1!A1')
    expect(updateCall.valueInputOption).toBe('RAW')
    expect(updateCall.requestBody.values[0]).toEqual([
      'Timestamp', 'Full Name', 'Email', 'Street Address', 'Apt / Suite',
      'City', 'State / Province', 'ZIP / Postal Code', 'Country',
      'Kids Attending', 'Hotel Block Interest', 'Notes',
    ])
    expect(mockAppend).toHaveBeenCalledOnce() // data row still appended
  })

  it('skips header row when A1 already has content', async () => {
    Object.assign(process.env, SHEET_ENV)
    // Default mockGet returns a populated A1 — no override needed

    const { POST } = await import('./route')
    await POST(makeRequest(validPayload))

    expect(mockUpdate).not.toHaveBeenCalled()
    expect(mockAppend).toHaveBeenCalledOnce()
  })
})
