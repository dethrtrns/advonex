import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Scale, Users2, Trophy, BadgeDollarSign } from "lucide-react";
import Link from "next/link";

export default function LawyerLanding() {
  const benefits = [
    {
      icon: Users2,
      title: "Expand Your Client Base",
      description: "Connect with potential clients actively seeking legal representation in your practice areas."
    },
    {
      icon: Scale,
      title: "Build Your Reputation",
      description: "Showcase your expertise, experience, and client reviews to establish trust with potential clients."
    },
    {
      icon: Trophy,
      title: "Professional Profile",
      description: "Create a comprehensive professional profile highlighting your qualifications and achievements."
    },
    {
      icon: BadgeDollarSign,
      title: "Efficient Client Acquisition",
      description: "Save time and resources by connecting with pre-qualified clients seeking your specific expertise."
    }
  ];

  return (
    <div className="flex flex-col gap-8 py-4">
      <section className="text-center md:text-left">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Grow Your Legal Practice<br />
          with Advonex
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Join our network of distinguished legal professionals and connect with clients who need your expertise
        </p>
        <Button size="lg" asChild>
          <Link href="/lawyer/register" className="gap-2">
            Join Advonex Today
          </Link>
        </Button>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">Why Join Advonex?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit) => (
            <Card key={benefit.title}>
              <CardContent className="flex items-start gap-4 p-6">
                <benefit.icon className="h-8 w-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
        <p className="text-muted-foreground mb-6">
          Join our growing network of legal professionals and start connecting with clients today.
        </p>
        <Button size="lg" asChild>
          <Link href="/lawyer/register">
            Create Your Profile
          </Link>
        </Button>
      </section>
    </div>
  );
}