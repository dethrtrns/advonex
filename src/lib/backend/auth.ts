import { handleApiError } from "../common/commonUtils";
import { toast } from "sonner";
import { getAccessToken, getRefreshToken } from "../storage/localStorage";
import {
  AuthMeResponse,
  AuthResponse,
  RefreshResponse,
  RequestEmailOtpParams,
  UserDataWithAllProfilesAndRoles,
  VerifyEmailOtpParams,
  VerifyOtpEmailResponse,
} from "../types/types";

// Function to request Email OTP
export async function requestOtpOnEmail(
  params: RequestEmailOtpParams
): Promise<void> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/auth/request-otp-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: params.email,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`${errorData.message}: Failed to send OTP`);
    }

    toast.success("OTP sent successfully. Please check your email.");
  } catch (error) {
    handleApiError(error, "Failed to send OTP");
    throw error;
  }
}

// Function to verify Email OTP and get tokens
export async function verifyEmailOtp(
  params: VerifyEmailOtpParams
): Promise<VerifyOtpEmailResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/auth/verify-otp-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: params.email,
          otp: params.otp,
          role: params.role.toUpperCase(),
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.message + `:Please try again`);
      console.log(response);
      throw new Error(errorData.message || "Failed to verify OTP");
    }

    const otpVerifyResponse = await response.json();
    console.log(
      "OTP verification successful(from API)",
      otpVerifyResponse.data
    );

    // Store access token in memory
    // accessToken = otpVerifyResponse.data.accessToken;

    // Store refresh token securely

    localStorage.setItem("refreshToken", otpVerifyResponse.data.refreshToken);

    // Store access token in memory

    localStorage.setItem("accessToken", otpVerifyResponse.data.accessToken);

    toast.success("Authentication successful!");
    return otpVerifyResponse;
  } catch (error) {
    handleApiError(error, "Failed to verify OTP");
    throw error;
  }
}

// export a reusable function(use async await) that takes in a access token and fetches the user data from the API endpoint - /auth/me and returns that data
export async function getFullUserDataFromAuthMeViaAccessToken(): Promise<UserDataWithAllProfilesAndRoles | null> {
  try {
    const token = getAccessToken();

    if (!token) {
      console.log("No access token available for user data fetch");
      return null;
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/auth/me`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const userAuthData: AuthMeResponse = await response.json();
      return userAuthData.data; //only return userData from the response.
    }
    return null;
  } catch (error) {
    handleApiError(error, "Error fetching user data");
    return null;
  }
}

// Function to refresh tokens
export async function refreshTokens(): Promise<RefreshResponse | null> {
  try {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      // Remove throw error and add maybe console.warn or something because it's Not a breaking error
      throw new Error(
        "No refresh token available in localStorage.Session expired. Please login again via OTP verification."
      );
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/auth/refresh`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const responseData: RefreshResponse = await response.json();
    if (!response.ok) {
      console.error("Refresh failed from API server.");
      throw new Error(
        `Refresh failed from API server.\n        response from api: ${responseData.message}\n        `
      ); //show the api response message in this case.
    }
    // Clear old tokens first
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");

    // Store new tokens from response.data
    if (responseData.data && responseData.data.accessToken) {
      localStorage.setItem("accessToken", responseData.data.accessToken);
    }

    if (responseData.data && responseData.data.refreshToken) {
      localStorage.setItem("refreshToken", responseData.data.refreshToken);
    }

    return responseData;
  } catch (error) {
    handleApiError(error, "Error refreshing tokens");
    return null;
    // throw error;
  }
}

// check expiry of jwt token from stored token's payload
export function isJwtexpired(token: string): boolean {
  try {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTime;
  } catch (error) {
    handleApiError(error, "Error decoding token");
    return true;
  }
}
