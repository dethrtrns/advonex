'use client'
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, TypeOutline } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { RegisterDialog } from "@/components/auth/register-dialog";
import Link from "next/link";
import { isLawyerRoute } from "@/lib/checkLawyerRoute";
import { useAuth } from "@/contexts/AuthContext";
import { getAccessToken } from "@/contexts/AuthContext";
import { jwtDecode } from "jwt-decode";
// import { isAuthenticated, logout, getAccessToken } from "@/services/authService/authService";

// const authenticatedUser = isAuthenticated();
// const logoutUser = () => {
//   logout();
// }


export function Header() {

  const {isAuthenticated, logout, user} = useAuth();
// For testing purposes
//   let accessToken = getAccessToken();

console.log(`User with roles:  ${user?.roles} by AuthContext`);

// if(accessToken){
//   let decodedToken= jwtDecode<any>(accessToken);
//   const id = decodedToken.sub; 
//   const jwtData = decodedToken;
//   const role = decodedToken.roles[0];
  
// console.log(`Data provided by AuthContext`);

// console.log(`User  ${isAuthenticated} by AuthContext`);
// console.log(`User profileId from decodedToken by authContext: ${user?.profileId}`);
// console.log(`+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++`);
// console.log(`Directly Decoded Token in Header`);
// console.log(`User with ID: ${id} and role: ${role}`);
// console.log(`User from decodedToken by authContext: ${user}`);
// console.log(`decodedToken: ${JSON.stringify(jwtData)}`);
// console.log(`+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++`);



// }



  const checkLawyer = isLawyerRoute();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container h-full flex items-center justify-between">
        <div className="flex items-center px-4 gap-6">
          <Link href="/" className="text-3xl px-4 font-serif font- tracking-tight md:text-4xl md:px-12">Advonex</Link>
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
            { (user) ? <div> <button onClick={logout}> Logout</button></div> :
            <RegisterDialog />
            }
          </div>
  
         
          { (checkLawyer === true) ? (
          <Button variant="outline" asChild>
             { (!user) ? <Link href="/client" className="flex items-center gap-2">
                <span>I'm Not a Lawyer</span>
              </Link> : <Link href="/lawyer/dashboard" className="flex items-center gap-2">
              <span>My Dashboard</span> </Link>}
          </Button>) :
                   
            (<Button variant="outline" asChild>
            <Link href="/lawyer" className="flex items-center gap-2">
              <span>I'm a Lawyer</span>
           </Link>
       </Button> )
          }
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