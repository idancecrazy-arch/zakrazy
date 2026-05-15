import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Planner portal: separate auth layer
  if (pathname.startsWith('/planner')) {
    if (pathname === '/planner/login') return NextResponse.next()
    const plannerAuth = request.cookies.get('planner-auth')
    if (plannerAuth?.value === 'granted') return NextResponse.next()
    return NextResponse.redirect(new URL('/planner/login', request.url))
  }

  // Main site auth
  const auth = request.cookies.get('auth')
  if (auth?.value === 'granted') return NextResponse.next()

  const from = pathname + request.nextUrl.search
  const enterUrl = new URL('/enter', request.url)
  enterUrl.searchParams.set('from', from)
  return NextResponse.redirect(enterUrl)
}

export const config = {
  matcher: ['/((?!enter|api/auth|api/planner-auth|api/planner-state|_next|favicon\\.ico).*)'],
}
