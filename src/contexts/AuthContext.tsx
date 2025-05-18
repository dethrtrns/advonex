"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { refreshTokens, logout, getCurrentUserFromToken } from '@/services/authService/authService';
import { jwtDecode } from 'jwt-decode';

// Define the user type based on JWT structure
type User = {
  id: string;
  roles: string[];
  email?: string;
  profileId?: string;
};

// Define the auth context type
// This context manages the global authentication state
// It handles token storage, user information, and automatic token refresh

// Key features:
// 1. Stores user information (id, role)
// 2. Tracks authentication state (isLoading, isAuthenticated)
// 3. Provides logout functionality
// 4. Handles automatic token refresh before expiry

// The context exposes these values to the entire application:
type AuthContextType = {
  user: User | null;         // Current user info from JWT
  isLoading: boolean;        // Whether auth state is being determined
  isAuthenticated: boolean;  // Whether user is authenticated
  logout: () => void;        // Function to log out
};

// Function to get the current access token
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') {
    console.log('Not in a browser environment');
    return null;
  }
  
  let accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    console.log('No access token available');
    return null;
  }
  return accessToken;
}

// The useAuth() hook provides easy access to this context
// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  logout: () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to extract user info from token
  const getUserFromToken = (token: string): User | null => {
    try {
      const decoded = jwtDecode<any>(token);
      const userInfoFromToken =   {
        id: decoded.sub,
        roles: [decoded.roles], // Handle both formats
        email: decoded?.email,
        profileId: decoded?.profileId
      };
      setUser(userInfoFromToken);
      return userInfoFromToken; // Return the user objec
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  // Setup token refresh interval
  useEffect(() => {
    const setupTokenRefresh = async () => {
      try {
        // Try to get current access token
        let token = getAccessToken();
        
        // If no token in memory but refresh token exists, try to refresh
        if (!token && localStorage.getItem('refreshToken')) {
          try {
            const authData = await refreshTokens();
            token = authData.data.accessToken;
          } catch (error) {
            console.error('Failed to refresh token:', error);
          }
        }
        
        if (token) {
          // Extract user info from token
           getUserFromToken(token);
         console.log(`Token present by AuthContext`);
          
          // Setup proactive token refresh
          const decoded = jwtDecode<{ exp: number }>(token);
          const expiryTime = decoded.exp * 1000; // Convert to milliseconds (JWT exp is in seconds since epoch)
          const currentTime = Date.now(); // Current time in milliseconds since epoch
          const timeUntilExpiry = expiryTime - currentTime; // Time left until token expires in milliseconds
          
          // Log token expiry information for debugging
          console.log('Token expiry details:', {
            expiryTimestamp: decoded.exp,
            expiryDate: new Date(expiryTime).toISOString(),
            currentDate: new Date(currentTime).toISOString(),
            timeUntilExpiryMs: timeUntilExpiry,
            timeUntilExpiryMinutes: Math.floor(timeUntilExpiry / (60 * 1000))
          });
          
          // Refresh 15 minutes before expiry to ensure continuous session
          const refreshTime = Math.max(0, timeUntilExpiry - 15 * 60 * 1000);
          console.log(`Token will be refreshed in ${Math.floor(refreshTime / (60 * 1000))} minutes`);
          
          const refreshTimer = setTimeout(async () => {
            try {
              console.log('Refreshing token before expiry...');
              const newAuthData = await refreshTokens();
              const newUserInfo = getUserFromToken(newAuthData.data.accessToken);
              setUser(newUserInfo);
              console.log('Token refreshed successfully');
            } catch (error) {
              console.error('Failed to refresh token:', error);
              setUser(null);
            }
          }, refreshTime);
          
          return () => clearTimeout(refreshTimer);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    setupTokenRefresh();
  }, []);

  // Handle logout
  const handleLogout = () => {
    logout();
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!getAccessToken(), // Check based on token existence
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}