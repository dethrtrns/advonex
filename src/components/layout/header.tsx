import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { RegisterDialog } from "@/components/auth/register-dialog";
import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container h-full flex items-center justify-between">
        <div className="flex items-center px-4 gap-6">
          <Link href="/" className="text-xl font-bold">Advonex</Link>
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/client/lawyers" className="px-4 py-2">Find Lawyers</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="#" className="px-4 py-2">Practice Areas</Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">         
            <ThemeToggle />
            <RegisterDialog />
            {/* <Button asChild>
              <Link href="#">Sign In</Link>
            </Button> */}
          </div>
          <Button variant="outline" asChild>
              <Link href="/lawyer" className="flex items-center gap-2">
                <span>Im a Lawyer</span>
              </Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle className="text-xl font-bold mb-4 px-4 py-4">Menu</SheetTitle>
              <nav className="flex flex-col gap-4">
                <SheetClose asChild>
                  <Link href="/client/lawyers" className="px-4 py-2">Find Lawyers</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="#" className="px-4 py-2">Practice Areas</Link>
                </SheetClose>
                <SheetClose asChild>
                <RegisterDialog />
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}