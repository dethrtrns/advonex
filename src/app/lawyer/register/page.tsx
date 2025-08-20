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
// import { practiceAreas } from "@/data/pacticeAreas/pacticeAreas";
import { ImageUpload } from "@/components/ui/image-upload";
import { useAuth } from "@/contexts/AuthContext";
import { redirect, useRouter } from "next/navigation";
import FileUpload from "@/components/kokonutui/file-upload";
import { LiquidCard } from "@/components/liquid-glass-card";
import Areas from "@/app/client/areas/page";
import {
  bringPracticeAreas,
  practiceArea,
} from "@/data/pacticeAreas/pacticeAreas";

import { PhotoUpload } from "./components/PhotoUpload";
import { NameInputs } from "./components/NameInputs";
import { LocationInputs } from "./components/LocationInputs";
import { ProfessionalInfoInputs } from "./components/ProfessionalInfoInputs";
import { PrimaryCourtInput } from "./components/PrimaryCourtInput";
import { BioInput } from "./components/BioInput";
import { EducationInputs } from "./components/EducationInputs";

// INFO: all number fields should be limited to max 32-bit signed integer limit, e.i. 2,147,483,647 as that's default in backend db
export const formSchema = z.object({
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
  const [practiceAreasList, setPracticeAreasList] = useState<practiceArea[]>(
    []
  );
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const profileId = user?.profileIds.lawyerId as string | null;

  useEffect(() => {
    const fetchAndSetPracticeAreas = async () => {
      try {
        const areas = await bringPracticeAreas();
        setPracticeAreasList(areas);
        console.log("Practice areas fetched:", areas);
      } catch (error) {
        console.error("Error fetching practice areas:", error);
      }
    };

    fetchAndSetPracticeAreas();
  }, []);

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
      {/* <NameFieldInput />
      <barIdFieldInput /> */}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6">
          

          <PhotoUpload control={form.control} />

          <LiquidCard>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <NameInputs control={form.control} />
              <LocationInputs control={form.control} />
            </CardContent>
          </LiquidCard>

          <LiquidCard>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProfessionalInfoInputs control={form.control} />
              <PrimaryCourtInput control={form.control} />
              <BioInput control={form.control} />
            </CardContent>
          </LiquidCard>

          <LiquidCard>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <EducationInputs control={form.control} />
            </CardContent>
          </LiquidCard>

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
