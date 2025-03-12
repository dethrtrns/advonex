/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CLIENT', 'LAWYER');

-- CreateEnum
CREATE TYPE "verificationStatus" AS ENUM ('AWAITING_CREDENTIALS', 'SUBMITTED', 'PENDING', 'VERIFIED');

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'CLIENT',
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- CreateTable
CREATE TABLE "lawyerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "primarySpecializationId" TEXT,
    "barId" TEXT,
    "isVerified" "verificationStatus" NOT NULL DEFAULT 'AWAITING_CREDENTIALS',
    "isVisible" BOOLEAN NOT NULL DEFAULT false,
    "location" TEXT,
    "gmapsLink" TEXT,
    "yearsOfExperience" INTEGER,
    "consultFee" DECIMAL(10,2) DEFAULT 300,
    "knownLanguages" TEXT[],
    "description" TEXT,
    "userRole" "Role" NOT NULL DEFAULT 'LAWYER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lawyerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Specialization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Specialization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecializationOnProfile" (
    "profileId" TEXT NOT NULL,
    "specializationId" TEXT NOT NULL,

    CONSTRAINT "SpecializationOnProfile_pkey" PRIMARY KEY ("profileId","specializationId")
);

-- CreateTable
CREATE TABLE "userProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "preferredLanguages" TEXT,
    "location" TEXT,
    "age" INTEGER,
    "userRole" "Role" NOT NULL DEFAULT 'CLIENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "userProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lawyerProfile_userId_key" ON "lawyerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "lawyerProfile_primarySpecializationId_key" ON "lawyerProfile"("primarySpecializationId");

-- CreateIndex
CREATE UNIQUE INDEX "lawyerProfile_barId_key" ON "lawyerProfile"("barId");

-- CreateIndex
CREATE UNIQUE INDEX "Specialization_name_key" ON "Specialization"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SpecializationOnProfile_profileId_specializationId_key" ON "SpecializationOnProfile"("profileId", "specializationId");

-- CreateIndex
CREATE UNIQUE INDEX "userProfile_userId_key" ON "userProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "lawyerProfile" ADD CONSTRAINT "lawyerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lawyerProfile" ADD CONSTRAINT "lawyerProfile_primarySpecializationId_fkey" FOREIGN KEY ("primarySpecializationId") REFERENCES "Specialization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecializationOnProfile" ADD CONSTRAINT "SpecializationOnProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "lawyerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecializationOnProfile" ADD CONSTRAINT "SpecializationOnProfile_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "Specialization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userProfile" ADD CONSTRAINT "userProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
