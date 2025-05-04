"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: 'LAWYER' | 'CLIENT';
};

export default function ProtectedRoute({ 
  children, 
  requiredRole 
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store the attempted URL to redirect back after login
      sessionStorage.setItem('redirectAfterLogin', pathname || '/');
      router.push('/');
      return;
    }

    if (!isLoading && isAuthenticated && requiredRole && user?.role !== requiredRole) {
      // User is authenticated but doesn't have the required role
      router.push(user?.role === 'LAWYER' ? '/lawyer/dashboard' : '/client');
    }
  }, [isLoading, isAuthenticated, user, requiredRole, router, pathname]);

  // Show nothing while checking authentication
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If authentication check is complete and user is authenticated
  // (and has required role if specified), render children
  if (isAuthenticated && (!requiredRole || user?.role === requiredRole)) {
    return <>{children}</>;
  }

  // Otherwise render nothing
  return null;
}