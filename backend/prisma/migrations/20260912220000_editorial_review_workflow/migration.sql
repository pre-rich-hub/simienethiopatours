ALTER TABLE "tours" ADD COLUMN "journey_type" VARCHAR(50) NOT NULL DEFAULT 'core-trek';
ALTER TABLE "tours" ADD COLUMN "editorial_status" VARCHAR(20) NOT NULL DEFAULT 'published';
ALTER TABLE "tours" ADD COLUMN "editorial_source_notes" TEXT;
ALTER TABLE "destinations" ADD COLUMN "editorial_status" VARCHAR(20) NOT NULL DEFAULT 'published';
ALTER TABLE "destinations" ADD COLUMN "editorial_source_notes" TEXT;

CREATE TABLE "editorial_reviews" (
  "id" SERIAL NOT NULL,
  "entity_type" VARCHAR(40) NOT NULL,
  "entity_slug" VARCHAR(255) NOT NULL,
  "status" VARCHAR(20) NOT NULL DEFAULT 'draft',
  "source_notes" TEXT,
  "reviewer_id" INTEGER,
  "route_approved" BOOLEAN NOT NULL DEFAULT false,
  "commercial_approved" BOOLEAN NOT NULL DEFAULT false,
  "safety_approved" BOOLEAN NOT NULL DEFAULT false,
  "translation_approved" BOOLEAN NOT NULL DEFAULT false,
  "reviewed_at" TIMESTAMP(3),
  "published_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "editorial_reviews_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "editorial_reviews_entity_type_entity_slug_key" ON "editorial_reviews"("entity_type", "entity_slug");
CREATE INDEX "editorial_reviews_status_idx" ON "editorial_reviews"("status");

INSERT INTO "editorial_reviews" ("entity_type", "entity_slug", "status", "route_approved", "commercial_approved", "safety_approved", "translation_approved", "reviewed_at", "published_at")
SELECT 'tour', "slug", 'published', true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP FROM "tours"
ON CONFLICT ("entity_type", "entity_slug") DO NOTHING;
INSERT INTO "editorial_reviews" ("entity_type", "entity_slug", "status", "route_approved", "commercial_approved", "safety_approved", "translation_approved", "reviewed_at", "published_at")
SELECT 'destination', "slug", 'published', true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP FROM "destinations"
ON CONFLICT ("entity_type", "entity_slug") DO NOTHING;
