// Type for user data object returned from token generation API endpoints like auth/refresh, auth/verify-otp-email
export type UserData = {
      id: string;
      email: string;
      phoneNumber: string | null;
      roles: string[];
      profileId: string;
      isNewUser: boolean;
}

// Type for data returned from auth/me API endpoint
export type UserAuthData = {
    accessToken: string;
    refreshToken: string;
    user: UserData;
};

// generic type for API response with data of type T
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
}

export type AuthResponse = ApiResponse<UserAuthData>; // TODO: check if this is used anywhere, if not, remove it

export type TokensData = {
    accessToken: string;
    refreshToken: string;
}

// type for response returned from auth/refresh API endpoint
export type RefreshResponse = ApiResponse<TokensData>;


// type for response returned from auth/verify-otp-email API endpoint
export type VerifyOtpEmailResponse = ApiResponse<UserAuthData>;

// Type for response returned from /auth/add-role API endpoint
export type AddRoleResponse = ApiResponse<TokensData>;

/**
 * {
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "id": "37b60632-5d72-4ed9-836d-fecdc52b5c81",
    "phoneNumber": null,
    "email": "rajshekharsingh060593@gmail.com",
    "accountStatus": "ACTIVE",
    "createdAt": "2025-05-05T10:33:37.256Z",
    "updatedAt": "2025-06-16T11:13:00.922Z",
    "lastLogin": "2025-06-16T11:13:00.921Z",
    "clientProfile": {
      "id": "49c83b55-eb6b-47d7-8c9a-8e9e5a2e2c16",
      "name": null,
      "photo": null,
      "registrationPending": true,
      "createdAt": "2025-05-05T10:33:37.273Z",
      "updatedAt": "2025-05-05T10:33:37.273Z",
      "userId": "37b60632-5d72-4ed9-836d-fecdc52b5c81"
    },
    "lawyerProfile": {
      "id": "ce560902-78b3-4012-9045-80f9a5b51faf",
      "name": null,
      "photo": null,
      "location": null,
      "experience": null,
      "bio": null,
      "consultFee": null,
      "barId": null,
      "isVerified": false,
      "registrationPending": true,
      "createdAt": "2025-06-16T11:52:07.348Z",
      "updatedAt": "2025-06-16T11:52:07.348Z",
      "userId": "37b60632-5d72-4ed9-836d-fecdc52b5c81",
      "specializationId": null,
      "primaryCourtId": null
    },
    "userRoles": [
      {
        "id": "500ef103-f3b2-4d37-ac03-f39a74800354",
        "role": "CLIENT",
        "isActive": false,
        "createdAt": "2025-05-05T10:33:37.267Z",
        "updatedAt": "2025-06-16T11:52:07.338Z",
        "userId": "37b60632-5d72-4ed9-836d-fecdc52b5c81"
      },
      {
        "id": "ff719d17-9233-4a7d-95bd-7702cecc04ee",
        "role": "LAWYER",
        "isActive": true,
        "createdAt": "2025-06-16T11:52:07.342Z",
        "updatedAt": "2025-06-16T11:52:07.342Z",
        "userId": "37b60632-5d72-4ed9-836d-fecdc52b5c81"
      }
    ]
  }
}
 */

// type for full user data with all profiles and roles returned from auth/me API endpoint

export type ClientProfile = {
  id: string;
  name: string | null;
  photo: string | null;
  registrationPending: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export type LawyerProfile = {
  id: string;
  name: string | null;
  photo: string | null;
  location: string | null;
  experience: string | null;
  bio: string | null;
  consultFee: number | null;
  barId: string | null;
  isVerified: boolean;
  registrationPending: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  specializationId: string | null;
  primaryCourtId: string | null;
}

export type UserRole = {
  id: string;
  role: "CLIENT" | "LAWYER";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export type UserDataWithAllProfilesAndRoles = {
  id: string;
  phoneNumber: string | null;
  email: string;
  accountStatus: "ACTIVE" | string;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
  clientProfile: ClientProfile;
  lawyerProfile: LawyerProfile;
  userRoles: UserRole[];
}
// response type for auth/me API endpoint
export type AuthMeResponse = ApiResponse<UserDataWithAllProfilesAndRoles>;


export type ClientProfileResponse = ApiResponse<ClientProfile>;

export type LawyerProfileResponse = ApiResponse<LawyerProfile>;


// jwt payload dto
export type JwtPayloadDto = {
  sub: string;
  email: string;
  roles: string[];
  profileId: string;
  profileIds: {
    lawyerId?: string;
    clientId?: string;
  };
  iat: number;
  exp: number;
}

export type UserDataFromJwtPayload = {
  id: string;
  email: string;
  roles: string[];
  profileId: string;
  profileIds: {
    lawyerId?: string;
    clientId?: string;
  };
}


// Types for email authentication
export type RequestEmailOtpParams = {
  email: string;
  role?: 'LAWYER' | 'CLIENT';
};

export type VerifyEmailOtpParams = {
  email: string;
  otp: string;
  role: 'LAWYER' | 'CLIENT';
};