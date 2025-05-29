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
  const { user, isAuthenticating, isAuthenticated } = useAuth();
  const router = useRouter();  // Correctly initialize the router hook
  const pathname = usePathname();  // Correctly initialize the pathname hook
  
  // If not authenticated, redirect to home and store intended destination
  useEffect(() => {
    if (!isAuthenticating && !isAuthenticated) {
      sessionStorage.setItem('redirectAfterLogin', pathname || '/');
      router.push('/');  
      return;
    }

    // If authenticated but wrong role, redirect to appropriate dashboard
    if (!isAuthenticating && isAuthenticated && requiredRole && user?.roles.includes('LAWYER') ) {
      router.push(user?.roles.includes('LAWYER') ? '/lawyer/dashboard' : '/client');
    }
  }, [isAuthenticating, isAuthenticated, user, requiredRole, router, pathname]);
  
  // Show loading state or render children based on authentication status
  if (isAuthenticating) {
    return <div className="flex justify-center items-center min-h-[50vh]">
    <Loader className="h-8 w-8 animate-spin text-primary" />
  </div>; // You might want to replace this with a proper loading component
  }
  
  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }
  
  if (requiredRole && !user?.roles.includes('LAWYER') ) {
    return null; // Don't render anything while redirecting to the correct dashboard
  }
  
  return <>{children}</>;
}