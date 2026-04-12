import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostHeader = request.headers.get('host'); 
  if (!hostHeader) {
    return NextResponse.next();
  }

  const isAdminSubdomain = hostHeader.startsWith('admin.');
  const isKitchenSubdomain = hostHeader.startsWith('kitchen.');

  if (isAdminSubdomain) {
    console.log('Admin subdomain detected. Rewriting URL to /admin.');
    url.pathname = `/admin${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  if (isKitchenSubdomain) {
    console.log('Kitchen subdomain detected. Rewriting URL to /kitchen.');
    url.pathname = `/kitchen${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  console.log('No subdomain rewrite applied.');

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};