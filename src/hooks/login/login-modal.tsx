"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LoginForm } from "./login-form";
import { useLoginContext } from "@/contexts/LoginContext";
import { useMediaQuery } from "@/hooks/use-media-query";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
interface LoginModalProps {}

export function LoginModal({}: LoginModalProps) {
  const hook = useLoginContext();
  const { isOpen, close } = hook;
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={close}>
        <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <DialogHeader>
            <DialogTitle>Login or Sign Up</DialogTitle>
            <DialogDescription>
              Enter your email to receive a one-time password.
            </DialogDescription>
          </DialogHeader>
          <LoginForm
            currentStep={hook.currentStep}
            loggingIn={hook.loggingIn}
            email={hook.email}
            otp={hook.otp}
            otpSent={hook.otpSent}
            otpResendTimer={hook.otpResendTimer}
            setEmail={hook.setEmail}
            setOtp={hook.setOtp}
            handleRequestOtp={hook.handleRequestOtp}
            handleVerifyOtp={hook.handleVerifyOtp}
          />
          <Button variant="link" onClick={close} className="w-full mt-4">
            Skip Login
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={close}>
      <SheetContent side="bottom" className="h-full">
        <SheetHeader>
          <SheetTitle>Login or Sign Up</SheetTitle>
          <SheetDescription>
            Enter your email to receive a one-time password.
          </SheetDescription>
        </SheetHeader>
        <LoginForm
          currentStep={hook.currentStep}
          loggingIn={hook.loggingIn}
          email={hook.email}
          otp={hook.otp}
          otpSent={hook.otpSent}
          otpResendTimer={hook.otpResendTimer}
          setEmail={hook.setEmail}
          setOtp={hook.setOtp}
          handleRequestOtp={hook.handleRequestOtp}
          handleVerifyOtp={hook.handleVerifyOtp}
        />
        <Button variant="link" onClick={close} className="w-full mt-4">
          Skip Login
        </Button>
      </SheetContent>
    </Sheet>
  );
}
