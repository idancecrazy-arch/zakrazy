'use client'

function makeICS(event: {
  summary: string
  location: string
  description: string
  start: string
  end: string
  uid: string
}) {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Christine & Michael//Wedding//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.uid}`,
    `DTSTART:${event.start}`,
    `DTEND:${event.end}`,
    `SUMMARY:${event.summary}`,
    `LOCATION:${event.location}`,
    `DESCRIPTION:${event.description}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

function downloadICS(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const CEREMONY_ICS = makeICS({
  summary: "Christine & Michael's Wedding Ceremony",
  location: "St. Joseph's Church, 371 Sixth Avenue, New York, NY 10014",
  description: 'Wedding ceremony for Christine Liu & Michael Zakrajsek',
  start: '20260912T173000Z', // 1:30pm EDT (UTC-4)
  end: '20260912T190000Z',   // 3:00pm EDT
  uid: 'ceremony-zakrazy-2026@christineandmichaelzak.com',
})

const RECEPTION_ICS = makeICS({
  summary: "Christine & Michael's Wedding Reception",
  location: 'Golden Unicorn Restaurant, 18 East Broadway, New York, NY 10002',
  description: 'Wedding reception for Christine Liu & Michael Zakrajsek',
  start: '20260912T210000Z', // 5:00pm EDT (UTC-4)
  end: '20260913T020000Z',   // 10:00pm EDT
  uid: 'reception-zakrazy-2026@christineandmichaelzak.com',
})

const btnClass =
  'flex-1 font-work-sans text-[11px] tracking-[0.15em] uppercase px-6 py-3.5 min-h-[48px] border border-gold-line text-dark-taupe hover:bg-blush transition-colors duration-200 text-center'

export default function CalendarDownload() {
  return (
    <div className="flex flex-col gap-3 w-full">
      <p className="font-work-sans text-[10px] tracking-[0.2em] uppercase text-soft-gray text-center">
        Add to Calendar
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => downloadICS('ceremony.ics', CEREMONY_ICS)}
          className={btnClass}
        >
          Ceremony
        </button>
        <button
          type="button"
          onClick={() => downloadICS('reception.ics', RECEPTION_ICS)}
          className={btnClass}
        >
          Reception
        </button>
      </div>
    </div>
  )
}
