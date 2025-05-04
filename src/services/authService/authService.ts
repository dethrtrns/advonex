import { toast } from "sonner";

// Types for our authentication requests and responses
type RequestOtpParams = {
  phone: string;
  type: 'lawyer' | 'client';
};

type VerifyOtpParams = {
  phone: string;
  otp: string;
  role: 'lawyer' | 'client';
};

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user?: {
    id: string;
    role: string;
  };
};

// In-memory storage for the access token
let accessToken: string | null = null;

// Function to request OTP
export async function sendOtp(params: RequestOtpParams): Promise<void> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/auth/request-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: params.phone,
        role: params.type.toUpperCase() // API expects uppercase role
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send OTP');
    }

    toast.success('OTP sent successfully. Please check your phone.');
  } catch (error) {
    console.error('Error sending OTP:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to send OTP');
    throw error;
  }
}

// Function to verify OTP and get tokens
export async function verifyOtp(params: VerifyOtpParams): Promise<AuthResponse> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: params.phone,
        otp: params.otp
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to verify OTP');
    }

    const data = await response.json();
    
    // Store access token in memory
    accessToken = data.accessToken;
    
    // Store refresh token securely (for now, using localStorage as per current app pattern)
    // In production, consider using HTTP-only cookies set by the backend
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }

    toast.success('Authentication successful!');
    return data;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to verify OTP');
    throw error;
  }
}

// Function to refresh tokens
export async function refreshTokens(): Promise<AuthResponse> {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${refreshToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // If refresh fails, clear tokens and throw error
      accessToken = null;
      localStorage.removeItem('refreshToken');
      throw new Error('Session expired. Please login again.');
    }

    const data = await response.json();
    
    // Update tokens
    accessToken = data.accessToken;
    localStorage.setItem('refreshToken', data.refreshToken);
    
    return data;
  } catch (error) {
    console.error('Error refreshing tokens:', error);
    // Don't show toast here as this might be called in the background
    throw error;
  }
}

// Function to get the current access token
export function getAccessToken(): string | null {
  return accessToken;
}

// Function to check if user is authenticated
export function isAuthenticated(): boolean {
  return !!accessToken;
}

// Function to logout
export function logout(): void {
  accessToken = null;
  localStorage.removeItem('refreshToken');
  // Redirect to home page or login page
  window.location.href = '/';
}
