import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function PlannerLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const auth = cookieStore.get('planner-auth')
  if (auth?.value !== 'granted') {
    redirect('/planner/login')
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-ivory overflow-y-auto">
      {children}
    </div>
  )
}
