### **Route Protection & RBAC Plan**

This plan uses a layered approach, combining Next.js Middleware for server-side enforcement with React Context and Higher-Order Components (HOCs) for seamless client-side integration.

#### **Part 1: Basic Protection (Logged-in vs. Public)**

This setup protects routes that require any authenticated user, redirecting unauthenticated users to the login page.

**1. Centralized Route Configuration:**
To maintain clarity, we'll define all our routes and their access levels in a single configuration file.

*   **Action:** Create a new file `src/config/routes.ts`.
*   **Content:** This file will export objects defining public routes (`/login`, `/`), protected routes that require login (`/client`, `/lawyer`), and routes specific to each role.

**2. Server-Side Enforcement with Next.js Middleware:**
Middleware is the first line of defense. It runs on the server before a page is rendered, making it highly secure.

*   **Action:** Create a `src/middleware.ts` file.
*   **Logic:**
    1.  It will read the authentication token from the request (e.g., from cookies).
    2.  It will check the requested path against the route configuration from `src/config/routes.ts`.
    3.  If a user tries to access a protected route without a valid token, the middleware will redirect them to `/login`.

**3. Client-Side Protection with a `withAuth` HOC:**
This provides a better user experience by handling auth checks on the client, enabling loading states, and protecting components.

*   **Action:** Create a `src/components/auth/withAuth.tsx` Higher-Order Component.
*   **Logic:**
    1.  This HOC will wrap any page or component that needs protection.
    2.  It will consume the `AuthContext` to get the user's authentication status.
    3.  While checking the status, it can render a loading spinner.
    4.  If the user is not authenticated, it will redirect them using the Next.js router.

---

#### **Part 2: Advanced Protection (Role-Based Access Control - RBAC)**

This extends the basic setup to grant access based on specific user roles (`client`, `lawyer`).

**1. Update Middleware for RBAC:**
The middleware will be enhanced to understand roles.

*   **Action:** Modify `src/middleware.ts`.
*   **Logic:**
    1.  After validating the auth token, the middleware will need to determine the user's role. This is where your backend information is key. Ideally, the role is encoded in the JWT payload to avoid an extra API call.
    2.  It will check if the user's role is authorized to access the requested path (e.g., a user with a `client` role trying to access `/lawyer/dashboard`).
    3.  If the user is not authorized, it can redirect them to a dedicated "Access Denied" page or their respective dashboard.

**2. Create a `withRoles` HOC:**
This HOC will protect pages and components based on an allowed list of roles.

*   **Action:** Create a `src/components/auth/withRoles.tsx` HOC.
*   **Logic:**
    1.  The HOC will accept an array of roles as an argument (e.g., `withRoles(['lawyer'])`).
    2.  It will get the user's role from the `AuthContext`.
    3.  If the user's role is not in the allowed list, it will render an "Access Denied" component or redirect them.

**3. Update `AuthContext`:**
The context needs to be aware of the user's role.

*   **Action:** Update `src/contexts/AuthContext.tsx`.
*   **Logic:**
    1.  When the user logs in or the app loads, the context will fetch the user's data, including their role, from the backend.
    2.  It will store the user's role in its state and provide it to all consuming components, like our HOCs.
