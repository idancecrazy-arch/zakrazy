import type { Metadata } from 'next'
import {
  Italiana,
  Poiret_One,
  Crimson_Pro,
  Lora,
  Work_Sans,
} from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { COUPLE, VENUE, SITE_URL } from '@/lib/constants'

const italiana = Italiana({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-italiana',
  display: 'swap',
})

const poiretOne = Poiret_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-poiret-one',
  display: 'swap',
})

const crimsonPro = Crimson_Pro({
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-crimson-pro',
  display: 'swap',
})

const lora = Lora({
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
})

const workSans = Work_Sans({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-work-sans',
  display: 'swap',
})

const fontVars = [
  italiana.variable,
  poiretOne.variable,
  crimsonPro.variable,
  lora.variable,
  workSans.variable,
].join(' ')

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `Save the Date — ${COUPLE.displayNames} · September 12, 2026`,
    template: `%s — ${COUPLE.displayNames}`,
  },
  description: `${COUPLE.displayNames} are getting married on September 12, 2026 at ${VENUE.shortName} in ${VENUE.neighborhood}, ${VENUE.city}. Save the date!`,
  openGraph: {
    type: 'website',
    siteName: `${COUPLE.displayNames} Wedding`,
    title: `Save the Date — ${COUPLE.displayNames} · September 12, 2026`,
    description: `Join us in celebrating the marriage of ${COUPLE.displayNames} on September 12, 2026 at ${VENUE.shortName}, Greenwich Village, New York.`,
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${fontVars} h-full`}>
      <body className="min-h-full flex flex-col bg-ivory text-dark-taupe antialiased">
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
