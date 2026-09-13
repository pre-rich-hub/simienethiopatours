ALTER TABLE "media_assets"
  ALTER COLUMN "content" DROP NOT NULL,
  ADD COLUMN "alt_text" VARCHAR(500),
  ADD COLUMN "attribution" TEXT,
  ADD COLUMN "license" VARCHAR(255),
  ADD COLUMN "source_url" TEXT,
  ADD COLUMN "width" INTEGER,
  ADD COLUMN "height" INTEGER,
  ADD COLUMN "focal_point" VARCHAR(100);
CREATE UNIQUE INDEX "media_assets_source_url_key" ON "media_assets"("source_url");

CREATE TABLE "tour_media" (
  "tour_id" INTEGER NOT NULL,
  "media_asset_id" UUID NOT NULL,
  "role" VARCHAR(40) NOT NULL DEFAULT 'hero',
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "tour_media_pkey" PRIMARY KEY ("tour_id", "media_asset_id", "role"),
  CONSTRAINT "tour_media_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "tour_media_media_asset_id_fkey" FOREIGN KEY ("media_asset_id") REFERENCES "media_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "destination_media" (
  "destination_id" INTEGER NOT NULL,
  "media_asset_id" UUID NOT NULL,
  "role" VARCHAR(40) NOT NULL DEFAULT 'hero',
  "sort_order" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "destination_media_pkey" PRIMARY KEY ("destination_id", "media_asset_id", "role"),
  CONSTRAINT "destination_media_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "destination_media_media_asset_id_fkey" FOREIGN KEY ("media_asset_id") REFERENCES "media_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "content_translations" (
  "id" SERIAL NOT NULL,
  "entity_type" VARCHAR(40) NOT NULL,
  "entity_slug" VARCHAR(255) NOT NULL,
  "locale" VARCHAR(10) NOT NULL,
  "status" VARCHAR(20) NOT NULL DEFAULT 'missing',
  "content" TEXT NOT NULL,
  "source_hash" VARCHAR(128),
  "reviewed_at" TIMESTAMP(3),
  "published_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "content_translations_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "content_translations_entity_type_entity_slug_locale_key"
  ON "content_translations"("entity_type", "entity_slug", "locale");
CREATE INDEX "content_translations_locale_status_idx"
  ON "content_translations"("locale", "status");
