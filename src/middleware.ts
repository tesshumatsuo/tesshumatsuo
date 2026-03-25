import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const handleI18n = createMiddleware(routing)

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect /studio paths
  if (pathname.startsWith('/studio')) {
    // Exception for the login page and its dependencies
    if (pathname.startsWith('/studio/login') || pathname.startsWith('/api/studio/login')) {
      return NextResponse.next()
    }

    const session = request.cookies.get('studio-session')
    if (!session) {
      // Redirect to login page
      const url = request.nextUrl.clone()
      url.pathname = '/studio/login'
      return NextResponse.redirect(url)
    }
  }

  // Handle i18n for other routes
  return handleI18n(request)
}

export const config = {
  // Match all paths except: api (non-studio), _next, static files, favicon
  // Note: We need to INCLUDE /studio in the matcher now to protect it
  matcher: ['/((?!api/contact|_next|.*\\..*).*)'],
}
