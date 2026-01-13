"use server";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

// Function to get refresh token from local storage
export async function getRefreshTokenFromCookie() {
  const cookie = await cookies();
  const httpRefreshToken = cookie.get("refreshTokenByNext");
  console.log(httpRefreshToken);
  // if (httpRefreshToken) {
  //   console.log("Found http refresh token...Yay");
  //   refreshToken.http = httpRefreshToken.value;
  //   return refreshToken;
  // } else {
  //   console.log("No refresh cookie found");
  // }

  if (!httpRefreshToken) {
    console.log("No HTTP refresh token available in cookie storage.");
    return false;
  }

  return httpRefreshToken.value;
}

// Function to get refresh token from local storage
export async function getRefreshTokenFromCookieByBackend() {
  const cookie = await cookies();
  const httpRefreshToken = cookie.get("refreshToken");
  console.log(httpRefreshToken);
  // if (httpRefreshToken) {
  //   console.log("Found http refresh token...Yay");
  //   refreshToken.http = httpRefreshToken.value;
  //   return refreshToken;
  // } else {
  //   console.log("No refresh cookie found");
  // }

  if (!httpRefreshToken) {
    console.log("No HTTP refresh token available in cookie storage.");
    return false;
  }

  return httpRefreshToken.value;
}
export async function setRefreshCookieByNext(token: string) {
  (await cookies()).set({
    name: "refreshTokenByNext",
    value: token,
    secure: true,
    httpOnly: true,
    expires: new Date(jwtDecode(token).exp! * 1000),
  });
}
export async function deleteRefreshCookie() {
  (await cookies()).set("refreshToken", "");
  console.log("Cookie value set to empty");
}
