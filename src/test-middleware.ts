// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { use } from "react";
// import { useAuth } from "./contexts/AuthContext";

// const ROLE_PATHS = [
//   { path: "/lawyer", role: "LAWYER" },
//   { path: "/client", role: "CLIENT" },
// ];

// export function middleware(request: NextRequest) {
//     const { pathname } = request.nextUrl;
//     const { isAuthenticated, isAuthenticating, user } = useAuth();

//   // Find if the path is protected and which role is required
//   const matched = ROLE_PATHS.find(({ path }) => pathname.startsWith(path));
//   if (!matched) return NextResponse.next(); // Not a protected route

//   if (!isAuthenticated) {
//     // Not logged in
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   try {
//       // Decode token (do not use jwt.verify unless you have the secret here)
//         // const payload: any = jwtDecode();

//     // Check if user has the required role
//       if (!user?.roles?.includes(matched.role)) {
//         return console.log("User is not authorized by middleware");
//         // NextResponse.redirect(new URL("/unauthorized", request.url));
//     }
//   } catch (e) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   return NextResponse.next();
// }

// // Optionally, configure matcher for only protected routes
// export const config = {
//   matcher: ["/lawyer/:path*", "/client/:path*", "/lawyer/*"],
// };