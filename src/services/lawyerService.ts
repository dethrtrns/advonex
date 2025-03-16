import { LawyerProfile, mockLawyers, mockLawyersList } from "@/data/mockData";

// In a real application, these functions would make API calls
// For now, they use the mock data

export async function getLawyersList() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockLawyersList;
}

export async function getLawyerProfile(id: string): Promise<LawyerProfile> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const lawyer = mockLawyers[id];
  if (!lawyer) {
    throw new Error("Lawyer not found");
  }
  
  return lawyer;
}

// Later, you can replace these implementations with actual API calls
// without changing the components that use these functions