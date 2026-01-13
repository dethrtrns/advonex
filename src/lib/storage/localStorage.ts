"use client";

import { isJwtexpired, refreshTokens } from "../backend/auth";
import { getRefreshTokenFromCookie } from "./cookieStorage";

// Function(async await) to get access token from local storage or refresh it if jwt is expired

export async function getAccessToken() {
  if (typeof window === "undefined") {
    console.log("Not in a browser environment");
    return null;
  }

  let accessToken = localStorage.getItem("accessToken");
  const refreshToken = await getRefreshTokenFromCookie();

  if (!accessToken || (isJwtexpired(accessToken) && refreshToken)) {
    try {
      console.log("No or Expired access token found; Attempting to refresh");
      const responseFromRefreshService = await refreshTokens();
      if (responseFromRefreshService) {
        accessToken = responseFromRefreshService.data.accessToken;
        console.info("Access token retrieved via refresh token service.");
      } else {
        console.warn("Failed to refresh token: No authData received.");
        return null;
      }
    } catch (error) {
      console.warn("Failed to refresh token:", error);
    }
  }

  if (!accessToken && !refreshToken) {
    console.warn("Neither access nor Refresh token found; Please login ");
  }
  return accessToken;
}

// Function to get refresh token from local storage
export function getRefreshToken(): string | null {
  if (typeof window === "undefined") {
    console.log("Not in a browser environment");
    return null;
  }

  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    console.log("No refresh token available in local storage.");
    return null;
  }
  return refreshToken;
}
