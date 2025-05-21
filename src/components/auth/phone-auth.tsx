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
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { sendOtp, verifyOtp } from "@/services/authService/authService";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Phone form schema
const phoneFormSchema = z.object({
  phone: z.string().refine(isValidPhoneNumber, { message: "Invalid phone number" }),
  role: z.enum(["lawyer", "client"]),
  otp: z.string().optional(),
});

type PhoneAuthProps = {
  defaultRole: "lawyer" | "client";
  onAuthSuccess: (data: any, roles: string[]) => void;
};

export function PhoneAuth({ defaultRole, onAuthSuccess }: PhoneAuthProps) {
  const [otpSent, setOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [canResend, setCanResend] = useState(false);

  // Phone form
  const phoneForm = useForm<z.infer<typeof phoneFormSchema>>({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: {
      phone: "",
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
    setResendCooldown(15);
    setCanResend(false);
  };

  // Function to handle sending/resending Phone OTP
  const handleSendPhoneOtp = async (phone: string, role: 'lawyer' | 'client') => {
    try {
      await sendOtp({ phone, type: role });
      setOtpSent(true);
      startResendTimer();
    } catch (error) {
      setCanResend(true);
    }
  };

  // Handle phone form submission
  const onPhoneSubmit = async (values: z.infer<typeof phoneFormSchema>) => {
    if (!otpSent) {
      await handleSendPhoneOtp(values.phone, values.role);
    } else {
      try {
        if (!values.otp) {
          toast.error("Please enter the OTP code");
          return;
        }
        
        const data = await verifyOtp({
          phone: values.phone,
          otp: values.otp,
          role: values.role
        });
// Additional checks for data and roles
        if(!data.data.user?.roles){
          console.log("User roles not found ");
          alert("Verification failed, please try again");
          setCanResend(true);
           return;}
        // Handle successful authentication
        onAuthSuccess(data, data.data.user.roles);
      } catch (error) {
        // Error is already handled by the service function's toast
      }
    }
  };

  // Reset form and state
  const resetForm = () => {
    setOtpSent(false);
    setResendCooldown(0);
    setCanResend(false);
    phoneForm.resetField("otp");
  };

  return (
    <>
      {!otpSent ? (
        <Form {...phoneForm}>
          <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
            <FormField
              control={phoneForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sign in with Phone Number</FormLabel>
                  <FormControl>
                    <PhoneInput
                      placeholder="Enter phone number"
                      value={field.value}
                      onChange={field.onChange}
                      defaultCountry="IN"
                      international
                      countryCallingCodeEditable={false}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      inputComponent={Input}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={phoneForm.control}
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
        <Form {...phoneForm}>
          <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
            <FormField
              control={phoneForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
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
                    Enter the 6-digit code sent to {phoneForm.getValues("phone")}
                  </div>
                </FormItem>
              )}
            />
            
            <FormItem>
              <FormLabel>Account Type</FormLabel>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 p-2 border rounded-md bg-gray-50 dark:bg-gray-800">
                {phoneForm.getValues("role") === "lawyer" ? "Lawyer" : "Client"}
              </div>
            </FormItem>
            
            <Button type="submit" className="w-full" disabled={!phoneForm.watch('otp')}>
              Verify OTP & Sign In
            </Button>
            
            <div className="flex flex-col items-center space-y-2">
              <Button
                variant="link"
                type="button"
                onClick={() => {
                  if (canResend) {
                    const phoneValue = phoneForm.getValues("phone");
                    const roleValue = phoneForm.getValues("role");
                    handleSendPhoneOtp(phoneValue, roleValue);
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
                Use a different phone number?
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
}