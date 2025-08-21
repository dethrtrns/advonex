"use client";

import { useRef, useState } from "react";
import { updateLawyerProfile } from "@/services/lawyerService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import React from "react";

// Import the refactored components
import { NameInputs } from "./components/NameInputs.new";
import { LocationInputs } from "./components/LocationInputs.new";
import { ProfessionalInfoInputs } from "./components/ProfessionalInfoInputs.new";
import { PrimaryCourtInput } from "./components/PrimaryCourtInput.new";
import { BioInput } from "./components/BioInput.new";
import { EducationInputs } from "./components/EducationInputs.new";
import { PhotoUpload } from "./components/PhotoUpload.new";

// Placeholder for a Stepper component - you would replace this with your actual Stepper implementation
const Stepper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = React.Children.toArray(children);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="space-y-8">
      {steps[currentStep]}
      <div className="flex justify-between mt-4">
        {currentStep > 0 && (
          <Button onClick={handleBack}>Back</Button>
        )}
        {currentStep < steps.length - 1 && (
          <Button onClick={handleNext}>Next</Button>
        )}
      </div>
    </div>
  );
};


export default function LawyerRegistrationPage() {
  const allDataRef = useRef<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleStepSubmit = (stepData: object) => {
    allDataRef.current = { ...allDataRef.current, ...stepData };
    console.log("Accumulated data:", allDataRef.current);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Transform accumulated data to match API structure
      const transformedData = {
        name: `${allDataRef.current.firstName} ${allDataRef.current.lastName}`,
        location: `${allDataRef.current.city}, ${allDataRef.current.state}`,
        barId: allDataRef.current.barNumber,
        experience: allDataRef.current.experience,
        bio: allDataRef.current.bio,
        consultFee: allDataRef.current.consultFee,
        specialization: allDataRef.current.practiceArea,
        primaryCourt: allDataRef.current.primaryCourt,
        registrationPending: false, // Assuming this is set to false on final submission
        education: {
          institution: allDataRef.current.lawSchool,
          degree: allDataRef.current.degree,
          year: Number(allDataRef.current.graduationYear),
        },
        photo: allDataRef.current.photo,
      };

      console.log("Final submission data:", transformedData);
      await updateLawyerProfile(transformedData);
      toast.success("Profile updated successfully");
      router.push("/lawyer/dashboard");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile, please retry!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1>Lawyer Registration</h1>
      <Stepper>
        <PhotoUpload submitMode="external" onSubmit={handleStepSubmit} />
        <NameInputs submitMode="external" onSubmit={handleStepSubmit} />
        <LocationInputs submitMode="external" onSubmit={handleStepSubmit} />
        <ProfessionalInfoInputs submitMode="external" onSubmit={handleStepSubmit} />
        <PrimaryCourtInput submitMode="external" onSubmit={handleStepSubmit} />
        <BioInput submitMode="external" onSubmit={handleStepSubmit} />
        <EducationInputs submitMode="external" onSubmit={handleStepSubmit} />
      </Stepper>
      <Button onClick={handleFinalSubmit} disabled={isSubmitting}>
        Submit All Registration Data
      </Button>
    </div>
  );
}
