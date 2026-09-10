/*
  Warnings:

  - A unique constraint covering the columns `[image_url]` on the table `gallery` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `tour_category` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "gallery" ADD COLUMN     "alt" VARCHAR(500),
ADD COLUMN     "category" VARCHAR(255),
ADD COLUMN     "href" VARCHAR(500),
ADD COLUMN     "link" VARCHAR(255),
ADD COLUMN     "location" VARCHAR(255),
ADD COLUMN     "story" TEXT,
ADD COLUMN     "title" VARCHAR(255);

-- AlterTable
ALTER TABLE "testimonials" ADD COLUMN     "translated_from" VARCHAR(100);

-- AlterTable
ALTER TABLE "tour_category" ADD COLUMN     "slug" VARCHAR(255);

-- AlterTable
ALTER TABLE "tours" ADD COLUMN     "difficulty" VARCHAR(255),
ADD COLUMN     "duration" VARCHAR(255),
ADD COLUMN     "facts" TEXT,
ADD COLUMN     "fit" VARCHAR(500),
ADD COLUMN     "hero_accent" VARCHAR(500),
ADD COLUMN     "hero_title" VARCHAR(500),
ADD COLUMN     "highlights" TEXT,
ADD COLUMN     "image" VARCHAR(500),
ADD COLUMN     "image_alt" VARCHAR(500),
ADD COLUMN     "inquiry" VARCHAR(255),
ADD COLUMN     "introduction" TEXT,
ADD COLUMN     "is_published" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notice" TEXT,
ADD COLUMN     "preparation" TEXT,
ADD COLUMN     "related" TEXT,
ADD COLUMN     "route" TEXT,
ADD COLUMN     "sort_order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "style" VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "gallery_image_url_key" ON "gallery"("image_url");

-- CreateIndex
CREATE UNIQUE INDEX "tour_category_slug_key" ON "tour_category"("slug");
