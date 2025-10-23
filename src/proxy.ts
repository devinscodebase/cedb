import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

/**
 * Next.js Proxy (formerly Middleware)
 * 
 * This proxy runs on every request and handles:
 * - Session refresh for authenticated users
 * - Cookie management for Supabase auth
 * 
 * The proxy will automatically refresh expired sessions
 * and keep users logged in as they navigate the app.
 * 
 * You can add additional logic here for:
 * - Route protection (redirect unauthenticated users)
 * - Role-based access control
 * - Analytics tracking
 * - etc.
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

/**
 * Proxy configuration
 * 
 * Specify which routes this proxy should run on.
 * The default config below runs on all routes except:
 * - _next/static (static files)
 * - _next/image (image optimization)
 * - favicon.ico (favicon)
 * - Public files (images, etc.)
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

