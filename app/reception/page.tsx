import { Metadata } from 'next'
import ComingSoon from '@/components/ComingSoon'

export const metadata: Metadata = { title: 'Reception' }

export default function ReceptionPage() {
  return <ComingSoon title="Reception" subtitle="Details to Follow" />
}
