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
    const response = await fetch('https://handsome-creativity-staging.up.railway.app/api/lawyers');
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
      id: string,
      primary: string
      secondary: string,
      lawyerId: string
    }
  barId?: string;
}

export async function getLawyerProfile(id: string): Promise<LawyerProfile> {
  try {
    const response = await fetch(`https://handsome-creativity-staging.up.railway.app/api/lawyers/${id}`);
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