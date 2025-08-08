"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Scale, Users2, Trophy, BadgeDollarSign } from "lucide-react";
import { BoxReveal } from "@/components/magicui/box-reveal";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ShinyButton } from "@/components/ui/shiny-button";
import { redirect } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLoginContext } from "@/contexts/LoginContext";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { NeumorphButton } from "@/components/ui/neumorph-button";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { StripeBgGuides } from "@/components/ui/stripe-bg-guides";

import { motion } from "motion/react";
import { LiquidCard } from "@/components/liquid-glass-card";
import { LiquidButton } from "@/components/liquid-glass-button";

export default function LawyerLanding() {
  const { user, isAuthenticated } = useAuth();
  const LoginModal = useLoginContext();

  const benefits = [
    {
      icon: Users2,
      title: "Expand Your Client Base",
      description:
        "Connect with potential clients actively seeking legal representation in your practice areas.",
    },
    {
      icon: Scale,
      title: "Build Your Reputation",
      description:
        "Showcase your expertise, experience, and client reviews to establish trust with potential clients.",
    },
    {
      icon: Trophy,
      title: "Professional Profile",
      description:
        "Create a comprehensive professional profile highlighting your qualifications and achievements.",
    },
    {
      icon: BadgeDollarSign,
      title: "Efficient Client Acquisition",
      description:
        "Save time and resources by connecting with pre-qualified clients seeking your specific expertise.",
    },
  ];

  const handleRegisterAction = () => {
    if (!isAuthenticated) {
      LoginModal.open();
    } else {
      redirect("/lawyer/register");
    }
  };

  return (
    <div className="flex flex-col gap-8 py-4">
      <StripeBgGuides
        columnCount={8}
        animated={true}
        animationDuration={8}
        animationDelay={0.8}
        glowColor="cyan"
        glowSize="5vh"
        glowOpacity={0.8}
        randomize={false}
        randomInterval={120}
        maxActiveColumns={8}
        contained={false}
        easing="spring"
        darkMode={true}
      />
      <section className="flex flex-col items-center text-center max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-serif tracking-tight mt-20 mb-4 md:text-5xl">
          Grow Your Legal Practice
          <br />
          with Advonex
        </h1>
        {/* <h1 className="text-3xl font-serif tracking-tight mt-20 mb-4 md:text-5xl"> */}
        {/* <motion.h1
          className="text-3xl font-serif tracking-tight mt-20 mb-4 md:text-5xl"
        
          initial={{
            opacity: 0,
            color: "white",
          }}
          
          animate={{ opacity: 1, color: "cyan" }}
          transition={{
            duration: 1,
            ease: "easeOut",
            repeat: Infinity,
            repeatDelay: 0.1,
          }}>
          Grow Your Legal Practice
          <br />
          with Advonex
         
        </motion.h1> */}

        <p className="text-md mb-6 max-w-2xl mx-auto">
          Join our network of distinguished legal professionals and connect with
          clients who need your expertise
        </p>

        <LiquidButton onClick={handleRegisterAction}>Register now</LiquidButton>
      </section>

      <section className="mt-8  ">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Why Join Advonex?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit) => (
            <LiquidCard key={benefit.title}>
              <CardContent className="flex items-start gap-4 p-12">
                <benefit.icon className="h-8 w-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </CardContent>
            </LiquidCard>
          ))}
        </div>
      </section>

      <section className="mt-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
        <p className="text-muted-foreground mb-6">
          Join our growing network of legal professionals and start connecting
          with clients today.
        </p>
        <LiquidButton variant={"secondary"}>
          <Link href="/lawyer/dashboard">open dashboard page</Link>
        </LiquidButton>
      </section>
    </div>
  );
}
