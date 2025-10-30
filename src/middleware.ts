import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // // Allow login page to be accessed
  // if (request.nextUrl.pathname.startsWith('/admin/login')) {
  //   return NextResponse.next();
  // }

  // // Simple mock authentication check for admin routes
  // const isAdminAuthenticated = request.cookies.get('admin-auth')?.value === 'true';

  // if (request.nextUrl.pathname.startsWith('/admin') && !isAdminAuthenticated) {
  //   return NextResponse.redirect(new URL('/admin/login', request.url));
  // }
  
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    }
  });
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
