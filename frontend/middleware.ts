import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const PROTECTED_PATHS = ['/dashboard', '/profile'];
const AUTH_PAGES = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
  const isAuthPage = AUTH_PAGES.some((path) => pathname.startsWith(path));

  // Check token using next-auth/jwt (supports all session strategies)
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Prevent authenticated users from accessing login/register
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Protect dashboard/profile
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/login', '/register'],
};
