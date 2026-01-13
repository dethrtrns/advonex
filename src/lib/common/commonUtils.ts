import { toast } from "sonner";
import { jwtDecode } from 'jwt-decode';
import { JwtPayloadDto, UserDataFromJwtPayload } from '../types/types';


export function extractPayloadFromJwt(token: string): JwtPayloadDto | null {
  try {
    const decodedToken: JwtPayloadDto = jwtDecode(token);
    return decodedToken;     
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

// Function to extract user info from token
export const getUserFromToken = (token: string): UserDataFromJwtPayload | null => {
  try {
    const decoded = extractPayloadFromJwt(token); // TODO: use extract jwt function here and define user type for payload

    if (!decoded) {
      console.error('Error decoding token: Invalid token format');
      return null;
    }
    // map decoded token to user data object
    const userInfoFromToken: UserDataFromJwtPayload =   {
      id: decoded.sub,
      roles: [...decoded.roles], // Handle both formats
      email: decoded.email,
      profileId: decoded.profileId,
      profileIds: decoded.profileIds,
    };
    return userInfoFromToken; // Return the user object
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Function to handle API errors
export function handleApiError(error: unknown, defaultMessage: string = 'An unexpected error occurred.') {
    console.error(defaultMessage, error);
    if (error instanceof Error) {
        toast.error(error.message);
    } else {
        toast.error(defaultMessage);
    }
}
