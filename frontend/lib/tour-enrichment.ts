/**
 * Fill empty journey commercial fields from catalogue values already on the tour.
 * Facts use localized duration/difficulty. Fit / preparation / related use English
 * defaults only when those fields are empty — CMS copy always wins when present.
 */

import type { PublicTour } from "@/lib/catalogue-contract/public-catalogue.schema";
import { journeyTypeForSlug } from "@/lib/tour-content";

type Related = PublicTour["related"][number];
type Fact = PublicTour["facts"][number];

const FIT_BY_SLUG: Record<string, string> = {
  "gelada-country": "Travellers who want a flexible wildlife-focused day in known Gelada habitat (sightings not guaranteed).",
  "simien-introduction": "First-time highland visitors who want one overnight in the park without a long corridor trek.",
  "5-day-gondar-simien": "Travellers who want royal Gondar and the classic Simien corridor in one private journey.",
  "gondar-heritage-simien": "Culture-first travellers who want heritage days in Gondar before or after Simien trekking.",
  "ras-dashen-expedition": "Fit trekkers who want a slower approach to Ambiko and a Ras Dashen summit attempt.",
  "simien-ras-dashen-8-day": "Experienced hikers building toward Ras Dashen with more corridor time than the Challenge.",
  "simien-wildlife-journey": "Travellers prioritising habitat time and patient wildlife watching over summit objectives.",
  "simien-photography-day": "Photographers and visual travellers who want a flexible Simien viewpoint day from Gondar.",
  "wildlife-landscape-photography": "Photographers who want multi-day highland light, wildlife habitat and camp access.",
  "simien-photography-expedition": "Serious amateurs and professionals who want several mountain nights for changing light and weather.",
  "royal-gondar": "First visits focused on Fasil Ghebbi and the royal-city heritage core.",
  "gondar-through-local-eyes": "Travellers who value neighbourhoods, conversation and everyday Gondar beyond monuments.",
  "gondar-food-coffee": "Curious eaters and coffee lovers; dietary needs should be shared during planning.",
  "gondar-photography-walk": "Phone and camera travellers who want time for light, streets and permission-based portraits.",
  "gondar-history-culture": "Visitors who want a broader historical narrative than a castles-only morning.",
  "gondar-market-local-life": "Travellers interested in trade, food markets and living-city rhythm.",
  "gondar-kosoye": "Walkers who want countryside and highland views near Gondar without a full Simien trek.",
  "gondar-running": "Runners and active travellers open to dirt-track and countryside routes adapted to fitness.",
  "timkat-simien": "Travellers combining Timkat in Gondar with Simien days; festival dates confirmed closer to departure.",
  "timkat-ras-dashen": "Fit hikers combining Timkat with a longer Ras Dashen–oriented mountain programme.",
  "genna-simien": "Travellers linking Genna (Ethiopian Christmas) in Gondar with Simien trekking time.",
  "meskel-simien": "Travellers linking Meskel celebrations with highland days; exact festival access varies by year.",
  "mountains-sacred-stone": "Travellers wanting a longer northern combination of Simien with sacred stone heritage.",
};

