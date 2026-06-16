import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const childSchema = z.object({
  name: z.string().min(1),
  age: z.string().min(1),
  highChair: z.boolean(),
})

const partyMemberSchema = z.object({
  name: z.string().min(1),
  attending: z.boolean(),
  dietaryRestrictions: z.string().optional(),
  welcomeReception: z.boolean().optional(),
})

const schema = z.object({
  guestName: z.string().min(1, 'Name is required'),
  attending: z.boolean(),
  updateContact: z.boolean().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  address1: z.string().optional(),
  address2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  plusOneName: z.string().optional(),
  children: z.array(childSchema).optional(),
  partyMembers: z.array(partyMemberSchema).optional(),
  dietaryRestrictions: z.string().optional(),
  welcomeReception: z.boolean().optional(),
})

async function createRecord(
  base: string,
  table: string,
  key: string,
  fields: Record<string, unknown>,
): Promise<void> {
  const res = await fetch(
    `https://api.airtable.com/v0/${encodeURIComponent(base)}/${encodeURIComponent(table)}`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      // typecast lets Airtable accept guest names that aren't already options on
      // a single-select "Guest Name" field — required now that each guest is
      // submitted individually rather than as one combined name.
      body: JSON.stringify({ fields, typecast: true }),
    },
  )
  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    console.error('Airtable record creation failed:', res.status, errText)
    throw new Error(`Airtable error ${res.status}`)
  }
}

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
  const airtableTable = process.env.AIRTABLE_RSVP_TABLE ?? 'table_2'

  if (!airtableKey || !airtableBase) {
    return NextResponse.json({ error: 'Airtable not configured' }, { status: 503 })
  }

  try {
    // Primary guest record
    const primaryFields: Record<string, unknown> = {
      'Guest Name': data.guestName,
      'RSVP Status': data.attending ? 'Accepted' : 'Declined',
      'Submitted Timestamp': submittedAt,
    }
    if (data.updateContact) {
      if (data.email) primaryFields['Email'] = data.email
      if (data.phone) primaryFields['Phone'] = data.phone
      if (data.address1) primaryFields['Address'] = [data.address1, data.address2, data.city, data.state, data.zip].filter(Boolean).join(', ')
    }
    // Party-level details are gated by the client (only sent when someone in
    // the party is attending), so save whatever is present — even if the
    // primary guest themselves declined while another party member accepted.
    if (data.plusOneName) primaryFields['Plus One Name'] = data.plusOneName
    if (data.children && data.children.length > 0) primaryFields['Children'] = JSON.stringify(data.children)
    if (data.dietaryRestrictions) primaryFields['Dietary Restrictions'] = data.dietaryRestrictions
    if (data.welcomeReception !== undefined) primaryFields['Welcome Reception'] = data.welcomeReception
    await createRecord(airtableBase, airtableTable, airtableKey, primaryFields)

    // One record per additional party member
    if (data.partyMembers && data.partyMembers.length > 0) {
      for (const member of data.partyMembers) {
        const memberFields: Record<string, unknown> = {
          'Guest Name': member.name,
          'Primary Guest': data.guestName,
          'RSVP Status': member.attending ? 'Accepted' : 'Declined',
          'Submitted Timestamp': submittedAt,
        }
        if (member.dietaryRestrictions) memberFields['Dietary Restrictions'] = member.dietaryRestrictions
        if (member.welcomeReception !== undefined) memberFields['Welcome Reception'] = member.welcomeReception
        await createRecord(airtableBase, airtableTable, airtableKey, memberFields)
      }
    }
  } catch (err) {
    console.error('RSVP save failed:', err)
    return NextResponse.json({ error: 'Failed to save RSVP' }, { status: 502 })
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
