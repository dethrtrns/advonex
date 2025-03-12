import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: Request, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params;
    const body = await req.json();
    const {
      barId,
      location,
      gmapsLink,
      yearsOfExperience,
      consultFee,
      knownLanguages,
      description,
      primarySpecialization,
      secondarySpecializations,
    } = body;

    // Update lawyer profile
    const updatedProfile = await prisma.lawyerProfile.update({
      where: { userId },
      data: {
        barId,
        location,
        gmapsLink,
        yearsOfExperience,
        consultFee,
        knownLanguages,
        description,
        primarySpecializationId: primarySpecialization,
        isVisible: true,
      },
    });

    // Update secondary specializations
    if (secondarySpecializations?.length > 0) {
      // First, remove existing secondary specializations
      await prisma.specializationOnProfile.deleteMany({
        where: { profileId: updatedProfile.id },
      });

      // Then add new ones
      await prisma.specializationOnProfile.createMany({
        data: secondarySpecializations.map((specId: string) => ({
          profileId: updatedProfile.id,
          specializationId: specId,
        })),
      });
    }

    return NextResponse.json(
      { message: "Profile updated successfully", profile: updatedProfile },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Error updating profile" },
      { status: 500 }
    );
  }
}