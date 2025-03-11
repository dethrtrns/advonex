"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  barNumber: z.string().min(1, "Bar number is required"),
  practiceArea: z.string().min(1, "Practice area is required"),
  experience: z.number().min(0, "Years of experience must be 0 or greater"),
  bio: z.string().min(50, "Bio must be at least 50 characters"),
  lawSchool: z.string().min(1, "Law school is required"),
  degree: z.string().min(1, "Degree is required"),
  graduationYear: z.number().min(1900, "Invalid graduation year").max(new Date().getFullYear(), "Graduation year cannot be in the future")
});

export default function LawyerRegistration() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({    
    resolver: zodResolver(formSchema),
    defaultValues: (() => {
      if (typeof window !== "undefined") {
        const savedData = localStorage.getItem("lawyerRegistration");
        if (savedData) {
          const { name, email } = JSON.parse(savedData);
          const [firstName, ...lastNameParts] = name.split(" ");
          return {
            firstName,
            lastName: lastNameParts.join(" "),
            email,
            phone: "",
            barNumber: "",
            practiceArea: "",
            experience: 0,
            bio: "",
            lawSchool: "",
            degree: "",
            graduationYear: new Date().getFullYear()
          };
        }
      }
      return {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        barNumber: "",
        practiceArea: "",
        experience: 0,
        bio: "",
        lawSchool: "",
        degree: "",
        graduationYear: new Date().getFullYear()
      };
    })()
  });

  const practiceAreas = [
    "Civil Law",
    "Criminal Law",
    "Corporate Law",
    "Family Law",
    "Immigration Law",
    "Tax Law",
    "Employment Law",
    "Real Estate Law",
    "Intellectual Property"
  ];

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      // TODO: Implement API call to submit form data
      console.log(values);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      router.push("/"); // Redirect to home page after successful submission
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Join Our Legal Network</h1>
        <p className="text-muted-foreground">Create your professional profile and start connecting with clients</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email address" {...field} />
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
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="barNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bar Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your bar number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="practiceArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Practice Area</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your primary practice area" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {practiceAreas.map((area) => (
                          <SelectItem key={area} value={area.toLowerCase().replace(/ /g, "-")}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="Enter years of experience"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write a brief description of your professional background and expertise"
                        className="h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="lawSchool"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Law School</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your law school name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="degree"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Degree</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Juris Doctor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="graduationYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Graduation Year</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1900"
                          placeholder="Enter graduation year"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating Profile..." : "Create Profile"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}