"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Filter } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Lawyer = {
  id: string;
  name: string;
  photo: string;
  practiceAreas: string[];
  location: string;
  consultFee: number;
  experience: number;
};

const mockLawyers: Lawyer[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop",
    practiceAreas: ["Civil Law", "Family Law"],
    location: "New York, NY",
    consultFee: 300,
    experience: 12
  },
  {
    id: "2",
    name: "Michael Chen",
    photo: "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1000&auto=format&fit=crop",
    practiceAreas: ["Corporate Law", "Tax Law"],
    location: "San Francisco, CA",
    consultFee: 350,
    experience: 15
  },
  {
    id: "3",
    name: "David Rodriguez",
    photo: "https://images.unsplash.com/photo-1615109398623-88346a601842?q=80&w=1000&auto=format&fit=crop",
    practiceAreas: ["Criminal Law", "Civil Rights"],
    location: "Chicago, IL",
    consultFee: 275,
    experience: 8
  },
  {
    id: "4",
    name: "Emily Parker",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop",
    practiceAreas: ["Employment Law", "Labor Relations"],
    location: "Boston, MA",
    consultFee: 325,
    experience: 10
  },
  {
    id: "5",
    name: "James Wilson",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
    practiceAreas: ["Real Estate Law", "Contract Law"],
    location: "Los Angeles, CA",
    consultFee: 400,
    experience: 14
  },
  {
    id: "6",
    name: "Maria Garcia",
    photo: "https://images.unsplash.com/photo-1589386417686-0d34b5903d23?q=80&w=1000&auto=format&fit=crop",
    practiceAreas: ["Immigration Law", "Civil Rights"],
    location: "Miami, FL",
    consultFee: 290,
    experience: 9
  }
];

export default function LawyersDirectory() {

const [lawyers, setLawyers] = useState<Lawyer[]>([]);
// const [searchTerm, setSearchTerm] = useState('');
// const [location, setLocation] = useState('');

useEffect(() => {
  // Simulate API call delay
  const fetchLawyers = async () => {
    try {
      // Simulating network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLawyers(mockLawyers);
    } catch (error) {
      console.error('Error fetching lawyers:', error);
      // Handle error state if needed
    }
  };

  fetchLawyers();
}, []); // Empty dependency array means this effect runs once on mount



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
        {lawyers.map((lawyer) => (
          <Card key={lawyer.id} className="p-0 overflow-hidden">
            <Link href={`/client/lawyers/${lawyer.id}`} className="block">
              <CardContent className="p-0 flex">
                <div className="w-1/3 aspect-square relative overflow-hidden group">
                  <img
                    src={lawyer.photo}
                    alt={lawyer.name}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 p-4 space-y-2">
                  <h3 className="font-semibold text-lg">{lawyer.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {lawyer.location}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {lawyer.practiceAreas.map((area) => (
                      <span
                        key={area}
                        className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">${lawyer.consultFee}/hr</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{lawyer.experience} years exp.</span>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}