ALTER TABLE "destinations"
  ADD COLUMN "area" VARCHAR(40) NOT NULL DEFAULT 'gondar',
  ADD COLUMN "type" VARCHAR(40) NOT NULL DEFAULT 'other',
  ADD COLUMN "location" TEXT,
  ADD COLUMN "also_known_as" TEXT,
  ADD COLUMN "hero_title" VARCHAR(500),
  ADD COLUMN "hero_accent" VARCHAR(500),
  ADD COLUMN "overview" TEXT,
  ADD COLUMN "highlights" TEXT,
  ADD COLUMN "things_to_do" TEXT,
  ADD COLUMN "image_alt" VARCHAR(500),
  ADD COLUMN "source_references" TEXT,
  ADD COLUMN "is_published" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "sort_order" INTEGER NOT NULL DEFAULT 0;

UPDATE "destinations"
SET "overview" = CASE
  WHEN "description" IS NULL OR "description" = '' THEN '[]'
  ELSE json_build_array("description")::text
END,
"also_known_as" = '[]',
"highlights" = '[]',
"things_to_do" = '[]',
"source_references" = '[]',
"is_published" = true;
