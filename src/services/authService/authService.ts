import { toast } from "sonner";

// Define interfaces for request payloads and responses if needed
interface SendOtpPayload {
  phone: string;
  type: 'lawyer' | 'client';
}

interface VerifyOtpPayload {
  phone: string;
  otp?: string; // Optional because it might not be present initially
  role: 'lawyer' | 'client';
}

interface VerifyOtpResponse {
  token?: string; // Assuming the token is returned on successful verification
  // Add other potential response fields
}

// Function to handle sending OTP
export const sendOtp = async (payload: SendOtpPayload): Promise<void> => {
  try {
    const response = await fetch("http://192.168.0.178:3003/auth/request-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to send OTP");
    }
    toast.success("OTP sent successfully!");
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "Failed to send OTP");
    throw error; // Re-throw the error to be caught by the caller if needed
  }
};

// Function to handle verifying OTP
export const verifyOtp = async (payload: VerifyOtpPayload): Promise<VerifyOtpResponse> => {
  try {
    const response = await fetch("http://192.168.0.178:3003/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "OTP verification failed");
    }

    toast.success("Sign in successful!");
    return data; // Return the response data (e.g., containing the token)
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "OTP verification failed");
    throw error; // Re-throw the error
  }
};