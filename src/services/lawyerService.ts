import { toast } from "sonner";

export interface Lawyer {
  id: string;
  name: string;
  photo: string;
  practiceAreas: string[];
  location: string;
  experience: number;
  consultFee: number;
  practiceCourt: {
    id: string,
    primary: string
    secondary: string,
    lawyerId: string
  }
}

interface ApiResponse {
  success: boolean;
  data: Lawyer[];
}

export async function getLawyersList(): Promise<Lawyer[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_BACKEND_URL_PROD}/api/lawyers`);
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

// Add this interface and function to your existing service file
export interface LawyerProfile {
  id: string;
  name: string;
  photo: string;
  practiceAreas: string[];
  location: string;
  experience: number;
  consultFee: number;
  email: string;
  phone: string;
  bio: string;
  education: {
    degree: string;
    institution: string;
    year: string;
  };
  practiceCourt: {
      primary: string
      secondary?: string | null
    }
  barId?: string;
}

export async function getLawyerProfile(id: string): Promise<LawyerProfile> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_BACKEND_URL_PROD}/api/lawyers/${id}`);
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

// Add this function to update the lawyer profile
export async function updateLawyerProfile(id: string, data: Partial<LawyerProfile>): Promise<LawyerProfile> {
  try {
    // Use environment variable for the API URL
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/api/lawyers/${id}`, {
      method: 'PUT', // Or PATCH, depending on your API design
      headers: {
        'Content-Type': 'application/json',
        // Add Authorization header if needed, e.g., using localStorage token
        // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json(); // Assuming the API returns the updated profile

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to update profile');
    }

    return responseData.data; // Adjust based on your API response structure
  } catch (error) {
    console.error('Error updating lawyer profile:', error);
    toast.error(error instanceof Error ? error.message : 'An unknown error occurred during profile update.');
    throw error; // Re-throw the error to be caught in the component
  }
}