export type JourneyItineraryMode = "days" | "segments" | "outline";

export type JourneyDay = {
  title: string;
  subtitle: string;
  paragraphs: string[];
  overnight?: string;
  dayLabel?: string;
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
  itineraryIntro?: string;
  itineraryNotes?: string[];
  days?: JourneyDay[];
  segments?: JourneySegment[];
  outline?: string[];
  included: string[];
  excluded: string[];
  includedNote?: string;
  image: string;
  imageAlt: string;
};

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
    "slug": "simien-day-trip",
    "name": "Simien Mountains Day Trip / Simien in a Day",
    "duration": "1 Day",
    "route": "Gondar → Debark → Simien Mountains → Gondar",
    "difficulty": "Easy to Moderate (walking adjustable)",
    "heroTitle": "Simien in a Day",
    "heroAccent": "from Gondar.",
    "overview": [
      "A one-day introduction to Simien Mountains National Park from Gondar. Travel north via Debark for park arrangements, then short mountain walks, escarpment viewpoints and time in known Gelada habitat. Designed for travellers with limited time who still want to leave the vehicle and spend time in the highlands. Walking difficulty is adjusted to the group."
    ],
    "highlights": [
      "One-day taste of Simien from Gondar",
      "Escarpment viewpoints (route-dependent; Sankaber / western escarpment)",
      "Time for Gelada observation if a troop is found (not guaranteed)",
      "Short guided walks adjusted to the group",
      "Mountain lunch with highland views"
    ],
    "itineraryMode": "segments",
    "included": [
      "Private transportation from Gondar to Simien and return; hotel pickup and drop-off in Gondar",
      "Professional English-speaking local guide; driver and fuel",
      "Simien National Park entrance fee / park arrangements; required park scout/ranger",
      "Lunch; drinking water according to the day’s arrangement; tea/coffee where included in the itinerary",
      "Short guided walks according to the agreed programme; wildlife and landscape interpretation",
      "Pre-trip planning and coordination"
    ],
    "excluded": [
      "International and domestic flights; visa/eVisa; travel insurance",
      "Personal trekking equipment; personal snacks and drinks; alcohol; tips; personal purchases",
      "Optional activities; any service not specifically listed in the quotation"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789386871/Sankaber.jpg",
    "imageAlt": "Layered cliffs and green valleys near Sankaber in the Simien Mountains",
    "segments": [
      {
        "label": "Morning",
        "body": "Hotel pickup in Gondar (typically around 06:30); briefing with your guide"
      },
      {
        "label": "Gondar → Debark",
        "body": "Highland road with farming, villages and geography commentary (~100 km; often up to around two hours)"
      },
      {
        "label": "Debark → park",
        "body": "Park arrangements; continue into Simien Mountains National Park as escarpments open"
      },
      {
        "label": "Gelada / walk",
        "body": "Observe if a troop is found; short Simien walk; possible viewpoints around Sankaber and the western escarpment"
      },
      {
        "label": "Lunch",
        "body": "Mountain lunch with a view"
      },
      {
        "label": "Afternoon",
        "body": "Further wildlife and landscape time as conditions allow (Gelada, Walia ibex, highland birds, giant lobelia — none guaranteed)"
      },
      {
        "label": "Return",
        "body": "Via Debark to Gondar by evening"
      }
    ]
  },
  {
    "slug": "gelada-country",
    "name": "Gelada Country (1 Day)",
    "duration": "1 Day / Private or Small Group",
    "route": "Gondar → Debark → western Simien escarpment (Gelada habitat) → Gondar",
    "difficulty": "Easy to Moderate",
    "heroTitle": "Gelada Country",
    "heroAccent": "one day.",
    "overview": [
      "A one-day programme built around time in Gelada country rather than a fixed checklist of viewpoints. Emphasis is on observation time, escarpment walking, birdlife and photography. Pacing is deliberately flexible so the group can stay with wildlife when conditions allow. Wildlife sightings are never guaranteed."
    ],
    "highlights": [
      "Extended observation time in known Gelada habitat",
      "Escarpment walking and highland birdlife",
      "Flexible pacing for wildlife watching",
      "Photography opportunities when light and animals cooperate"
    ],
    "itineraryMode": "segments",
    "included": [
      "Private transportation from Gondar; return from Simien; hotel pickup and drop-off",
      "Professional local wildlife/trekking guide; driver and fuel",
      "Simien National Park entrance fee; required park scout/ranger",
      "Lunch; drinking water",
      "Guided wildlife walks; wildlife interpretation",
      "Pre-trip planning and coordination"
    ],
    "excluded": [
      "International and domestic flights; visa/eVisa; travel insurance",
      "Personal trekking equipment; personal snacks and drinks; alcohol; tips; personal purchases; optional activities"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789400264/Gelada-Country.png",
    "imageAlt": "A gelada sitting above green valleys in the Simien Mountains",
    "segments": [
      {
        "label": "Morning",
        "body": "Pickup in Gondar; transfer north via Debark; park arrangements"
      },
      {
        "label": "Late morning – midday",
        "body": "Guided walks in known Gelada habitat along the western escarpment; time to observe and photograph if troops are present"
      },
      {
        "label": "Lunch",
        "body": "Packed or picnic lunch in the mountains"
      },
      {
        "label": "Afternoon",
        "body": "Continue wildlife and landscape walking as conditions allow; birdlife and cliff scenery"
      },
      {
        "label": "Evening",
        "body": "Return via Debark to Gondar"
      }
    ]
  },
  {
    "slug": "simien-introduction",
    "name": "Simien Introduction (2 Days / 1 Night)",
    "duration": "2 Days / 1 Night",
    "route": "Gondar → Debark → Simien → Sankaber / surrounding trekking area → Gondar",
    "difficulty": "Moderate",
    "heroTitle": "Simien Introduction",
    "heroAccent": "one mountain night.",
    "overview": [
      "An overnight mountain introduction: park entry via Debark, escarpment walking around Sankaber and the surrounding trekking area, time in Gelada habitat, highland scenery, sunset, camp life and morning atmosphere before returning to Gondar. Ideal for travellers who want more than a day trip without committing to a multi-day classic corridor."
    ],
    "highlights": [
      "Overnight camping in the mountains",
      "Escarpment walking and highland scenery",
      "Gelada habitat time (sightings not guaranteed)",
      "Sunset and morning camp atmosphere",
      "First night under the Simien sky"
    ],
    "itineraryMode": "days",
    "included": [
      "Private transportation Gondar–Simien–return; Gondar pickup/drop-off",
      "Professional English-speaking trekking guide; park scout/ranger",
      "Simien National Park entrance fee; required trekking/camping permits",
      "Camping accommodation; trekking tents; sleeping mattresses; camping and camp kitchen equipment; cook/camp support",
      "Mule support for agreed group equipment",
      "Breakfast, lunch, dinner; drinking water according to confirmed arrangement; tea and coffee during camping",
      "Trekking support; pre-trip briefing; packing guidance"
    ],
    "excluded": [
      "International and domestic flights; visa/eVisa; travel insurance",
      "Personal sleeping bag unless specifically included; personal trekking equipment",
      "Alcohol; personal snacks/extra drinks; laundry; SIM/data/roaming; tips; personal expenses",
      "Medical treatment/evacuation; optional activities"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789386871/Sankaber.jpg",
    "imageAlt": "Layered cliffs and green valleys near Sankaber in the Simien Mountains",
    "days": [
      {
        "title": "Gondar to Sankaber",
        "subtitle": "",
        "paragraphs": [
          "Morning departure from Gondar (~2,200 m) via Debark for park arrangements. Enter Simien Mountains National Park and begin walking on the western approach toward Sankaber (~3,200–3,250 m). Escarpment views, possible Gelada encounters, and an afternoon walk near camp. Sunset at or near camp when weather allows. Overnight Sankaber Camp (or nearby designated camping area). Meals: lunch and dinner."
        ],
        "overnight": "Sankaber Camp (or nearby designated camping area)"
      },
      {
        "title": "Highlands and return to Gondar",
        "subtitle": "",
        "paragraphs": [
          "Early morning light and wildlife time around Sankaber. Short guided walk before packing camp. Meet the vehicle and return via Debark to Gondar by afternoon or early evening. Meals: breakfast and lunch."
        ]
      }
    ]
  },
  {
    "slug": "3-day-simien-trek",
    "name": "3-Day Simien Mountains Trekking Adventure",
    "duration": "3 Days / 2 Nights",
    "route": "Gondar → Sankaber → Geech → Imet Gogo → Gondar",
    "difficulty": "Moderate to Challenging",
    "heroTitle": "Three days",
    "heroAccent": "to Imet Gogo.",
    "overview": [
      "A three-day trek into the western classic corridor as far as Imet Gogo (~3,926 m), with overnight camps at Sankaber and Geech. The itinerary does not reach Chenek; travellers who specifically want Chenek should choose the 4-Day Classic. Possible start from Buyit Ras; road pickup often in the Ambaras area after Imet Gogo."
    ],
    "highlights": [
      "Simien Mountains National Park escarpments and deep valleys",
      "Wild Gelada baboons; possibility of Walia ibex (not guaranteed)",
      "Jinbar Waterfall & Geech Abyss",
      "Giant lobelia; Imet Gogo ~3,926 m",
      "Two nights mountain camping; highland villages",
      "Gondar gateway"
    ],
    "itineraryMode": "days",
    "included": [
      "Private Gondar–Simien–Gondar transportation; professional English-speaking trekking guide",
      "Park entrance fee; required trekking permits; camping fees; park scout/ranger",
      "Trekking tents; sleeping mattresses; dining/cooking equipment; camping crew; cook",
      "Mule support for agreed luggage/equipment",
      "Breakfast each trekking morning; lunch/packed lunch; dinner; drinking water per confirmed arrangement; tea and coffee",
      "Guided trekking; wildlife and landscape interpretation; pre-trek briefing; packing guidance; pickup/drop-off"
    ],
    "excluded": [
      "International and domestic flights; visa/eVisa; travel insurance",
      "Personal sleeping bag unless specifically stated; personal trekking equipment",
      "Alcohol; personal snacks and extra drinks; laundry; communications costs; tips; personal purchases",
      "Medical/evacuation costs; optional activities"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789397557/imet-gogo.png",
    "imageAlt": "Cliffs and deep valleys seen from Imet Gogo",
    "days": [
      {
        "title": "Gondar to Sankaber",
        "subtitle": "",
        "paragraphs": [
          "Gondar ~2,200 m; Sankaber ~3,250 m; drive approximately 100–105 km to Debark/park area; walking approximately 5–13 km. Possible start from Buyit Ras toward Sankaber; Geladas often gather along the escarpment; overnight Sankaber Camp. Meals: lunch & dinner."
        ],
        "overnight": "Sankaber Camp"
      },
      {
        "title": "Sankaber to Geech",
        "subtitle": "",
        "paragraphs": [
          "Sankaber ~3,250 m; Geech ~3,600 m; approximately 12–15 km; ~5–7 hours. Follow the escarpment; Jinbar Waterfall into Geech Abyss; climb to Geech; optional sunset viewpoint; overnight Geech Camp. Meals: breakfast, lunch & dinner."
        ],
        "overnight": "Geech Camp"
      },
      {
        "title": "Geech to Imet Gogo & return to Gondar",
        "subtitle": "",
        "paragraphs": [
          "Geech ~3,600 m; Imet Gogo ~3,926 m; walking approximately 10–17 km; ~5–8 hours. Climb to Imet Gogo for panoramic views; continue to road pickup often in the Ambaras area; return to Gondar. Meals: breakfast & lunch."
        ]
      }
    ]
  },
  {
    "slug": "4-day-simien-classic",
    "name": "4-Day Simien Classic Trek",
    "duration": "4 Days / 3 Nights",
    "route": "Gondar → Sankaber → Geech → Imet Gogo → Chenek → Gondar",
    "difficulty": "Moderate to Challenging",
    "heroTitle": "The Simien Classic",
    "heroAccent": "to Chenek.",
    "overview": [
      "The signature classic corridor trek: Sankaber, Geech, Imet Gogo and Chenek, with optional Bwahit-area morning hike on the final day. Walking distance approximately 30–45 km depending on route and optional hikes. This is the core Simien product for travellers who want the full western escarpment circuit without a summit attempt."
    ],
    "highlights": [
      "Simien Mountains National Park; Gelada baboons; Walia ibex (habitat; sightings not guaranteed)",
      "Jinbar Waterfall; Imet Gogo; Chenek; Bwahit landscape (optional)",
      "Highland villages; mountain camping; Gondar cultural context at start/end",
      "Walking distance approximately 30–45 km depending on options"
    ],
    "itineraryMode": "days",
    "included": [
      "Private transportation Gondar–Simien–return; professional English-speaking local trekking guide",
      "Park entrance fee; required trekking/camping permits; park scout/ranger",
      "Trekking tents; sleeping mattresses; dining tent where required; cooking and camp equipment",
      "Professional trekking cook; camp support crew; mule support",
      "Breakfast, lunch, dinner; drinking water per confirmed arrangement; tea and coffee during camping",
      "All agreed trekking support; pre-trip briefing; packing guidance; pickup/drop-off"
    ],
    "excluded": [
      "International and domestic flights; visa/eVisa; travel insurance",
      "Personal sleeping bag unless stated; personal trekking gear",
      "Alcohol; personal snacks/extra drinks; laundry; SIM/data/roaming; tips; personal shopping",
      "Medical treatment; emergency evacuation; optional activities"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789386843/cheenk-camp.jpg",
    "imageAlt": "Travellers sharing an outdoor meal at Chenek camp",
    "days": [
      {
        "title": "Gondar to Sankaber",
        "subtitle": "",
        "paragraphs": [
          "Gondar ~2,200 m; Sankaber ~3,250 m; drive ~100 km; walking approximately 5–13 km depending on trail. After breakfast travel north toward Debark for park arrangements; begin walking into the highlands; Gelada often gather; overnight Sankaber Camp."
        ],
        "overnight": "Sankaber Camp"
      },
      {
        "title": "Sankaber to Geech",
        "subtitle": "",
        "paragraphs": [
          "Altitude ~3,250–3,600 m; walking approximately 10–14 km; ~5–7 hours. Follow the escarpment toward Geech; descend toward Jinbar River; Jinbar Waterfall highlight; climb toward Geech; overnight Geech Camp."
        ],
        "overnight": "Geech Camp"
      },
      {
        "title": "Geech to Chenek via Imet Gogo",
        "subtitle": "",
        "paragraphs": [
          "Highest point ~3,926 m; walking approximately 15–17 km; ~7–9 hours. Climb to Imet Gogo; continue toward Chenek across highland ridges; Gelada and possible Walia ibex; overnight Chenek Camp."
        ],
        "overnight": "Chenek Camp"
      },
      {
        "title": "Chenek & return to Gondar",
        "subtitle": "",
        "paragraphs": [
          "Chenek ~3,620 m. Morning around Chenek; optional morning hike toward Bwahit area according to fitness, weather and time; meet vehicle and return to Gondar via Debark."
        ]
      }
    ]
  },
  {
    "slug": "5-day-gondar-simien",
    "name": "5-Day Royal City & Mountain Adventure",
    "duration": "5 Days / 4 Nights",
    "route": "Gondar → Debark → Sankaber → Geech → Imet Gogo → Chenek → Gondar",
    "difficulty": "Moderate to Challenging",
    "heroTitle": "Royal city",
    "heroAccent": "and mountain adventure.",
    "overview": [
      "Combines a Gondar heritage day with three days of Simien trekking to Chenek. Hotel accommodation in Gondar plus camping in Simien. Day 4 routes Geech → Imet Gogo → Inatye → Chenek. Designed for travellers who want both imperial Gondar and the classic mountain corridor in one journey."
    ],
    "highlights": [
      "Royal Gondar and wild Simien in one journey",
      "Time to walk rather than rush viewpoints",
      "Wildlife in natural habitat (no guarantees)",
      "Local guide interpretation throughout",
      "Hotel night in Gondar plus three mountain camp nights"
    ],
    "itineraryMode": "days",
    "included": [
      "Airport pickup in Gondar; private transportation according to itinerary",
      "Professional English-speaking local guide; Simien Mountains National Park entrance arrangements; park scout",
      "Camping equipment; camping crew/cook; trekking meals during the mountain section",
      "Accommodation in Gondar; camping in Simien",
      "All planned trekking and sightseeing activities; Gondar city sightseeing; local assistance throughout"
    ],
    "excluded": [
      "International flights; domestic flights to/from Gondar unless specifically requested",
      "Personal expenses; alcoholic drinks; tips; travel insurance; personal trekking equipment",
      "Expenses caused by circumstances outside operator control"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789397558/Inatye.png",
    "imageAlt": "Steep cliffs above green slopes near Inatye",
    "days": [
      {
        "title": "Arrive in Gondar",
        "subtitle": "",
        "paragraphs": [
          "~2,200 m. Airport meet; hotel check-in; visit Fasil Ghebbi and other sites per arrival time; trek briefing; overnight Gondar hotel."
        ],
        "overnight": "Gondar hotel"
      },
      {
        "title": "Gondar → Debark → Sankaber",
        "subtitle": "",
        "paragraphs": [
          "Drive ~100 km to Debark; trekking altitude around 3,250 m. Park formalities; walk around Buyit Ras/Sankaber; Geladas; overnight camping Sankaber."
        ],
        "overnight": "Sankaber"
      },
      {
        "title": "Sankaber → Jinbar Waterfall → Geech",
        "subtitle": "",
        "paragraphs": [
          "~3,250–3,600 m; full day. Escarpment; Jinbar Waterfall; giant lobelia; optional sunset walk; overnight camping Geech."
        ],
        "overnight": "Geech"
      },
      {
        "title": "Geech → Imet Gogo → Inatye → Chenek",
        "subtitle": "",
        "paragraphs": [
          "Up to approximately 4,000 m+; overnight Chenek ~3,600 m. Imet Gogo; Inatye; wildlife including Gelada/Walia; Ethiopian wolf possible but not guaranteed."
        ],
        "overnight": "Chenek"
      },
      {
        "title": "Chenek → Gondar",
        "subtitle": "",
        "paragraphs": [
          "Optional short morning walk; return via Debark to Gondar. Meals: breakfast & lunch."
        ]
      }
    ]
  },
  {
    "slug": "gondar-heritage-simien",
    "name": "Gondar, Heritage & Simien (5 Days)",
    "duration": "5 Days / 4 Nights",
    "route": "Gondar → Woleka → Debark → Simien → Gondar (Royal Heritage · Woleka · Simien · Wildlife · Local Life)",
    "difficulty": "Flexible; Day 4 adapted to fitness (active or more accessible options)",
    "heroTitle": "Heritage",
    "heroAccent": "then the highlands.",
    "overview": [
      "Culture-forward five-day arc: empire and living Gondar, Woleka heritage stop, then flexible Simien mountain days. Distinct from the trek-heavy Royal City & Mountain Adventure. Suitable for travellers who want heritage depth with adaptable mountain walking rather than a fixed classic corridor push to Chenek every day."
    ],
    "highlights": [
      "Empire → culture → highlands → wilderness arc",
      "Royal city sites plus living Gondar (food, coffee)",
      "Woleka (Beta Israel heritage associations)",
      "Flexible Simien day (active or more accessible)",
      "Extension options toward Lalibela, Axum, Bahir Dar or longer mountain programmes"
    ],
    "itineraryMode": "days",
    "included": [
      "Private transportation; professional local guide",
      "Gondar sightseeing according to itinerary; applicable Gondar attraction entrance fees",
      "Simien National Park entrance fee; required scout/ranger; trekking permits",
      "Camping or accommodation according to itinerary; camping equipment where applicable",
      "Meals according to itinerary; drinking water according to itinerary",
      "Mule support and cook/camp crew where required",
      "Pre-trip planning and local coordination"
    ],
    "excluded": [
      "International and domestic flights; visa; insurance; personal equipment",
      "Alcohol; personal snacks/extra drinks; tips; personal shopping; optional activities",
      "Extra hotel nights; services not stated in the quotation"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789392021/woleka-beta-israel.png",
    "imageAlt": "Woleka Beta Israel heritage site near Gondar",
    "days": [
      {
        "title": "Welcome to Gondar",
        "subtitle": "",
        "paragraphs": [
          "Gentle city introduction; café time; evening briefing; overnight Gondar."
        ],
        "overnight": "Gondar"
      },
      {
        "title": "Walking through history",
        "subtitle": "",
        "paragraphs": [
          "Fasil Ghebbi; Debre Berhan Selassie; Kuskuam; then living city — food and coffee; overnight Gondar."
        ],
        "overnight": "Gondar"
      },
      {
        "title": "Beyond the city",
        "subtitle": "",
        "paragraphs": [
          "Woleka heritage stop; Debark; enter Simien; short walks, viewpoints and Gelada time as conditions allow; overnight Simien Mountains."
        ],
        "overnight": "Simien Mountains"
      },
      {
        "title": "Wild heart of Simien",
        "subtitle": "",
        "paragraphs": [
          "Active option toward Geech / Imet Gogo / escarpment / Geladas; or more accessible scenic drives, viewpoints, short walks, possibly Chenek area; overnight Simien Mountains."
        ],
        "overnight": "Simien Mountains"
      },
      {
        "title": "Road back",
        "subtitle": "",
        "paragraphs": [
          "Final morning walk or viewpoint; Simien → Debark → Gondar; airport transfer or onward extensions as arranged."
        ]
      }
    ]
  },
  {
    "slug": "ras-dashen-challenge",
    "name": "Ras Dashen Challenge",
    "duration": "5 Days / 4 Nights (approach ends Ambiko); 6 Days / 5 Nights available with return via Chenek",
    "route": "Gondar → Sankaber → Geech → Chenek → Ambiko → Ras Dashen",
    "difficulty": "Challenging",
    "heroTitle": "Ras Dashen",
    "heroAccent": "the challenge.",
    "overview": [
      "Summit-focused Simien trek: classic corridor into Chenek, then Bwahit Pass (~4,200 m), Meseha Valley and Ambiko base (~3,200 m) for a Ras Dashen (Ras Dejen) summit attempt. This is a mountain challenge rather than sightseeing. The detailed 5-day itinerary ends at Ambiko after the summit day; return or acclimatisation days are added when booking the 6-day Challenge or a longer expedition so the group can descend via Chenek and transfer to Gondar. Summit success cannot be guaranteed; safety conditions determine the final summit decision."
    ],
    "highlights": [
      "Summit attempt on Ethiopia’s highest mountain",
      "Classic Simien landscapes then high-altitude Ambiko / Ras Dashen route",
      "Key points: Sankaber, Geech, Imet Gogo, Chenek, Bwahit Pass, Meseha Valley, Ambiko, Ras Dashen",
      "Full mountain camping support"
    ],
    "itineraryMode": "days",
    "included": [
      "Gondar–Simien transportation; transportation to/from agreed trekking route",
      "Professional English-speaking trekking guide; park entrance fees; required permits; park scout/ranger",
      "Camping throughout; trekking tents; sleeping mattresses; dining/cooking equipment",
      "Professional cook; camping support crew; mule support; mule handlers",
      "Breakfast, lunch, dinner; drinking water per confirmed arrangement; tea and coffee",
      "Ras Dashen summit attempt; route guidance and mountain interpretation",
      "Pre-trek briefing; packing guidance; Gondar coordination"
    ],
    "excluded": [
      "International and domestic flights; visa/eVisa; travel insurance; high-altitude medical/evacuation insurance",
      "Personal sleeping bag unless stated; personal trekking equipment",
      "Alcohol; personal snacks/extra drinks; laundry; communications; tips; personal purchases",
      "Medical treatment; emergency evacuation; optional activities"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789397607/ras-dashen.png",
    "imageAlt": "A grassy escarpment overlooking the mountains on the Ras Dashen route",
    "itineraryIntro": "Detailed 5-Day approach (ends Ambiko after summit)",
    "itineraryNotes": [
      "Return / acclimatisation note: On the 5-day detailed approach, Day 5 ends at Ambiko. Bookings that require vehicle return to Gondar add descent and transfer days (as on the 6-day Challenge: return toward Chenek → Gondar) or continue into a longer expedition. Exact return logistics are confirmed in the quotation."
    ],
    "days": [
      {
        "title": "Gondar to Sankaber",
        "subtitle": "",
        "paragraphs": [
          "~2,200 m → ~3,250 m. Drive through Debark; park arrangements; first escarpment hike; Geladas; overnight Sankaber Camp."
        ],
        "overnight": "Sankaber Camp"
      },
      {
        "title": "Sankaber to Geech",
        "subtitle": "",
        "paragraphs": [
          "Walking ~10–14 km; camp ~3,600 m. Trail toward Geech; Jinbar Waterfall; overnight Geech Camp."
        ],
        "overnight": "Geech Camp"
      },
      {
        "title": "Geech to Chenek",
        "subtitle": "",
        "paragraphs": [
          "Walking ~15–17 km; highest ~3,926 m. Early start for Imet Gogo; continue toward Chenek and Bwahit massif area; overnight Chenek Camp."
        ],
        "overnight": "Chenek Camp"
      },
      {
        "title": "Chenek to Ambiko",
        "subtitle": "",
        "paragraphs": [
          "Walking ~18–20 km; highest pass ~4,200 m; Ambiko ~3,200 m. Cross Bwahit area; descend toward Meseha Valley; climb to Ambiko; summit briefing; overnight Ambiko Camp."
        ],
        "overnight": "Ambiko Camp"
      },
      {
        "title": "Ras Dashen summit",
        "subtitle": "",
        "paragraphs": [
          "Summit approximately 4,500+ m; walking approximately 14–16 km round trip; ~8–10 hours. Pre-sunrise ascent; summit attempt; descent toward Ambiko."
        ]
      }
    ]
  },
  {
    "slug": "ras-dashen-expedition",
    "name": "Ras Dashen Expedition (7 Days)",
    "duration": "7 Days / 6 Nights",
    "route": "Gondar → Sankaber → Geech → Chenek → Ambiko → Ras Dashen → Chenek corridor → Gondar",
    "difficulty": "Challenging",
    "heroTitle": "Ras Dashen Expedition",
    "heroAccent": "seven days.",
    "overview": [
      "A slower Ras Dashen summit product versus the 5–6 day Challenge, designed around acclimatisation, deliberate pacing, extra mountain time and weather flexibility. The additional day/night supports better recovery before or after the summit attempt and allows contingency for high-altitude conditions. Suitable for fit travellers who prefer not to rush the Ambiko approach."
    ],
    "highlights": [
      "Additional trekking day/night versus the Challenge",
      "Extra time for acclimatisation and flexible pacing",
      "Full mountain support throughout the extended itinerary",
      "Classic corridor plus summit attempt with contingency buffer"
    ],
    "itineraryMode": "days",
    "included": [
      "Gondar–Simien transportation; transportation to/from agreed trekking route",
      "Professional English-speaking trekking guide; park entrance fees; required permits; park scout/ranger",
      "Camping throughout; trekking tents; sleeping mattresses; dining/cooking equipment",
      "Professional cook; camping support crew; mule support; mule handlers",
      "Breakfast, lunch, dinner; drinking water per confirmed arrangement; tea and coffee",
      "Ras Dashen summit attempt; route guidance and mountain interpretation",
      "Pre-trek briefing; packing guidance; Gondar coordination",
      "Additional trekking day/night; additional camping night; additional trekking meals",
      "Full mountain support throughout the extended itinerary",
      "Additional time for acclimatisation and flexible pacing where appropriate",
      "Mule and camp support for the additional trekking period"
    ],
    "excluded": [
      "International and domestic flights; visa/eVisa; travel insurance; high-altitude medical/evacuation insurance",
      "Personal sleeping bag unless stated; personal trekking equipment",
      "Alcohol; personal snacks/extra drinks; laundry; communications; tips; personal purchases",
      "Medical treatment; emergency evacuation; optional activities"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789397573/Ambiko.png",
    "imageAlt": "A thatched stone hut on a mountainside near Ambiko",
    "itineraryNotes": [
      "Summit success and exact daily distances depend on weather and group condition; the guide may adjust pacing within this framework."
    ],
    "days": [
      {
        "title": "Gondar to Sankaber",
        "subtitle": "",
        "paragraphs": [
          "Drive via Debark; park arrangements; introductory escarpment hike; overnight Sankaber Camp (~3,250 m)."
        ],
        "overnight": "Sankaber Camp"
      },
      {
        "title": "Sankaber to Geech",
        "subtitle": "",
        "paragraphs": [
          "Escarpment trail; Jinbar Waterfall; overnight Geech Camp (~3,600 m)."
        ],
        "overnight": "Geech Camp"
      },
      {
        "title": "Geech to Chenek via Imet Gogo",
        "subtitle": "",
        "paragraphs": [
          "Early start for Imet Gogo (~3,926 m); continue to Chenek; overnight Chenek Camp (~3,600 m)."
        ],
        "overnight": "Chenek Camp"
      },
      {
        "title": "Chenek (acclimatisation / Bwahit area)",
        "subtitle": "",
        "paragraphs": [
          "Shorter high walk toward the Bwahit massif or rest-and-explore day around Chenek depending on group condition and weather; overnight Chenek Camp."
        ],
        "overnight": "Chenek Camp"
      },
      {
        "title": "Chenek to Ambiko",
        "subtitle": "",
        "paragraphs": [
          "Cross Bwahit Pass (~4,200 m); descend toward Meseha Valley; climb to Ambiko (~3,200 m); summit briefing; overnight Ambiko Camp."
        ],
        "overnight": "Ambiko Camp"
      },
      {
        "title": "Ras Dashen summit → Ambiko",
        "subtitle": "",
        "paragraphs": [
          "Pre-sunrise departure; summit attempt (~4,500+ m; ~14–16 km round trip; ~8–10+ hours); return to Ambiko; overnight Ambiko Camp."
        ],
        "overnight": "Ambiko Camp"
      },
      {
        "title": "Ambiko toward Chenek / Gondar",
        "subtitle": "",
        "paragraphs": [
          "Descend and transfer according to agreed return route (typically toward the Chenek road corridor) and continue to Gondar."
        ]
      }
    ]
  },
  {
    "slug": "simien-ras-dashen-8-day",
    "name": "Simien & Ras Dashen (8 Days)",
    "duration": "8 Days / 7 Nights",
    "route": "Gondar → Sankaber → Geech → Imet Gogo → Chenek → Bwahit → Ambiko → Ras Dashen → return corridor → Gondar",
    "difficulty": "Challenging",
    "heroTitle": "Simien & Ras Dashen",
    "heroAccent": "eight days.",
    "overview": [
      "Eight-day product combining central Simien highlights (Geech, Jinbar Falls, Imet Gogo, Chenek, Bwahit) with Ambiko and a Ras Dashen summit attempt. The extra days versus the Challenge allow fuller enjoyment of the classic escarpment before committing to the summit approach — see the Simien properly, then climb."
    ],
    "highlights": [
      "Central Simien corridor plus summit attempt",
      "Destinations: Geech, Jinbar Falls, Imet Gogo, Chenek, Bwahit, Ambiko, Ras Dashen",
      "Balanced pacing between viewpoints and high mountain days",
      "Full camping support throughout"
    ],
    "itineraryMode": "days",
    "included": [
      "Gondar–Simien transportation; return/end-of-route transportation according to itinerary",
      "Professional trekking guide; park entrance fees; required trekking permits; park scout/ranger",
      "Camping throughout; trekking tents; sleeping mattresses; dining/cooking equipment",
      "Professional cook; camp support crew; mule support; mule handlers",
      "Breakfast, lunch, dinner; drinking water per confirmed arrangement; tea and coffee",
      "Ras Dashen summit attempt; route guidance; wildlife and landscape interpretation",
      "Pre-trek briefing; packing guidance"
    ],
    "excluded": [
      "International and domestic flights; visa/eVisa; travel insurance",
      "Personal sleeping bag unless stated; personal trekking equipment",
      "Alcohol; personal snacks/extra drinks; laundry; communications; tips; personal expenses",
      "Medical treatment; emergency evacuation; optional services"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789397585/Bwahit.png",
    "imageAlt": "Rocky ridges and open highland terrain around Bwahit",
    "days": [
      {
        "title": "Gondar to Sankaber",
        "subtitle": "",
        "paragraphs": [
          "Via Debark; park entry; escarpment walk; overnight Sankaber Camp."
        ],
        "overnight": "Sankaber Camp"
      },
      {
        "title": "Sankaber to Geech",
        "subtitle": "",
        "paragraphs": [
          "Jinbar Waterfall; Afro-alpine approach; overnight Geech Camp."
        ],
        "overnight": "Geech Camp"
      },
      {
        "title": "Geech to Imet Gogo area / Chenek approach",
        "subtitle": "",
        "paragraphs": [
          "Full viewpoint day focused on Imet Gogo and surrounding escarpment; overnight toward Chenek corridor (Geech or Chenek per pacing)."
        ],
        "overnight": "Geech or Chenek per pacing"
      },
      {
        "title": "Into Chenek",
        "subtitle": "",
        "paragraphs": [
          "Complete approach to Chenek; wildlife time in known Walia and Gelada habitat; overnight Chenek Camp."
        ],
        "overnight": "Chenek Camp"
      },
      {
        "title": "Chenek to Ambiko",
        "subtitle": "",
        "paragraphs": [
          "Bwahit Pass (~4,200 m); Meseha Valley; Ambiko base (~3,200 m); overnight Ambiko Camp."
        ],
        "overnight": "Ambiko Camp"
      },
      {
        "title": "Ras Dashen summit",
        "subtitle": "",
        "paragraphs": [
          "Pre-sunrise summit attempt; return to Ambiko; overnight Ambiko Camp."
        ],
        "overnight": "Ambiko Camp"
      },
      {
        "title": "Ambiko toward Chenek corridor",
        "subtitle": "",
        "paragraphs": [
          "Descent and transfer toward the western road network; overnight camping or lodge as confirmed."
        ],
        "overnight": "Camping or lodge as confirmed"
      },
      {
        "title": "Return to Gondar",
        "subtitle": "",
        "paragraphs": [
          "Final transfer via Debark to Gondar."
        ]
      }
    ]
  },
  {
    "slug": "10-day-simien-ras-dashen",
    "name": "10-Day Simien Mountains & Ras Dashen Expedition",
    "duration": "10 Days / 9 Nights",
    "route": "Gondar → Sankaber → Geech → Imet Gogo → Chenek → Ambiko → Ras Dashen → Sona → Mekarebya → Mulit → Adi Arkay → Gondar",
    "difficulty": "Challenging",
    "heroTitle": "The full Simien",
    "heroAccent": "crossing.",
    "overview": [
      "Full Simien crossing: classic corridor, Bwahit Pass, Ambiko, Ras Dashen summit (~4,550 m in this detailed version), then the quieter eastern transect via Sona, Mekarebya and Mulit to Adi Arkay vehicle pickup and return to Gondar. The defining long expedition for travellers who want the summit and the remote side of the range beyond the familiar escarpment circuit."
    ],
    "highlights": [
      "Full Simien crossing beyond the familiar trekking route after summit",
      "Ras Dashen ~4,550 m (this detailed itinerary)",
      "Remote valleys and communities; changing landscapes",
      "Siha Gorge on the great-views day toward Chenek"
    ],
    "itineraryMode": "days",
    "included": [
      "Private transportation from Gondar to the mountains; transportation from Adi Arkay back to Gondar; all agreed ground transfers",
      "Professional English-speaking trekking guide; required park scout/ranger; park entrance fees; trekking and camping permits; camping fees",
      "Trekking tents; sleeping mattresses; dining and cooking equipment; professional cook; camping crew",
      "Mule support; mule handlers; group trekking equipment",
      "Breakfast throughout the trekking programme; lunch/packed lunch; dinner; drinking water per confirmed arrangement; tea and coffee",
      "Ras Dashen summit attempt; pre-trek briefing; packing guidance; route planning and coordination",
      "Wildlife and landscape interpretation; Gondar pickup/drop-off"
    ],
    "excluded": [
      "International and domestic flights; visa/eVisa; travel insurance",
      "Personal sleeping bag unless specifically stated; personal trekking equipment",
      "Alcohol; personal snacks and extra drinks; laundry; SIM/data/roaming; tips; souvenirs/personal shopping",
      "Professional photography/video; medical treatment; emergency evacuation; optional activities",
      "Any service not specifically listed in the final quotation"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789397573/Sona.png",
    "imageAlt": "Grazing animals and fields beneath the mountains near Sona",
    "days": [
      {
        "title": "Arrival in Gondar",
        "subtitle": "",
        "paragraphs": [
          "~2,200 m. Meet guide; possible Royal Enclosure visit; expedition briefing; overnight Gondar hotel."
        ],
        "overnight": "Gondar hotel"
      },
      {
        "title": "Gondar → Debark → Sankaber",
        "subtitle": "",
        "paragraphs": [
          "Drive ~100 km to Debark; Sankaber ~3,200–3,250 m; introductory hike; overnight camping Sankaber."
        ],
        "overnight": "Sankaber"
      },
      {
        "title": "Sankaber → Geech",
        "subtitle": "",
        "paragraphs": [
          "Approximately 14–15 km; Geech ~3,600 m; ~6–8 hours. Jinbar Waterfall area; overnight Geech camp."
        ],
        "overnight": "Geech"
      },
      {
        "title": "Geech → Imet Gogo → Siha Gorge → Chenek",
        "subtitle": "",
        "paragraphs": [
          "Approximately 15–20 km; highest ~3,900 m; Chenek ~3,600 m. Overnight Chenek camp."
        ],
        "overnight": "Chenek"
      },
      {
        "title": "Chenek → Bwahit Pass → Ambiko",
        "subtitle": "",
        "paragraphs": [
          "Approximately 18–20 km; pass ~4,200 m; Ambiko ~3,200 m. Overnight Ambiko camp."
        ],
        "overnight": "Ambiko"
      },
      {
        "title": "Ambiko → Ras Dashen summit → Ambiko",
        "subtitle": "",
        "paragraphs": [
          "Summit ~4,550 m; round-trip ~14–16 km; ~8–10+ hours. Overnight Ambiko camp."
        ],
        "overnight": "Ambiko"
      },
      {
        "title": "Ambiko → Sona",
        "subtitle": "",
        "paragraphs": [
          "Approximately 15–20 km. Continue eastern/lowland side rather than fully retracing; overnight Sona camp."
        ],
        "overnight": "Sona"
      },
      {
        "title": "Sona → Mekarebya",
        "subtitle": "",
        "paragraphs": [
          "Approximately 15–20 km. Quieter Simien; communities and agriculture where appropriate; overnight Mekarebya camp."
        ],
        "overnight": "Mekarebya"
      },
      {
        "title": "Mekarebya → Mulit",
        "subtitle": "",
        "paragraphs": [
          "Approximately 15–20 km. Quieter trekking day along the Incya River corridor; overnight Mulit camp."
        ],
        "overnight": "Mulit"
      },
      {
        "title": "Mulit → Adi Arkay → Gondar",
        "subtitle": "",
        "paragraphs": [
          "Final walk to Adi Arkay; drive to Gondar hotel or airport."
        ]
      }
    ]
  },
  {
    "slug": "simien-wildlife-journey",
    "name": "Simien Wildlife Journey (2–4 Days)",
    "duration": "2–4 Days / Flexible",
    "route": "Gondar → Debark → western Simien corridor (Sankaber / Geech / Chenek areas as conditions allow) → Gondar",
    "difficulty": "Flexible",
    "heroTitle": "Wildlife Journey",
    "heroAccent": "flexible days.",
    "overview": [
      "A flexible 2–4 day journey oriented to wildlife observation rather than a fixed camp checklist. Focus areas include Gelada, Walia ibex where encountered, Ethiopian wolf where encountered, birds, giant lobelia and landscape. Duration and overnight points are confirmed at booking based on fitness, season and wildlife priorities. Sightings are never guaranteed."
    ],
    "highlights": [
      "Wildlife-first pacing with time to observe rather than rush",
      "Flexible duration inside a 2–4 day window",
      "Escarpment habitat for Gelada and highland birds",
      "Optional extension toward Chenek for Walia habitat when time allows"
    ],
    "itineraryMode": "days",
    "included": [
      "Gondar–Simien–Gondar transportation; professional local wildlife/trekking guide",
      "Park entrance fees; required scout/ranger; trekking permits where applicable",
      "Camping or accommodation according to itinerary; camping equipment where camping is included",
      "Meals according to itinerary; drinking water according to arrangement",
      "Wildlife-focused walking; wildlife interpretation; local landscape and cultural interpretation",
      "Pre-trip planning and coordination"
    ],
    "excluded": [
      "Flights; visa; insurance; personal equipment; personal expenses; alcohol; tips",
      "Professional photography services; optional activities"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789397564/siha-gorge.png",
    "imageAlt": "An ibex standing on a rocky ridge in the Simien Mountains",
    "itineraryIntro": "Sample 3-day outline (adapted at booking)",
    "itineraryNotes": [
      "2-day versions compress to Sankaber overnight and return; 4-day versions add a Chenek or Imet Gogo wildlife day."
    ],
    "days": [
      {
        "title": "Gondar to Sankaber",
        "subtitle": "",
        "paragraphs": [
          "Transfer via Debark; park arrangements; afternoon wildlife walk along the escarpment; overnight Sankaber Camp."
        ],
        "overnight": "Sankaber Camp"
      },
      {
        "title": "Sankaber to Geech corridor",
        "subtitle": "",
        "paragraphs": [
          "Full wildlife and landscape day toward Geech / Jinbar area; extended observation stops when animals are present; overnight Geech Camp or return toward Sankaber per plan."
        ],
        "overnight": "Geech Camp or Sankaber per plan"
      },
      {
        "title": "Highlands and return",
        "subtitle": "",
        "paragraphs": [
          "Morning wildlife time; optional short walk toward higher viewpoints; transfer via Debark to Gondar."
        ]
      }
    ]
  },
  {
    "slug": "simien-photography-day",
    "name": "1-Day Simien Photography Experience",
    "duration": "1 Day",
    "route": "Gondar → Simien → Gondar",
    "difficulty": "Easy to Moderate (walking adjusted to shooting priorities)",
    "heroTitle": "Simien photography",
    "heroAccent": "one day.",
    "overview": [
      "One-day photography focus for travellers, photographers and content creators with only one day available: landscapes, viewpoints, Gelada, mountain scenery and golden-hour opportunities where timing allows. The guide prioritises light, positions and flexible stops within a realistic day-trip window from Gondar."
    ],
    "highlights": [
      "Best fit when only one day is available for Simien photography",
      "Landscapes, viewpoints, Gelada and mountain scenery",
      "Flexible stops for light within day-trip limits",
      "Local knowledge of escarpment positions and access"
    ],
    "itineraryMode": "segments",
    "included": [
      "Private transportation Gondar–Simien–return; hotel pickup and drop-off",
      "Professional local guide with landscape and wildlife knowledge; driver and fuel",
      "Simien National Park entrance fee; required park scout/ranger",
      "Lunch; drinking water",
      "Flexible photographic stops within the agreed day-trip route",
      "Pre-trip timing advice for light and packing"
    ],
    "excluded": [
      "Professional photographer hire unless specifically booked; camera equipment; drone services",
      "International and domestic flights; visa; travel insurance",
      "Personal expenses; alcohol; tips; optional activities"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789386873/buhit-ras.jpg",
    "imageAlt": "A hiker overlooking the mountains at Buyit Ras",
    "segments": [
      {
        "label": "Early morning",
        "body": "Pickup in Gondar; transfer via Debark with park arrangements timed for good morning light where possible"
      },
      {
        "label": "Late morning – midday",
        "body": "Guided photography walks on the western escarpment; Gelada and landscape subjects as available"
      },
      {
        "label": "Lunch",
        "body": "Mountain lunch; gear rest"
      },
      {
        "label": "Afternoon",
        "body": "Continued shooting toward golden hour if schedule allows; otherwise earlier return for evening light nearer the road corridor"
      },
      {
        "label": "Evening",
        "body": "Return to Gondar"
      }
    ]
  },
  {
    "slug": "wildlife-landscape-photography",
    "name": "2–3 Day Wildlife & Landscape Photography",
    "duration": "2–3 Days",
    "route": "Gondar → Sankaber / Geech / Imet Gogo corridor (exact camps adapted) → Gondar",
    "difficulty": "Moderate (flexible pacing for photography)",
    "heroTitle": "Wildlife & landscape",
    "heroAccent": "photography.",
    "overview": [
      "Longer field time than a day trip for wildlife and landscape photography — Gelada, Walia ibex, escarpments, Imet Gogo, highland landscapes, sunrise and sunset, mountain camping. Less rushing, more waiting for light and animal behaviour. Route adapted within the western classic corridor."
    ],
    "highlights": [
      "More time in the field than a day trip",
      "Sunrise/sunset and Imet Gogo among named focuses",
      "Mountain camping for early and late light",
      "Flexible stops for wildlife and weather"
    ],
    "itineraryMode": "days",
    "included": [
      "Private transportation according to itinerary; professional local guide",
      "Simien National Park fees; required scout/ranger",
      "Camping/accommodation according to itinerary; camping equipment where applicable",
      "Meals according to itinerary; drinking water; mule support where applicable",
      "Local wildlife and landscape knowledge; flexible photographic stops within reasonable route limits",
      "Pre-trip photography planning"
    ],
    "excluded": [
      "Professional photographer unless specifically booked; photography equipment; camera/lens rental unless arranged; drone services",
      "International/domestic flights; visa; travel insurance; personal expenses; alcohol; tips; optional services"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789400264/Gelada-Country.png",
    "imageAlt": "A gelada sitting above green valleys in the Simien Mountains",
    "itineraryIntro": "Sample 3-day outline",
    "itineraryNotes": [
      "2-day versions overnight at Sankaber and return after a second highland photography morning."
    ],
    "days": [
      {
        "title": "Gondar to Sankaber",
        "subtitle": "",
        "paragraphs": [
          "Transfer via Debark; afternoon escarpment photography; golden-hour session near camp; overnight Sankaber Camp."
        ],
        "overnight": "Sankaber Camp"
      },
      {
        "title": "Sankaber to Geech",
        "subtitle": "",
        "paragraphs": [
          "Jinbar Waterfall and Geech Abyss; Afro-alpine vegetation; sunset viewpoint if conditions allow; overnight Geech Camp."
        ],
        "overnight": "Geech Camp"
      },
      {
        "title": "Geech to Imet Gogo & return",
        "subtitle": "",
        "paragraphs": [
          "Dawn departure for Imet Gogo light; panoramic shooting; continue to road pickup; return to Gondar."
        ]
      }
    ]
  },
  {
    "slug": "simien-photography-expedition",
    "name": "4–5 Day Simien Photography Expedition",
    "duration": "4–5 Days",
    "route": "Sankaber · Geech · Imet Gogo · Chenek (exact route adapted)",
    "difficulty": "Moderate to Challenging (flexible daily pacing)",
    "heroTitle": "Photography expedition",
    "heroAccent": "time to wait.",
    "overview": [
      "Extended photography expedition with time to wait, explore alternative viewpoints, follow wildlife and photograph changing weather — time a day trip cannot provide. Route adapted within the named classic corridor. Suitable for serious amateurs and professionals who want multi-camp access without a summit objective."
    ],
    "highlights": [
      "Multi-day photographic access to Sankaber, Geech, Imet Gogo, Chenek corridor",
      "Flexible stops for light and wildlife within route limits",
      "Multiple sunrise and sunset opportunities",
      "Optional Chenek wildlife focus on longer versions"
    ],
    "itineraryMode": "days",
    "included": [
      "Private transportation; professional local guide; required park scout/ranger; park fees and permits",
      "Accommodation/camping according to itinerary; camping equipment where applicable",
      "Meals according to itinerary; drinking water; mule support where applicable",
      "Flexible daily pacing / photographic stops within planned route; local photography guidance",
      "Wildlife and landscape interpretation; pre-trip planning"
    ],
    "excluded": [
      "Professional photographer unless booked; camera equipment; drone services",
      "Flights; visa; insurance; personal expenses; alcohol; tips; optional activities"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789386844/Jinbar_Waterfall.jpg",
    "imageAlt": "Two visitors at the Jinbar Waterfall viewpoint",
    "itineraryIntro": "Sample 5-day outline",
    "itineraryNotes": [
      "4-day versions compress Day 3–4 into a single Imet Gogo → Chenek day and earlier return."
    ],
    "days": [
      {
        "title": "Gondar to Sankaber",
        "subtitle": "",
        "paragraphs": [
          "Transfer via Debark; afternoon and evening shooting; overnight Sankaber Camp."
        ],
        "overnight": "Sankaber Camp"
      },
      {
        "title": "Sankaber to Geech",
        "subtitle": "",
        "paragraphs": [
          "Jinbar Waterfall; escarpment and lobelia subjects; overnight Geech Camp."
        ],
        "overnight": "Geech Camp"
      },
      {
        "title": "Geech to Imet Gogo / Chenek approach",
        "subtitle": "",
        "paragraphs": [
          "Full day at and around Imet Gogo with flexible return toward Chenek; overnight Chenek Camp or Geech per light plan."
        ],
        "overnight": "Chenek Camp or Geech per light plan"
      },
      {
        "title": "Chenek wildlife & landscape",
        "subtitle": "",
        "paragraphs": [
          "Morning wildlife photography in known Walia and Gelada habitat; afternoon ridge and amphitheatre subjects; overnight Chenek Camp."
        ],
        "overnight": "Chenek Camp"
      },
      {
        "title": "Chenek to Gondar",
        "subtitle": "",
        "paragraphs": [
          "Optional dawn session; meet vehicle; return via Debark to Gondar."
        ]
      }
    ]
  },
  {
    "slug": "royal-gondar",
    "name": "Royal Gondar Experience",
    "duration": "Half Day / Full Day",
    "route": "Gondar (city-based)",
    "difficulty": "Easy",
    "heroTitle": "Royal Gondar",
    "heroAccent": "the city of emperors.",
    "overview": [
      "History-focused Gondar walk through the city of emperors: Royal Enclosure and important historic sites, with context on why Gondar was built and how history shapes the city today. Aimed at first-time visitors, history lovers and photographers. Half-day covers the core monuments; full-day adds churches, Kuskuam and a more leisurely pace."
    ],
    "highlights": [
      "Imperial history, royal architecture, churches, Fasilides’ legacy",
      "Gondar as more than a stop on the way to the mountains",
      "UNESCO-listed Fasil Ghebbi at the centre of the programme",
      "Flexible half-day or full-day format"
    ],
    "itineraryMode": "segments",
    "included": [
      "Professional local guide; private transportation; hotel pickup/drop-off",
      "Fasil Ghebbi entrance fee when included in itinerary; other listed historical-site entrance fees",
      "Historical interpretation; cultural context; personalized sightseeing; driver and fuel"
    ],
    "excluded": [
      "Flights; visa; insurance; meals unless stated; drinks; personal expenses; tips",
      "Attractions not listed; optional activities"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789392032/fasilides_-bath-fasil_s-pool.jpg",
    "imageAlt": "Fasilides’ Bath, also known as Fasil’s Pool, in Gondar",
    "segments": [
      {
        "label": "Half Day (approximately 3–4 hours)",
        "body": "Hotel pickup; guided visit to Fasil Ghebbi (Royal Enclosure). Fasilides’ Bath or Debre Berhan Selassie depending on timing and interest. Drop-off at hotel or agreed city point."
      },
      {
        "label": "Full Day (approximately 6–8 hours)",
        "body": "Morning: Fasil Ghebbi and Fasilides’ Bath. Midday: lunch break (own account unless stated). Afternoon: Debre Berhan Selassie and Kuskuam. Optional short living-city walk or viewpoint; return to hotel."
      }
    ]
  },
  {
    "slug": "gondar-through-local-eyes",
    "name": "Gondar Through Local Eyes",
    "duration": "Half Day (approximately 3–5 hours) or Full Day on request",
    "route": "Gondar (city-based neighbourhoods and everyday spaces)",
    "difficulty": "Easy",
    "heroTitle": "Gondar",
    "heroAccent": "through local eyes.",
    "overview": [
      "Slow everyday Gondar beyond the tourist route: neighbourhoods, small businesses, meeting people, coffee, local food and daily life — seeing and understanding the city as locals live it. Designed for travellers who have already seen the monuments or who want living culture alongside heritage."
    ],
    "highlights": [
      "Living city beyond monuments",
      "Coffee, food and community interaction",
      "Neighbourhood walks away from the main tourist circuit",
      "Local interpretation of contemporary Gondar"
    ],
    "itineraryMode": "segments",
    "included": [
      "Professional local guide; hotel pickup and drop-off",
      "Private transportation where required within the city",
      "Coffee or light tasting stops specifically listed in the confirmed programme",
      "Cultural interpretation and local introductions"
    ],
    "excluded": [
      "Meals and drinks beyond those listed in the programme; alcohol; personal shopping",
      "Attraction entrance fees for monument sites (this is not a castle tour)",
      "Tips; flights; visa; insurance; optional add-ons"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789392021/irenelik-gondar-3388882.jpg",
    "imageAlt": "Gondar viewed across its historic highland landscape",
    "itineraryNotes": [
      "Pace is conversational and flexible; exact stops vary by day, season and guest interest."
    ],
    "segments": [
      {
        "label": "Meet your guide",
        "body": "Hotel pickup and orientation with your local guide"
      },
      {
        "label": "Neighbourhood walk",
        "body": "Neighbourhood walk through residential and commercial streets"
      },
      {
        "label": "Coffee",
        "body": "Coffee stop and informal conversation"
      },
      {
        "label": "Local food",
        "body": "Local eatery or market snack introduction (as arranged)"
      },
      {
        "label": "Everyday spaces",
        "body": "Small businesses, workshops or community spaces as available and appropriate"
      },
      {
        "label": "Return",
        "body": "Return to hotel"
      }
    ]
  },
  {
    "slug": "gondar-food-coffee",
    "name": "Gondar Food & Coffee Experience",
    "duration": "3–5 Hours",
    "route": "Gondar (city-based)",
    "difficulty": "Easy",
    "heroTitle": "Food & coffee",
    "heroAccent": "in Gondar.",
    "overview": [
      "Ethiopian coffee culture and Gondar flavours: traditional coffee preparation and ceremony, local snacks, injera and dishes, spices, street food, traditional drinks and food markets depending on the experience. Come hungry; the focus is taste and the stories behind food."
    ],
    "highlights": [
      "Coffee ceremony and Gondar food culture",
      "Market visit where appropriate",
      "Introduction to injera, stews and local snacks",
      "Guided interpretation of ingredients and customs"
    ],
    "itineraryMode": "segments",
    "included": [
      "Local guide; transportation where required",
      "Planned food/coffee experiences specifically listed in the itinerary",
      "Ethiopian coffee experience where stated; cultural interpretation; local food introduction",
      "Hotel pickup/drop-off where included"
    ],
    "excluded": [
      "Additional food/drinks outside the agreed experience; alcohol; personal purchases; tips",
      "Flights; visa; insurance; optional experiences"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789400249/Gondar-Food-Coffee-Experience.png",
    "imageAlt": "Injera served with a variety of Ethiopian dishes",
    "segments": [
      {
        "label": "Orientation",
        "body": "Hotel pickup; short orientation on Ethiopian food culture"
      },
      {
        "label": "Market",
        "body": "Market or spice stop when included in the day’s plan"
      },
      {
        "label": "Coffee",
        "body": "Traditional coffee ceremony"
      },
      {
        "label": "Tasting",
        "body": "Guided tasting of injera-based dishes and local snacks"
      },
      {
        "label": "Optional tasting",
        "body": "Optional traditional drink tasting where appropriate"
      },
      {
        "label": "Return",
        "body": "Return to hotel within the 3–5 hour window"
      }
    ]
  },
  {
    "slug": "gondar-photography-walk",
    "name": "Gondar Photography Walk",
    "duration": "Half Day (approximately 3–5 hours); dawn or late-afternoon options available",
    "route": "Gondar (city-based)",
    "difficulty": "Easy",
    "heroTitle": "Gondar photography",
    "heroAccent": "beyond postcards.",
    "overview": [
      "Photograph the city beyond postcards: architecture, streets, churches, markets, people, coffee, morning light, mountain views and unplanned moments, with local knowledge for timing. Suitable for travellers with any camera, including phones."
    ],
    "highlights": [
      "Local knowledge for photographic moments and timing",
      "Mix of heritage and everyday city subjects",
      "Flexible dawn, morning or late-afternoon light windows",
      "Respectful approach to people photography"
    ],
    "itineraryMode": "segments",
    "included": [
      "Professional local guide; hotel pickup/drop-off",
      "Private transportation within Gondar where required",
      "Timing guidance for light; cultural etiquette for photographing people",
      "Entrance fees only if a specific interior site is booked into the walk"
    ],
    "excluded": [
      "Professional photographer hire unless booked; camera gear; drone permits/services",
      "Meals and drinks unless listed; tips; personal shopping",
      "Flights; visa; insurance"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789386847/fasil-ghebbi.jpg",
    "imageAlt": "Stone castle and towers at Fasil Ghebbi in Gondar",
    "segments": [
      {
        "label": "Meet",
        "body": "Meet at hotel; brief on light, etiquette and route"
      },
      {
        "label": "Heritage and streets",
        "body": "Heritage and street photography circuit (Fasil Ghebbi exterior viewpoints, church approaches, market edges as appropriate)"
      },
      {
        "label": "Living city",
        "body": "Living-city frames: cafés, alleys, highland backdrops"
      },
      {
        "label": "Coffee",
        "body": "Optional coffee stop"
      },
      {
        "label": "Return",
        "body": "Review of key shots and return to hotel"
      }
    ]
  },
  {
    "slug": "gondar-history-culture",
    "name": "Gondar History & Culture Tour",
    "duration": "Half Day / Full Day",
    "route": "Gondar (city-based)",
    "difficulty": "Easy",
    "heroTitle": "History & culture",
    "heroAccent": "as living context.",
    "overview": [
      "Guided cultural touring of stories that shaped northern Ethiopia: emperors, religious traditions, architecture, trade, art, music, food, communities and modern life — history presented as living context. Broader narrative than a monuments-only castle visit."
    ],
    "highlights": [
      "Broad cultural narrative beyond single monuments",
      "Connection between imperial past and contemporary Gondar",
      "Churches, royal sites and living-city context in one programme",
      "Flexible half-day or full-day depth"
    ],
    "itineraryMode": "segments",
    "included": [
      "Professional local English-speaking guide; private transportation; hotel pickup/drop-off; driver and fuel",
      "Entrance fees to attractions specifically listed in itinerary",
      "Historical and cultural interpretation; personalized sightseeing route; pre-trip coordination"
    ],
    "excluded": [
      "International and domestic flights; visa; travel insurance",
      "Meals unless specifically stated; drinks; personal purchases; tips",
      "Optional attractions not listed; personal expenses"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789392019/bebre-berhan-selassie.jpg",
    "imageAlt": "Painted religious murals inside Debre Berhan Selassie church in Gondar",
    "segments": [
      {
        "label": "Half Day",
        "body": "Fasil Ghebbi with extended historical interpretation; one church (typically Debre Berhan Selassie); short living-city coda."
      },
      {
        "label": "Full Day",
        "body": "Morning royal enclosure and Fasilides’ Bath; afternoon Debre Berhan Selassie and Kuskuam; coffee or market stop; closing conversation on Gondar today."
      }
    ]
  },
  {
    "slug": "gondar-market-local-life",
    "name": "Gondar Market & Local Life",
    "duration": "Half Day (approximately 3–4 hours)",
    "route": "Gondar (market areas and everyday commercial districts)",
    "difficulty": "Easy",
    "heroTitle": "Market",
    "heroAccent": "and local life.",
    "overview": [
      "Market areas and everyday commercial life — local products, food, and farming connections between the city and the highlands. A window into everyday Gondar for travellers who want commerce, produce and street culture rather than castles alone."
    ],
    "highlights": [
      "Everyday commercial and market life",
      "City–highland farming connections",
      "Spices, produce and local crafts as available",
      "Guided interpretation of products and trade rhythms"
    ],
    "itineraryMode": "segments",
    "included": [
      "Professional local guide; hotel pickup and drop-off",
      "Private transportation within Gondar where required",
      "Market orientation and cultural interpretation"
    ],
    "excluded": [
      "Purchases of any kind; meals and drinks; tips",
      "Flights; visa; insurance; optional activities"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789400256/Gondar-Market-Local-Life.png",
    "imageAlt": "Shoppers among colourful clothing stalls in a Gondar market",
    "segments": [
      {
        "label": "Orientation",
        "body": "Hotel pickup; orientation on market etiquette and bargaining culture"
      },
      {
        "label": "Market walk",
        "body": "Guided walk through main market areas and surrounding streets"
      },
      {
        "label": "Products",
        "body": "Produce, spice and household-goods sections with explanation"
      },
      {
        "label": "Free time",
        "body": "Optional tasting or purchase time (own account)"
      },
      {
        "label": "Return",
        "body": "Short discussion of highland–city supply links; return to hotel"
      }
    ]
  },
  {
    "slug": "gondar-kosoye",
    "name": "Gondar & Kosoye Mountains",
    "duration": "Half Day approximately 4–5 hours; Full Day approximately 7–9 hours",
    "route": "Gondar → Kosoye highlands / village → Gondar",
    "difficulty": "Walk adaptable to fitness",
    "heroTitle": "Gondar & Kosoye",
    "heroAccent": "highland life.",
    "overview": [
      "From the royal city into rural highland life around Kosoye: village visit, traditional homes, farming, livestock, coffee ceremony, local food, countryside walk and conversations with local people. Emphasises community connection, not a staged show. Can combine with Gondar heritage and Simien as History → Community → Wilderness."
    ],
    "highlights": [
      "Community-based rural highland experience",
      "Coffee ceremony, food tasting, countryside walk",
      "Farmland and highland scenery near Gondar",
      "Flexible half-day or full-day pacing"
    ],
    "itineraryMode": "segments",
    "included": [
      "Hotel pickup and drop-off in Gondar; local professional guide; transportation",
      "Village visit; local family/community interaction; traditional coffee ceremony",
      "Cultural interpretation; local food tasting according to the selected experience",
      "Guided countryside walk; community-hosted activities"
    ],
    "excluded": [
      "Personal expenses; alcoholic drinks; tips; personal purchases; activities not listed above"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789386874/kosoye-mountain.jpg",
    "imageAlt": "A visitor pointing across the green Kosoye Mountains",
    "itineraryNotes": [
      "Full-day versions add longer walking, additional village time and a more leisurely meal."
    ],
    "segments": [
      {
        "label": "Pickup",
        "body": "Hotel pickup in Gondar; drive into the Kosoye highland area"
      },
      {
        "label": "Village welcome",
        "body": "Village welcome and introduction to local hosts"
      },
      {
        "label": "Home visit",
        "body": "Traditional Ethiopian home visit; rural farming life commentary"
      },
      {
        "label": "Food and coffee",
        "body": "Ethiopian coffee ceremony; traditional food tasting according to the selected experience"
      },
      {
        "label": "Walk",
        "body": "Countryside highland walk adapted to fitness"
      },
      {
        "label": "Return",
        "body": "Return to Gondar"
      }
    ]
  },
  {
    "slug": "gondar-running",
    "name": "Gondar Hidden Running Experience",
    "duration": "Not fixed; Easy / Moderate / Challenging options; can finish with coffee/breakfast",
    "route": "City edge → local paths → countryside → dirt tracks → highland views → village life → return to Gondar (exact route depends on ability, weather, conditions)",
    "difficulty": "Easy, Moderate, or Challenging (adapted)",
    "heroTitle": "Hidden Gondar",
    "heroAccent": "running.",
    "overview": [
      "Guided run away from main paved roads onto quieter local paths, dirt tracks, countryside trails and hidden routes around Gondar. Pace adapted; safety-first route selection. Run with a local, not a GPS app. Variants combine running with coffee, culture or photography."
    ],
    "highlights": [
      "Hidden Gondar beyond the tourist route",
      "Ability-adapted difficulty",
      "Optional coffee/breakfast finish",
      "Optional photography and cultural observation en route"
    ],
    "itineraryMode": "segments",
    "included": [
      "Local running guide; route selection matched to ability and conditions",
      "Safety briefing; pacing support",
      "Hotel pickup/drop-off when start and finish points require transport",
      "Optional coffee or simple breakfast when booked into the session"
    ],
    "excluded": [
      "Running shoes and personal kit; hydration pack unless arranged",
      "Additional meals and drinks beyond the optional finish; tips",
      "Flights; visa; insurance; optional photography services"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789400230/Gondar-Hidden-Running-Experience.png",
    "imageAlt": "Historic stone buildings and ruins in Gondar",
    "segments": [
      {
        "label": "Meet",
        "body": "Meet at agreed hotel or city-edge start; warm-up and route briefing"
      },
      {
        "label": "Run",
        "body": "Guided run on local paths, dirt tracks and countryside trails selected for the day’s difficulty"
      },
      {
        "label": "Views",
        "body": "Highland views and village edges as the route allows"
      },
      {
        "label": "Cool-down",
        "body": "Cool-down; optional coffee or breakfast finish"
      },
      {
        "label": "Return",
        "body": "Return transfer to hotel if start/finish points differ"
      }
    ]
  },
  {
    "slug": "timkat-simien",
    "name": "Timkat & Simien Mountains",
    "duration": "Suggested 6 Days / 5 Nights",
    "route": "Gondar (Timkat) → Simien Mountains → Gondar",
    "difficulty": "Easy in Gondar festival days; Easy to Moderate in Simien (route adapted)",
    "heroTitle": "Timkat",
    "heroAccent": "then the mountains.",
    "overview": [
      "Festival and mountain journey: Timkat in Gondar, then Simien landscapes, escarpments, Geladas and possible Imet Gogo / Geech area. Living culture followed by highland wilderness. Festival schedules and access can change; final itineraries are confirmed closer to departure."
    ],
    "highlights": [
      "Living Timkat culture then wild mountains",
      "Ketera (Tabots procession) on Timkat eve; Timkat day ceremonies",
      "Flexible Simien days after the festival",
      "Extension options toward Lalibela, Axum or longer trekking"
    ],
    "itineraryMode": "days",
    "included": [
      "Accommodation in Gondar and Simien according to itinerary (hotel and camping/lodge as confirmed)",
      "Private transportation throughout; professional local guide",
      "Gondar festival accompaniment and heritage visits as scheduled",
      "Simien National Park entrance fee; required scout/ranger; trekking support for mountain days",
      "Meals according to itinerary; drinking water according to arrangement",
      "Airport transfers in Gondar when specified"
    ],
    "excluded": [
      "International and domestic flights; visa; travel insurance",
      "Personal expenses; alcohol; tips; optional activities",
      "Festival-period surcharges where separately quoted; services not listed in the quotation"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789392032/fasilides_-bath-fasil_s-pool.jpg",
    "imageAlt": "Fasilides’ Bath, also known as Fasil’s Pool, in Gondar",
    "days": [
      {
        "title": "Arrive in Gondar",
        "subtitle": "",
        "paragraphs": [
          "Hotel; orientation; traditional dinner; festival briefing; overnight Gondar."
        ],
        "overnight": "Gondar"
      },
      {
        "title": "Gondar & Timkat eve",
        "subtitle": "",
        "paragraphs": [
          "Historic Gondar sites; afternoon/evening Ketera (Tabots procession); overnight Gondar."
        ],
        "overnight": "Gondar"
      },
      {
        "title": "Timkat in Gondar",
        "subtitle": "",
        "paragraphs": [
          "Early morning ceremonies, music, chanting, processions centred on Fasil’s Pool and city routes; local interpretation; overnight Gondar."
        ],
        "overnight": "Gondar"
      },
      {
        "title": "Gondar → Simien",
        "subtitle": "",
        "paragraphs": [
          "Via Debark; landscapes, escarpments, Geladas, viewpoints, short walks as timing allows; overnight Simien."
        ],
        "overnight": "Simien"
      },
      {
        "title": "Simien mountain experience",
        "subtitle": "",
        "paragraphs": [
          "Possible Imet Gogo, Geech area, highland scenery, Geladas, giant lobelia, escarpment viewpoints; route adapted; overnight Simien."
        ],
        "overnight": "Simien"
      },
      {
        "title": "Simien → Gondar",
        "subtitle": "",
        "paragraphs": [
          "Final morning; return; airport/hotel or extensions (Lalibela, Axum, more trekking)."
        ]
      }
    ]
  },
  {
    "slug": "timkat-ras-dashen",
    "name": "Timkat & Ras Dashen",
    "duration": "Suggested 8–10 Days",
    "route": "Timkat in Gondar → multi-day Simien trek toward Ras Dashen → Gondar",
    "difficulty": "Challenging (Adventure Festival Journey)",
    "heroTitle": "Timkat & Ras Dashen",
    "heroAccent": "festival to summit.",
    "overview": [
      "Combine Timkat in Gondar with a multi-day Simien trek toward Ras Dashen — festival atmosphere followed by a summit-oriented mountain programme. Demanding adventure festival journey for fit travellers who want both living culture and a high-altitude objective. Summit success is not guaranteed."
    ],
    "highlights": [
      "Festival in Gondar plus summit-oriented Simien trek",
      "Ketera and Timkat ceremonies before mountain departure",
      "Classic corridor into Ambiko and Ras Dashen attempt",
      "Adventure festival positioning for experienced travellers"
    ],
    "itineraryMode": "days",
    "included": [
      "Gondar hotel nights during festival days; camping throughout the mountain section",
      "Private transportation; professional trekking and cultural guide support",
      "Festival accompaniment in Gondar; park fees, permits, scout/ranger",
      "Full camping crew, cook, mule support on trek days",
      "Meals according to itinerary; Ras Dashen summit attempt",
      "Pre-trip briefing and packing guidance"
    ],
    "excluded": [
      "Flights; visa; travel insurance; high-altitude medical/evacuation cover",
      "Personal sleeping bag and trekking kit unless stated; alcohol; tips; personal expenses",
      "Optional activities; any service not listed in the quotation"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789397607/ras-dashen.png",
    "imageAlt": "A grassy escarpment overlooking the mountains on the Ras Dashen route",
    "itineraryIntro": "Sample 9-day outline",
    "itineraryNotes": [
      "Return timing depends on the 8-, 9- or 10-day booking."
    ],
    "days": [
      {
        "title": "Gondar & Timkat",
        "subtitle": "",
        "paragraphs": [
          "Arrival; Timkat eve (Ketera); Timkat day ceremonies; rest and trek briefing; overnight Gondar hotels."
        ],
        "overnight": "Gondar hotels",
        "dayLabel": "1–3"
      },
      {
        "title": "Gondar to Sankaber",
        "subtitle": "",
        "paragraphs": [
          "Via Debark; park entry; overnight Sankaber Camp."
        ],
        "overnight": "Sankaber Camp",
        "dayLabel": "4"
      },
      {
        "title": "Sankaber to Geech",
        "subtitle": "",
        "paragraphs": [
          "Jinbar Waterfall; overnight Geech Camp."
        ],
        "overnight": "Geech Camp",
        "dayLabel": "5"
      },
      {
        "title": "Geech to Chenek via Imet Gogo",
        "subtitle": "",
        "paragraphs": [
          "Overnight Chenek Camp."
        ],
        "overnight": "Chenek Camp",
        "dayLabel": "6"
      },
      {
        "title": "Chenek to Ambiko",
        "subtitle": "",
        "paragraphs": [
          "Bwahit Pass; Meseha Valley; overnight Ambiko Camp."
        ],
        "overnight": "Ambiko Camp",
        "dayLabel": "7"
      },
      {
        "title": "Ras Dashen summit",
        "subtitle": "",
        "paragraphs": [
          "Pre-sunrise attempt; return to Ambiko; overnight Ambiko or begin descent as arranged."
        ],
        "overnight": "Ambiko or descent as arranged",
        "dayLabel": "8"
      },
      {
        "title": "Return to Gondar",
        "subtitle": "",
        "paragraphs": [
          "Descent toward Chenek corridor and transfer via Debark to Gondar (timing depends on 8-, 9- or 10-day booking)."
        ],
        "dayLabel": "9–10"
      }
    ]
  },
  {
    "slug": "genna-simien",
    "name": "Genna & Simien",
    "duration": "Suggested 6–8 Days",
    "route": "Gondar → Genna experience → Simien Mountains → Gondar",
    "difficulty": "Easy in Gondar; Easy to Moderate in Simien (route adapted)",
    "heroTitle": "Genna",
    "heroAccent": "and Simien.",
    "overview": [
      "Ethiopian Christmas (Genna), celebrated 7 January, combined with a Simien journey. Positioned as a quieter cultural experience before Timkat crowds, with church services, community atmosphere and highland trekking or wildlife days afterward."
    ],
    "highlights": [
      "Genna atmosphere and cultural experiences",
      "Follow-on Simien mountains programme",
      "Quieter seasonal window than peak Timkat",
      "Flexible mountain depth (day walks to classic corridor)"
    ],
    "itineraryMode": "days",
    "included": [
      "Accommodation in Gondar and Simien according to itinerary",
      "Private transportation; professional local guide",
      "Genna cultural accompaniment; Gondar heritage visits as scheduled",
      "Simien park fees, scout/ranger and camping support for mountain days",
      "Meals according to itinerary"
    ],
    "excluded": [
      "Flights; visa; insurance; personal expenses; alcohol; tips",
      "Optional activities; services not listed in the quotation"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789392019/bebre-berhan-selassie.jpg",
    "imageAlt": "Painted religious murals inside Debre Berhan Selassie church in Gondar",
    "itineraryIntro": "Sample 7-day outline",
    "days": [
      {
        "title": "Arrive Gondar",
        "subtitle": "",
        "paragraphs": [
          "Hotel; orientation; Genna briefing; overnight Gondar."
        ],
        "overnight": "Gondar"
      },
      {
        "title": "Genna in Gondar",
        "subtitle": "",
        "paragraphs": [
          "Morning church and community celebrations; cultural interpretation; afternoon heritage sites as energy allows; overnight Gondar."
        ],
        "overnight": "Gondar"
      },
      {
        "title": "Living Gondar",
        "subtitle": "",
        "paragraphs": [
          "Softer city day — coffee, markets, optional Fasil Ghebbi; trek briefing; overnight Gondar."
        ],
        "overnight": "Gondar"
      },
      {
        "title": "Gondar → Simien",
        "subtitle": "",
        "paragraphs": [
          "Via Debark; park entry; short walks and Gelada time; overnight Simien camp."
        ],
        "overnight": "Simien camp"
      },
      {
        "title": "Simien highland day",
        "subtitle": "",
        "paragraphs": [
          "Geech / Imet Gogo corridor or wildlife-focused walks adapted to group; overnight Simien."
        ],
        "overnight": "Simien"
      },
      {
        "title": "Further Simien or return start",
        "subtitle": "",
        "paragraphs": [
          "Continue corridor toward Chenek or begin return toward Debark per booking length."
        ]
      },
      {
        "title": "Return to Gondar",
        "subtitle": "",
        "paragraphs": [
          "Final mountain morning and transfer to Gondar; airport or extension as arranged."
        ],
        "dayLabel": "7–8"
      }
    ]
  },
  {
    "slug": "meskel-simien",
    "name": "Meskel & Simien",
    "duration": "Suggested 6–7 Days (September festival journey)",
    "route": "Gondar → Meskel experience → Simien Mountains → Gondar",
    "difficulty": "Easy in Gondar; Easy to Moderate in Simien",
    "heroTitle": "Meskel",
    "heroAccent": "and Simien.",
    "overview": [
      "Combine Meskel celebration with Gondar and Simien: traditional celebrations, local culture and the beginning of the Ethiopian highland season. Meskel is celebrated in September; the exact date is confirmed for each season. Bonfires, processions and community gatherings precede a Simien highland programme."
    ],
    "highlights": [
      "Meskel celebrations in Gondar",
      "September highland-season context for Simien",
      "Heritage city days plus mountain escarpments",
      "Flexible post-festival trekking depth"
    ],
    "itineraryMode": "days",
    "included": [
      "Accommodation according to itinerary; private transportation; professional local guide",
      "Meskel festival accompaniment; Gondar heritage visits as scheduled",
      "Simien park arrangements, scout/ranger and mountain support for trek days",
      "Meals according to itinerary; drinking water according to arrangement"
    ],
    "excluded": [
      "Flights; visa; insurance; personal expenses; alcohol; tips",
      "Optional activities; services not listed in the quotation"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789386842/Guche-camp-simen.jpg",
    "imageAlt": "A tent beside a shelter and giant lobelias at Geech camp",
    "itineraryIntro": "Sample 6-day outline",
    "days": [
      {
        "title": "Arrive Gondar",
        "subtitle": "",
        "paragraphs": [
          "Hotel; orientation; Meskel briefing; overnight Gondar."
        ],
        "overnight": "Gondar"
      },
      {
        "title": "Meskel eve / Demera",
        "subtitle": "",
        "paragraphs": [
          "City heritage in the day; evening Demera bonfire celebrations; overnight Gondar."
        ],
        "overnight": "Gondar"
      },
      {
        "title": "Meskel day",
        "subtitle": "",
        "paragraphs": [
          "Morning ceremonies and community festivities; afternoon rest or light sightseeing; overnight Gondar."
        ],
        "overnight": "Gondar"
      },
      {
        "title": "Gondar → Simien",
        "subtitle": "",
        "paragraphs": [
          "Via Debark; park entry; escarpment walks; overnight Simien."
        ],
        "overnight": "Simien"
      },
      {
        "title": "Simien mountain day",
        "subtitle": "",
        "paragraphs": [
          "Viewpoints, Gelada habitat, possible Geech / Imet Gogo area; overnight Simien or return start."
        ],
        "overnight": "Simien or return start"
      },
      {
        "title": "Simien → Gondar",
        "subtitle": "",
        "paragraphs": [
          "Final morning; transfer to Gondar hotel or airport."
        ]
      }
    ]
  },
  {
    "slug": "mountains-sacred-stone",
    "name": "Mountains & Sacred Stone — Gondar + Simien + Lalibela",
    "duration": "7–9 Days · Private Journey",
    "route": "Gondar → Simien → Lalibela",
    "difficulty": "Moderate",
    "heroTitle": "Mountains",
    "heroAccent": "and sacred stone.",
    "overview": [
      "Private combination: imperial Gondar, Simien wildlife and trekking, then Lalibela’s rock-hewn churches. Arc: Royal Ethiopia · Wild Ethiopia · Sacred Ethiopia. Optional Yemrehanna Kristos where practical. Designed as a private journey with flexible pacing inside the 7–9 day range."
    ],
    "highlights": [
      "Gondar heritage, Simien mountains, Lalibela churches in one private journey",
      "Optional Yemrehanna Kristos extension",
      "Private pacing and guiding throughout",
      "Clear narrative arc across three northern icons"
    ],
    "itineraryMode": "days",
    "included": [
      "Private transportation according to itinerary; professional local guide throughout",
      "Accommodation in Gondar, Simien (camping or lodge as confirmed) and Lalibela",
      "Gondar and Lalibela attraction entrance fees listed in the itinerary",
      "Simien National Park fees; scout/ranger; camping/trek support for mountain days",
      "Meals according to itinerary; drinking water according to arrangement",
      "Airport transfers where specified; pre-trip planning"
    ],
    "excluded": [
      "International and domestic flights (including Gondar–Lalibela air tickets unless specifically quoted)",
      "Visa; travel insurance; personal trekking equipment",
      "Alcohol; tips; personal shopping; optional Yemrehanna Kristos costs if not listed",
      "Any service not specifically listed in the final quotation"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789389640/lalibela.jpg",
    "imageAlt": "A person in white ceremonial clothing inside a rock-hewn church in Lalibela",
    "itineraryNotes": [
      "For 7–8 day versions: compress Simien to two mountain days and/or combine Lalibela church days as confirmed in the quotation."
    ],
    "days": [
      {
        "title": "Welcome to Gondar",
        "subtitle": "",
        "paragraphs": [
          "Arrival; meet your guide; coffee; orientation; overnight Gondar."
        ],
        "overnight": "Gondar"
      },
      {
        "title": "Imperial Gondar",
        "subtitle": "",
        "paragraphs": [
          "Fasil Ghebbi; Fasilides’ Bath; Debre Berhan Selassie; Gondar after the monuments."
        ]
      },
      {
        "title": "Into Simien",
        "subtitle": "",
        "paragraphs": [
          "Gondar → Debark → Simien; Sankaber or suitable start; afternoon walk; Gelada; sunset; overnight mountains."
        ],
        "overnight": "Mountains"
      },
      {
        "title": "Gelada country",
        "subtitle": "",
        "paragraphs": [
          "Walking day — Gelada, escarpment, vegetation, viewpoints, villages, photography."
        ]
      },
      {
        "title": "The great Simien",
        "subtitle": "",
        "paragraphs": [
          "Geech / Imet Gogo / Chenek corridor adapted to conditions."
        ]
      },
      {
        "title": "Simien → Lalibela",
        "subtitle": "",
        "paragraphs": [
          "Transition by practical road or air; evening slow; overnight Lalibela."
        ],
        "overnight": "Lalibela"
      },
      {
        "title": "Lalibela: the churches",
        "subtitle": "",
        "paragraphs": [
          "Principal rock-hewn complexes with a local guide."
        ]
      },
      {
        "title": "Lalibela beyond the checklist",
        "subtitle": "",
        "paragraphs": [
          "Morning religious/cultural time; additional churches; community; coffee; optional countryside; optional Yemrehanna Kristos."
        ]
      },
      {
        "title": "Departure",
        "subtitle": "",
        "paragraphs": [
          "Onward transfer."
        ]
      }
    ]
  }
];
