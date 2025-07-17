// Type for the login hook
export type UseLoginHookType = {
  isOpen: boolean;
  currentStep: LoginStep;
  loggingIn: boolean;
  email: string;
  otp: string;
  otpSent: boolean;
  otpResendTimer: number;
  open: () => void;
  close: () => void;
  setEmail: (email: string) => void;
  setOtp: (otp: string) => void;
  handleRequestOtp: (email: string) => Promise<void>;
  handleVerifyOtp: (otp: string) => Promise<void>;
};

// Type for the login flow steps
export type LoginStep = 'email' | 'otp';
