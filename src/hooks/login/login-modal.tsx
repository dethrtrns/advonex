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
      <Dialog open={isOpen} onOpenChange={close}>
        <DialogContent className="max-w-fit mx-auto p-6 rounded-2xl shadow-xl bg-background/80 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
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
          <Button variant="outline" onClick={close}>
            Skip Login
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={close}>
      <DrawerContent className="max-w-fit h-1/2 mx-auto p-6 rounded-2xl shadow-xl">
        <DrawerHeader>
          <DrawerTitle className="text-2xl font-semibold flex items-center gap-2.5 tracking-tighter">
            Login
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
            <Button variant="outline" onClick={close}>
              Skip Login
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
