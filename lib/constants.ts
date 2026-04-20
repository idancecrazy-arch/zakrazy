export const WEDDING_DATE = new Date('2026-09-12T16:00:00-04:00')

export const COUPLE = {
  partner1: { first: 'Christine', last: 'Liu' },
  partner2: { first: 'Michael', last: 'Zakrajsek' },
  displayNames: 'Christine & Michael',
  initials: 'C & M',
}

export const VENUE = {
  name: 'The Church of St. Joseph of the Holy Family',
  shortName: "St. Joseph's Church",
  address: '371 Sixth Avenue',
  city: 'New York',
  state: 'NY',
  zip: '10014',
  neighborhood: 'Greenwich Village',
  googleMapsUrl: 'https://maps.google.com/?q=371+Sixth+Avenue+New+York+NY+10014',
  googleMapsEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.2!2d-74.0021!3d40.7331!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2598a4ae37769%3A0x8b60d4a9d58cdd4a!2sSt.%20Joseph&#39;s%20Church!5e0!3m2!1sen!2sus!4v1',
}

export const RECEPTION_VENUE = {
  name: 'Golden Unicorn Restaurant',
  shortName: 'Golden Unicorn',
  address: '18 East Broadway',
  city: 'New York',
  state: 'NY',
  zip: '10002',
  neighborhood: 'Chinatown',
  googleMapsUrl: 'https://maps.google.com/?q=18+East+Broadway+New+York+NY+10002',
}

export const CONTACT_EMAIL = 'christineandmichaelzak@gmail.com'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zakrazy.vercel.app'

export const CHURCH_HISTORY = `
St. Joseph's Church was built in 1833 and is one of the oldest Roman Catholic church
buildings in Manhattan still in active use. Designed in the Greek Revival style, the
church's Doric columns and coffered ceiling create an atmosphere of solemn beauty.
The Transfiguration altarpiece — bathed in warm candlelight — has witnessed generations
of faith, devotion, and love in the heart of Greenwich Village.
`.trim()
