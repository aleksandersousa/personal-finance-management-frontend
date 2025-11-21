import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/dashboard', '/entries', '/forecast', '/summary'];
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const refreshToken = request.cookies.get('refreshToken')?.value;
  const accessToken = request.cookies.get('accessToken')?.value;

  if (!refreshToken && !accessToken) {
    console.log('No tokens found, redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (refreshToken && !accessToken) {
    console.log(
      'Access token missing, but refresh token present - allowing through'
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     * - logout (logout page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|logout).*)',
  ],
};
