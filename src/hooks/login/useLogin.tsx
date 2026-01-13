"use client";

import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { requestOtpOnEmail, verifyEmailOtp } from "@/lib/backend/auth";
import { handleApiError } from "@/lib/common/commonUtils";
import { toast } from "sonner";
import { UseLoginHookType, LoginStep } from "./login-types";

export const useLogin = (): UseLoginHookType => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<LoginStep>("email");
  const [loggingIn, setLoggingIn] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpResendTimer, setOtpResendTimer] = useState(0);

  const { login: authLogin, activeAppSide } = useAuth();

  const open = useCallback(() => {
    setIsOpen(true);
    setCurrentStep("email");
    setEmail("");
    setOtp("");
    setOtpSent(false);
    setOtpResendTimer(0);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Reset all states when closing
    setCurrentStep("email");
    setEmail("");
    setOtp("");
    setOtpSent(false);
    setOtpResendTimer(0);
  }, []);

  const handleRequestOtp = useCallback(
    async (email: string) => {
      setLoggingIn(true);
      try {
        await requestOtpOnEmail({ email, role: activeAppSide });
        setOtpSent(true);
        setCurrentStep("otp");
        setOtpResendTimer(30); // Start 30-second timer
        toast.success("OTP sent successfully. Please check your email.");
      } catch (error) {
        handleApiError(error, "Failed to send OTP");
      } finally {
        setLoggingIn(false);
      }
    },
    [activeAppSide]
  );

  const handleVerifyOtp = useCallback(
    async (otp: string) => {
      setLoggingIn(true);
      try {
        const response = await verifyEmailOtp({
          email,
          otp,
          role: activeAppSide,
        });
        if (response.data && response.data.accessToken) {
          authLogin(response.data.accessToken);
          toast.success("Login successful!");
          close(); // Close modal on successful login
        } else {
          throw new Error("Login failed: No access token received.");
        }
      } catch (error) {
        handleApiError(error, "Failed to verify OTP");
      } finally {
        setLoggingIn(false);
      }
    },
    [email, activeAppSide, authLogin, close]
  );

  // handle any issues here when current step is changes externally via setCurrentStep exposed
  // useEffect(() => {

  // }, [currentStep]);

  // Timer effect for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpResendTimer > 0) {
      timer = setTimeout(() => {
        setOtpResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [otpResendTimer]);

  return {
    isOpen,
    currentStep,
    loggingIn,
    email,
    otp,
    otpSent,
    otpResendTimer,
    open,
    close,
    setCurrentStep,
    setIsOpen,
    setEmail,
    setOtp,
    handleRequestOtp,
    handleVerifyOtp,
  };
};
