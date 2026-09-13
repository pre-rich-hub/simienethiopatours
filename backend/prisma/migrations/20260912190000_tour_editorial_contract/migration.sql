-- Additive migration: preserve every existing slug and editorial column.
ALTER TABLE "tours"
  ADD COLUMN "summary" TEXT,
  ADD COLUMN "itinerary_intro" TEXT,
  ADD COLUMN "itinerary_notes" TEXT;

-- Existing cards used overview; retain their first paragraph as the initial
-- editable summary. Do not guess how legacy notice text should be split.
UPDATE "tours"
SET "summary" = NULLIF(split_part("overview", E'\n\n', 1), ''),
    "itinerary_notes" = '[]';
