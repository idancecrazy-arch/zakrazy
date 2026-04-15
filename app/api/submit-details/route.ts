import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { z } from 'zod'
import { google } from 'googleapis'

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  address1: z.string().min(3),
  address2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  zip: z.string().min(3),
  country: z.string().min(1),
  kidsAttending: z.coerce.number().int().min(0).optional(),
  hotelBlockInterest: z.boolean().optional(),
  notes: z.string().optional(),
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

  const submission = {
    ...parsed.data,
    submittedAt: new Date().toISOString(),
    ip: req.headers.get('x-forwarded-for') ?? 'unknown',
  }

  // ── Persist to file ──────────────────────────────────────────────
  // In development: writes to /data/submissions.json in project root.
  // On Vercel: the project root is read-only; set DATA_DIR=/tmp to use
  // the writable tmp directory (ephemeral — use a database for production).
  const dataDir = process.env.DATA_DIR ?? path.join(process.cwd(), 'data')
  const dataFile = path.join(dataDir, 'submissions.json')

  try {
    await fs.mkdir(dataDir, { recursive: true })

    let existing: unknown[] = []
    try {
      const raw = await fs.readFile(dataFile, 'utf-8')
      existing = JSON.parse(raw)
    } catch {
      // file doesn't exist yet — start fresh
    }

    existing.push(submission)
    await fs.writeFile(dataFile, JSON.stringify(existing, null, 2), 'utf-8')
  } catch (err) {
    // Non-fatal: log and continue — the submission is still returned OK
    console.error('Could not write submissions file:', err)
  }

  // ── Google Sheets ────────────────────────────────────────────────
  // Set these env vars to enable:
  //   GOOGLE_SHEET_ID              — the spreadsheet ID from the URL
  //   GOOGLE_SERVICE_ACCOUNT_EMAIL — service account client_email
  //   GOOGLE_PRIVATE_KEY           — service account private_key (newlines as \n)
  // The sheet must be shared (Editor) with the service account email and with
  // christineandmichaelzak@gmail.com.
  const sheetId = process.env.GOOGLE_SHEET_ID
  const saEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (sheetId && saEmail && privateKey) {
    try {
      const auth = new google.auth.JWT({
        email: saEmail,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      })
      const sheets = google.sheets({ version: 'v4', auth })
      await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: 'Sheet1',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[
            submission.submittedAt,
            parsed.data.fullName,
            parsed.data.email,
            parsed.data.address1,
            parsed.data.address2 ?? '',
            parsed.data.city,
            parsed.data.state,
            parsed.data.zip,
            parsed.data.country,
            parsed.data.kidsAttending ?? 0,
            parsed.data.hotelBlockInterest ? 'Yes' : 'No',
            parsed.data.notes ?? '',
          ]],
        },
      })
    } catch (err) {
      console.error('Google Sheets write failed:', err)
    }
  }

  // ── Optional: email notification via Resend ──────────────────────
  // Set RESEND_API_KEY and NOTIFICATION_EMAIL env vars to enable.
  const resendKey = process.env.RESEND_API_KEY
  const notifyEmail = process.env.NOTIFICATION_EMAIL

  if (resendKey && notifyEmail) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Wedding Website <noreply@resend.dev>',
          to: notifyEmail,
          subject: `New RSVP detail submission — ${parsed.data.fullName}`,
          text: [
            `Name: ${parsed.data.fullName}`,
            `Email: ${parsed.data.email}`,
            `Address: ${parsed.data.address1}${parsed.data.address2 ? ', ' + parsed.data.address2 : ''}`,
            `         ${parsed.data.city}, ${parsed.data.state} ${parsed.data.zip}`,
            `         ${parsed.data.country}`,
            parsed.data.kidsAttending != null ? `Kids attending: ${parsed.data.kidsAttending}` : '',
            `Hotel block interest: ${parsed.data.hotelBlockInterest ? 'Yes' : 'No'}`,
            parsed.data.notes ? `Notes: ${parsed.data.notes}` : '',
            `Submitted: ${submission.submittedAt}`,
          ]
            .filter(Boolean)
            .join('\n'),
        }),
      })
    } catch (err) {
      console.error('Resend notification failed:', err)
    }
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
