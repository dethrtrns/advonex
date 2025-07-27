### **Advanced Route Protection & RBAC Plan**

This plan details a multi-layered strategy for authentication and authorization, prioritizing a fast initial load and handling specific user registration flows.

**Backend Expectation:** For optimal performance, the JWT payload from the backend should be updated to include `lawyerRegistrationPending: boolean`.

#### **Part 1: Initial Load and Automatic Login (`AuthContext`)**

This part focuses on the initial app load experience, ensuring users are redirected correctly and efficiently.

*   **Action:** Modify the `authInit` function within `src/contexts/AuthContext.tsx`.
*   **Logic:**
    1.  On app start, this function will attempt to read the `accessToken` from local storage.
    2.  If a token exists, it will be decoded *on the client*.
    3.  **Immediate Redirection Based on Payload:**
        *   If the token payload contains `role: 'LAWYER'`:
            *   If `lawyerRegistrationPending: true`, the user is immediately redirected to `/lawyer/register`.
            *   If `lawyerRegistrationPending: false`, the user is immediately redirected to `/lawyer/dashboard`.
        *   If the token payload contains `role: 'CLIENT'`, the user is immediately redirected to `/client/dashboard`.
    4.  This client-side redirection based on the token payload avoids the need for an initial `GET /auth/me` call, ensuring a faster startup.

#### **Part 2: Ongoing Navigation and Security (Middleware and HOCs)**

This part handles security for subsequent user navigation and direct access attempts.

**1. Server-Side Pre-check with Next.js Middleware:**

*   **Action:** Create a `src/middleware.ts` file.
*   **Logic:**
    *   It will protect all sensitive sub-routes (e.g., `/lawyer/dashboard/**`, `/client/dashboard/**`).
    *   It will leave the main landing pages (`/lawyer`, `/client`) public.
    *   If an unauthenticated user tries to access a protected route directly, the middleware will redirect them to `/login` before any client-side code is rendered.

**2. Client-Side Enforcement with a `withAuth` HOC:**

*   **Action:** Create a `src/components/auth/withAuth.tsx` HOC.
*   **Logic:**
    *   This HOC acts as a secondary check and handles UI states (like loading spinners).
    *   `withClientAuth`: For client pages, it will primarily verify the `CLIENT` role.
    *   `withLawyerAuth`: For lawyer pages, it will have a crucial additional check:
        *   It will verify the `LAWYER` role.
        *   If the `lawyerRegistrationPending` status is `true`, it will prevent the lawyer from navigating to any other lawyer-only page besides `/lawyer/register`, redirecting them back if they try.

**3. Page Application:**

*   **Action:** Wrap all protected pages with the appropriate HOC (`withClientAuth` or `withLawyerAuth`).
    *   The `/lawyer/register` page will also be wrapped to ensure only authenticated users can access it, but its HOC will not perform the registration check on itself.
