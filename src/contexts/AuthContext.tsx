"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { refreshTokens, getAccessToken, logout } from '@/services/authService/authService';
import { jwtDecode } from 'jwt-decode'; // You'll need to install this package

// Define the user type
type User = {
  id: string;
  role: 'LAWYER' | 'CLIENT';
  // Add other user properties as needed
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
  user: User | null;         // Current user info or null if not authenticated
  isLoading: boolean;        // Whether auth state is being determined
  isAuthenticated: boolean;  // Whether user is authenticated
  logout: () => void;        // Function to log out
};

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
      return {
        id: decoded.sub,
        role: decoded.role,
        // Map other user properties from token claims
      };
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
          const authData = await refreshTokens();
          token = authData.accessToken;
        }
        
        if (token) {
          // Extract user info from token
          const userInfo = getUserFromToken(token);
          setUser(userInfo);
          
          // Setup proactive token refresh
          const decoded = jwtDecode<{ exp: number }>(token);
          const expiryTime = decoded.exp * 1000; // Convert to milliseconds
          const currentTime = Date.now();
          const timeUntilExpiry = expiryTime - currentTime;
          
          // Refresh 1 minute before expiry
          const refreshTime = Math.max(0, timeUntilExpiry - 60000);
          
          const refreshTimer = setTimeout(async () => {
            try {
              const newAuthData = await refreshTokens();
              const newUserInfo = getUserFromToken(newAuthData.accessToken);
              setUser(newUserInfo);
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
    isAuthenticated: !!user,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}