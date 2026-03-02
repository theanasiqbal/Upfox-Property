import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

const PROTECTED_ADMIN = ['/admin'];
const PROTECTED_SELLER = ['/dashboard/seller'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = PROTECTED_ADMIN.some((r) => pathname.startsWith(r));
  const isSellerRoute = PROTECTED_SELLER.some((r) => pathname.startsWith(r));

  if (!isAdminRoute && !isSellerRoute) return NextResponse.next();

  const token = request.cookies.get('token')?.value;

  if (!token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const payload = await verifyToken(token);

    // Admin route — must be admin role
    if (isAdminRoute && payload.role !== 'admin') {
      // Redirect sellers to their dashboard, buyers to home
      const fallback = payload.role === 'seller' ? '/dashboard/seller' : '/';
      return NextResponse.redirect(new URL(fallback, request.url));
    }

    // Seller dashboard — requires seller or admin role (buyers not allowed)
    if (isSellerRoute && payload.role === 'buyer') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch {
    // Token invalid/expired — redirect to login
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/seller/:path*'],
};
