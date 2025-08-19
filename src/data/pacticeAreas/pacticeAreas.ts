// import { toast } from "sonner";

// export type practiceArea = {
//   id: string;
//   name: string;
//   description: string;
// };

// export async function practiceAreas(): Promise<practiceArea[]> {
//   try {
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/static-data/practice-areas`,
//       {
//         method: "GET",
//       }
//     );

//     const responseData = await response.json();

//     if (!response.ok) {
//       throw new Error(responseData.message || "Failed to update profile");
//     }

//     return responseData.data;
//   } catch (error) {
//     console.error("Error getting practice areas:", error);
//     toast.error(
//       error instanceof Error
//         ? error.message
//         : "An unknown error occurred during profile update."
//     );
//     throw error;
//   }
// }

export const practiceAreas = [
  "Civil Law",
  "Criminal Law",
  "Corporate Law",
  "Family Law",
  "Constitutional Law",
  "Environmental Law",
  "Intellectual Property Law",
  "Labor Law",
  "Tax Law",
  "Real Estate Law",
  "Consumer Protection Law",
];
