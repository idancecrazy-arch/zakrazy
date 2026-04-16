import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const auth = request.cookies.get('auth')
  if (auth?.value === 'granted') {
    return NextResponse.next()
  }

  const from = request.nextUrl.pathname + request.nextUrl.search
  const enterUrl = new URL('/enter', request.url)
  enterUrl.searchParams.set('from', from)
  return NextResponse.redirect(enterUrl)
}

export const config = {
  matcher: ['/((?!enter|api/auth|_next|favicon\\.ico).*)'],
}
