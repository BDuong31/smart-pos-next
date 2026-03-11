import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostHeader = request.headers.get('host'); 
  if (!hostHeader) {
    return NextResponse.next();
  }

  const isAdminSubdomain = hostHeader.startsWith('admin.');

  if (isAdminSubdomain) {
    url.pathname = `/admin${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  console.log('No subdomain rewrite applied.');

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};