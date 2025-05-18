import { toast } from "sonner";

// Define nested interfaces for better type safety
export interface NamedEntity {
  id?: string;
  name: string;
  description?: string;
  location?: string;
}

export interface Service extends NamedEntity {
  description?: string;
}

export interface Education {
  id?: string;
  degree: string;
  institution: string;
  year: number;
  createdAt?: string;
  updatedAt?: string;
  lawyerProfileId?: string;
}

export interface PracticeCourts {
  practiceCourt: {
    id?: string;
    name: string;
    location?: string;
  }
}
export interface practiceAreas {
  practiceArea: {
    id?: string;
    name: string;
    description?: string;
  }
}

export interface Lawyer {
  id: string;
  name: string; 
  photo: string;
  location: string;
  experience: number;
  bio: string;
  consultFee: number;
  barId: string;
  isVerified: boolean;
  specialization: NamedEntity;
  practiceAreas: practiceAreas[];
  primaryCourt: NamedEntity;
  practiceCourts: PracticeCourts[];
  education: Education;
  services: Service[];
  createdAt: string;
  updatedAt: string;
  // Additional fields for profile
  email: string;
  phone: string;
}

interface ApiResponse {
  success: boolean;
  data: Lawyer[];
}

export async function getLawyersList(): Promise<Lawyer[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/lawyers/search`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const result: ApiResponse = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching lawyers:', error);
    throw error;
  }
}

// LawyerProfile is the same as Lawyer but ensures email and phone are required
// export interface LawyerProfile extends Lawyer {
//   email: string;
//   phone: string;
// }

export async function getLawyerProfile(id: string): Promise<Lawyer> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/lawyers/${id}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching lawyer profile:', error);
    throw error;
  }
}

export async function updateLawyerProfile(id: string, data: Partial<Lawyer>): Promise<Lawyer> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/api/lawyers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Add Authorization header if needed
        // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to update profile');
    }

    return responseData.data;
  } catch (error) {
    console.error('Error updating lawyer profile:', error);
    toast.error(error instanceof Error ? error.message : 'An unknown error occurred during profile update.');
    throw error;
  }
}