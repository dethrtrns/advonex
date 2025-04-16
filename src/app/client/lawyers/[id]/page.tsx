"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Mail, Phone, Briefcase, GraduationCap, ArrowLeft, Loader } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getLawyerProfile, type LawyerProfile } from "@/services/lawyerService";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { DialogHeader } from "@/components/ui/dialog";

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
        const profile = await getLawyerProfile(lawyerId);
        setLawyer(profile);
      } catch (err) {
        console.error("Error fetching lawyer profile:", err);
        setError("Could not load lawyer profile. Please try a different lawyer.");
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
      <div className="flex gap-3 flex-row items-start ">

        <div className="relative w-1/3 max-w-sm overflow-hidden rounded-lg md:w-1/6 group">
        <AspectRatio className="sm" ratio={9/13}> <img
            src={lawyer.photo}
            alt={lawyer.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          </AspectRatio>
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-2xl font-bold">{lawyer.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{lawyer.location}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {lawyer.practiceAreas.map((area) => (
              <span
                key={area}
                className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                {area}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              <span>{lawyer.experience} years experience</span>
            </div>
            <div className="flex items-center gap-2 text-primary">
              <span className="text-lg font-bold">${lawyer.consultFee}</span>
              <span className="text-sm text-muted-foreground">/hour</span>
            </div>
            
          </div>

         
        </div>
      </div>
 {/* Add Contact Button */}
 <span className="flex w-full justify-center md:justify-start">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-3/4 md:w-1/3">Contact Lawyer</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Contact {lawyer.name}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
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
              </div>
            </DialogContent>
          </Dialog>
          </span>
      {/* Remove the standalone Contact Information card since it's now in the dialog */}

      {/* About Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">About</h2>
        <p className="text-muted-foreground">{lawyer.bio}</p>
      </div>


   {/* Practice Courts Section */}
   <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Practice Courts</h2>
        <Card>
          <CardContent className="">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">Primary Court</div>
                  <div className="text-sm text-muted-foreground">{lawyer.practiceCourt?.primary || "Not provided"}</div>
                </div>
              </div>
              {lawyer.practiceCourt?.secondary && (
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm font-medium">Secondary Court</div>
                    <div className="text-sm text-muted-foreground">{lawyer.practiceCourt.secondary}</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bar ID Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Bar Information</h2>
        <Card>
          <CardContent className="">
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
        <Card>
          <CardContent className="flex items-start gap-4 ">
            <GraduationCap className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium">{lawyer.education.degree}</div>
              <div className="text-sm text-muted-foreground">{lawyer.education.institution}</div>
              <div className="text-sm text-muted-foreground">{lawyer.education.year}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Section as Footer */}
      <div className="mt-12 pt-6 pb-6 border-t">
        <div className="flex flex-wrap gap-2 justify-center">
          {lawyer.practiceAreas.flatMap(area => {
            const mockServices = getMockServicesForArea(area);
            return mockServices.map((service, index) => (
              <span
                key={`${area}-${index}`}
                className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {service}
              </span>
            ));
          })}
        </div>
      </div>
    </div>
  );
}

// Helper function to generate mock services based on practice area
function getMockServicesForArea(area: string): string[] {
  const serviceMap: Record<string, string[]> = {
    "Civil Law": [
      "Divorce Proceedings", 
      "Child Custody", 
      "Property Disputes", 
      "Contract Review", 
      "Civil Litigation"
    ],
    "Corporate Law": [
      "Business Formation", 
      "Contract Drafting", 
      "Regulatory Compliance", 
      "Mergers & Acquisitions", 
      "Corporate Governance"
    ],
    "Criminal Law": [
      "Criminal Defense", 
      "DUI Defense", 
      "White Collar Crime", 
      "Juvenile Defense", 
      "Appeals"
    ],
    "Employment Law": [
      "Workplace Discrimination", 
      "Wrongful Termination", 
      "Employment Contracts", 
      "Harassment Claims", 
      "Wage Disputes"
    ],
    "Family Law": [
      "Divorce", 
      "Child Support", 
      "Adoption", 
      "Prenuptial Agreements", 
      "Domestic Violence"
    ],
    "Real Estate Law": [
      "Property Transactions", 
      "Landlord-Tenant Disputes", 
      "Zoning Issues", 
      "Title Searches", 
      "Foreclosures"
    ],
    "Immigration Law": [
      "Visa Applications", 
      "Green Card Processing", 
      "Deportation Defense", 
      "Citizenship", 
      "Asylum"
    ],
    "Intellectual Property": [
      "Patent Filing", 
      "Trademark Registration", 
      "Copyright Protection", 
      "IP Litigation", 
      "Licensing Agreements"
    ]
  };
  
  // Return services for the given area, or a subset of random services if area not found
  return serviceMap[area] || ["Legal Consultation", "Document Review", "Legal Representation"];
}