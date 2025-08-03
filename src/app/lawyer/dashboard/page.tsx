'use client';

import { useAuth } from "@/contexts/AuthContext";
import { redirect } from "next/navigation";
import { DashboardTabs } from "@/components/ui/dashboard-tabs";

export default function LawyerDashboardPage() {
  const { user, isAuthenticated } = useAuth();

  if(!isAuthenticated) {
    redirect('/lawyer');
  }


  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Welcome {user?.email || 'Guest'}</h2>
      <div className="flex w-full justify-center">

      <DashboardTabs></DashboardTabs>
      </div>
    </div>
      );
}