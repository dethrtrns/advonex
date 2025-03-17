"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  type: z.enum(["lawyer", "client"]),
});

export function RegisterDialog() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isLawyerRoute = pathname?.includes('/lawyer');

  const form = useForm<z.infer<typeof formSchema>>({ 
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      type: "client",
    },
  });

  // Set user type based on route
  useEffect(() => {
    if (isLawyerRoute) {
      form.setValue("type", "lawyer");
    }
  }, [isLawyerRoute, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      toast.success("Registration successful!");
      setOpen(false);

      if (values.type === "lawyer") {
        // Store user ID for lawyer profile completion
        localStorage.setItem("lawyerRegistration", JSON.stringify({
          userId: data.userId,
          name: values.name
        }));
        window.location.href = "/lawyer/register";
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button> Sign In</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create an Account</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+1234567890" type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isLawyerRoute && (
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Type</FormLabel>
                    <FormControl>
                      <div className="text-sm text-gray-500">
                        {field.value === "lawyer" ? "Lawyer" : "Client"}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button type="submit" className="w-full">Register</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}