
import { getAccessToken } from "@/contexts/AuthContext";
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
// Update phone otp data according to API response
type AuthResponse = {
  success: boolean;
  message: string;
  data: {
  accessToken: string;
  refreshToken: string;
  profileId?: string;
  user?: {
    id: string;
    roles: string[];
  };}
};

// Types for email authentication
type RequestEmailOtpParams = {
  email: string;
  role?: 'lawyer' | 'client';
};

type VerifyEmailOtpParams = {
  email: string;
  otp: string;
  role: 'lawyer' | 'client';
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
    console.log(data);
    
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

///////////////////////////////////////////////////////////////////////
// Function to request Email OTP
export async function sendEmailOtp(params: RequestEmailOtpParams): Promise<void> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/auth/request-otp-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: params.email
        
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send OTP');
    }

    toast.success('OTP sent successfully. Please check your email.');
  } catch (error) {
    console.error('Error sending email OTP:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to send OTP');
    throw error;
  }
}

// Function to verify Email OTP and get tokens
export async function verifyEmailOtp(params: VerifyEmailOtpParams): Promise<AuthResponse> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/auth/verify-otp-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: params.email,
        otp: params.otp,
        role: params.role.toUpperCase()
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.message) + `:Please try again`;
      // throw new Error(errorData.message || 'Failed to verify OTP');
    }

    const otpVerifyResponse = await response.json();
    console.log('OTP verification successful(from API)',otpVerifyResponse.data);
    
    // Store access token in memory
    // accessToken = otpVerifyResponse.data.accessToken;
    
    // Store refresh token securely
  
      localStorage.setItem('refreshToken', otpVerifyResponse.data.refreshToken);
    
// Store access token in memory
    
      localStorage.setItem('accessToken', otpVerifyResponse.data.accessToken);
    

    toast.success('Authentication successful!');
    return otpVerifyResponse.data;
  } catch (error) {
    console.error('Error verifying email OTP:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to verify OTP');
    throw error;
  }
}


////////////////////////////////////////////////////
// Function to refresh tokens
export async function refreshTokens(): Promise<AuthResponse> {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      console.log('No refresh token available');
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
     
      console.log('Refresh failed. Clearing tokens.');
      throw new Error('Session expired. Please login again.');
    }

    const responseData = await response.json();
    
    // Clear old tokens first
    accessToken = null;
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessToken');
    
    // Store new tokens from response.data
    if (responseData.data && responseData.data.accessToken) {
      accessToken = responseData.data.accessToken;
      localStorage.setItem('accessToken', responseData.data.accessToken);
    }
    
    if (responseData.data && responseData.data.refreshToken) {
      localStorage.setItem('refreshToken', responseData.data.refreshToken);
    }
    
    return responseData;
  } catch (error) {
    console.error('Error refreshing tokens:', error);
    // Don't show toast here as this might be called in the background
    throw error;
  }
}



// Function to check if user is authenticated
export function isAuthenticated(): boolean {
  return !!accessToken;
}

// Function to logout
export function logout(): void {
  // accessToken = null;
  localStorage.removeItem('accessToken'); // Not working for some reason, Need debugging
  localStorage.removeItem('refreshToken');
  // Redirect to home page or login page
  window.location.href = '/';
}


// Type for full user profile data from API
type UserProfile = {
  id: string;
  email: string;
  phoneNumber: string | null;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
  accountStatus: string;
  roles: string[];
};

// Function to fetch current user data
export async function getCurrentUserFromToken(): Promise<UserProfile | null> {
  try {
    const token = getAccessToken();
    
    if (!token) {
      console.log('No access token available for user data fetch');
      return null;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const responseData = await response.json();
    return responseData.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}


