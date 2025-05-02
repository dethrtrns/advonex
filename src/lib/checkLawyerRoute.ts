'use client'
import { usePathname } from "next/navigation";


export function isLawyerRoute() {
    const pathname = usePathname();
    
    if (pathname?.startsWith('/lawyer')) {
        return true;
    } else {
        return false;
    }
}