const RELATED_BY_SLUG: Record<string, Array<{ slug: string; title: string; body: string }>> = {
  "simien-day-trip": [
    { slug: "simien-introduction", title: "2-day Simien Introduction", body: "Add one mountain night near Sankaber if you have a little more time." },
    { slug: "4-day-simien-classic", title: "4-Day Simien Classic", body: "The signature corridor when you want camps, Imet Gogo and Chenek." },
  ],
  "simien-introduction": [
    { slug: "simien-day-trip", title: "Simien in a Day", body: "Shorter option if you only have a single park day from Gondar." },
    { slug: "3-day-simien-trek", title: "3-Day Simien Trek", body: "Continue to Geech and Imet Gogo without reaching Chenek." },
  ],
  "3-day-simien-trek": [
    { slug: "4-day-simien-classic", title: "4-Day Simien Classic", body: "Add Chenek and a fuller classic corridor." },
    { slug: "simien-introduction", title: "2-day Simien Introduction", body: "Gentler first overnight if three walking days feel long." },
  ],
  "4-day-simien-classic": [
    { slug: "3-day-simien-trek", title: "3-Day Simien Trek", body: "Shorter classic corridor that ends before Chenek." },
    { slug: "ras-dashen-challenge", title: "Ras Dashen Challenge", body: "Continue beyond Chenek toward a summit attempt." },
    { slug: "5-day-gondar-simien", title: "5-Day Gondar & Simien", body: "Add royal-city time before the mountain corridor." },
  ],
  "ras-dashen-challenge": [
    { slug: "4-day-simien-classic", title: "4-Day Simien Classic", body: "Classic corridor without the summit objective." },
    { slug: "ras-dashen-expedition", title: "Ras Dashen Expedition", body: "Slower Ambiko approach when you want more buffer days." },
    { slug: "10-day-simien-ras-dashen", title: "10-Day Simien Expedition", body: "Full crossing with eastern transect after the summit attempt." },
  ],
  "10-day-simien-ras-dashen": [
    { slug: "ras-dashen-challenge", title: "Ras Dashen Challenge", body: "Shorter summit-focused programme without the eastern crossing." },
    { slug: "4-day-simien-classic", title: "4-Day Simien Classic", body: "Classic western corridor if ten days is more than you need." },
  ],
  "royal-gondar": [
    { slug: "gondar-history-culture", title: "History & culture tour", body: "Wider narrative across churches, trade and living traditions." },
    { slug: "gondar-heritage-simien", title: "Gondar heritage & Simien", body: "Combine royal-city days with a mountain corridor." },
  ],
  "timkat-simien": [
    { slug: "timkat-ras-dashen", title: "Timkat & Ras Dashen", body: "Longer festival journey with a summit-oriented mountain block." },
    { slug: "4-day-simien-classic", title: "4-Day Simien Classic", body: "Classic trek outline if you visit outside festival dates." },
  ],
};

const PREP_MOUNTAIN = [
  "Share walking comfort, prior altitude experience and any medical needs during planning.",
  "Pack layers for cold nights, sun protection for open ridges and broken-in footwear.",
  "Summit success and wildlife sightings are never guaranteed — programmes adapt to conditions.",
  "A written proposal from the operating company confirms inclusions for your dates.",
];

const PREP_CITY = [
  "Tell us whether you prefer a focused half-day or a fuller city circuit.",
  "Share photography preferences and any mobility needs before the day is shaped.",
  "Heritage visits follow local etiquette; your guide confirms what is appropriate on site.",
  "A written proposal confirms the day’s inclusions — submitting the form is not a booking.",
];

const PREP_FESTIVAL = [
  "Festival dates and access can shift; Tevan reconfirms timing closer to departure.",
  "Share walking comfort for the mountain days that follow the city celebrations.",
  "Expect crowds and ceremony schedules that are not fully under private control.",
  "A written proposal confirms what is included once festival logistics are clearer.",
];

function factsFromTour(tour: PublicTour): Fact[] {
  const facts: Fact[] = [];
  if (tour.duration) facts.push({ label: "Duration", value: tour.duration });
  if (tour.difficulty) facts.push({ label: "Difficulty", value: tour.difficulty });
  if (tour.route.length) facts.push({ label: "Route", value: tour.route.join(" → ") });
  if (tour.style) facts.push({ label: "Style", value: tour.style });
  return facts;
}

function preparationFor(tour: PublicTour): string[] {
  try {
    const type = journeyTypeForSlug(tour.slug);
    if (type === "gondar-cultural") return PREP_CITY;
    if (type === "seasonal-festival") return PREP_FESTIVAL;
    return PREP_MOUNTAIN;
  } catch {
    return PREP_MOUNTAIN;
  }
}

function relatedFor(tour: PublicTour): Related[] {
  const entries = RELATED_BY_SLUG[tour.slug] ?? [];
  return entries.map((entry) => ({
    title: entry.title,
    body: entry.body,
    href: `/treks/${entry.slug}`,
  }));
}

/** Merge catalogue tour with enrichment for empty commercial fields. */
export function enrichTourRecord(tour: PublicTour): PublicTour {
  const fit = tour.fit?.trim() || (tour.locale === "en" ? FIT_BY_SLUG[tour.slug] ?? null : tour.fit);
  const facts = tour.facts.length > 0 ? tour.facts : factsFromTour(tour);
  const preparation =
    tour.preparation.length > 0
      ? tour.preparation
      : tour.locale === "en"
        ? preparationFor(tour)
        : tour.preparation;
  const related =
    tour.related.length > 0
      ? tour.related
      : tour.locale === "en"
        ? relatedFor(tour)
        : tour.related;

  return { ...tour, fit, facts, preparation, related };
}
