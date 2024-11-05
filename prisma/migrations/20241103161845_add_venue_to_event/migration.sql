/*
  Warnings:

  - Added the required column `availableSeats` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `venue` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "availableSeats" INTEGER NOT NULL,
ADD COLUMN     "venue" TEXT NOT NULL;
