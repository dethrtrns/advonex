"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import {
  Lawyer,
  getLawyerProfile,
  updateLawyerProfile,
} from "@/services/lawyerService"; // Import updateLawyerProfile
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { indianLocations } from "@/data/indianLocations/locations";
import { practiceAreas } from "@/data/pacticeAreas/pacticeAreas";
import { ImageUpload } from "@/components/ui/image-upload";
import { useAuth } from "@/contexts/AuthContext";
import { redirect, useRouter } from "next/navigation";
import FileUpload from "@/components/kokonutui/file-upload";

// INFO: all number fields should be limited to max 32-bit signed integer limit, e.i. 2,147,483,647 as that's default in backend db
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  barNumber: z.string().min(1, "Bar number is required"),
  practiceArea: z.string().min(1, "Practice area is required"),
  experience: z
    .number()
    .min(1, "Years of experience must be 1 or greater")
    .max(100, "Years of experience cannot be greater than 100"),
  bio: z
    .string()
    .min(50, "Bio must be at least 50 characters")
    .max(1000, "Bio cannot be more than 1000 characters"),
  lawSchool: z.string().min(1, "Law school is required"),
  degree: z.string().min(1, "Degree is required"),
  graduationYear: z
    .number()
    .min(1900, "Invalid graduation year")
    .max(new Date().getFullYear(), "Graduation year cannot be in the future"),
  primaryCourt: z.string().min(1, "At least one practice court is required"),
  consultFee: z
    .number()
    .min(50, "Consultation fee must be 50 or greater")
    .max(10000, "Consultation fee cannot be greater than 10000"), // cause of backend: FIXIT in backend
  photo: z.string().min(1, "Photo is required"),
});

export default function LawyerRegistrationPage() {
  // const [isLoading, setIsLoading] = useState(false); // check if can be used else remove
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const profileId = user?.profileIds.lawyerId as string | null;

  // TODO: get this value from profile for now or in jwt(lawyerRegistrationPending) after backend production sync.
  //  if(!lawyerRegistrationPending) {
  //   redirect('/lawyer/dashboard');
  //  }

  // logs for dev info
  console.log("User object:", user);
  console.log("Profile ID:", profileId);
  console.log("User authenticated:", !!user);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      state: Object.keys(indianLocations)[0],
      city: "",
      barNumber: "", // Fix: changed barId to barNumber to match schema
      practiceArea: "",
      experience: 0,
      bio: "",
      consultFee: 0,
      primaryCourt: "",
      lawSchool: "", // Fix: changed institution to lawSchool
      degree: "",
      graduationYear: undefined, // Fix: changed year to graduationYear
      photo: "",
    },
  });

  if (user && !profileId) {
    console.log("User does not have lawyer profile ID!");
    alert("User not authorised!");
    redirect("/"); //FIX: remove this??
    return null;
  }

  if (!user) {
    console.log("User is not Authenticated!");
    // alert("Please login to continue!");
    redirect("/"); //FIX this!
    return null;
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true); // Set submitting state
    try {
      // Transform form data to match API structure (UpdateLawyer interface: Different from lawyer interface)
      const transformedData = {
        name: `${values.firstName} ${values.lastName}`,
        location: `${values.city}, ${values.state}`,
        barId: values.barNumber,
        experience: values.experience,
        bio: values.bio,
        consultFee: values.consultFee,
        specialization: values.practiceArea,
        primaryCourt: values.primaryCourt,
        registrationPending: false,
        education: {
          institution: values.lawSchool,
          degree: values.degree,
          year: Number(values.graduationYear), // Changed from String to Number to match the interface
        },
        photo: values.photo ? values.photo : "",
      };

      console.log("Updating profile with:", transformedData);

      // Call the service function
      const updatedProfile = await updateLawyerProfile(transformedData);
      console.log("Profile updated:", updatedProfile);
      toast.success("Profile updated successfully");
      router.push("/lawyer/dashboard");
    } catch (error) {
      // Error toast is handled in the service function
      console.error("Failed to update profile:", error);
      toast.error(`Failed to update profile, retry!`);
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  }

  if (isSubmitting) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1>Register Form</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6">
          <FormField
            control={form.control}
            name="photo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Picture</FormLabel>
                <FormControl>
                  <div className="flex">
                    <input
                      type="hidden"
                      {...field}
                    />
                    <FileUpload
                      onUploadSuccess={(imageUrl) => {
                        field.onChange(imageUrl);
                        console.log("Image URL updated:", imageUrl);
                      }}
                      // name={`${form.watch("firstName")} ${form.watch(
                      //   "lastName"
                      // )} `}
                      // photo={lawyer.photo}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                        <Input
                          placeholder="Enter your first name"
                          {...field}
                        />
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
                        <Input
                          placeholder="Enter your last name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Location Fields - State and City */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                field.value === ""
                                  ? "Select your state"
                                  : "select your state"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.keys(indianLocations).map((state) => (
                            <SelectItem
                              key={state}
                              value={state}>
                              {state}
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
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        // disabled={!selectedState}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                // selectedState
                                //   ?
                                "Select your city"
                                // : "Select a state first"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {indianLocations[form.watch("state")].map((city) => (
                            <SelectItem
                              key={city}
                              value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                      <Input
                        placeholder="Enter your bar number"
                        {...field}
                      />
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
                    {/* Use value prop instead of defaultValue for controlled component */}
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your primary practice area" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {practiceAreas.map((area) => (
                          <SelectItem
                            key={area}
                            value={area.toLowerCase().replace(/ /g, "-")}>
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
                name="consultFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Consultation Fee ($/hr)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="Enter your hourly consultation fee"
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
                name="primaryCourt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Court</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Family Court"
                        {...field}
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
                      <Input
                        placeholder="Enter your law school name"
                        {...field}
                      />
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
                        <Input
                          placeholder="e.g., Juris Doctor (J.D.)"
                          {...field}
                        />
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
                          max={new Date().getFullYear()}
                          placeholder="Enter graduation year"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto">
              {isSubmitting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
