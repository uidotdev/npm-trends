import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  if (pathname.includes('-vs-')) {
    const newPath = `/${pathname.substring(1).split('-vs-').sort().join('-vs-')}`;
    if (newPath !== pathname) {
      const url = new URL(origin + newPath);
      return NextResponse.redirect(url, 301);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}
