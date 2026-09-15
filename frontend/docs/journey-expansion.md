# Signature journey expansion

Six new English source journeys are prepared under `backend/scripts/data/journey-expansion/en.json`:

- The Southern Ethiopia Journey (12 days / 11 nights)
- Bale Mountains Extension (4 days)
- Northern Ethiopia — The Long Way North (12 days / 11 nights)
- Gheralta / Tigray Extension (2–3 days)
- Ras Dashen Add-on (5–7 trekking days)
- Run the Simien (7 days / 6 nights)

The Northern Ethiopia product name remains unchanged as a client package title, while its site section is Explore Ethiopia. Southern products are private or premium additions and are linked from the Explore Ethiopia navigation.

Each record uses the canonical tour contract: route, facts, highlights, preparation, included and excluded items, itinerary days, operational notes and related destinations. The Southern Ethiopia Journey, Bale Mountains Extension, Long Way North, Gheralta Extension, Ras Dashen Add-on and Run the Simien use the supplied Cloudinary hero images. Existing Timkat journeys use the supplied `timket.jpg` image.

## CMS import

Preview the idempotent transaction from `backend`:

```bash
npx tsx scripts/apply-journey-expansion.ts
```

Apply after reviewing the report:

```bash
npx tsx scripts/apply-journey-expansion.ts --apply
npm run content:export
```

The importer creates published tours, links them to their destination records, updates the requested hero media on already imported journey and Timkat records, preserves their editorial content, and refuses to overwrite a slug with different editorial content. The source records are English-only at this stage; the existing translation workflow can create reviewed Spanish, German and French variants after editorial review.

The local preview API merges these six journeys with the destination expansion. Start it with `npx tsx scripts/serve-ethiopia-preview.ts`, then run the frontend with `API_URL=http://127.0.0.1:5106`.
