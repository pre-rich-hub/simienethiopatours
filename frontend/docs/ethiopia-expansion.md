# Ethiopia destination expansion

The destination expansion adds 30 editorial rows: five new and four revised Explore Ethiopia records plus 21 Southern Ethiopia records, including the optional four-day Bale Mountains extension. The existing Yeha and Yemrehanna Kristos records are retained and normalized into Explore Ethiopia. With the existing Simien and Gondar catalogue, the public model now supports 58 destinations in each of `en`, `es`, `de`, and `fr`.

Explore Ethiopia is the replacement for the former Northern Ethiopia section. Product names that contain “Northern Ethiopia” remain unchanged because they are client package titles. Requests for `/northern-ethiopia` and its localized detail paths receive permanent redirects to `/explore-ethiopia`.

New detail pages are intentionally text-first. Empty `imageUrl` values render an editorial hero without an image and emit no image metadata. This batch assigns the two supplied images to Addis Ababa and Bahir Dar among the new records; other new destinations, including Bale Mountains, remain image-free. Existing Gateway & Historic media and tour links are preserved.

## CMS import

From `backend`, preview the transaction against the configured database:

```bash
npx tsx scripts/apply-ethiopia-expansion.ts
```

The command checks the prepared English baseline, translation publication state, editorial drift, and retained media/tour links. Apply only after the preview is reviewed:

```bash
npx tsx scripts/apply-ethiopia-expansion.ts --apply
npm run content:export
```

The apply transaction creates or updates published destination records, upserts the reviewed Spanish/German/French translations, normalizes Yeha and Yemrehanna Kristos to the Explore area, preserves existing destination media and tour relations, and assigns the supplied media to Addis Ababa and Bahir Dar. After `content:export`, deploy the generated `frontend/lib/generated/catalogue.json` with the frontend so the outage fallback contains the approved expansion.

The locale source files live in `backend/scripts/data/ethiopia-expansion/`. They contain the supplied English copy and machine-assisted translations with protected place-name glossary terms; editorial owners should review the translations before treating them as final marketing copy.

## Local preview

To review all 232 localized destination rows without a database, run:

```bash
npx tsx scripts/serve-ethiopia-preview.ts
```

Then start the frontend with `API_URL=http://127.0.0.1:5106`. The fixture is loopback-only and is not used by deployment.
