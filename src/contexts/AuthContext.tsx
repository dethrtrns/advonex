"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUserFromToken } from '@/services/authService/authService';
import { getAccessToken } from '@/utils/storage/localStorage';
import { isJwtexpired } from '@/utils/backend/auth';
import { extractPayloadFromJwt, getUserFromToken } from '@/utils/common/commonUtils';
import { UserDataFromJwtPayload } from '@/utils/types/types';
import { usePathname } from 'next/navigation';


// Define the auth context type
// This context manages the global authentication state
// It handles token storage, user information, and automatic token refresh

// Key features:
// 1. Stores user information (id, AppSide)
// 2. Tracks authentication state (isLoading, isAuthenticated)
// 3. Provides logout functionality
// 4. Handles automatic token refresh before expiry

// The context exposes these values to the entire application:
type AuthContextType = {
  user: UserDataFromJwtPayload | null;         // Current user info from JWT
  isAuthenticating: boolean;        // Whether auth state is being determined
  isAuthenticated: boolean;  // Whether user is authenticated
  activeAppSide: 'LAWYER' | 'CLIENT'; // Active AppSide
  logout: () => void;        // Function to log out
  login: (token: string) => void; // Function to log in
  setActiveAppSide: React.Dispatch<React.SetStateAction<'LAWYER' | 'CLIENT'>>;
  resetAppLoginState: () => void;
};

// Function to get the current access token


// The useAuth() hook provides easy access to this context
// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticating: false,
  isAuthenticated: false,
  activeAppSide: "CLIENT",
  logout: () => {},
  login: () => {},
  setActiveAppSide: () => {},
  resetAppLoginState: () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDataFromJwtPayload | null>(null);
  const [isAuthenticating, setisAuthenticating] = useState(false);
  const [isAuthenticated, setisAuthenticated] = useState(false);
  const [activeAppSide, setActiveAppSide] = useState<'LAWYER' | 'CLIENT'>('CLIENT');
  const pathname = usePathname();

  const resetAppLoginState = () => {
    setUser(null);
    setisAuthenticated(false);
    setActiveAppSide("CLIENT");
  };

  const login = async (token: string) => {
    try {
      setisAuthenticating(true);
      const userInfo = getUserFromToken(token);
      setUser(userInfo);
      setisAuthenticated(true);
      // Set active AppSide based on URL
      setActiveAppSideByUrl();
    } catch (error) {
      console.error('Error during login:', error);
      setisAuthenticated(false);
    } finally {
      setisAuthenticating(false);
      
    }
  };

  // Function to set the active AppSide state by checking the current url path for /lawyer or /client and set the active AppSide accordingly only if that AppSide is present in user.AppSides array.
  const setActiveAppSideByUrl = () => {
    if (pathname) {
      //check if pathname contains /lawyer or /client
      if (pathname.includes('/lawyer')) {
        setActiveAppSide('LAWYER');
        console.log(`pathname: ${pathname}`); 
      } else if (pathname.includes('/client')) {
        setActiveAppSide('CLIENT');
      }
    } else {
      console.error('pathname is null');
      return;
    }
  };

   // Handle logout
   const logout = async () => {
    try {
      // Clear user state and local storage
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setisAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  // Setup token refresh interval
  useEffect(() => {
    // const refresh

    // Function to initialize authentication state
    const authInit = async () => {
      try {
        setisAuthenticating(true);
        setActiveAppSideByUrl();
        
        // Try to get current access token
        const token = await getAccessToken(); // this will also check for expired token or null token and try to refresh.
        
        if (token) {
          // if token is valid then Log in user
          login(token);
          console.log(`logged in successfully via authInit`);

          // Set authentication state
          
          // // Setup proactive token refresh
          // const decoded = jwtDecode<{ exp: number }>(token);
          // const expiryTime = decoded.exp * 1000; // Convert to milliseconds (JWT exp is in seconds since epoch)
          // const currentTime = Date.now(); // Current time in milliseconds since epoch
          // const timeUntilExpiry = expiryTime - currentTime; // Time left until token expires in milliseconds
          
          // // Log token expiry information for debugging
          // console.log('Token expiry details:', {
          //   expiryTimestamp: decoded.exp,
          //   expiryDate: new Date(expiryTime).toISOString(),
          //   currentDate: new Date(currentTime).toISOString(),
          //   timeUntilExpiryMs: timeUntilExpiry,
          //   timeUntilExpiryMinutes: Math.floor(timeUntilExpiry / (60 * 1000))
          // });
          
          // // Refresh 15 minutes before expiry to ensure continuous session
          // const refreshTime = Math.max(0, timeUntilExpiry - 15 * 60 * 1000);
          // console.log(`Token will be refreshed in ${Math.floor(refreshTime / (60 * 1000))} minutes`);
          
          // const refreshTimer = setTimeout(async () => {
          //   try {
          //     console.log('Refreshing token before expiry...');
          //     const newAuthData = await refreshTokens();
          //     const newUserInfo = getUserFromToken(newAuthData.data.accessToken);
          //     setUser(newUserInfo);
          //     console.log('Token refreshed successfully');
          //   } catch (error) {
          //     console.error('Failed to refresh token:', error);
          //     setUser(null);
          //   }
          // }, refreshTime);
          
          // return () => clearTimeout(refreshTimer);
        }
      } catch (error) {
        setUser(null);
        setActiveAppSide('CLIENT');
        setisAuthenticated(false);
        console.error('Auth initialization error:', error);
      } finally {
        setisAuthenticating(false);
        // console.info(`activeAppSide: ${activeAppSide} from authInit`);
      }
    };
    
    authInit();
  }, []);
 
  const value = {
    user,
    isAuthenticating,
    isAuthenticated,
    activeAppSide,
    logout,
    login,
    setActiveAppSide,
    resetAppLoginState,
  };

  return (
    <AuthContext.Provider value={value}>
      {isAuthenticating ? (
        // Show a loading indicator while auth state is being determined
        <div className="flex justify-center items-center min-h-screen">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}