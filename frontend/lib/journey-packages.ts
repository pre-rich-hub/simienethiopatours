export type JourneyItineraryMode = "days" | "segments" | "outline";

export type JourneyDay = {
  title: string;
  subtitle: string;
  paragraphs: string[];
  overnight?: string;
};

export type JourneySegment = {
  label: string;
  body: string;
};

export type JourneyPackage = {
  slug: string;
  name: string;
  duration: string;
  route: string;
  difficulty: string;
  heroTitle: string;
  heroAccent: string;
  overview: string[];
  highlights: string[];
  itineraryMode: JourneyItineraryMode;
  days?: JourneyDay[];
  segments?: JourneySegment[];
  outline?: string[];
  included: string[];
  excluded: string[];
  includedNote?: string;
  image: string;
  imageAlt: string;
};

const NOT_STATED = "Not stated in source.";

export function journeyPackagePath(slug: string): string {
  return `/treks/${slug}`;
}

export function journeyPackageSummary(journey: Pick<JourneyPackage, "overview">): string {
  return journey.overview[0] ?? "";
}

export function getJourneyPackage(slug: string): JourneyPackage | undefined {
  return journeyPackages.find((journey) => journey.slug === slug);
}

export const journeyPackages: JourneyPackage[] = [
  {
    slug: "simien-day-trip",
    name: "Simien Mountains Day Trip / Simien in a Day",
    duration: "1 Day",
    route: "Gondar → Debark → Simien Mountains → Gondar",
    difficulty: "Easy to Moderate (walking adjustable)",
    heroTitle: "Simien in a Day",
    heroAccent: "from Gondar.",
    overview: [
      "A one-day introduction to Simien Mountains National Park from Gondar. Travel north via Debark for park arrangements, then short mountain walks, escarpment viewpoints and time in known Gelada habitat. Designed for travellers with limited time who still want to leave the vehicle and spend time in the highlands.",
    ],
    highlights: [
      "One-day taste of Simien from Gondar",
      "Escarpment viewpoints (route-dependent; Sankaber / western escarpment noted)",
      "Time for Gelada observation if a troop is found (not guaranteed)",
      "Short guided walks adjusted to the group",
      "Mountain lunch",
    ],
    itineraryMode: "segments",
    segments: [
      { label: "Morning", body: "Pickup in Gondar (source example: ~6:30 AM); briefing." },
      { label: "Gondar → Debark", body: "Highland road with farming, villages and geography commentary." },
      { label: "Debark → park", body: "Park arrangements; escarpments open." },
      { label: "Gelada / walk", body: "Observe if a troop is found; short Simien walk; possible viewpoints around Sankaber and the western escarpment." },
      { label: "Lunch", body: "With a view." },
      { label: "Afternoon", body: "Further wildlife and landscape time as conditions allow (Gelada, Walia, highland birds, giant lobelia — none guaranteed)." },
      { label: "Return", body: "Via Debark to Gondar by evening." },
    ],
    included: [
      "Private transportation from Gondar to Simien and return; hotel pickup and drop-off in Gondar",
      "Professional English-speaking local guide; driver and fuel",
      "Simien National Park entrance fee / park arrangements; required park scout/ranger",
      "Lunch; drinking water according to the day’s arrangement; tea/coffee where included in the itinerary",
      "Short guided walks according to the agreed programme; wildlife and landscape interpretation",
      "Pre-trip planning and coordination",
    ],
    excluded: [
      "International and domestic flights; visa/eVisa; travel insurance",
      "Personal trekking equipment; personal snacks and drinks; alcohol; tips; personal purchases",
      "Optional activities; any service not specifically listed in the quotation",
    ],
    image: "/images/chenek-camp.jpg",
    imageAlt: "Highland landscape in the Simien Mountains",
  },
  {
    slug: "gelada-country",
    name: "Gelada Country (1 Day)",
    duration: "1 Day / Private or Small Group",
    route: "Not fully mapped in source; designed around time in Gelada country",
    difficulty: "Easy–Moderate",
    heroTitle: "Gelada Country",
    heroAccent: "one day.",
    overview: [
      "A one-day programme built around time in Gelada country rather than a fixed checklist of viewpoints. Emphasis is on observation time, escarpment walking, birdlife and photography. Wildlife sightings are never guaranteed.",
    ],
    highlights: [
      "Extended observation time in known Gelada habitat",
      "Escarpment walking and birdlife",
      "Flexible pacing for wildlife watching — give wildlife time rather than chase it",
    ],
    itineraryMode: "outline",
    outline: [
      "Outline only — day-by-day hour plan not stated in source. Expect Gondar pickup, transfer into Simien, guided wildlife walks, lunch, and return to Gondar.",
    ],
    included: [
      "Private transportation from Gondar; return from Simien; hotel pickup and drop-off",
      "Professional local wildlife/trekking guide; driver and fuel",
      "Simien National Park entrance fee; required park scout/ranger",
      "Lunch; drinking water",
      "Guided wildlife walks; wildlife interpretation",
      "Pre-trip planning and coordination",
    ],
    excluded: [
      "International and domestic flights; visa/eVisa; travel insurance",
      "Personal trekking equipment; personal snacks and drinks; alcohol; tips; personal purchases; optional activities",
    ],
    includedNote: "Wildlife sightings are never guaranteed.",
    image: "/images/gelada-troop.jpg",
    imageAlt: "A wild troop of geladas grazing in the Simien Mountains",
  },
  {
    slug: "simien-introduction",
    name: "Simien Introduction (2 Days / 1 Night)",
    duration: "2 Days / 1 Night",
    route: "Gondar → Debark → Simien → Sankaber / surrounding trekking area → Gondar",
    difficulty: "Moderate",
    heroTitle: "Simien Introduction",
    heroAccent: "one mountain night.",
    overview: [
      "An overnight mountain introduction: park entry via Debark, escarpment walking around Sankaber / surrounding trekking area, Geladas, highland scenery, sunset, camp life and morning atmosphere before returning to Gondar. This is the only detailed named 2-day package in source.",
    ],
    highlights: [
      "Overnight camping in the mountains",
      "Escarpment walking and highland scenery",
      "Gelada habitat time (sightings not guaranteed)",
      "Sunset and morning camp atmosphere",
    ],
    itineraryMode: "days",
    days: [
      {
        title: "Into Simien via Debark",
        subtitle: "Walk and overnight mountain camp",
        overnight: "Sankaber / surrounding area",
        paragraphs: ["Park entry via Debark; walk; overnight mountain camp (Sankaber / surrounding area). Full hour-by-hour splits are not stated in source."],
      },
      {
        title: "Morning in the highlands",
        subtitle: "Return to Gondar",
        paragraphs: ["Morning in the highlands; return to Gondar. Missing detailed day splits: not stated in source."],
      },
    ],
    included: [
      "Private transportation Gondar–Simien–return; Gonder pickup/drop-off",
      "Professional English-speaking trekking guide; park scout/ranger",
      "Simien National Park entrance fee; required trekking/camping permits",
      "Camping accommodation; trekking tents; sleeping mattresses; camping and camp kitchen equipment; cook/camp support",
      "Mule support for agreed group equipment",
      "Breakfast, lunch, dinner; drinking water according to confirmed arrangement; tea and coffee during camping",
      "Trekking support; pre-trip briefing; packing guidance",
      "Gonder + Simien Travel Companion after booking",
    ],
    excluded: [
      "International and domestic flights; visa/eVisa; travel insurance",
      "Personal sleeping bag unless specifically included; personal trekking equipment",
      "Alcohol; personal snacks/extra drinks; laundry; SIM/data/roaming; tips; personal expenses",
      "Medical treatment/evacuation; optional activities",
    ],
    image: "/images/geech-camp.jpg",
    imageAlt: "Tents on a high plateau in the Simien Mountains",
  },
  {
    slug: "3-day-simien-trek",
    name: "3-Day Simien Mountains Trekking Adventure",
    duration: "3 Days / 2 Nights",
    route: "Gondar → Sankaber → Geech → Imet Gogo → Gondar",
    difficulty: "Moderate to Challenging",
    heroTitle: "Three days",
    heroAccent: "to Imet Gogo.",
    overview: [
      "A three-day trek into the western classic corridor as far as Imet Gogo (~3,926 m), with overnight camps at Sankaber and Geech. Does not reach Chenek; the 4-Day Classic is recommended for travellers who specifically want Chenek. Possible start from Buyit Ras; road pickup often in the Ambaras area after Imet Gogo.",
    ],
    highlights: [
      "Simien Mountains National Park escarpments and deep valleys",
      "Wild Gelada baboons; possibility of Walia ibex (not guaranteed)",
      "Jinbar Waterfall & Geech Abyss",
      "Giant lobelia; Imet Gogo ~3,926 m",
      "Two nights mountain camping; highland villages",
      "Gondar gateway",
    ],
    itineraryMode: "days",
    days: [
      {
        title: "Gondar to Sankaber",
        subtitle: "Gondar ~2,200 m; Sankaber ~3,250 m",
        overnight: "Sankaber Camp",
        paragraphs: [
          "Drive approximately 100–105 km to Debark/park area; walking approximately 5–13 km. Possible start from Buyit Ras toward Sankaber; Geladas; overnight Sankaber Camp.",
          "Meals: lunch & dinner (per source day note).",
        ],
      },
      {
        title: "Sankaber to Geech",
        subtitle: "Sankaber ~3,250 m; Geech ~3,600 m",
        overnight: "Geech Camp",
        paragraphs: [
          "Approximately 12–15 km; ~5–7 hours. Escarpment; Jinbar Waterfall into Geech Abyss; climb to Geech; optional sunset viewpoint; overnight Geech Camp.",
          "Meals: B/L/D.",
        ],
      },
      {
        title: "Geech to Imet Gogo & return to Gondar",
        subtitle: "Geech ~3,600 m; Imet Gogo ~3,926 m",
        paragraphs: [
          "Walking approximately 10–17 km; ~5–8 hours. Imet Gogo; continue to road pickup often in the Ambaras area; return to Gondar.",
        ],
      },
    ],
    included: [
      "Private Gonder–Simien–Gonder transportation; professional English-speaking trekking guide",
      "Park entrance fee; required trekking permits; camping fees; park scout/ranger",
      "Trekking tents; sleeping mattresses; dining/cooking equipment; camping crew; cook",
      "Mule support for agreed luggage/equipment",
      "Breakfast each trekking morning; lunch/packed lunch; dinner; drinking water per confirmed arrangement; tea and coffee",
      "Guided trekking; wildlife and landscape interpretation; pre-trek briefing; packing guidance; pickup/drop-off; Travel Companion after booking",
    ],
    excluded: [
      "International and domestic flights; visa/eVisa; travel insurance",
      "Personal sleeping bag unless specifically stated; personal trekking equipment",
      "Alcohol; personal snacks and extra drinks; laundry; communications costs; tips; personal purchases",
      "Medical/evacuation costs; optional activities",
    ],
    includedNote: "Closest matching source list is PACKAGE 05 — Simien Classic (3 Days / 2 Nights camping trek format). Apply only where confirmed in the quotation for this Adventure product. If this Adventure product is quoted separately from PACKAGE 05, confirm inclusions in the quotation — not stated as a distinct Adventure-only list beyond meal notes on Day 1–2.",
    image: "/images/imet-gogo.jpg",
    imageAlt: "The immense cliffs and valleys seen from Imet Gogo",
  },
  {
    slug: "4-day-simien-classic",
    name: "4-Day Simien Classic Trek",
    duration: "4 Days / 3 Nights",
    route: "Gondar → Sankaber → Geech → Imet Gogo → Chenek → Gondar",
    difficulty: "Moderate to Challenging",
    heroTitle: "The Simien Classic",
    heroAccent: "to Chenek.",
    overview: [
      "The signature classic corridor trek: Sankaber, Geech, Imet Gogo and Chenek, with optional Bwahit-area morning hike on the final day. Walking distance approximately 30–45 km depending on route and optional hikes. Aligns with PACKAGE 06 — Simien Essential in source.",
    ],
    highlights: [
      "Simien Mountains National Park; Gelada baboons; Walia ibex (habitat; sightings not guaranteed)",
      "Jinbar Waterfall; Imet Gogo; Chenek; Bwahit landscape (optional)",
      "Highland villages; mountain camping; Gondar cultural context at start/end",
    ],
    itineraryMode: "days",
    days: [
      {
        title: "Gondar to Sankaber",
        subtitle: "Gondar ~2,200 m; Sankaber ~3,250 m",
        overnight: "Sankaber Camp",
        paragraphs: [
          "Drive ~100 km; walking approximately 5–13 km depending on trail. North to Debark for park arrangements; walk into the highlands; Gelada often gather; overnight Sankaber Camp.",
        ],
      },
      {
        title: "Sankaber to Geech",
        subtitle: "~3,250–3,600 m",
        overnight: "Geech Camp",
        paragraphs: [
          "Walking approximately 10–14 km; ~5–7 hours. Escarpment toward Geech; Jinbar River and Waterfall; overnight Geech Camp.",
        ],
      },
      {
        title: "Geech to Chenek via Imet Gogo",
        subtitle: "Highest point ~3,926 m",
        overnight: "Chenek Camp",
        paragraphs: [
          "Walking approximately 15–17 km; ~7–9 hours. Imet Gogo; continue toward Chenek; Gelada and possible Walia ibex; overnight Chenek Camp.",
        ],
      },
      {
        title: "Chenek & return to Gondar",
        subtitle: "Chenek ~3,620 m",
        paragraphs: [
          "Morning around Chenek; optional morning hike toward the Bwahit area according to fitness, weather and time; meet vehicle; return to Gondar.",
        ],
      },
    ],
    included: [
      "Private transportation Gondar–Simien–return; professional English-speaking local trekking guide",
      "Park entrance fee; required trekking/camping permits; park scout/ranger",
      "Trekking tents; sleeping mattresses; dining tent where required; cooking and camp equipment",
      "Professional trekking cook; camp support crew; mule support",
      "Breakfast, lunch, dinner; drinking water per confirmed arrangement; tea and coffee during camping",
      "All agreed trekking support; pre-trip briefing; packing guidance; pickup/drop-off; Travel Companion",
    ],
    excluded: [
      "International and domestic flights; visa/eVisa; travel insurance",
      "Personal sleeping bag unless stated; personal trekking gear",
      "Alcohol; personal snacks/extra drinks; laundry; SIM/data/roaming; tips; personal shopping",
      "Medical treatment; emergency evacuation; optional activities",
    ],
    image: "/images/imet-gogo.jpg",
    imageAlt: "The immense cliffs and valleys seen from Imet Gogo",
  },
  {
    slug: "5-day-gondar-simien",
    name: "5-Day Royal City & Mountain Adventure",
    duration: "5 Days / 4 Nights",
    route: "Gondar → Debark → Sankaber → Geech → Imet Gogo → Chenek → Gondar",
    difficulty: "Moderate to Challenging",
    heroTitle: "Royal city",
    heroAccent: "and mountain adventure.",
    overview: [
      "Combines a Gondar heritage day with three days of Simien trekking to Chenek. Hotel in Gondar plus camping in Simien. Day 4 routes Geech → Imet Gogo → Inatye → Chenek; Ethiopian wolf possible but not guaranteed.",
    ],
    highlights: [
      "Royal Gondar and wild Simien in one journey",
      "Time to walk rather than rush viewpoints",
      "Wildlife in natural habitat (no guarantees)",
      "Local guide interpretation",
    ],
    itineraryMode: "days",
    days: [
      {
        title: "Arrive in Gondar",
        subtitle: "~2,200 m",
        overnight: "Gondar hotel",
        paragraphs: ["Airport meet; hotel; visit Fasil Ghebbi and other sites per arrival time; trek briefing; overnight Gondar hotel."],
      },
      {
        title: "Gondar → Debark → Sankaber",
        subtitle: "Drive ~100 km to Debark; trekking altitude around 3,250 m",
        overnight: "Sankaber camp",
        paragraphs: ["Park formalities; walk around Buyit Ras/Sankaber; Geladas; overnight camping Sankaber."],
      },
      {
        title: "Sankaber → Jinbar Waterfall → Geech",
        subtitle: "~3,250–3,600 m; full day",
        overnight: "Geech camp",
        paragraphs: ["Escarpment; Jinbar Waterfall; giant lobelia; optional sunset walk; overnight camping Geech."],
      },
      {
        title: "Geech → Imet Gogo → Inatye → Chenek",
        subtitle: "Up to approximately 4,000 m+; overnight Chenek ~3,600 m",
        overnight: "Chenek camp",
        paragraphs: ["Imet Gogo; Inatye; wildlife including Gelada/Walia; Ethiopian wolf possible but not guaranteed."],
      },
      {
        title: "Chenek → Gondar",
        subtitle: "Optional short morning walk",
        paragraphs: ["Optional short morning walk; return via Debark to Gondar. Meals: breakfast & lunch (per source)."],
      },
    ],
    included: [
      "Airport pickup in Gondar; private transportation according to itinerary",
      "Professional English-speaking local guide; Simien Mountains National Park entrance arrangements; park scout",
      "Camping equipment; camping crew/cook; trekking meals during the mountain section",
      "Accommodation in Gondar; camping in Simien",
      "All planned trekking and sightseeing activities; Gondar city sightseeing; local assistance throughout",
    ],
    excluded: [
      "International flights; domestic flights to/from Gondar unless specifically requested",
      "Personal expenses; alcoholic drinks; tips; travel insurance; personal trekking equipment",
      "Expenses caused by circumstances outside operator control",
    ],
    image: "/images/fasil-ghebbi.jpg",
    imageAlt: "Stone arches at the royal fortress of Fasil Ghebbi in Gondar",
  },
  {
    slug: "gondar-heritage-simien",
    name: "Gondar, Heritage & Simien (5 Days)",
    duration: "5 Days / 4 Nights",
    route: "Gondar → Woleka → Debark → Simien → Gondar (Royal Heritage · Woleka · Simien · Wildlife · Local Life)",
    difficulty: "Not stated as a single level; Day 4 adapted to fitness (active vs accessible options)",
    heroTitle: "Heritage",
    heroAccent: "then the highlands.",
    overview: [
      "Culture-forward five-day arc: empire and living Gondar, Woleka heritage stop, then flexible Simien mountain days. Distinct from the Royal City & Mountain Adventure trek-heavy corridor.",
    ],
    highlights: [
      "Empire → culture → highlands → wilderness arc",
      "Royal city sites plus living Gondar (food, coffee)",
      "Woleka (Beta Israel heritage associations)",
      "Flexible Simien day (active or more accessible)",
    ],
    itineraryMode: "days",
    days: [
      {
        title: "Welcome to Gondar",
        subtitle: "Gentle city introduction",
        overnight: "Gondar",
        paragraphs: ["Gentle city introduction; café/relax; evening briefing; overnight Gondar."],
      },
      {
        title: "Walking through history",
        subtitle: "Royal sites and living city",
        overnight: "Gondar",
        paragraphs: ["Fasil Ghebbi; Debre Berhan Selassie; Kuskuam; then living city — food, coffee; overnight Gondar."],
      },
      {
        title: "Beyond the city",
        subtitle: "Woleka, Debark and Simien",
        overnight: "Simien Mountains",
        paragraphs: ["Woleka; Debark; enter Simien; short walks/viewpoints/Geladas as conditions allow; overnight Simien Mountains."],
      },
      {
        title: "Wild heart of Simien",
        subtitle: "Active or more accessible",
        overnight: "Simien Mountains",
        paragraphs: [
          "Active option: Geech/Imet Gogo/escarpment/Geladas; or more accessible scenic drives, viewpoints, short walks, possibly Chenek area; overnight Simien Mountains.",
        ],
      },
      {
        title: "Road back",
        subtitle: "Simien → Debark → Gondar",
        paragraphs: [
          "Final morning walk/viewpoint; Simien → Debark → Gondar; airport transfer or extensions (Lalibela, Axum, Bahir Dar, Ras Dashen, Danakil mentioned in source as extension ideas).",
        ],
      },
    ],
    included: [
      "Private transportation; professional local guide",
      "Gondar sightseeing according to itinerary; applicable Gondar attraction entrance fees",
      "Simien National Park entrance fee; required scout/ranger; trekking permits",
      "Camping or accommodation according to itinerary; camping equipment where applicable",
      "Meals according to itinerary; drinking water according to itinerary",
      "Mule support and cook/camp crew where required",
      "Pre-trip planning; Travel Companion",
    ],
    excluded: [
      "International and domestic flights; visa; insurance; personal equipment",
      "Alcohol; personal snacks/extra drinks; tips; personal shopping; optional activities",
      "Extra hotel nights; services not stated in the quotation",
    ],
    includedNote: "Closest matching catalogue block is PACKAGE 20 — Gondar + Simien (history → culture → mountains). Confirm on quotation.",
    image: "/images/fasil-ghebbi.jpg",
    imageAlt: "Stone arches at the royal fortress of Fasil Ghebbi in Gondar",
  },
  {
    slug: "ras-dashen-challenge",
    name: "Ras Dashen Challenge",
    duration: "5 Days / 4 Nights (detailed itinerary); 6 Days / 5 Nights (PACKAGE 07 catalogue)",
    route: "Gondar → Sankaber → Geech → Chenek → Ambiko → Ras Dejen",
    difficulty: "Challenging",
    heroTitle: "Ras Dashen",
    heroAccent: "the challenge.",
    overview: [
      "Summit-focused Simien trek: classic corridor into Chenek, then Bwahit Pass (~4,200 m), Meseha Valley and Ambiko base (~3,200 m) for a Ras Dashen / Ras Dejen summit attempt. This is a mountain challenge rather than sightseeing. Summit success cannot be guaranteed; safety conditions determine the final summit decision.",
      "Source has two Challenge products — 5 Days / 4 Nights (detailed Ras Dejen Challenge itinerary on this page) and 6 Days / 5 Nights (PACKAGE 07), the slower catalogue Challenge with return via Chennek. The 6-day full day-by-day is not stated; key experience includes the same corridor plus return toward Chennek → Gondar.",
    ],
    highlights: [
      "Stand on the roof of Ethiopia framing (summit attempt)",
      "Classic Simien landscapes then high-altitude Ambiko / Ras Dashen route",
      "Key points: Sankaber, Geech, Imet Gogo, Chenek, Bwahit Pass, Mesheha/Meseha Valley, Ambiko, Ras Dashen",
    ],
    itineraryMode: "days",
    days: [
      {
        title: "Gondar to Sankaber",
        subtitle: "~2,200 m → ~3,250 m",
        overnight: "Sankaber Camp",
        paragraphs: ["Drive through Debark; park arrangements; first escarpment hike; Geladas; overnight Sankaber Camp."],
      },
      {
        title: "Sankaber to Geech",
        subtitle: "Walking ~10–14 km; camp ~3,600 m",
        overnight: "Geech Camp",
        paragraphs: ["Trail toward Geech; Jinbar Waterfall; overnight Geech Camp."],
      },
      {
        title: "Geech to Chenek",
        subtitle: "Walking ~15–17 km; highest ~3,926 m",
        overnight: "Chenek Camp",
        paragraphs: ["Early start for Imet Gogo; continue toward Chenek and Bwahit massif area; overnight Chenek Camp."],
      },
      {
        title: "Chenek to Ambiko",
        subtitle: "Walking ~18–20 km; highest pass ~4,200 m; Ambiko ~3,200 m",
        overnight: "Ambiko Camp",
        paragraphs: ["Cross Bwahit area; descend toward Meseha Valley; climb to Ambiko; briefing; overnight Ambiko Camp."],
      },
      {
        title: "Ras Dejen summit",
        subtitle: "Summit approximately 4,500+ m",
        paragraphs: [
          "Walking approximately 14–16 km round trip; ~8–10 hours. Pre-sunrise ascent; summit; descent toward Ambiko. Expedition ends according to agreed return arrangements.",
        ],
      },
    ],
    included: [
      "Gonder–Simien transportation; transportation to/from agreed trekking route",
      "Professional English-speaking trekking guide; park entrance fees; required permits; park scout/ranger",
      "Camping throughout; trekking tents; sleeping mattresses; dining/cooking equipment",
      "Professional cook; camping support crew; mule support; mule handlers",
      "Breakfast, lunch, dinner; drinking water per confirmed arrangement; tea and coffee",
      "Ras Dashen summit attempt; route guidance and mountain interpretation",
      "Pre-trek briefing; packing guidance; Gonder coordination; Travel Companion after booking",
    ],
    excluded: [
      "International and domestic flights; visa/eVisa; travel insurance; high-altitude medical/evacuation insurance",
      "Personal sleeping bag unless stated; personal trekking equipment",
      "Alcohol; personal snacks/extra drinks; laundry; communications; tips; personal purchases",
      "Medical treatment; emergency evacuation; optional activities",
    ],
    includedNote: "Included list is PACKAGE 07 — Ras Dashen Challenge, 6 Days / 5 Nights, used as standard Challenge inclusions.",
    image: "/images/giant-lobelia.jpg",
    imageAlt: "Giant lobelias across the high Afroalpine landscape of the Simien Mountains",
  },
  {
    slug: "ras-dashen-expedition",
    name: "Ras Dashen Expedition (7 Days)",
    duration: "7 Days / 6 Nights",
    route: "Not fully mapped; slower summit product vs 6-day Challenge",
    difficulty: "Challenging (implied)",
    heroTitle: "Ras Dashen Expedition",
    heroAccent: "seven days.",
    overview: [
      "A slower Ras Dashen summit product versus the 6-day Challenge, designed around acclimatization, deliberate pacing, extra mountain time and weather flexibility. Source highlight framing: earn the journey, not only reach the summit.",
    ],
    highlights: [
      "Additional trekking day/night versus Challenge",
      "Extra time for acclimatization and flexible pacing where appropriate",
      "Full mountain support throughout the extended itinerary",
    ],
    itineraryMode: "outline",
    outline: [
      "Day-by-day not stated in source. Outline: Challenge corridor extended by one day/night for pacing and contingency.",
    ],
    included: [
      "Everything included in the Ras Dashen Challenge",
      "Additional trekking day/night; additional camping night; additional trekking meals",
      "Full mountain support throughout the extended itinerary",
      "Additional time for acclimatization and flexible pacing where appropriate",
      "Mule and camp support for the additional trekking period; additional route support",
    ],
    excluded: [
      "Same exclusions as the Ras Dashen Challenge unless specifically stated otherwise in the quotation",
    ],
    image: "/images/simien-panorama.jpg",
    imageAlt: "Wide panorama across the Simien Mountains",
  },
  {
    slug: "simien-ras-dashen-8-day",
    name: "Simien & Ras Dashen (8 Days)",
    duration: "8 Days / 7 Nights",
    route: "Central Simien + Ras Dashen (first part Simien, second part summit)",
    difficulty: "Challenging",
    heroTitle: "Simien & Ras Dashen",
    heroAccent: "eight days.",
    overview: [
      "Eight-day product combining central Simien highlights (Geech, Jinbar Falls, Imet Gogo, Chennek, Bwahit) with Ambiko and a Ras Dashen summit attempt — see the Simien and climb Ras Dashen properly.",
    ],
    highlights: [
      "Central Simien corridor plus summit attempt",
      "Destinations named: Geech, Jinbar Falls, Imet Gogo, Chennek, Bwahit, Ambiko, Ras Dashen",
    ],
    itineraryMode: "outline",
    outline: ["Day-by-day not stated in source."],
    included: [
      "Gonder–Simien transportation; return/end-of-route transportation according to itinerary",
      "Professional trekking guide; park entrance fees; required trekking permits; park scout/ranger",
      "Camping throughout; trekking tents; sleeping mattresses; dining/cooking equipment",
      "Professional cook; camp support crew; mule support; mule handlers",
      "Breakfast, lunch, dinner; drinking water per confirmed arrangement; tea and coffee",
      "Ras Dashen summit attempt; route guidance; wildlife and landscape interpretation",
      "Pre-trek briefing; packing guidance; Travel Companion",
    ],
    excluded: [
      "International and domestic flights; visa/eVisa; travel insurance",
      "Personal sleeping bag unless stated; personal trekking equipment",
      "Alcohol; personal snacks/extra drinks; laundry; communications; tips; personal expenses",
      "Medical treatment; emergency evacuation; optional services",
    ],
    image: "/images/simien-panorama.jpg",
    imageAlt: "Wide panorama across the Simien Mountains",
  },
  {
    slug: "10-day-simien-ras-dashen",
    name: "10-Day Simien Mountains & Ras Dashen Expedition",
    duration: "10 Days / 9 Nights",
    route: "Gondar → Sankaber → Geech → Imet Gogo → Chenek → Ambiko → Ras Dashen → Sona → Mekarebya → Mulit → Adi Arkay → Gondar",
    difficulty: "Challenging",
    heroTitle: "The full Simien",
    heroAccent: "crossing.",
    overview: [
      "Full Simien crossing: classic corridor, Bwahit/Buahit Pass, Ambiko, Ras Dashen summit (~4,550 m in this detailed version), then the quieter eastern transect via Sona, Mekarebya and Mulit to Adi Arkay vehicle pickup and return to Gondar.",
    ],
    highlights: [
      "Full Simien crossing beyond familiar trekking route after summit",
      "Ras Dashen ~4,550 m (this detailed itinerary wording)",
      "Remote valleys and communities; changing landscapes",
    ],
    itineraryMode: "days",
    days: [
      {
        title: "Arrival in Gondar",
        subtitle: "~2,200 m",
        overnight: "Gondar hotel",
        paragraphs: ["Meet guide; possible Royal Enclosure; expedition briefing; overnight Gondar hotel."],
      },
      {
        title: "Gondar → Debark → Sankaber",
        subtitle: "Drive ~100 km to Debark; Sankaber ~3,200–3,250 m",
        overnight: "Sankaber camp",
        paragraphs: ["Introductory hike; overnight camping Sankaber."],
      },
      {
        title: "Sankaber → Geech",
        subtitle: "Approximately 14–15 km; Geech ~3,600 m; ~6–8 hours",
        overnight: "Geech camp",
        paragraphs: ["Jinbar/Genbar Waterfall area; overnight Geech camp."],
      },
      {
        title: "Geech → Imet Gogo → Siha Gorge → Chenek",
        subtitle: "Approximately 15–20 km; highest ~3,900 m; Chenek ~3,600 m",
        overnight: "Chenek camp",
        paragraphs: ["Overnight Chenek camp."],
      },
      {
        title: "Chenek → Buwahit Pass → Ambiko",
        subtitle: "Approximately 18–20 km; pass ~4,200 m; Ambiko ~3,200 m",
        overnight: "Ambiko camp",
        paragraphs: ["Overnight Ambiko camp."],
      },
      {
        title: "Ambiko → Ras Dashen summit → Ambiko",
        subtitle: "Summit ~4,550 m; round-trip ~14–16 km; ~8–10+ hours",
        overnight: "Ambiko camp",
        paragraphs: ["Overnight Ambiko camp."],
      },
      {
        title: "Ambiko → Sona",
        subtitle: "Approximately 15–20 km",
        overnight: "Sona camp",
        paragraphs: ["Eastern/lowland side rather than fully retracing; overnight Sona camp."],
      },
      {
        title: "Sona → Mekarebya",
        subtitle: "Approximately 15–20 km",
        overnight: "Mekarebya camp",
        paragraphs: ["Quieter Simien; communities/agriculture/coffee where appropriate; overnight Mekarebya camp."],
      },
      {
        title: "Mekarebya → Mulit",
        subtitle: "Approximately 15–20 km",
        overnight: "Mulit camp",
        paragraphs: ["Quieter trekking day; overnight Mulit camp."],
      },
      {
        title: "Mulit → Adi Arkay → Gondar",
        subtitle: "Final walk and drive",
        paragraphs: ["Final walk to Adi Arkay; drive to Gondar hotel or airport."],
      },
    ],
    included: [
      "Private transportation from Gondar to the mountains; transportation from Adi Arkay back to Gondar; all agreed ground transfers",
      "Professional English-speaking trekking guide; required park scout/ranger; park entrance fees; trekking and camping permits; camping fees",
      "Trekking tents; sleeping mattresses; dining and cooking equipment; professional cook; camping crew",
      "Mule support; mule handlers; group trekking equipment",
      "Breakfast throughout the trekking programme; lunch/packed lunch; dinner; drinking water per confirmed arrangement; tea and coffee",
      "Ras Dashen summit attempt; pre-trek briefing; packing guidance; route planning and coordination",
      "Wildlife and landscape interpretation; Gonder pickup/drop-off; Travel Companion",
    ],
    excluded: [
      "International and domestic flights; visa/eVisa; travel insurance",
      "Personal sleeping bag unless specifically stated; personal trekking equipment",
      "Alcohol; personal snacks and extra drinks; laundry; SIM/data/roaming; tips; souvenirs/personal shopping",
      "Professional photography/video; medical treatment; emergency evacuation; optional activities",
      "Any service not specifically listed in the final quotation",
    ],
    image: "/images/simien-panorama.jpg",
    imageAlt: "Ridges and escarpments across the Simien Mountains",
  },
  {
    slug: "simien-wildlife-journey",
    name: "Simien Wildlife Journey (2–4 Days)",
    duration: "2–4 Days / Flexible",
    route: "Not built around a particular camp; built around wildlife observation",
    difficulty: "Flexible",
    heroTitle: "Wildlife Journey",
    heroAccent: "flexible days.",
    overview: [
      "A flexible 2–4 day journey oriented to wildlife observation rather than a fixed camp checklist. Focus areas named in source: Gelada, Walia where encountered, Ethiopian wolf where encountered, birds, giant lobelia and landscape. Sightings are never guaranteed.",
    ],
    highlights: [
      "Wildlife-first pacing — come for landscape, stay for wildlife",
      "Flexible duration inside a 2–4 day window",
    ],
    itineraryMode: "outline",
    outline: ["Day-by-day not stated in source."],
    included: [
      "Gonder–Simien–Gonder transportation; professional local wildlife/trekking guide",
      "Park entrance fees; required scout/ranger; trekking permits where applicable",
      "Camping or accommodation according to itinerary; camping equipment where camping is included",
      "Meals according to itinerary; drinking water according to arrangement",
      "Wildlife-focused walking; wildlife interpretation; local landscape and cultural interpretation",
      "Pre-trip planning; Travel Companion",
    ],
    excluded: [
      "Flights; visa; insurance; personal equipment; personal expenses; alcohol; tips",
      "Professional photography; optional activities",
    ],
    includedNote: "Wildlife sightings are never guaranteed.",
    image: "/images/gelada-troop.jpg",
    imageAlt: "A wild troop of geladas grazing in the Simien Mountains",
  },
  {
    slug: "simien-photography-day",
    name: "1-Day Simien Photography Experience",
    duration: "1 Day",
    route: "Gondar → Simien → Gondar",
    difficulty: "Not stated in source",
    heroTitle: "Simien photography",
    heroAccent: "one day.",
    overview: [
      "One-day photography focus for travellers, photographers and content creators with only one day: landscapes, viewpoints, Gelada, mountain scenery and golden-hour opportunities where timing allows.",
    ],
    highlights: [
      "Best fit when only one day is available for Simien photography",
      "Landscapes, viewpoints, Gelada and mountain scenery",
    ],
    itineraryMode: "outline",
    outline: [
      "Not a full hour-by-hour itinerary in source. Focus as above; timing depends on light and conditions.",
    ],
    included: [NOT_STATED],
    excluded: [NOT_STATED],
    includedNote: "Not stated in source as a distinct 1-day photography inclusion list. Closest day-trip transport/guide/park structure may apply per quotation — confirm in quotation.",
    image: "/images/simien-panorama.jpg",
    imageAlt: "Wide panorama across the Simien Mountains",
  },
  {
    slug: "wildlife-landscape-photography",
    name: "2–3 Day Wildlife & Landscape Photography",
    duration: "2–3 Days",
    route: "Not fully stated; spend more time inside the mountains",
    difficulty: "Not stated in source",
    heroTitle: "Wildlife & landscape",
    heroAccent: "photography.",
    overview: [
      "Longer field time than a day trip for wildlife and landscape photography — Gelada, Walia ibex, escarpments, Imet Gogo, highland landscapes, sunrise and sunset, mountain camping. Less rushing.",
    ],
    highlights: [
      "More time in the field",
      "Sunrise/sunset and Imet Gogo among named focuses",
    ],
    itineraryMode: "outline",
    outline: ["Day-by-day not stated in source."],
    included: [
      "Private transportation according to itinerary; professional local guide",
      "Simien National Park fees; required scout/ranger",
      "Camping/accommodation according to itinerary; camping equipment where applicable",
      "Meals according to itinerary; drinking water; mule support where applicable",
      "Local wildlife and landscape knowledge; flexible photographic stops within reasonable route limits",
      "Pre-trip photography planning; Travel Companion",
    ],
    excluded: [
      "Professional photographer unless specifically booked; photography equipment; camera/lens rental unless arranged; drone services",
      "International/domestic flights; visa; travel insurance; personal expenses; alcohol; tips; optional services",
    ],
    includedNote: "Align with Photographer’s Simien (PACKAGE 12) where quotation maps this product. If quoted as a separate SKU without PACKAGE 12 mapping: Not stated in source.",
    image: "/images/imet-gogo.jpg",
    imageAlt: "The immense cliffs and valleys seen from Imet Gogo",
  },
  {
    slug: "simien-photography-expedition",
    name: "4–5 Day Simien Photography Expedition",
    duration: "4–5 Days",
    route: "Possible areas: Sankaber · Geech · Imet Gogo · Chenek (exact route adapted)",
    difficulty: "Not stated in source",
    heroTitle: "Photography expedition",
    heroAccent: "time to wait.",
    overview: [
      "Extended photography expedition with time to wait, explore alternative viewpoints, follow wildlife and photograph changing weather — time a day trip cannot provide. Route adapted within the named corridor.",
    ],
    highlights: [
      "Multi-day photographic access to Sankaber, Geech, Imet Gogo, Chenek corridor",
      "Flexible stops for light and wildlife within route limits",
    ],
    itineraryMode: "outline",
    outline: ["Day-by-day not stated in source."],
    included: [
      "Private transportation; professional local guide; required park scout/ranger; park fees and permits",
      "Accommodation/camping according to itinerary; camping equipment where applicable",
      "Meals according to itinerary; drinking water; mule support where applicable",
      "Flexible daily pacing / photographic stops within planned route; local photography guidance",
      "Wildlife and landscape interpretation; pre-trip planning; Travel Companion",
    ],
    excluded: [
      "Professional photographer unless booked; camera equipment; drone services",
      "Flights; visa; insurance; personal expenses; alcohol; tips; optional activities",
    ],
    includedNote: "Use PACKAGE 12 (Photographer’s Simien, 3–5 Days) and/or PACKAGE 13 (The Light of Simien, 4–6 Days) as applicable to quotation.",
    image: "/images/chenek-camp.jpg",
    imageAlt: "Mountain landscape around Chenek camp in the Simien Mountains",
  },
  {
    slug: "royal-gondar",
    name: "Royal Gondar Experience",
    duration: "Half Day / Full Day",
    route: "Gondar (city-based)",
    difficulty: "Easy",
    heroTitle: "Royal Gondar",
    heroAccent: "the city of emperors.",
    overview: [
      "History-focused Gondar walk through the city of emperors: Royal Enclosure and important historic sites, with context on why Gondar was built and how history shapes the city today. Aimed at first-time visitors, history lovers and photographers.",
    ],
    highlights: [
      "Imperial history, royal architecture, churches, Fasilides’ legacy",
      "Gondar as more than a stop on the way to the mountains",
    ],
    itineraryMode: "outline",
    outline: [
      "Half-day or full-day city heritage programme. Exact timed stops not stated beyond site types above.",
    ],
    included: [
      "Professional local guide; private transportation; hotel pickup/drop-off",
      "Fasil Ghebbi entrance fee when included in itinerary; other listed historical-site entrance fees",
      "Historical interpretation; cultural context; personalized sightseeing; driver and fuel",
    ],
    excluded: [
      "Flights; visa; insurance; meals unless stated; drinks; personal expenses; tips",
      "Attractions not listed; optional activities",
    ],
    image: "/images/fasil-ghebbi.jpg",
    imageAlt: "Stone arches at the royal fortress of Fasil Ghebbi in Gondar",
  },
  {
    slug: "gondar-through-local-eyes",
    name: "Gondar Through Local Eyes",
    duration: "Not stated in source",
    route: "Gondar (city-based)",
    difficulty: "Easy (where stated for related packages) / Not always stated",
    heroTitle: "Gondar",
    heroAccent: "through local eyes.",
    overview: [
      "Slow everyday Gondar beyond the tourist route: neighbourhoods, small businesses, meeting people, coffee, local food and daily life — seeing and understanding the city as locals live it.",
    ],
    highlights: [
      "Living city beyond monuments",
      "Coffee, food and community interaction",
    ],
    itineraryMode: "outline",
    outline: [
      "Outline only (not day-by-day): neighbourhoods, small businesses, people, coffee, local food, daily life.",
    ],
    included: [NOT_STATED],
    excluded: [NOT_STATED],
    image: "/images/tevan-portrait.jpg",
    imageAlt: "Local perspective on Gondar and northern Ethiopia",
  },
  {
    slug: "gondar-food-coffee",
    name: "Gondar Food & Coffee Experience",
    duration: "3–5 Hours",
    route: "Gondar (city-based)",
    difficulty: "Easy",
    heroTitle: "Food & coffee",
    heroAccent: "in Gondar.",
    overview: [
      "Ethiopian coffee culture and Gondar flavours: traditional coffee preparation/ceremony, local snacks, injera and dishes, spices, street food, traditional drinks and food markets depending on the experience. Come hungry; stories behind food.",
    ],
    highlights: [
      "Coffee ceremony and Gondar food culture",
      "Market visit where appropriate",
    ],
    itineraryMode: "outline",
    outline: ["3–5 hour experience outline as above; timed stops not stated."],
    included: [
      "Local guide; transportation where required",
      "Planned food/coffee experiences specifically listed in the itinerary",
      "Ethiopian coffee experience where stated; cultural interpretation; local food introduction",
      "Hotel pickup/drop-off where included",
    ],
    excluded: [
      "Additional food/drinks outside the agreed experience; alcohol; personal purchases; tips",
      "Flights; visa; insurance; optional experiences",
    ],
    image: "/images/tevan-founder.jpg",
    imageAlt: "A local guide sharing the landscape and stories of northern Ethiopia",
  },
  {
    slug: "gondar-photography-walk",
    name: "Gondar Photography Walk",
    duration: "Not stated in source",
    route: "Gondar (city-based)",
    difficulty: "Easy (where stated for related packages) / Not always stated",
    heroTitle: "Gondar photography",
    heroAccent: "beyond postcards.",
    overview: [
      "Photograph the city beyond postcards: architecture, streets, churches, markets, people, coffee, morning light, mountain views and unplanned moments, with local knowledge for timing.",
    ],
    highlights: [
      "Local knowledge for photographic moments",
      "Mix of heritage and everyday city subjects",
    ],
    itineraryMode: "outline",
    outline: ["Outline only; timed route not stated in source."],
    included: [NOT_STATED],
    excluded: [NOT_STATED],
    image: "/images/fasil-ghebbi.jpg",
    imageAlt: "Historic stone architecture in Gondar",
  },
  {
    slug: "gondar-history-culture",
    name: "Gondar History & Culture Tour",
    duration: "Not stated in source",
    route: "Gondar (city-based)",
    difficulty: "Easy (where stated for related packages) / Not always stated",
    heroTitle: "History & culture",
    heroAccent: "as living context.",
    overview: [
      "Guided cultural touring of stories that shaped northern Ethiopia: emperors, religious traditions, architecture, trade, art, music, food, communities and modern life — history presented as living context.",
    ],
    highlights: [
      "Broad cultural narrative beyond single monuments",
      "Connection between imperial past and contemporary Gondar",
    ],
    itineraryMode: "outline",
    outline: ["Outline only; day-by-day not stated."],
    included: [
      "Professional local English-speaking guide; private transportation; hotel pickup/drop-off; driver and fuel",
      "Entrance fees to attractions specifically listed in itinerary",
      "Historical and cultural interpretation; personalized sightseeing route; pre-trip coordination",
    ],
    excluded: [
      "International and domestic flights; visa; travel insurance",
      "Meals unless specifically stated; drinks; personal purchases; tips",
      "Optional attractions not listed; personal expenses",
    ],
    includedNote: "Closest catalogue match PACKAGE 16 — Gondar Essentials (half/full day city) when mapped on quotation. If sold as a separate History & Culture SKU without Essentials mapping: Not stated in source.",
    image: "/images/fasil-ghebbi.jpg",
    imageAlt: "Stone arches at the royal fortress of Fasil Ghebbi in Gondar",
  },
  {
    slug: "gondar-market-local-life",
    name: "Gondar Market & Local Life",
    duration: "Not stated in source",
    route: "Gondar (city-based)",
    difficulty: "Easy (where stated for related packages) / Not always stated",
    heroTitle: "Market",
    heroAccent: "and local life.",
    overview: [
      "Market areas and everyday commercial life — local products, food, and farming connections between the city and the highlands. A window into everyday Gondar.",
    ],
    highlights: [
      "Everyday commercial and market life",
      "City–highland farming connections",
    ],
    itineraryMode: "outline",
    outline: ["Outline only; timed itinerary not stated."],
    included: [NOT_STATED],
    excluded: [NOT_STATED],
    image: "/images/tevan-portrait.jpg",
    imageAlt: "Local perspective on Gondar and northern Ethiopia",
  },
  {
    slug: "gondar-kosoye",
    name: "Gondar & Kosoye Mountains",
    duration: "Half Day approximately 4–5 hours; Full Day approximately 7–9 hours",
    route: "Gondar → Kosoye highlands / village → Gondar",
    difficulty: "Walk adaptable to fitness; not stated as trek difficulty",
    heroTitle: "Gondar & Kosoye",
    heroAccent: "highland life.",
    overview: [
      "From the royal city into rural highland life around Kosoye: village visit, traditional homes, farming, livestock, coffee ceremony, local food, countryside walk and conversations with local people. Community connection, not a staged show. Can combine with Gondar & Simien as History → Community → Wilderness.",
    ],
    highlights: [
      "Community-based rural highland experience",
      "Coffee ceremony, food tasting, countryside walk",
      "Farmland and highland scenery near Gondar",
    ],
    itineraryMode: "outline",
    outline: [
      "Not multi-day. Experience elements: traditional Ethiopian home; rural farming life; coffee ceremony; traditional food tasting; local customs; countryside highland walk adapted to fitness.",
    ],
    included: [
      "Hotel pickup and drop-off in Gondar; local professional guide; transportation",
      "Village visit; local family/community interaction; traditional coffee ceremony",
      "Cultural interpretation; local food tasting according to the selected experience",
      "Guided countryside walk; community-hosted activities",
    ],
    excluded: [
      "Personal expenses; alcoholic drinks; tips; personal purchases; activities not listed above",
    ],
    image: "/images/road-to-simien.jpg",
    imageAlt: "Everyday life in the northern Ethiopian highlands",
  },
  {
    slug: "gondar-running",
    name: "Gondar Hidden Running Experience",
    duration: "Not fixed; Easy / Moderate / Challenging options; can finish with coffee/breakfast",
    route: "City edge → local paths → countryside → dirt tracks → highland views → village life → return to Gondar (exact route depends on ability, weather, conditions)",
    difficulty: "Easy, Moderate, or Challenging (adapted)",
    heroTitle: "Hidden Gondar",
    heroAccent: "running.",
    overview: [
      "Guided run away from main paved roads onto quieter local paths, dirt tracks, countryside trails and hidden routes around Gondar. Pace adapted; safety-first route selection. Run with a local, not a GPS app. Variants combine running with coffee, culture or photography.",
    ],
    highlights: [
      "Hidden Gondar beyond the tourist route",
      "Ability-adapted difficulty",
      "Optional coffee/breakfast finish; optional photography and cultural observation",
    ],
    itineraryMode: "outline",
    outline: ["Not a multi-day itinerary. Single guided run session as described above."],
    included: [NOT_STATED],
    excluded: [NOT_STATED],
    image: "/images/road-to-simien.jpg",
    imageAlt: "Highland paths in the countryside around Gondar",
  },
  {
    slug: "timkat-simien",
    name: "Timkat & Simien Mountains",
    duration: "Suggested 6 Days / 5 Nights",
    route: "Gondar (Timkat) → Simien Mountains → Gondar",
    difficulty: "Not stated in source",
    heroTitle: "Timkat",
    heroAccent: "then the mountains.",
    overview: [
      "Festival and mountain journey: Timkat in Gondar (festival date noted in source: January 19, 2027), then Simien landscapes, escarpments, Geladas and possible Imet Gogo / Geech area. Festival schedules and access can change; final itineraries confirmed closer to departure.",
    ],
    highlights: [
      "Living Timkat culture then wild mountains",
      "Ketera (Tabots procession) on Timkat eve; Timkat day ceremonies",
      "Flexible Simien days after the festival",
    ],
    itineraryMode: "days",
    days: [
      {
        title: "Arrive in Gondar",
        subtitle: "Orientation and festival briefing",
        overnight: "Gondar",
        paragraphs: ["Hotel; orientation; traditional dinner; festival briefing; overnight Gondar."],
      },
      {
        title: "Gondar & Timkat eve",
        subtitle: "Ketera",
        overnight: "Gondar",
        paragraphs: ["Historic Gondar sites; afternoon/evening Ketera; overnight Gondar."],
      },
      {
        title: "Timkat in Gondar",
        subtitle: "Main festival day",
        overnight: "Gondar",
        paragraphs: ["Early morning ceremonies, music, chanting, processions; local interpretation; overnight Gondar."],
      },
      {
        title: "Gondar → Simien",
        subtitle: "Via Debark",
        overnight: "Simien",
        paragraphs: ["Via Debark; landscapes, escarpments, Geladas, viewpoints, short walks as timing allows; overnight Simien."],
      },
      {
        title: "Simien mountain experience",
        subtitle: "Route adapted",
        overnight: "Simien",
        paragraphs: [
          "Possible Imet Gogo, Geech area, highland scenery, Geladas, giant lobelia, escarpment viewpoints; route adapted; overnight Simien.",
        ],
      },
      {
        title: "Simien → Gondar",
        subtitle: "Return",
        paragraphs: ["Final morning; return; airport/hotel or extensions (Lalibela, Axum, more trekking)."],
      },
    ],
    included: [NOT_STATED],
    excluded: [NOT_STATED],
    includedNote: "Not stated in source as a Timkat-specific inclusion list.",
    image: "/images/fasil-ghebbi.jpg",
    imageAlt: "Historic stone architecture in Gondar",
  },
  {
    slug: "timkat-ras-dashen",
    name: "Timkat & Ras Dashen",
    duration: "Suggested 8–10 Days",
    route: "Timkat in Gondar → multi-day Simien trek toward Ras Dashen",
    difficulty: "Positioned as Adventure Festival Journey (demanding)",
    heroTitle: "Timkat & Ras Dashen",
    heroAccent: "festival to summit.",
    overview: [
      "Combine Timkat in Gondar with a multi-day Simien trek toward Ras Dashen — festival to the roof of Ethiopia. Demanding adventure festival journey.",
    ],
    highlights: [
      "Festival in Gondar plus summit-oriented Simien trek",
      "Adventure festival positioning",
    ],
    itineraryMode: "outline",
    outline: ["Day-by-day not stated in source."],
    included: [NOT_STATED],
    excluded: [NOT_STATED],
    image: "/images/giant-lobelia.jpg",
    imageAlt: "Giant lobelias across the high Afroalpine landscape of the Simien Mountains",
  },
  {
    slug: "genna-simien",
    name: "Genna & Simien",
    duration: "Suggested 6–8 Days",
    route: "Gondar → Genna experience → Simien Mountains → Gondar",
    difficulty: "Not stated in source",
    heroTitle: "Genna",
    heroAccent: "and Simien.",
    overview: [
      "Ethiopian Christmas (Genna), celebrated January 7, combined with a Simien journey. Source positions it as a quieter cultural experience before Timkat crowds.",
    ],
    highlights: [
      "Genna atmosphere and cultural experiences",
      "Follow-on Simien mountains programme",
    ],
    itineraryMode: "outline",
    outline: ["Day-by-day not stated in source."],
    included: [NOT_STATED],
    excluded: [NOT_STATED],
    image: "/images/fasil-ghebbi.jpg",
    imageAlt: "Historic stone architecture in Gondar",
  },
  {
    slug: "meskel-simien",
    name: "Meskel & Simien",
    duration: "Not stated (September festival journey)",
    route: "Gondar → Meskel experience → Simien Mountains → Gondar",
    difficulty: "Not stated in source",
    heroTitle: "Meskel",
    heroAccent: "and Simien.",
    overview: [
      "Combine Meskel celebration with Gondar and Simien: traditional celebrations, local culture and the beginning of the Ethiopian highland season. Source notes Meskel falls on September 27 in 2026 and September 28 in 2027.",
    ],
    highlights: [
      "Fire, culture and mountains",
      "September highland-season context",
    ],
    itineraryMode: "outline",
    outline: ["Day-by-day not stated in source."],
    included: [NOT_STATED],
    excluded: [NOT_STATED],
    image: "/images/geech-camp.jpg",
    imageAlt: "Tents on a high plateau in the Simien Mountains",
  },
  {
    slug: "mountains-sacred-stone",
    name: "Mountains & Sacred Stone — Gondar + Simien + Lalibela",
    duration: "7–9 Days · Private Journey",
    route: "Gondar → Simien → Lalibela",
    difficulty: "Moderate",
    heroTitle: "Mountains",
    heroAccent: "and sacred stone.",
    overview: [
      "Private combination: imperial Gondar, Simien wildlife and trekking, then Lalibela’s rock-hewn churches. Source arc: Royal Ethiopia · Wild Ethiopia · Sacred Ethiopia. Optional Yemrehanna Kristos where practical.",
    ],
    highlights: [
      "Gondar heritage, Simien mountains, Lalibela churches in one private journey",
      "Optional Yemrehanna Kristos extension",
    ],
    itineraryMode: "days",
    days: [
      {
        title: "Welcome to Gondar",
        subtitle: "Arrival",
        overnight: "Gondar",
        paragraphs: ["Arrival; meet Tevan; coffee; orientation."],
      },
      {
        title: "Imperial Gondar",
        subtitle: "Royal sites and the living city",
        overnight: "Gondar",
        paragraphs: ["Fasil Ghebbi; Fasilides’ Bath; Debre Berhan Selassie; Gondar after the monuments."],
      },
      {
        title: "Into Simien",
        subtitle: "Gondar → Debark → Simien",
        overnight: "Mountains",
        paragraphs: ["Sankaber/suitable start; afternoon walk; Gelada; sunset; overnight mountains."],
      },
      {
        title: "Gelada country",
        subtitle: "Walking day",
        overnight: "Mountains",
        paragraphs: ["Walking day — Gelada, escarpment, vegetation, viewpoints, villages, photography."],
      },
      {
        title: "The great Simien",
        subtitle: "Corridor adapted to conditions",
        overnight: "Mountains",
        paragraphs: ["Geech / Imet Gogo / Chennek corridor adapted to conditions."],
      },
      {
        title: "Simien → Lalibela",
        subtitle: "Transition",
        overnight: "Lalibela",
        paragraphs: ["Transition by practical road/air; evening slow."],
      },
      {
        title: "Lalibela: the churches",
        subtitle: "Principal rock-hewn complexes",
        overnight: "Lalibela",
        paragraphs: ["Principal rock-hewn complexes with a local guide."],
      },
      {
        title: "Lalibela beyond the checklist",
        subtitle: "Culture, coffee, optional extension",
        overnight: "Lalibela",
        paragraphs: [
          "Morning religious/cultural; additional churches; community; coffee; optional countryside; optional Yemrehanna Kristos.",
        ],
      },
      {
        title: "Departure",
        subtitle: "Onward transfer",
        paragraphs: [
          "Onward transfer. For 7–8 day versions: compress or drop days per quotation — exact short versions not stated beyond 7–9 day range.",
        ],
      },
    ],
    included: [NOT_STATED],
    excluded: [NOT_STATED],
    includedNote: "Not stated in source as a dedicated Mountains & Sacred Stone inclusion list. Closest related blocks are Gondar + Simien and northern combination packages; confirm exact inclusions in the private quotation.",
    image: "/images/tevan-founder.jpg",
    imageAlt: "A local guide sharing the landscape and stories of northern Ethiopia",
  },
];
