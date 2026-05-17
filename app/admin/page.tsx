import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminDashboard from '@/components/admin/AdminDashboard'

export const metadata: Metadata = {
  title: 'RSVP Dashboard',
}

export default async function AdminPage() {
  const cookieStore = await cookies()
  const auth = cookieStore.get('planner-auth')
  if (auth?.value !== 'granted') {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-ivory pt-36 sm:pt-40 pb-24 px-5 sm:px-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex flex-col gap-2 mb-12">
          <p className="font-work-sans text-[10px] tracking-[0.25em] uppercase text-soft-gray">
            Admin
          </p>
          <h1 className="font-italiana text-4xl sm:text-5xl text-dark-taupe tracking-wide">
            RSVP Dashboard
          </h1>
          <p className="font-crimson italic text-base text-deep-ivory">
            Christine &amp; Michael · September 12, 2026
          </p>
        </div>

        <AdminDashboard />

      </div>
    </div>
  )
}
