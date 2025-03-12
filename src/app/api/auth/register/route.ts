import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, phone, type } = body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with appropriate role
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: type.toUpperCase(),
      },
    });

    // Create corresponding profile based on user type
    if (type === "lawyer") {
      await prisma.lawyerProfile.create({
        data: {
          userId: user.id,
          userRole: "LAWYER",
        },
      });
    } else {
      await prisma.userProfile.create({
        data: {
          userId: user.id,
          userRole: "CLIENT",
        },
      });
    }

    return NextResponse.json(
      { message: "User created successfully", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Error creating user" },
      { status: 500 }
    );
  }
}