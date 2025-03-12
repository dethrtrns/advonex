-- CreateTable
CREATE TABLE "Education" (
    "id" TEXT NOT NULL,
    "lawyerProfileId" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "graduationYear" INTEGER NOT NULL,
    "specialization" TEXT,
    "honors" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_lawyerProfileId_fkey" FOREIGN KEY ("lawyerProfileId") REFERENCES "lawyerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
