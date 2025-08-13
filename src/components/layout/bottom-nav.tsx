import { Home, Search, User, BookMarked } from "lucide-react";
import Link from "next/link";
import { LiquidCard } from "../liquid-glass-card";

export function BottomNav() {
  return (
    <LiquidCard className="fixed bottom-0 left-0 right-0 z-50 h-16 -m-1 rounded-none border-none  md:hidden">
      <div className="container h-full mt-0">
        <ul className="h-full grid grid-cols-4 items-center justify-items-center">
          <li>
            <Link
              href="/"
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
              <Home className="h-5 w-5" />
            </Link>
          </li>
          <li>
            <Link
              href="/client/lawyers"
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
              <Search className="h-5 w-5" />
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
              <BookMarked className="h-5 w-5" />
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
              <User className="h-5 w-5" />
            </Link>
          </li>
        </ul>
      </div>
    </LiquidCard>
  );
}
