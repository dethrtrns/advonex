"use client";

import { cn } from "@/lib/utils";
import { Button } from "../liquid-glass-button";
// import { LoginForm } from "@/hooks/login/login-form";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { liquidGlassClasses, liquidGlassStyle } from "../ui/liquid-glass";

export default function SwipeUpDrawer() {
  const drawerProps = {
    isOpen: true,
    title: "Sign In",
    Description: "Enter your email to receive a one-time password.",
    closeButtonText: "Skip Login",
  };

  return (
    <Drawer
      open={drawerProps.isOpen}
      onOpenChange={close}>
      <DrawerContent
        className={cn(liquidGlassClasses, "max-w-fit h-1/2 mx-4 p-6  ")}
        // 2. Apply the style object for the backdrop-filter.
        style={liquidGlassStyle}
        // className="max-w-fit h-1/2 mx-auto p-6 bg-transparent border-none"
      >
        <DrawerHeader>
          <DrawerTitle className="flex justify-center font-serif text-2xl font-semibold gap-2.5 tracking-tighter">
            {drawerProps.title}
          </DrawerTitle>
          <DrawerDescription>{drawerProps.Description}</DrawerDescription>
        </DrawerHeader>
        {/* render children here */}
        <DrawerFooter>
          <DrawerClose asChild>
            <Button
              variant="outline"
              onClick={close}>
              {drawerProps.closeButtonText}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
