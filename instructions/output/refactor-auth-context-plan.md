
# Refactor AuthContext Plan

This plan outlines the steps to merge the `LoginContext` into the `AuthContext` to create a single, unified authentication context.

## 1. Analyze Login Hook

- Examine the code in `useLogin.tsx`, `login-types.ts`, `login-form.tsx`, and `login-modal.tsx` to fully understand the login functionality and its dependencies.

## 2. Refactor `AuthContext.tsx`

- Import the `useLogin` hook and its types into `AuthContext.tsx`.
- Integrate the `useLogin` hook within the `AuthProvider`.
- Add the `loginModalHook` to the `AuthContextType` and expose it through the context provider's value.

## 3. Update Login Components

- Modify the login components to use the new `loginModalHook` from the `useAuth` hook, instead of the old `useLoginContext` hook.

## 4. Cleanup

- Delete the now-redundant `src/contexts/LoginContext.tsx` file.
- Remove the `LoginProvider` from the main application wrapper (likely in `src/app/layout.tsx`).
