import { NextRequest, NextResponse } from 'next/server';

// Define protected routes
const protectedRoutes = {
  admin: ['/admin'],
  seller: ['/dashboard/seller'],
};

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // // Check if it's an admin route
  // const isAdminRoute = protectedRoutes.admin.some((route) =>
  //   pathname.startsWith(route)
  // );

  // // Check if it's a seller route
  // const isSellerRoute = protectedRoutes.seller.some((route) =>
  //   pathname.startsWith(route)
  // );

  // // For protected routes, you would typically check for a JWT token or session
  // // This is a simplified example - in production, you'd validate the token
  // const userRole = request.cookies.get('userRole')?.value;
  // const isAuthenticated = request.cookies.get('authenticated')?.value === 'true';

  // // Redirect unauthenticated users trying to access protected routes
  // if ((isAdminRoute || isSellerRoute) && !isAuthenticated) {
  //   return NextResponse.redirect(new URL('/auth/login', request.url));
  // }

  // // Redirect users to appropriate dashboard based on role
  // if (isAdminRoute && userRole !== 'admin') {
  //   return NextResponse.redirect(new URL('/dashboard/seller', request.url));
  // }

  // if (isSellerRoute && userRole === 'admin') {
  //   return NextResponse.redirect(new URL('/admin', request.url));
  // }

  return NextResponse.next();
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    // Admin routes
    // '/admin/:path*',
    // Seller dashboard routes
    // '/dashboard/seller/:path*',
  ],
};
