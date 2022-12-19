/*
  Warnings:

  - You are about to drop the column `rating` on the `Tour` table. All the data in the column will be lost.
  - Added the required column `createdAt` to the `Tour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `difficulty` to the `Tour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `Tour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageCover` to the `Tour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxGroupSize` to the `Tour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Tour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `summary` to the `Tour` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tour" DROP COLUMN "rating",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "difficulty" TEXT NOT NULL,
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "imageCover" TEXT NOT NULL,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "maxGroupSize" INTEGER NOT NULL,
ADD COLUMN     "priceDiscount" INTEGER,
ADD COLUMN     "ratingsAverage" INTEGER DEFAULT 4,
ADD COLUMN     "ratingsQuantity" INTEGER,
ADD COLUMN     "secretTour" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "startDates" TIMESTAMP(3)[],
ADD COLUMN     "summary" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "StartLocation" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Point',
    "coordinates" TEXT[],
    "address" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "StartLocationId" INTEGER NOT NULL,

    CONSTRAINT "StartLocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StartLocation_StartLocationId_key" ON "StartLocation"("StartLocationId");

-- AddForeignKey
ALTER TABLE "StartLocation" ADD CONSTRAINT "StartLocation_StartLocationId_fkey" FOREIGN KEY ("StartLocationId") REFERENCES "Tour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
