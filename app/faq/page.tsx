import { Metadata } from 'next'
import ComingSoon from '@/components/ComingSoon'

export const metadata: Metadata = {
  title: 'FAQ',
}

export default function FAQPage() {
  return <ComingSoon title="FAQ" />
}
