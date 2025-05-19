"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Filter, Briefcase, Loader } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getLawyersList, type Lawyer } from "@/services/lawyerService";  // Update import to use service types

export default function LawyersDirectory() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        setIsLoading(true); // Set loading state before fetch
        const lawyersData = await getLawyersList();
        setLawyers(lawyersData);
      } catch (error) {
        console.error('Error fetching lawyers:', error);
        setLawyers([]);
      } finally {
        setIsLoading(false); // Clear loading state after fetch
      }
    };

    fetchLawyers();
  }, []);

  // Add loading state check
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
 

  return (
    
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold">Find Lawyers</h1>
        <div className="flex items-center gap-4">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or practice area"
              className="pl-9"
            />
          </div>
          <div className="relative flex-1 md:w-60">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Location"
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lawyers && lawyers.length > 0 ? (
          lawyers.map((lawyer) => (
            <Card key={lawyer.id} className="p-0 overflow-hidden">
              <Link href={`/client/lawyers/${lawyer.id}`} className="block">
                <CardContent className="p-0 flex">
                  <div className="w-1/3 aspect-square relative overflow-hidden group">
                    {lawyer.photo ? (
                      <img
                        src={lawyer.photo}
                      alt={lawyer.name}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          document.getElementById(`initials-${lawyer.id}`)?.style.removeProperty('display');
                        }}
                      />
                    ) : (
                      <div 
                        id={`initials-${lawyer.id}`}
                        className="flex items-center justify-center w-full h-full bg-primary/10 text-primary font-bold text-2xl"
                      >
                      {getInitials(lawyer?.name)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-4 space-y-2">
                  <h3 className="font-semibold text-lg">{lawyer.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {lawyer.location}
                    </div>
                    {/* Practice Court Section */}
                    {lawyer.primaryCourt && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Briefcase className="h-4 w-4" />
                        {lawyer.primaryCourt.name}
                      </div>
                    )}

<div className="flex flex-wrap gap-2">
                       {/* ++++++++++++++Watchout for the API res structure+++++++++++++++++++++ */}
                      {lawyer.practiceAreas.slice(0, 1).map((area) => (
                        <span
                          key={area.practiceArea.id}
                          className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                        >
                          {area.practiceArea.name}
                        </span>
                      ))}
                    </div>
                   
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm text-muted-foreground">{lawyer.experience} years exp.</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">${lawyer.consultFee}/hr</span>
                      </div>
                    </div>
                  </div>
                
              </CardContent>
            </Link>
          </Card>
        ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">No lawyers found</p>
          </div>
        )}
      </div>
    </div>
  );  
}

// Helper function to generate initials from a name
function getInitials(name: string): string {
  if (!name) return 'IMG';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2); // Limit to first two initials
}