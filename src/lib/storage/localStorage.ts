import { isJwtexpired, refreshTokens } from "../backend/auth";

// Function(async await) to get access token from local storage or refresh it if jwt is expired

export async function getAccessToken() {
  if (typeof window === "undefined") {
    console.log("Not in a browser environment");
    return null;
  }

  let accessToken = localStorage.getItem("accessToken");

  if (!accessToken || isJwtexpired(accessToken)) {
    try {
      const responseFromRefreshService = await refreshTokens();
      if (responseFromRefreshService) {
        accessToken = responseFromRefreshService.data.accessToken;
        console.info("Access token retrieved via refresh token service.");
      } else {
        console.error("Failed to refresh token: No authData received.");
        return null;
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
    }
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
