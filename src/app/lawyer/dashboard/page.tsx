"use client";

import LawyerProfile from "@/app/client/lawyers/[id]/page";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import {
  EyeIcon,
  HouseIcon,
  PanelsTopLeftIcon,
  Settings,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import { redirect } from "next/navigation";

export default function LawyerDashboardPage() {
  const { user, isAuthenticated } = useAuth();

  // if(!isAuthenticated) {
  //   redirect('/lawyer');
  // }

  return (
    <div>
      {/* <h1>Dashboard</h1>
      <h2>Welcome {user?.email || 'Guest'}</h2> */}
      <div className="flex w-full mt-8 justify-center">
        <Tabs defaultValue="tab-1">
          <ScrollArea>
            <TabsList className="flex w-full bg-background mb-3 h-auto -space-x-px p-0 shadow-xs rtl:space-x-reverse">
              <TabsTrigger
                value="tab-1"
                className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e">
                <UserIcon
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="tab-2"
                className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e">
                <SettingsIcon
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Account
              </TabsTrigger>
              <TabsTrigger
                value="tab-3"
                className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e">
                <EyeIcon
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Views
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <TabsContent
            style={{
              width: "80vw",
            }}
            className="w-100vw"
            value="tab-1">
            <LawyerProfile />
          </TabsContent>
          <TabsContent value="tab-2">
            <p className="text-accent-foreground p-4 pt-1 text-center text-xs">
              View your account details here. COMING SOON...
            </p>
          </TabsContent>
          <TabsContent value="tab-3">
            <p className="text-muted-foreground p-4 pt-1 text-center text-xs">
              Content for Tab 3
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
