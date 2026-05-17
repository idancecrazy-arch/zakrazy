import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const childSchema = z.object({
  name: z.string().min(1, 'Child name is required'),
  age: z.string().min(1, 'Child age is required'),
  highChair: z.boolean(),
})

const schema = z.object({
  recordId: z.string().min(1, 'Record ID is required'),
  guestName: z.string().min(1),
  attending: z.boolean(),
  plusOneName: z.string().optional(),
  children: z.array(childSchema).optional(),
  dietaryRestrictions: z.string().optional(),
  specialRequests: z.string().optional(),
  hotelInterest: z.boolean().optional(),
})

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 422 },
    )
  }

  const {
    recordId,
    guestName,
    attending,
    plusOneName,
    children,
    dietaryRestrictions,
    specialRequests,
    hotelInterest,
  } = parsed.data

  const submittedAt = new Date().toISOString()

  console.log('RSVP_SUBMISSION', JSON.stringify({
    recordId,
    guestName,
    attending,
    plusOneName,
    children,
    dietaryRestrictions,
    specialRequests,
    hotelInterest,
    submittedAt,
  }))

  const airtableKey = process.env.AIRTABLE_API_KEY
  const airtableBase = process.env.AIRTABLE_BASE_ID
  const airtableTable = process.env.AIRTABLE_GUEST_TABLE ?? 'Guest List'

  const fields: Record<string, unknown> = {
    'RSVP Status': attending ? 'Accepted' : 'Declined',
    'Hotel Interest': hotelInterest ?? false,
    'Submitted Timestamp': submittedAt,
  }

  if (attending) {
    if (plusOneName) fields['Plus One Name'] = plusOneName
    if (children && children.length > 0) {
      fields['Children'] = JSON.stringify(children)
    }
    if (dietaryRestrictions) fields['Dietary Restrictions'] = dietaryRestrictions
    if (specialRequests) fields['Special Requests'] = specialRequests
  }

  const res = await fetch(
    `https://api.airtable.com/v0/${encodeURIComponent(airtableBase!)}/${encodeURIComponent(airtableTable)}/${encodeURIComponent(recordId)}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${airtableKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    },
  )

  if (!res.ok) {
    const errText = await res.text()
    console.error('Airtable RSVP patch failed:', errText)
    return NextResponse.json({ error: 'Failed to save RSVP' }, { status: 502 })
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
