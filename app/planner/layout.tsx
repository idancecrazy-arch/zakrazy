export default function PlannerLayout({ children }: { children: React.ReactNode }) {
  // Full-screen overlay so the main site nav/footer are hidden
  return (
    <div className="fixed inset-0 z-[9999] bg-ivory overflow-y-auto">
      {children}
    </div>
  )
}
