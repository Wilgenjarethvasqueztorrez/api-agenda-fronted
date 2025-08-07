import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const protectedRoutes = [
  '/carreras',
  '/usuarios', 
  '/grupos',
  '/invitaciones',
  '/notificaciones',
  '/perfil'
]

// Routes that should redirect to dashboard if authenticated
const authRoutes = [
  '/login'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Since we're using localStorage for tokens, middleware can't access them
  // The client-side AuthContext will handle all authentication checks
  // This middleware is mainly for handling direct URL access
  
  // Allow all routes to pass through - client-side will handle redirects
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 