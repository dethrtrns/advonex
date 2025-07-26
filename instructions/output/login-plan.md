**Plan: Implement `useLogin` Hook**

1.  **Create `instructions/login-plan.md`**: I will create a markdown file in the `instructions` folder outlining this plan.
2.  **Create `src/hooks/login/useLogin.tsx`**: This will be the main file for the custom hook.
    - **State Management**:
      - `isOpen`: `boolean` to control the visibility of the login modal/screen.
      - `currentStep`: `enum ('email', 'otp')` to manage the current step of the login flow.
      - `loggingIn`: `boolean` to indicate if an API call is in progress (for loading states).
      - `email`: `string` to store the user's email.
      - `otp`: `string` to store the entered OTP.
      - `otpSent`: `boolean` to indicate if OTP has been successfully sent.
      - `otpResendTimer`: `number` for the countdown on the "Resend OTP" button.
    - **Exposed Functions**:
      - `open()`: Sets `isOpen` to `true` and `currentStep` to 'email'.
      - `close()`: Sets `isOpen` to `false` and resets other relevant states.
      - `loggingIn`: Returns the `loggingIn` state.
    - **Dependencies**:
      - `useAuth` from `src/contexts/AuthContext.tsx` to access `login` and `activeAppSide`.
      - `requestOtpOnEmail` and `verifyEmailOtp` from `src/utils/backend/auth.ts`.
      - `handleApiError` from `src/utils/common/commonUtils.ts`.
      - `toast` from `sonner` for notifications.
3.  **Create `src/hooks/login/login-form.tsx`**: This component will handle the email and OTP input forms.
    - **Email Form**:
      - Input field for email.
      - Validation using `Zod` and `React Hook Form`.
      - "Request OTP" button:
        - Calls `requestOtpOnEmail` with the entered email and `activeAppSide`.
        - Sets `loggingIn` to `true` during the API call.
        - On success, sets `otpSent` to `true`, starts `otpResendTimer`, and transitions `currentStep` to 'otp'.
        - On error, uses `handleApiError`.
        - Disables the button and shows a loading state during the API call and for 30 seconds after sending OTP.
    - **OTP Form**:
      - 6-digit OTP input field (`InputOTP` from Shadcn/UI).
      - Validation for OTP.
      - "Submit" button:
        - Calls `verifyEmailOtp` with email, OTP, and `activeAppSide`.
        - Sets `loggingIn` to `true` during the API call.
        - On success, calls `login` from `useAuth` with the received `accessToken`, then calls `close()` from `useLogin`.
        - On error, uses `handleApiError`.
        - Disables the button and shows a loading state during the API call.
      - "Resend OTP" button:
        - Disabled until `otpResendTimer` reaches 0.
        - Calls `requestOtpOnEmail` again.
4.  **Create `src/hooks/login/login-modal.tsx`**: This component will wrap the `login-form.tsx` and handle the modal/screen display logic.
    - **Conditional Rendering**: Renders based on the `isOpen` state from `useLogin`.
    - **Responsive Design**:
      - On desktop, uses `Dialog` from Shadcn/UI for a modal with a glassy-blur background.
      - On mobile, renders as a full-screen overlay.
    - **"Skip Login" Button**: A button to call the `close()` function from `useLogin`.
    - **Optional Animated Text/Loading Indicators**: Implement animated text (e.g., "Sending OTP...", "Verifying...") based on the `loggingIn` state and `currentStep`.
5.  **Create `src/hooks/login/login-types.ts`**: Define any new types specific to the login hook, such as the `currentStep` enum.
