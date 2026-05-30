import { NextResponse, type NextRequest } from 'next/server';
import { DEMO_SESSION_COOKIE } from '@/lib/demo';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard');
  const hasDemoSession = request.cookies.get(DEMO_SESSION_COOKIE)?.value === 'active';

  if (isProtectedRoute && !user && !hasDemoSession) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/login';
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
