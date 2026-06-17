// Auth for the planner portal is enforced in proxy.ts, which redirects
// unauthenticated /planner/* requests to /planner/login while exempting the
// login page itself. This layout must NOT re-gate, because it also wraps
// /planner/login — redirecting there from here loops the login page forever
// (ERR_TOO_MANY_REDIRECTS).
export default function PlannerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[9999] bg-ivory overflow-y-auto">
      {children}
    </div>
  )
}
