// "use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inspector } from "react-dev-inspector";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { LoginProvider } from "@/contexts/LoginContext";
import { LoginModal } from "@/hooks/login/login-modal";
import { Toaster } from "@/components/ui/sonner";
import { GlassFilter } from "@/components/ui/liquid-glass";
import { Fragment } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Advonex - Find the Right Lawyer",
  description:
    "Connect with qualified legal professionals across various practice areas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const Wrapper = process.env.NODE_ENV === "development" ? Inspector : Fragment;

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          <LoginProvider>
            <ThemeProvider defaultTheme="dark">
              {/* <Wrapper> */}
              <Header />
              <main className="container mx-auto px-4 py-16 md:py-20">
                {children}
              </main>
              <BottomNav />
              <LoginModal />
              <Toaster />
              <GlassFilter />
              {/* </Wrapper> */}
            </ThemeProvider>
          </LoginProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
