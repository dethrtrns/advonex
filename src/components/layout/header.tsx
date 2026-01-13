"use client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, TypeOutline, User } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
// import { RegisterDialog } from "@/components/auth/register-dialog";
import Link from "next/link";
import { isLawyerRoute } from "@/lib/checkLawyerRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { redirect } from "next/navigation";
import { ShinyButton } from "../ui/shiny-button";
import { useLoginContext } from "@/contexts/LoginContext";
import { LiquidButton } from "../liquid-glass-button";
import { LiquidCard } from "../liquid-glass-card";
import { liquidGlassClasses, liquidGlassStyle } from "../ui/liquid-glass";
import { cn } from "@/lib/utils";

export function Header() {
  const {
    activeAppSide,
    isAuthenticating,
    resetAppLoginState,
    setActiveAppSide,
    isAuthenticated,
    logout,
    user,
  } = useAuth();
  const loginHook = useLoginContext();
  // For testing purposes
  //   let accessToken = getAccessToken();

  console.log(
    `User with role(s):  ${
      user ? user?.email : "Guest"
    } to Advonex ${activeAppSide} portal.`,
  );

  const checkLawyer = activeAppSide === "LAWYER" ? true : false;
  // const appSide = activeAppSide.toLocaleLowerCase();
  const handleLogout = () => {
    resetAppLoginState();
    // setActiveAppSide("CLIENT");
    // const redirectPathOnLogout = activeAppSide ? "/lawyer" : "/client";
    redirect("/");
  };
  // valid appSide values are 'CLIENT' or 'LAWYER'
  // custom button component that displays action-text based on activeAppSide to switch between client and lawyer app, click should open a warning dialog and after confirmation,use redirect() to navigate the user and set the activeAppSide to appropriate value.
  const SwitchAppButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSwitchApp = () => {
      setIsOpen(true);
    };
  };
  return (
    <>
      {/* <LiquidCard className="fixed top-0 left-0 right-0 z-50 h-18 -m-1 rounded-none "> */}
      <div
        className={cn(
          // liquidGlassClasses,
          "fixed top-0 left-0 right-0 z-50 h-18 px-1 rounded-none border-b-1 flex items-center justify-between",
          //removed liquidGlassClasses to remove shadow-box effect. `border-none` removes simple line border when w-2/3
        )}
        // 2. Apply the style object for the backdrop-filter which gives the main liquid glass effect.
        style={liquidGlassStyle}
        // className="container h-full flex items-center justify-between"
      >
        <div className="flex items-center px-4 gap-6">
          <Link
            href={`/${activeAppSide.toLocaleLowerCase()}`}
            className="text-2xl px-4 font-serif font- tracking-tight md:text-4xl md:px-12">
            Advonex
            <sub className="text-foreground text-xs space-x-1.5 tracking-wide text-amber-500">{`${activeAppSide.toLocaleLowerCase()}s`}</sub>
          </Link>

          {/* <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link
                    href="/client/lawyers"
                    className="px-4 py-2">
                    Find Lawyers
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link
                    href="#"
                    className="px-4 py-2">
                    Practice Areas
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu> */}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {
              // Changes from User to isAuthenticated based condition
              isAuthenticated ? (
                <div>
                  {" "}
                  <LiquidButton
                    variant={"destructive"}
                    onClick={handleLogout}>
                    {" "}
                    Logout
                  </LiquidButton>
                </div>
              ) : (
                <>
                  <LiquidButton
                    variant={"secondary"}
                    size={"default"}
                    onClick={loginHook.open}>
                    Sign In
                  </LiquidButton>
                </>
              ) // <RegisterDialog />
            }
          </div>
          <Button
            className="w-fit hidden md:flex"
            onClick={() =>
              setActiveAppSide(checkLawyer === true ? "CLIENT" : "LAWYER")
            }
            variant="outline"
            asChild>
            {checkLawyer === true ? (
              <Link
                href="/client"
                className="flex items-center gap-2">
                <span>
                  Go to Advonex
                  <sub className="text-accent-foreground">clients</sub>
                </span>
              </Link>
            ) : (
              <Link
                href="/lawyer"
                className="flex items-center gap-2">
                <span>Become a Lawyer</span>
              </Link>
            )}
          </Button>

          <Sheet>
            <SheetTrigger
              asChild
              className="md:hidden">
              <Button
                variant="outline"
                className="rounded-full mr-2 bg-background/95 backdrop-blur-2xl"
                size="icon">
                <User className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              className={cn(
                // liquidGlassClasses,
                "w-full flex items-center bg-transparent",
                //removed liquidGlassClasses, added bg-transparent to remove shadow-box effect. `border-none` removes simple line border when w-2/3
              )}
              // 2. Apply the style object for the backdrop-filter which gives the main liquid glass effect.
              style={liquidGlassStyle}
              // className="w-full bg-transparent"
              side="right">
              {/* <LiquidCard className="flex items-center rounded-none -mx-1 min-h-screen"> */}
              <SheetTitle className="text-2xl font-bold mb-4 px-4 py-4">
                Menu
              </SheetTitle>
              <nav className="flex flex-col items-center gap-8">
                <SheetClose asChild>
                  <Link
                    href="#"
                    // href="/client/lawyers"
                    className="px-4 py-2">
                    Find Lawyers
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="#"
                    className="px-4 py-2">
                    Practice Areas
                  </Link>
                </SheetClose>
                <span className="text-red-500">
                  welcome {user ? user?.email : "Guest"}
                </span>
                <SheetClose asChild>
                  {user ? (
                    <div>
                      {" "}
                      <LiquidButton
                        variant={"destructive"}
                        onClick={handleLogout}>
                        {" "}
                        Logout
                      </LiquidButton>
                    </div>
                  ) : (
                    <div>
                      <LiquidButton
                        variant={"secondary"}
                        onClick={loginHook.open}>
                        login
                      </LiquidButton>
                    </div>
                  )}
                </SheetClose>
              </nav>
              <Button
                className="w-fit absolute bottom-5 right-2"
                onClick={() =>
                  setActiveAppSide(checkLawyer === true ? "CLIENT" : "LAWYER")
                }
                variant="ghost"
                // asChild
              >
                {checkLawyer === true ? (
                  <Link
                    href="/client"
                    className="flex items-center gap-2">
                    <span>
                      Go to Advonex
                      <sub className="text-accent-foreground">clients</sub>
                    </span>
                  </Link>
                ) : (
                  <Link
                    href="/lawyer"
                    className="flex items-center gap-2">
                    <span>Become a Lawyer</span>
                  </Link>
                )}
              </Button>
              {/* </LiquidCard> */}
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {/* </LiquidCard> */}
    </>
  );
}
