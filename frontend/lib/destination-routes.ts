import { getJourneyPackage, type JourneyPackage } from "@/lib/journey-packages";

export type DestinationArea = "simien" | "gondar";

const simienRoutesThrough: Record<string, readonly string[]> = {
  "simien-mountains-national-park": [
    "simien-day-trip",
    "4-day-simien-classic",
    "ras-dashen-challenge",
    "10-day-simien-ras-dashen",
  ],
  debark: [
    "simien-day-trip",
    "simien-introduction",
    "5-day-gondar-simien",
    "gondar-heritage-simien",
  ],
  "buyit-ras": ["3-day-simien-trek", "5-day-gondar-simien"],
  sankaber: [
    "simien-introduction",
    "3-day-simien-trek",
    "4-day-simien-classic",
    "ras-dashen-challenge",
  ],
  geech: [
    "3-day-simien-trek",
    "4-day-simien-classic",
    "ras-dashen-challenge",
    "10-day-simien-ras-dashen",
  ],
  "jinbar-waterfall": [
    "3-day-simien-trek",
    "4-day-simien-classic",
    "5-day-gondar-simien",
    "simien-ras-dashen-8-day",
  ],
  "imet-gogo": [
    "3-day-simien-trek",
    "4-day-simien-classic",
    "5-day-gondar-simien",
    "simien-photography-expedition",
  ],
  inatye: ["5-day-gondar-simien"],
  chenek: [
    "4-day-simien-classic",
    "5-day-gondar-simien",
    "ras-dashen-challenge",
    "10-day-simien-ras-dashen",
  ],
  ambaras: ["3-day-simien-trek"],
  "siha-gorge": ["10-day-simien-ras-dashen"],
  "bwahit-pass": [
    "4-day-simien-classic",
    "ras-dashen-challenge",
    "simien-ras-dashen-8-day",
    "10-day-simien-ras-dashen",
  ],
  ambiko: [
    "ras-dashen-challenge",
    "simien-ras-dashen-8-day",
    "10-day-simien-ras-dashen",
    "ras-dashen-expedition",
  ],
  "ras-dashen": [
    "ras-dashen-challenge",
    "ras-dashen-expedition",
    "10-day-simien-ras-dashen",
    "timkat-ras-dashen",
  ],
  "meseha-valley": ["ras-dashen-challenge", "10-day-simien-ras-dashen"],
  sona: ["10-day-simien-ras-dashen"],
  mulit: ["10-day-simien-ras-dashen"],
  "adi-arkay": ["10-day-simien-ras-dashen"],
};

const gondarRoutesThrough: Record<string, readonly string[]> = {
  gondar: [
    "royal-gondar",
    "gondar-through-local-eyes",
    "gondar-heritage-simien",
    "5-day-gondar-simien",
  ],
  "fasil-ghebbi": [
    "royal-gondar",
    "gondar-history-culture",
    "gondar-heritage-simien",
    "mountains-sacred-stone",
  ],
  "fasilides-bath": [
    "royal-gondar",
    "mountains-sacred-stone",
    "timkat-simien",
  ],
  "debre-berhan-selassie": [
    "gondar-heritage-simien",
    "royal-gondar",
    "gondar-history-culture",
  ],
  kuskuam: ["gondar-heritage-simien", "royal-gondar"],
  woleka: ["gondar-heritage-simien"],
  "kosoye-mountains": ["gondar-kosoye"],
  debark: simienRoutesThrough.debark,
  "highland-villages": [
    "simien-day-trip",
    "simien-introduction",
    "gondar-heritage-simien",
  ],
  lalibela: ["mountains-sacred-stone"],
  "yemrehanna-kristos": ["mountains-sacred-stone"],
};

const routesByArea: Record<DestinationArea, Record<string, readonly string[]>> = {
  simien: simienRoutesThrough,
  gondar: gondarRoutesThrough,
};

export function journeysThroughPlace(area: DestinationArea, slug: string): JourneyPackage[] {
  const slugs = routesByArea[area][slug] ?? [];
  return slugs
    .map((journeySlug) => getJourneyPackage(journeySlug))
    .filter((journey): journey is JourneyPackage => Boolean(journey));
}
