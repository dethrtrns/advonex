import { Home, Search, User, BookMarked } from "lucide-react";
import Link from "next/link";

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t bg-background md:hidden">
      <div className="container h-full">
        <ul className="h-full grid grid-cols-4 items-center justify-items-center">
          <li>
            <Link href="/" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
              <Home className="h-5 w-5" />
              <span className="text-xs">Home</span>
            </Link>
          </li>
          <li>
            <Link href="/client/lawyers" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
              <Search className="h-5 w-5" />
              <span className="text-xs">Search</span>
            </Link>
          </li>
          <li>
            <Link href="#" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
              <BookMarked className="h-5 w-5" />
              <span className="text-xs">About</span>
            </Link>
          </li>
          <li>
            <Link href="#" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
              <User className="h-5 w-5" />
              <span className="text-xs">Profile</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}