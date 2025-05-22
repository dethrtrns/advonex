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
  const handleAuthSuccess = (authData: any, userRoles: string[] | undefined) => {
    console.log("handleAuthSuccess triggered.");
    console.log("Received authData:", JSON.stringify(authData, null, 2));
    console.log("Received userRoles:", userRoles);

    // Attempt to get tokens for the alert
    const accessToken = authData?.accessToken;
    const refreshToken = authData?.refreshToken;

    if (accessToken && refreshToken) {
      alert(`Authentication Successful!\nAccess Token: ${accessToken}\nRefresh Token: ${refreshToken}`);
    } else {
      console.warn("Token information incomplete. authData:", authData);
      alert("Authentication Successful! (Token info might be partial or missing in alert)");
    }

    setOpen(false); // Close the dialog

    // Robust check for roles and redirection
    let isLawyer = false;
    if (Array.isArray(userRoles)) {
      // Check for "LAWYER" case-insensitively
      isLawyer = userRoles.some(role => typeof role === 'string' && role.toUpperCase() === "LAWYER");
      console.log(`Role check: Is Lawyer? ${isLawyer}. Roles provided: ${userRoles.join(', ')}`);
    } else {
      console.log("User roles are undefined or not an array. Defaulting redirection.");
    }

    if (isLawyer) {
      console.log("Redirecting to /lawyer/dashboard");
      window.location.href = "/lawyer/dashboard";
    } else {
      console.log("Redirecting to / (default, client, or no specific lawyer role found)");
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
            {/* <TabsTrigger className="font-bold tracking-wide" value="phone">PHONE</TabsTrigger> */}
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