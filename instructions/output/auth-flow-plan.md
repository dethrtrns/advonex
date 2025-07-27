
# Plan for Role-Based Access Control

This plan outlines the steps to implement a robust role-based access control (RBAC) system, including initial login redirection and specific checks for the lawyer registration flow.

**Backend Expectation:** For optimal performance, the JWT payload should be updated to include `lawyerRegistrationPending: boolean`.

## 1. Update `AuthContext.tsx`

- **Expand User State:**
  - The context will store the full user object, including `roles` and the `lawyerRegistrationPending` status, directly from the JWT payload.
- **Modify `authInit` (Initial Load Logic):**
  - On initial app load, the `authInit` function will be the primary handler for automatic login.
  - It will read the token from local storage.
  - **Redirection Logic:** Based on the token's payload:
    - If `roles` contains `'LAWYER'`:
      - If `lawyerRegistrationPending` is `true`, redirect to `/lawyer/register`.
      - If `false`, redirect to `/lawyer/dashboard`.
    - If `roles` contains `'CLIENT'`, redirect to `/client/dashboard`.
- **Modify `login` function:**
  - The standard login function will now primarily focus on setting the user state in the context after a manual login, as the initial redirection will be handled by `authInit`.

## 2. Create `withAuth` HOC for Ongoing Route Protection

- Create a new file: `src/components/auth/withAuth.tsx`.
- This HOC will protect routes *after* the initial login/redirection.
- **Authentication Check:** It will ensure a user is logged in. If not, it redirects to `/login`.
- **Role Check:** It will accept a `role` and verify the user has it.
- **Lawyer Registration Check (for Lawyer routes only):**
    - The `withLawyerAuth` variant of the HOC will check the `lawyerRegistrationPending` status.
    - If a lawyer tries to navigate away from the `/lawyer/register` page while their `registrationPending` is `true`, this HOC will redirect them back.

## 3. Create Role-Specific HOCs

- In `src/components/auth/withAuth.tsx`, create:
  - `withClientAuth`: A HOC for client-specific pages.
  - `withLawyerAuth`: A HOC for lawyer-specific pages that includes the registration status check.

## 4. Refine Middleware for Public and Protected Routes

- Create a `src/middleware.ts` file.
- **Logic:**
    - **Public Routes:** `/client` and `/lawyer` landing pages will be accessible to everyone.
    - **Protected Sub-Routes:** Routes like `/client/dashboard/**` and `/lawyer/dashboard/**` will be protected.
    - If an unauthenticated user tries to access a protected sub-route, the middleware will redirect them to `/login`.

## 5. Implement Route Protection

- **Client Routes:**
  - Wrap protected client pages (e.g., `src/app/client/dashboard/page.tsx`) with `withClientAuth`.
- **Lawyer Routes:**
  - Wrap the lawyer registration page (`src/app/lawyer/register/page.tsx`) with a basic auth HOC to ensure a user is logged in.
  - Wrap all other protected lawyer pages (e.g., `src/app/lawyer/dashboard/page.tsx`) with `withLawyerAuth`.

## Permissions

I will need permission to modify the following files:

- `src/contexts/AuthContext.tsx`
- `src/app/client/**/page.tsx`
- `src/app/lawyer/**/page.tsx`

I will also need permission to create the following files:

- `src/components/auth/withAuth.tsx`
- `src/middleware.ts`
