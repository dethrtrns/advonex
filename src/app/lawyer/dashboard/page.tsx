'use client';

import { useAuth } from "@/contexts/AuthContext";
import { useLogin } from "@/hooks/login/useLogin";
import { redirect } from "next/navigation";;

export default function LawyerDashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const LoginModal = useLogin();

  if(!isAuthenticated) {
    redirect('/lawyer');
  }


  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Welcome {user?.email || 'Guest'}</h2>
    </div>
      );
}