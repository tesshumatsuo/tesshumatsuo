import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const handleI18n = createMiddleware(routing)

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Ignore /studio path for i18n handling
  if (pathname.startsWith('/studio')) {
    return NextResponse.next()
  }

  // Handle i18n for other routes
  return handleI18n(request)
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
