import { getAccessToken, getRefreshToken } from "../storage/localStorage";
import { AuthMeResponse, AuthResponse, RefreshResponse, UserDataWithAllProfilesAndRoles } from "../types/types";



// export a reusable function(use async await) that takes in a access token and fetches the user data from the API endpoint - /auth/me and returns that data
export async function getFullUserDataFromAuthMeViaAccessToken(): Promise<UserDataWithAllProfilesAndRoles | null> {
  try {
    const token = getAccessToken();
    
    if (!token) {
      console.log('No access token available for user data fetch');
      return null;
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }); 

    if (response.ok) {
      const userAuthData: AuthMeResponse = await response.json();
      return userAuthData.data;  //only return userData from the response.
    }   
    return null;    

  }
  catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

// Function to refresh tokens
export async function refreshTokens(): Promise<RefreshResponse | null> {
  try {
    const refreshToken = getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available in localStorage.Session expired. Please login again via OTP verification.');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${refreshToken}`,
        'Content-Type': 'application/json',
      },
    });

    const responseData: RefreshResponse = await response.json();
    if (!response.ok) {
      console.error('Refresh failed from API server.');
      throw new Error(`Refresh failed from API server.
        response from api: ${responseData.message}
        `);//show the api response message in this case.
    }
    // Clear old tokens first
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessToken');
    
    // Store new tokens from response.data
    if (responseData.data && responseData.data.accessToken) {
      localStorage.setItem('accessToken', responseData.data.accessToken);
    }
    
    if (responseData.data && responseData.data.refreshToken) {
      localStorage.setItem('refreshToken', responseData.data.refreshToken);
    }
    
    return responseData;
  } catch (error) {
    console.error('Error refreshing tokens:', error);
    return null;
    // throw error;
  }
}

// check expiry of jwt token from stored token's payload
export function isJwtexpired(token: string): boolean {
  try {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
}