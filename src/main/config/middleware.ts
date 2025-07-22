import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Rotas que precisam de autenticação
  const protectedPaths = ['/dashboard', '/entries', '/summary', '/forecast'];
  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath) {
    const tokensCookie = request.cookies.get('tokens');

    if (!tokensCookie?.value) {
      return NextResponse.redirect(new URL('/login', request.nextUrl.href));
    }

    try {
      const tokens = JSON.parse(tokensCookie.value);
      if (!tokens.accessToken) {
        return NextResponse.redirect(new URL('/login', request.nextUrl.href));
      }
    } catch {
      // Se não conseguir fazer parse do cookie, redirecionar para login
      return NextResponse.redirect(new URL('/login', request.nextUrl.href));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login|register).*)'],
};
