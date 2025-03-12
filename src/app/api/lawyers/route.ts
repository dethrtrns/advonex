import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (userId) {
      // Fetch single lawyer profile
      const lawyer = await prisma.lawyerProfile.findUnique({
        where: { userId },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
          primarySpecialization: true,
          secondarySpecializations: {
            include: {
              specialization: true,
            },
          },
        },
      });

      if (!lawyer) {
        return NextResponse.json(
          { error: "Lawyer not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(lawyer);
    }

    // Fetch all visible lawyer profiles
    const lawyers = await prisma.lawyerProfile.findMany({
      where: {
        isVisible: true,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        primarySpecialization: true,
        secondarySpecializations: {
          include: {
            specialization: true,
          },
        },
      },
    });

    return NextResponse.json(lawyers);
  } catch (error) {
    console.error("Error fetching lawyers:", error);
    return NextResponse.json(
      { error: "Error fetching lawyers" },
      { status: 500 }
    );
  }
}