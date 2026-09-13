import { detailedJourneys } from "@/lib/itineraries";

// Compatibility subset; do not maintain a second copy of approved itineraries.
const classicSlugs = new Set([
  "simien-day-trip", "3-day-simien-trek", "4-day-simien-classic",
  "5-day-gondar-simien", "ras-dashen-challenge",
]);
export const classicJourneys = detailedJourneys.filter((journey) => classicSlugs.has(journey.slug));
