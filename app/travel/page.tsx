import { Metadata } from 'next'
import ComingSoon from '@/components/ComingSoon'

export const metadata: Metadata = { title: 'Travel & Accommodations' }

export default function TravelPage() {
  return <ComingSoon title="Travel & Accommodations" subtitle="Details to Follow" />
}
