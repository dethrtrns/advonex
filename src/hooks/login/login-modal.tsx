"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { LoginForm } from "./login-form";
import { useLoginContext } from "@/contexts/LoginContext";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { LiquidButton } from "@/components/liquid-glass-button";
import { LiquidCard } from "@/components/liquid-glass-card";
import {
  LiquidGlass,
  liquidGlassClasses,
  liquidGlassStyle,
} from "@/components/ui/liquid-glass";
import { cn } from "@/lib/utils";

interface LoginModalProps {}

export function LoginModal({}: LoginModalProps) {
  const hook = useLoginContext();
  const {
    isOpen,
    close,
    currentStep,
    email,
    otp,
    otpSent,
    otpResendTimer,
    setEmail,
    setOtp,
    handleRequestOtp,
    handleVerifyOtp,
  } = hook;
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog
        open={isOpen}
        onOpenChange={close}>
        <DialogContent className="max-w-1/5 h-1/2 p-0 bg-transparent ">
          <LiquidCard className="flex w-full h-full py-20 px-14">
            <DialogHeader>
              <DialogTitle className="text-3xl font-serif flex items-center pb-4 ">
                Sign In
              </DialogTitle>
              <DialogDescription>
                Enter your email to receive a one-time password.
              </DialogDescription>
            </DialogHeader>
            <LoginForm
              currentStep={currentStep}
              loggingIn={hook.loggingIn}
              email={email}
              otp={otp}
              otpSent={otpSent}
              otpResendTimer={otpResendTimer}
              setEmail={setEmail}
              setOtp={setOtp}
              handleRequestOtp={handleRequestOtp}
              handleVerifyOtp={handleVerifyOtp}
            />
            <LiquidButton
              variant="secondary"
              onClick={close}>
              Skip Login
            </LiquidButton>
          </LiquidCard>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={isOpen}
      onOpenChange={close}>
      <DrawerContent
        className={cn(liquidGlassClasses, "w-100vw min-h-1/2 mx-12 p-6  ")}
        // 2. Apply the style object for the backdrop-filter.
        style={liquidGlassStyle}
        // className="max-w-fit h-1/2 mx-auto p-6 bg-transparent border-none"
      >
        {/* <LiquidGlass className="rounded-2xl shadow-xl p-6"> */}
        <DrawerHeader>
          <DrawerTitle className="flex justify-center font-serif text-2xl font-semibold gap-2.5 tracking-tighter">
            Sign In
          </DrawerTitle>
          <DrawerDescription>
            Enter your email to receive a one-time password.
          </DrawerDescription>
        </DrawerHeader>
        <LoginForm
          currentStep={currentStep}
          loggingIn={hook.loggingIn}
          email={email}
          otp={otp}
          otpSent={otpSent}
          otpResendTimer={otpResendTimer}
          setEmail={setEmail}
          setOtp={setOtp}
          handleRequestOtp={handleRequestOtp}
          handleVerifyOtp={handleVerifyOtp}
        />
        <DrawerFooter>
          <DrawerClose asChild>
            <Button
              variant="outline"
              onClick={close}>
              Skip Login
            </Button>
          </DrawerClose>
        </DrawerFooter>
        {/* </LiquidGlass> */}
      </DrawerContent>
    </Drawer>
  );
}
