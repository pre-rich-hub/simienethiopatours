/*
  Warnings:

  - A unique constraint covering the columns `[reviewer_name,message]` on the table `testimonials` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "testimonials" ADD COLUMN     "avatar_tone" TEXT,
ADD COLUMN     "date" TEXT,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "title" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "testimonials_reviewer_name_message_key" ON "testimonials"("reviewer_name", "message");
