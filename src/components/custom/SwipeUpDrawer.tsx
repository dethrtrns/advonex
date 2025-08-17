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
  DrawerTrigger,
} from "../ui/drawer";
import { liquidGlassClasses, liquidGlassStyle } from "../ui/liquid-glass";
import { Dispatch, SetStateAction } from "react";

interface SwipeUpDrawerProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  title?: string;
  description?: string;
  closeButtonText?: string;
  children?: React.ReactNode;
}

export default function SwipeUpDrawer({
  isOpen,
  setIsOpen,
  title = "Awesome drawer!",
  description = "You're in a drawer! this is optional",
  closeButtonText = "Close",
  children,
}: SwipeUpDrawerProps) {
  return (
    <Drawer
      open={isOpen}
      onOpenChange={setIsOpen}>
      {/* <DrawerTrigger>hey</DrawerTrigger> */}
      <DrawerContent
        className={cn(liquidGlassClasses, "w-100vw min-h-1/2 mx-8 p-6 ")}
        style={liquidGlassStyle}
        // className="max-w-fit h-1/2 mx-auto p-6 bg-transparent border-none"
      >
        <DrawerHeader>
          <DrawerTitle className="flex justify-center font-serif text-2xl font-semibold gap-2.5 tracking-tighter">
            {title}
          </DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        {children}
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">{closeButtonText}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
