import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Example: Protect /dashboard and /profile routes (require token)
const PROTECTED_PATHS = ['/dashboard', '/profile'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));

  // Example: Check for auth token (from cookies)
  if (isProtected) {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // You can add more logic, e.g. logging, custom headers, etc.

  return NextResponse.next();
}

// Specify which paths to match (optional, for performance)
export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
};
