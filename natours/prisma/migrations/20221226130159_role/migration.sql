-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'LEAD_GUIDE', 'GUIDE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
