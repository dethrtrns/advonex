import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Scale, Briefcase, Building2, Users2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { AnimatedBeamDemo } from "@/components/ui/beam-connect";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { ShinyButton } from "@/components/ui/shiny-button";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { LiquidCard } from "@/components/liquid-glass-card";
import { LiquidButton } from "@/components/liquid-glass-button";

export default function ClientLandingPage() {
  const practiceAreas = [
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

  return (
    <div className="flex flex-col gap-8 py-4">
      <section className="flex flex-col items-center text-center max-w-4xl mx-auto px-4">
        <h1 className="text-5xl font-serif tracking-tight mt-20 mb-4 md:text-7xl ">
          Next Level <br /> Lawyers
        </h1>
        <p className="text-md mb-6 max-w-2xl mx-auto">
          Connect with qualified legal professionals <br /> across various
          practice areas
        </p>
        <LiquidButton>
          <Link href="/client/lawyers">Find Lawyers</Link>
        </LiquidButton>
      </section>

      <section className="relative w-full max-w-6xl mx-auto px-4 py-16 overflow-hidden">
        <div className="w-full rounded-lg ">
          <AnimatedBeamDemo></AnimatedBeamDemo>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20 pointer-events-none" />
      </section>

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
    </div>
  );
}
