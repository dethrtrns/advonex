"use client";

import { useState, useEffect } from "react"; // Make sure useEffect is imported
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input"; // Keep Input for other potential uses
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'; // Import PhoneInput and validator
import 'react-phone-number-input/style.css'; // Import default styles
import { sendOtp, verifyOtp } from "@/services/authService/authService"; // Import the service functions
import { RadioGroup } from "../ui/radio-group";
import { RadioGroupItem } from "../ui/radio-group";

// Update schema to use the validator from react-phone-number-input
const formSchema = z.object({
  phone: z.string().refine(isValidPhoneNumber, { message: "Invalid phone number" }), // Use validator
  role: z.enum(["lawyer", "client"]), // Changed from 'type' to 'role'
  otp: z.string().optional(),
});

export function RegisterDialog() {
  const [open, setOpen] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0); // Timer state
  const [canResend, setCanResend] = useState(false); // Button availability state
  const pathname = usePathname();
  const isLawyerRoute = pathname?.startsWith('/lawyer');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
      role: "client", // Changed from 'type' to 'role'
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


  // Reset OTP state and timer when dialog closes or type changes
  useEffect(() => {
    if (!open) {
      setOtpSent(false);
      setResendCooldown(0);
      setCanResend(false);
      form.resetField("otp");
      form.resetField("phone");
    }
  }, [open, form]);

  useEffect(() => {
    if (isLawyerRoute) {
      form.setValue("role", "lawyer"); // Changed from 'type' to 'role'
    } else {
      form.setValue("role", "client"); // Changed from 'type' to 'role'
    }
    setOtpSent(false);
    setResendCooldown(0);
    setCanResend(false);
    form.resetField("otp");
  }, [isLawyerRoute, form]);

  // Function to start the cooldown timer
  const startResendTimer = () => {
    setResendCooldown(15); // Start 15 second cooldown
    setCanResend(false); // Disable resend button
  };

  // Function to handle sending/resending OTP
  const handleSendOtp = async (phone: string, role: 'lawyer' | 'client') => { // Changed parameter name
    try {
      await sendOtp({ phone, type: role }); // Map role to type for API compatibility
      setOtpSent(true);
      startResendTimer();
    } catch (error) {
      setCanResend(true);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!otpSent) {
      await handleSendOtp(values.phone, values.role); // Changed from 'type' to 'role'
    } else {
      try {
        const data = await verifyOtp({
          phone: values.phone,
          otp: values.otp,
          role: values.role // This is already correct
        });

        // toast.success is already called in the service function

        if (data.token) {
          localStorage.setItem("authToken", data.token);
        } else {
           console.warn("No JWT token received from verify-otp endpoint");
        }

        setOpen(false); // Close the dialog

        // Handle redirection
        if (values.role === "lawyer") { // Changed from 'type' to 'role'
          window.location.href = "/lawyer/dashboard";
        } else {
          window.location.href = "/";
        }

      } catch (error) {
        // Error is already handled by the service function's toast
      }
    }
  };

  // Handle Resend OTP click
  const handleResendOtpClick = () => {
    if (canResend) {
      const phoneValue = form.getValues("phone");
      const roleValue = form.getValues("role");
      handleSendOtp(phoneValue, roleValue); // Resend OTP
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button> Sign Up / Register</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{otpSent ? "Enter OTP" : "Sign In / Register"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* Phone Number Field (Only if OTP not sent) */}
            {!otpSent && (
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <PhoneInput
                        placeholder="Enter phone number"
                        value={field.value}
                        onChange={field.onChange}
                        defaultCountry="IN" // Set default country if desired
                        international
                        countryCallingCodeEditable={false}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" // Apply similar styling
                        inputComponent={Input} // Use your existing Input component for styling consistency
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* OTP Field (Only if OTP sent) */}
            {otpSent && (
               <FormField
                control={form.control}
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
                        Enter the 6-digit code sent to {form.getValues("phone")}
                     </div>
                  </FormItem>
                )}
              />
            )}

            {/* Account Type Selection (Always visible before OTP is sent) */}
            {!otpSent && ( // Show role selection only before OTP is sent
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Account Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4" // Arrange options horizontally
                        disabled={otpSent} // Disable after OTP is sent
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
            )}

             {/* Display selected role if OTP has been sent */}
             {otpSent && (
                <FormItem>
                  <FormLabel>Account Type</FormLabel>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 p-2 border rounded-md bg-gray-50 dark:bg-gray-800">
                    {form.getValues("role") === "lawyer" ? "Lawyer" : "Client"}
                  </div>
                </FormItem>
             )}


            <Button type="submit" className="w-full" disabled={otpSent && !form.watch('otp')}>
              {otpSent ? "Verify OTP & Sign In" : "Send OTP"}
            </Button>

            {/* Resend OTP and Change Number Links */}
            {otpSent && (
              <div className="flex flex-col items-center space-y-2">
                 <Button
                   variant="link"
                   type="button"
                   onClick={handleResendOtpClick}
                   disabled={!canResend} // Disable based on canResend state
                   className="w-full text-sm"
                 >
                   {canResend ? "Resend OTP" : `Resend OTP in ${resendCooldown}s`}
                 </Button>
                 <Button variant="link" type="button" onClick={() => {
                   setOtpSent(false);
                   setResendCooldown(0);
                   setCanResend(false);
                   form.resetField("otp");
                   // Optionally reset phone: form.resetField("phone");
                 }} className="w-full text-sm">
                   Use a different phone number?
                 </Button>
              </div>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}