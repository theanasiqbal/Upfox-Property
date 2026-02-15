'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { User } from '@/lib/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: User['role'];
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const { currentUser, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!currentUser) {
      router.push('/auth/login');
      return;
    }

    if (requiredRole && currentUser.role !== requiredRole) {
      // Redirect based on user role
      if (currentUser.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard/seller');
      }
      return;
    }
  }, [currentUser, isLoading, router, requiredRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}
