# Localization and media pipeline

Tours and destinations use ContentTranslation rows keyed by stable entity slug and locale. English is the source locale and is seeded as published; ES, DE and FR rows start as missing with empty content until a fluent reviewer supplies and publishes them. Statuses are missing, draft, reviewed and published.

MediaAsset stores the durable source URL, alt text, attribution, license, dimensions, focal point and usage metadata. TourMedia and DestinationMedia select assets by role and order. Existing URL fields remain for compatibility while the CMS cutover migrates rendering to relationships.

Production startup rejects local file storage without PUBLIC_FILE_BASE_URL. Configure a durable object/media provider before enabling production uploads. No live migration, seed, translation publication or media upload was run in this change.
