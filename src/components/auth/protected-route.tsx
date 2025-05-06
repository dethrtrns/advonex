"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader } from 'lucide-react';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: 'LAWYER' | 'CLIENT';
};

// This component protects routes that require authentication
// It can also enforce specific role requirements (LAWYER or CLIENT)

export default function ProtectedRoute({ 
  children, 
  requiredRole 
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();  // Correctly initialize the router hook
  const pathname = usePathname();  // Correctly initialize the pathname hook
  
  // If not authenticated, redirect to home and store intended destination
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      sessionStorage.setItem('redirectAfterLogin', pathname || '/');
      router.push('/');  
      return;
    }

    // If authenticated but wrong role, redirect to appropriate dashboard
    if (!isLoading && isAuthenticated && requiredRole && user?.role !== requiredRole) {
      router.push(user?.role === 'LAWYER' ? '/lawyer/dashboard' : '/client');
    }
  }, [isLoading, isAuthenticated, user, requiredRole, router, pathname]);
  
  // Show loading state or render children based on authentication status
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[50vh]">
    <Loader className="h-8 w-8 animate-spin text-primary" />
  </div>; // You might want to replace this with a proper loading component
  }
  
  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    return null; // Don't render anything while redirecting to the correct dashboard
  }
  
  return <>{children}</>;
}