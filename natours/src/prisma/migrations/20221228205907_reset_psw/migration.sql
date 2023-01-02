-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordChanged" TIMESTAMP(3),
ADD COLUMN     "passwordResetExpires" TIMESTAMP(3),
ADD COLUMN     "passwordResetToken" TEXT;
