import { NextRequest, NextResponse } from 'next/server';

const redirectMap: Record<string, string> = {
  '/quiz': '/ai-persona/quiz',
  '/upload': '/ai-persona/upload',
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname in redirectMap) {
    return NextResponse.redirect(new URL(redirectMap[pathname], req.url));
  }

  if (pathname.startsWith('/result/')) {
    return NextResponse.redirect(new URL(`/ai-persona${pathname}`, req.url));
  }

  if (pathname === '/ai-persona/quiz') {
    return NextResponse.rewrite(new URL('/quiz', req.url));
  }

  if (pathname === '/ai-persona/upload') {
    return NextResponse.rewrite(new URL('/upload', req.url));
  }

  if (pathname.startsWith('/ai-persona/result/')) {
    return NextResponse.rewrite(new URL(pathname.replace('/ai-persona', ''), req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/quiz', '/upload', '/result/:path*', '/ai-persona/quiz', '/ai-persona/upload', '/ai-persona/result/:path*'],
};
