import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Scale, Briefcase, Building2, Users2 } from "lucide-react";
import Link from "next/link"; // Add this import

export default function ClientLandingPage() {
  const practiceAreas = [
    { icon: Scale, name: "Civil Law", description: "Family, Property, and Contract Disputes" },
    { icon: Building2, name: "Corporate Law", description: "Business Formation and Compliance" },
    { icon: Users2, name: "Criminal Law", description: "Defense and Prosecution Services" },
    { icon: Briefcase, name: "Employment Law", description: "Workplace Rights and Regulations" },
  ];

  return (
    <div className="flex flex-col gap-8 py-4">
      <section className="text-center md:text-left">
        
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Find the Right Lawyer<br />
          For Your Legal Needs
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Connect with qualified legal professionals across various practice areas
        </p>
        <Button size="lg" asChild>
          <Link href="/client/lawyers" className="gap-2">
            <Search className="h-4 w-4" />
            Search Lawyers
          </Link>
        </Button>
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
