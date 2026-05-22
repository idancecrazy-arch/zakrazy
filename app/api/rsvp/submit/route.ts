import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const childSchema = z.object({
  name: z.string().min(1),
  age: z.string().min(1),
  highChair: z.boolean(),
})

const schema = z.object({
  guestName: z.string().min(1, 'Name is required'),
  attending: z.boolean(),
  // Contact update (optional)
  updateContact: z.boolean().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  address1: z.string().optional(),
  address2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  // Party
  plusOneName: z.string().optional(),
  children: z.array(childSchema).optional(),
  // Other
  dietaryRestrictions: z.string().optional(),
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

  const data = parsed.data
  const submittedAt = new Date().toISOString()

  console.log('RSVP_SUBMISSION', JSON.stringify({ ...data, submittedAt }))

  const airtableKey = process.env.AIRTABLE_API_KEY
  const airtableBase = process.env.AIRTABLE_BASE_ID
  const airtableTable = process.env.AIRTABLE_GUEST_TABLE ?? 'Guest List'

  if (!airtableKey || !airtableBase) {
    return NextResponse.json({ error: 'Airtable not configured' }, { status: 503 })
  }

  const fields: Record<string, unknown> = {
    'Guest Name': data.guestName,
    'RSVP Status': data.attending ? 'Accepted' : 'Declined',
    'Hotel Interest': data.hotelInterest ?? false,
    'Submitted Timestamp': submittedAt,
  }

  if (data.updateContact) {
    if (data.email) fields['Email'] = data.email
    if (data.phone) fields['Phone'] = data.phone
    if (data.address1) fields['Address'] = [data.address1, data.address2, data.city, data.state, data.zip].filter(Boolean).join(', ')
  }

  if (data.attending) {
    if (data.plusOneName) fields['Plus One Name'] = data.plusOneName
    if (data.children && data.children.length > 0) fields['Children'] = JSON.stringify(data.children)
    if (data.dietaryRestrictions) fields['Dietary Restrictions'] = data.dietaryRestrictions
  }

  const res = await fetch(
    `https://api.airtable.com/v0/${encodeURIComponent(airtableBase)}/${encodeURIComponent(airtableTable)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${airtableKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    },
  )

  if (!res.ok) {
    const errText = await res.text()
    console.error('Airtable RSVP post failed:', errText)
    return NextResponse.json({ error: 'Failed to save RSVP' }, { status: 502 })
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
