"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NeumorphButton } from "@/components/ui/neumorph-button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { LoginStep, UseLoginHookType } from "./login-types";
import { useEffect } from "react";
import { LiquidButton } from "@/components/liquid-glass-button";

const emailFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

const otpFormSchema = z.object({
  otp: z.string().min(6, { message: "OTP must be 6 characters." }),
});

interface LoginFormProps {
  currentStep: LoginStep;
  loggingIn: boolean;
  email: string;
  otp: string;
  otpSent: boolean;
  otpResendTimer: number;
  setEmail: (email: string) => void;
  setOtp: (otp: string) => void;
  handleRequestOtp: (email: string) => Promise<void>;
  handleVerifyOtp: (otp: string) => Promise<void>;
}

export function LoginForm({
  currentStep,
  loggingIn,
  email,
  otp,
  otpSent,
  otpResendTimer,
  setEmail,
  setOtp,
  handleRequestOtp,
  handleVerifyOtp,
}: LoginFormProps) {
  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: email,
    },
  });

  const otpForm = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: otp,
    },
  });

  useEffect(() => {
    emailForm.setValue("email", email);
  }, [email, emailForm]);

  useEffect(() => {
    otpForm.setValue("otp", otp);
  }, [otp, otpForm]);

  const onEmailSubmit = async (values: z.infer<typeof emailFormSchema>) => {
    setEmail(values.email);
    await handleRequestOtp(values.email);
  };

  const onOtpSubmit = async (values: z.infer<typeof otpFormSchema>) => {
    setOtp(values.otp);
    await handleVerifyOtp(values.otp);
  };

  return (
    <div className="space-y-4">
      {currentStep === "email" && (
        <Form {...emailForm}>
          <form
            onSubmit={emailForm.handleSubmit(onEmailSubmit)}
            className="space-y-4">
            <FormField
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LiquidButton
              type="submit"
              className="w-full"
              disabled={loggingIn || otpSent}>
              {loggingIn
                ? "Sending OTP..."
                : otpSent
                ? `Resend in ${otpResendTimer}s`
                : "Request OTP"}
            </LiquidButton>
          </form>
        </Form>
      )}

      {currentStep === "otp" && (
        <Form {...otpForm}>
          <form
            onSubmit={otpForm.handleSubmit(onOtpSubmit)}
            className="space-y-4">
            <FormField
              control={otpForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={loggingIn}>
              {loggingIn ? "Verifying..." : "Submit OTP"}
            </Button>
            <Button
              type="button"
              variant="link"
              className="w-full"
              onClick={() => handleRequestOtp(email)}
              disabled={otpResendTimer > 0 || loggingIn}>
              Resend OTP {otpResendTimer > 0 && `in ${otpResendTimer}s`}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
