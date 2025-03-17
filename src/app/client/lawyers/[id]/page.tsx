"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Mail, Phone, Briefcase, GraduationCap, ArrowLeft, Loader } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { mockLawyers } from "@/data/mockData";
import type { LawyerProfile } from "@/data/mockData";
// import { getLawyerProfile } from "@/services/lawyerService";

export default function LawyerProfile() {
  const params = useParams();
  const lawyerId = params.id as string;
  
  const [lawyer, setLawyer] = useState<LawyerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLawyerProfile = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, this would be an API call
        const profile = mockLawyers[lawyerId];
        
        if (!profile) {
          throw new Error("Lawyer not found");
        }
        
        setLawyer(profile);
      } catch (err) {
        console.error("Error fetching lawyer profile:", err);
        setError("Could not load lawyer profile. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLawyerProfile();
  }, [lawyerId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !lawyer) {
    return (
      <div className="text-center py-10 space-y-4">
        <h2 className="text-2xl font-semibold text-destructive">Error</h2>
        <p className="text-muted-foreground">{error || "Lawyer not found"}</p>
        <Button asChild>
          <Link href="/client/lawyers">Back to Lawyers</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Navigation */}
      <Link href="/client/lawyers" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to lawyers
      </Link>
      
      {/* Hero Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-lg md:w-1/4">
          {/* Replace Image component with standard img tag */}
          <img
            src={lawyer.photo}
            alt={lawyer.name}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{lawyer.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{lawyer.location}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {lawyer.practiceAreas.map((area) => (
              <span
                key={area}
                className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
              >
                {area}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-primary">
              <span className="text-lg font-bold">${lawyer.consultFee}</span>
              <span className="text-sm text-muted-foreground">/hour</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              <span>{lawyer.experience} years experience</span>
            </div>
          </div>

        </div>
      </div>

      {/* Contact Information */}
      <Card>
        <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">Email</div>
              <a href={`mailto:${lawyer.email}`} className="text-sm text-muted-foreground hover:underline">
                {lawyer.email}
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">Phone</div>
              <a href={`tel:${lawyer.phone}`} className="text-sm text-muted-foreground hover:underline">
                {lawyer.phone}
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">About</h2>
        <p className="text-muted-foreground">{lawyer.bio}</p>
      </div>

      {/* Bar ID Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Bar Information</h2>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm font-medium">Bar ID</div>
                <div className="text-sm text-muted-foreground">{lawyer.barId || "Not provided"}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Education Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Education</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {lawyer.education.map((edu) => (
            <Card key={edu.institution}>
              <CardContent className="flex items-start gap-4 p-6">
                <GraduationCap className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">{edu.degree}</div>
                  <div className="text-sm text-muted-foreground">{edu.institution}</div>
                  <div className="text-sm text-muted-foreground">{edu.year}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}