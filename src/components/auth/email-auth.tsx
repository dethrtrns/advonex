"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { sendEmailOtp, verifyEmailOtp } from "@/services/authService/authService";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Email form schema
const emailFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  role: z.enum(["lawyer", "client"]),
  otp: z.string().optional().refine(
    (val) => !val || /^\d+$/.test(val),
    { message: "OTP must contain only numbers" }
  ),
});

type EmailAuthProps = {
  defaultRole: "lawyer" | "client";
  onAuthSuccess: (data: any, roles: string[]) => void;
};

export function EmailAuth({ defaultRole }: EmailAuthProps) {
  const [otpSent, setOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [canResend, setCanResend] = useState(false);

  // Email form
  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
      role: defaultRole,
      otp: "",
    },
  });

  // Timer effect for resend OTP
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (otpSent && resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    } else if (otpSent && resendCooldown === 0) {
      setCanResend(true); // Enable resend button when cooldown finishes
    }
    return () => {
      if (timer) clearTimeout(timer); // Cleanup timer
    };
  }, [otpSent, resendCooldown]);

  // Function to start the cooldown timer
  const startResendTimer = () => {
    setResendCooldown(30);
    setCanResend(false);
  };

  // Add this state to track OTP value separately
  const [otpValue, setOtpValue] = useState("");

  // Function to handle sending/resending Email OTP
  const handleSendEmailOtp = async (email: string, role: 'lawyer' | 'client') => {
    try {
      await sendEmailOtp({ email });
      console.log("OTP sent successfully");
      setOtpSent(true);
      startResendTimer();
      
      // Reset OTP value
      setOtpValue("");
      emailForm.setValue("otp", "");
    } catch (error) {
      console.error("Error sending OTP:", error);
      setCanResend(true);
    }
  };

  // Handle email form submission
  const onEmailSubmit = async (values: z.infer<typeof emailFormSchema>) => {
    if (!otpSent) {
      // Clear the OTP field before sending OTP
      emailForm.setValue("otp", "");
      await handleSendEmailOtp(values.email, values.role);
    } else {
      try {
        if (!values.otp) {
          toast.error("Please enter the OTP code");
          return;
        }
        
        const data = await verifyEmailOtp({
          email: values.email,
          otp: values.otp,
          role: values.role
        });

        // Handle successful authentication
        // if (!data.data.user?.roles) {
        //   console.log("User does not have any role");
        //   return console.log('roles not found, fx returned!'); // Exit the function if user is not found
        // }
        // onAuthSuccess(data, data.data.user?.roles);
        // REMOVE REDUNDANT REDIRECTION LOGIC
        // if (data.data.user?.roles.includes("LAWYER")) {
          window.location.href = `/`;
        // } else {
        //   window.location.href = `/`;
        // }
       
        console.log(`email OTP verification Successful: ${data.data.user}`);

      } catch (error) {
        console.error("Error verifying OTP:", error);
        // Error is already handled by the service function's toast
      }
    }
  };

  // Reset form and state
  const resetForm = () => {
    setOtpSent(false);
    setResendCooldown(0);
    setCanResend(false);
    emailForm.resetField("otp");
    emailForm.resetField("email");
  };

  return (
    <>
      {!otpSent ? (
        <Form {...emailForm}>
          <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
            <FormField
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sign in with Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="Enter your email address" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={emailForm.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Account Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="client" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Client
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="lawyer" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Lawyer
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full">
              Send OTP
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...emailForm}>
          <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
            <FormField
              control={emailForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP 
                      maxLength={6} 
                      pattern="[0-9]*" 
                      inputMode="numeric" 
                      value={otpValue}
                      onChange={(value) => {
                        setOtpValue(value);
                        field.onChange(value);
                      }}
                    >
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
                  <div className="text-center text-sm text-muted-foreground">
                    Enter the 6-digit code sent to {emailForm.getValues("email")}
                  </div>
                </FormItem>
              )}
            />
            
            <FormItem>
              <FormLabel>Account Type</FormLabel>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 p-2 border rounded-md bg-gray-50 dark:bg-gray-800">
                {emailForm.getValues("role") === "lawyer" ? "Lawyer" : "Client"}
              </div>
            </FormItem>
            
            <Button type="submit" className="w-full" disabled={!emailForm.watch('otp')}>
              Verify OTP & Sign In
            </Button>
            
            <div className="flex flex-col items-center space-y-2">
              <Button
                variant="link"
                type="button"
                onClick={() => {
                  if (canResend) {
                    const emailValue = emailForm.getValues("email");
                    const roleValue = emailForm.getValues("role");
                    handleSendEmailOtp(emailValue, roleValue);
                  }
                }}
                disabled={!canResend}
                className="w-full text-sm"
              >
                {canResend ? "Resend OTP" : `Resend OTP in ${resendCooldown}s`}
              </Button>
              <Button 
                variant="link" 
                type="button" 
                onClick={resetForm} 
                className="w-full text-sm"
              >
                Use a different email address?
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
}