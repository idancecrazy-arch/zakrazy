import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { isPlannerAuthed } from '../../lib/plannerAuth'

export default async function PlannerLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  if (!(await isPlannerAuthed(cookieStore.get('planner-auth')?.value))) {
    redirect('/planner/login')
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-ivory overflow-y-auto">
      {children}
    </div>
  )
}
