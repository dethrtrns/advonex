import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Scale, Briefcase, Building2, Users2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ClientLandingPage() {
  const practiceAreas = [
    { icon: Scale, name: "Civil Law", description: "Family, Property, and Contract Disputes" },
    { icon: Building2, name: "Corporate Law", description: "Business Formation and Compliance" },
    { icon: Users2, name: "Criminal Law", description: "Defense and Prosecution Services" },
    { icon: Briefcase, name: "Employment Law", description: "Workplace Rights and Regulations" },
  ];

  return (
    <div className="flex flex-col gap-8 py-4">
      <section className="text-center max-w-4xl mx-auto px-4">
      <h1 className="text-5xl font-serif tracking-tight mt-20 mb-4 md:text-7xl ">
         Next Level <br /> Lawyers
        </h1>
        <p className="text-md mb-6 max-w-2xl mx-auto">
          Connect with qualified legal professionals <br /> across various practice areas
        </p>
        <Button size="lg" variant="default" asChild className="px-8 py-6 text-sm">
          <Link href="/client/lawyers" className="gap-2">
            <Search className="h-5 w-5" />
            Search Lawyers
          </Link>
        </Button>
      </section>

      <section className="relative w-full max-w-6xl mx-auto px-4 py-16 overflow-hidden">
        <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted">
          <Image
            src="https://images.unsplash.com/photo-1731955418581-5ba6827ca5ff?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Advonex legal services"
            width={1931}
            height={1080}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20 pointer-events-none" />
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-6">Practice Areas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {practiceAreas.map((area) => (
            <Card key={area.name}>
              <CardContent className="flex flex-col items-center text-center p-6">
                <area.icon className="h-12 w-12 mb-4 text-primary" />
                <h3 className="font-semibold mb-2">{area.name}</h3>
                <p className="text-sm text-muted-foreground">{area.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
