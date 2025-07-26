**Plan: Fix and Complete Login Implementation**

1.  **Define Zod Schemas in `src/hooks/login/login-form.tsx`**:
    *   I will import `z` from `zod`.
    *   I will define `emailFormSchema` to validate a string as a valid email.
    *   I will define `otpFormSchema` to validate a string with a length of exactly 6 characters.

2.  **Correct Prop Passing in `src/hooks/login/login-modal.tsx`**:
    *   The `LoginForm` component inside the `Sheet` (for mobile view) is currently passed `hook={hook}` which is incorrect.
    *   I will update this to pass the individual props required by `LoginForm`, matching the implementation in the `Dialog` (desktop view).

3.  **Create `LoginContext` for Global State Management**:
    *   I will create a new file at `src/contexts/LoginContext.tsx`.
    *   This file will contain:
        *   A `LoginContext` created with `createContext`.
        *   A `LoginProvider` component that calls the `useLogin` hook and passes its value to children components.
        *   A `useLoginContext` custom hook to easily consume the context's value.

4.  **Integrate `LoginProvider` and `LoginModal` into the App Layout**:
    *   In `src/app/layout.tsx`, I will wrap the application's children with the `LoginProvider`.
    *   I will also add the `LoginModal` component within the provider to make it globally available.

5.  **Update Components to Use the New `LoginContext`**:
    *   I will refactor `src/hooks/login/login-modal.tsx` to get the login state and functions from `useLoginContext()` instead of calling `useLogin()` directly.
    *   I will update `src/components/layout/header.tsx` to include a "Login" button that triggers the `open` function from the `useLoginContext`.
