"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePathname } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PhoneAuth } from "./phone-auth";
import { EmailAuth } from "./email-auth";

import { isAuthenticated, logout, getAccessToken } from "@/services/authService/authService";



export function RegisterDialog() {
  const [open, setOpen] = useState(false);
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('email');
  const pathname = usePathname();
  const isLawyerRoute = pathname?.startsWith('/lawyer');
  const defaultRole = isLawyerRoute ? "lawyer" : "client";


  // Handle changing authentication method
  const handleAuthMethodChange = (method: 'phone' | 'email') => {
    setAuthMethod(authMethod);
  };

  // Common function to handle successful authentication
  const handleAuthSuccess = (data: any, role: string) => {
    // Show token in alert for testing purposes
    console.log("OTP verified successfully");
    alert(`Access Token: ${data.accessToken}\n\nRefresh Token: ${data.refreshToken}`);

    setOpen(false); // Close the dialog

    // Handle redirection
    if (role === "lawyer") {
      window.location.href = "/lawyer/dashboard";
    } else {
      window.location.href = "/";
    }
  };


   

  return (
    <div> 
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>   
        <Button> Sign Up / Register</Button>
        
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign In / Register</DialogTitle>
        </DialogHeader>
    
        <Tabs defaultValue="email" className="w-full" onValueChange={(value: string) => handleAuthMethodChange(value as 'phone' | 'email')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger className="font-bold tracking-wide" value="email">EMAIL</TabsTrigger>
            <TabsTrigger className="font-bold tracking-wide" value="phone">PHONE</TabsTrigger>
          </TabsList>
          <div className="h-8"></div>
          <TabsContent value="phone">
            <PhoneAuth 
              defaultRole={defaultRole} 
              onAuthSuccess={handleAuthSuccess} 
            />
          </TabsContent>
          
          <TabsContent value="email">
            <EmailAuth 
              defaultRole={defaultRole} 
              onAuthSuccess={handleAuthSuccess} 
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
    </div>
  );
}