"use client";

import { CardContent, LiquidCard } from "@/components/liquid-glass-card";
import { practiceAreas } from "@/data/pacticeAreas/pacticeAreas";
import { Briefcase, Building2, Scale, Users2 } from "lucide-react";
import { useEffect, useState } from "react";

const mockPracticeAreas = [
  {
    icon: Scale,
    name: "Civil Law",
    description: "Family, Property, and Contract Disputes",
  },
  {
    icon: Building2,
    name: "Corporate Law",
    description: "Business Formation and Compliance",
  },
  {
    icon: Users2,
    name: "Criminal Law",
    description: "Defense and Prosecution Services",
  },
  {
    icon: Briefcase,
    name: "Employment Law",
    description: "Workplace Rights and Regulations",
  },
];

export default function Areas() {
  const [practiceAreas, setPracticeAreas] = useState(mockPracticeAreas);

  useEffect(() => {
    const fetchPracticeAreas = async () => {
      try {
        //fetch real areas from ezzy API here
        const response = await fetch("/api/practice-areas");
        const data = await response.json();
        setPracticeAreas(data);
      } catch (error) {
        console.error("Error fetching practice areas:", error);
      } finally {
        // setIsLoading(false);
      }
    };

    fetchPracticeAreas();
  }, []);

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-semibold mb-6">Practice Areas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {practiceAreas.map((area) => (
          <LiquidCard key={area.name}>
            <CardContent className="flex flex-col items-center text-center p-6">
              <area.icon className="h-12 w-12 mb-4 text-primary" />
              <h3 className="font-semibold mb-2">{area.name}</h3>
              <p className="text-sm text-muted-foreground">
                {area.description}
              </p>
            </CardContent>
          </LiquidCard>
        ))}
      </div>
    </section>
  );
}
