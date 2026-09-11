export type GondarPlace = {
  slug: string;
  name: string;
  alsoKnownAs?: string[];
  location: string;
  heroTitle: string;
  heroAccent: string;
  about: string[];
  highlights: string[];
  thingsToDo: string[];
  image: string;
  imageAlt: string;
};

export function gondarPlacePath(slug: string): string {
  return `/gondar/${slug}`;
}

export function gondarPlaceSummary(place: Pick<GondarPlace, "about">): string {
  return place.about[0] ?? "";
}

export function getGondarPlace(slug: string): GondarPlace | undefined {
  return gondarPlaces.find((place) => place.slug === slug);
}

export const gondarPlaces: GondarPlace[] = [
  {
    slug: "gondar",
    name: "Gondar",
    location: "Northern Ethiopia; gateway to Simien Mountains National Park; altitude approximately 2,200 m",
    heroTitle: "Gondar",
    heroAccent: "the royal city.",
    about: [
      "Gondar is the historic royal city once capital of the Ethiopian Empire. Stone walls, royal compounds, churches and centuries of local history sit within a living modern city. It is Ethiopia’s Royal City and the natural gateway toward Simien — a base for heritage tours, food and coffee experiences, photography walks, market visits, countryside running, and the start of mountain journeys.",
    ],
    highlights: [
      "Imperial history and architecture",
      "Living city beyond the monuments",
      "Timkat festival association (Fasil’s Pool)",
      "Gateway to Simien Mountains National Park",
    ],
    thingsToDo: [
      "City sightseeing and heritage tours",
      "Coffee and food experiences",
      "Photography walks",
      "Market and local-life visits",
      "Hidden countryside running",
      "Departures for Simien day trips and multi-day treks",
    ],
    image: "/images/fasil-ghebbi.jpg",
    imageAlt: "Stone arches at the royal fortress of Fasil Ghebbi in Gondar",
  },
  {
    slug: "fasil-ghebbi",
    name: "Fasil Ghebbi",
    alsoKnownAs: ["Royal Enclosure", "historic Royal Compound"],
    location: "Gondar",
    heroTitle: "Fasil Ghebbi",
    heroAccent: "the Royal Enclosure.",
    about: [
      "Fasil Ghebbi (Royal Enclosure / historic Royal Compound) is the remarkable royal enclosure associated with Emperor Fasilides and the Gondarine period. It is a UNESCO World Heritage Site and the core of Gondar’s imperial story.",
    ],
    highlights: [
      "Royal castles and compounds",
      "Imperial architecture and Gondarine history",
      "UNESCO World Heritage designation",
    ],
    thingsToDo: [
      "Guided heritage visits of the enclosure and castles",
    ],
    image: "/images/fasil-ghebbi.jpg",
    imageAlt: "Stone arches at the royal fortress of Fasil Ghebbi in Gondar",
  },
  {
    slug: "fasilides-bath",
    name: "Fasilides’ Bath",
    alsoKnownAs: ["Fasil’s Pool"],
    location: "Gondar",
    heroTitle: "Fasilides’ Bath",
    heroAccent: "Fasil’s Pool.",
    about: [
      "Fasilides’ Bath (Fasil’s Pool) is a historic bath/pool complex with particular cultural significance during Timkat celebrations centered on the site. Outside festival time it remains a key heritage stop on Gondar itineraries.",
    ],
    highlights: [
      "Historic bath/pool complex",
      "Strong Timkat ceremonial association",
    ],
    thingsToDo: [
      "Sightseeing visits",
      "Festival observation or participation during Timkat (schedules and access can change)",
    ],
    image: "/images/tevan-founder.jpg",
    imageAlt: "A local guide sharing the landscape and stories of northern Ethiopia",
  },
  {
    slug: "debre-berhan-selassie",
    name: "Debre Berhan Selassie",
    location: "Gondar",
    heroTitle: "Debre Berhan Selassie",
    heroAccent: "the painted ceiling.",
    about: [
      "Debre Berhan Selassie is one of Gondar’s most remarkable historic churches. Its painted ceiling is the detail most consistently associated with the church.",
    ],
    highlights: [
      "Historic church",
      "Painted ceiling",
    ],
    thingsToDo: [
      "Cultural and religious heritage visit",
    ],
    image: "/images/tevan-portrait.jpg",
    imageAlt: "Local perspective on Gondar and northern Ethiopia",
  },
  {
    slug: "kuskuam",
    name: "Kuskuam",
    alsoKnownAs: ["Qusquam"],
    location: "Gondar",
    heroTitle: "Kuskuam",
    heroAccent: "Empress Mentewab.",
    about: [
      "Kuskuam (also known as Qusquam) is associated with Empress Mentewab and forms another chapter of Gondar’s royal history beyond Fasil Ghebbi.",
    ],
    highlights: [
      "Royal / heritage associations with Empress Mentewab",
      "Royal history beyond the main enclosure",
    ],
    thingsToDo: [
      "Heritage visit as part of Gondar city programmes",
    ],
    image: "/images/tevan-founder.jpg",
    imageAlt: "A local guide sharing the landscape and stories of northern Ethiopia",
  },
  {
    slug: "woleka",
    name: "Woleka",
    location: "Near Gondar, on the road toward Debark / Simien",
    heroTitle: "Woleka",
    heroAccent: "Beta Israel heritage.",
    about: [
      "Woleka is historically associated with Ethiopia’s Beta Israel community. Visits are a cultural stop emphasising heritage, history and respectful encounter — living heritage beyond monuments, typically on the way north toward Debark and Simien.",
    ],
    highlights: [
      "Beta Israel heritage associations",
      "Cultural stop on the Gondar–Debark corridor",
    ],
    thingsToDo: [
      "Heritage visit focused on listening and learning",
      "Respectful cultural encounter (not a staged show)",
    ],
    image: "/images/tevan-portrait.jpg",
    imageAlt: "Local perspective on Gondar and northern Ethiopia",
  },
  {
    slug: "kosoye-mountains",
    name: "Kosoye Mountains",
    location: "Near Gondar; rural highlands surrounding Kosoye",
    heroTitle: "Kosoye Mountains",
    heroAccent: "countryside near Gondar.",
    about: [
      "The Kosoye Mountains / Kosoye highlands offer rural Ethiopian life, village visits, farmland walks and mountain landscapes beyond Gondar’s castles and busy streets. Programmes include village visits, coffee ceremony, traditional food tasting, countryside walking and cultural interaction — community-based, not a staged cultural show.",
    ],
    highlights: [
      "Rural villages, traditional homes, farmland and highland scenery",
      "Local hospitality and community-based cultural experience",
      "Connection between people and mountains near Gondar",
    ],
    thingsToDo: [
      "Village visit and countryside highland walking (adapted to fitness)",
      "Coffee ceremony and traditional food tasting",
      "Cultural interaction and photography",
      "Half-day (approx. 4–5 hours) or full-day (approx. 7–9 hours) experiences as offered",
    ],
    image: "/images/road-to-simien.jpg",
    imageAlt: "Everyday life in the northern Ethiopian highlands",
  },
  {
    slug: "debark",
    name: "Debark",
    location: "Northern Ethiopia; principal gateway town to Simien Mountains National Park; approximately 100 km from Gondar by road (generally up to around two hours depending on conditions)",
    heroTitle: "Debark",
    heroAccent: "from the Gondar side.",
    about: [
      "From the Gondar side, Debark is the principal gateway town on the road north toward Simien Mountains National Park. Park arrangements and formalities are completed here before continuing into the mountains. It is the operational hinge between royal-city stays and highland trekking.",
    ],
    highlights: [
      "Gateway role for Simien journeys from Gondar",
      "Park formalities before mountain entry",
    ],
    thingsToDo: [
      "Complete park arrangements",
      "Transit toward trekking areas and camps",
    ],
    image: "/images/road-to-simien.jpg",
    imageAlt: "Highland road in northern Ethiopia on the approach toward the Simien Mountains",
  },
  {
    slug: "lake-tana",
    name: "Lake Tana / Bahir Dar",
    location: "Extension destination (northern circuit) — Northern Ethiopia; Lake Tana basin",
    heroTitle: "Lake Tana",
    heroAccent: "Bahir Dar.",
    about: [
      "Lake Tana / Bahir Dar is a major cultural landscape with historic monasteries and islands/shore sites on northern Ethiopia’s tourism circuit. It is a soft-adventure contrast to the Simien highlands — lake landscapes, selected monasteries, boat excursion subject to conditions, and optional Blue Nile Falls (appearance varies with season and water conditions).",
    ],
    highlights: [
      "Water, monasteries and cultural lake landscape",
      "Soft-adventure contrast to Simien highlands",
    ],
    thingsToDo: [
      "Boat excursion subject to conditions",
      "Monastery visits",
      "Lakefront time",
      "Optional Blue Nile Falls visit when season and conditions allow",
    ],
    image: "/images/tevan-founder.jpg",
    imageAlt: "A local guide sharing the landscape and stories of northern Ethiopia",
  },
  {
    slug: "blue-nile-falls",
    name: "Blue Nile Falls",
    location: "Extension destination (northern circuit) — Near Lake Tana / Bahir Dar area (optional add-on)",
    heroTitle: "Blue Nile Falls",
    heroAccent: "when conditions allow.",
    about: [
      "Blue Nile Falls is an optional add-on depending on season and conditions. Appearance varies with season and water conditions and should not be marketed as permanently spectacular.",
    ],
    highlights: [
      "Waterfall scenery when conditions are favourable",
      "Seasonal variation (not permanently spectacular)",
    ],
    thingsToDo: [
      "Optional visit as part of Lake Tana / Bahir Dar programmes",
    ],
    image: "/images/road-to-simien.jpg",
    imageAlt: "Highland landscape in northern Ethiopia",
  },
  {
    slug: "lalibela",
    name: "Lalibela",
    location: "Extension destination (northern circuit) — Northern Ethiopia",
    heroTitle: "Lalibela",
    heroAccent: "carved in stone.",
    about: [
      "Lalibela is the destination of rock-hewn church complexes, a city carved downward into stone. The churches remain part of a living religious landscape. An optional Yemrehanna Kristos extension is available where practical.",
    ],
    highlights: [
      "Principal rock-hewn church complexes",
      "Sacred stone architecture and living faith culture",
    ],
    thingsToDo: [
      "Church visits with a local guide",
      "Religious and cultural experiences",
      "Optional countryside walk and coffee",
      "Optional Yemrehanna Kristos extension where practical",
    ],
    image: "/images/fasil-ghebbi.jpg",
    imageAlt: "Historic stone architecture in northern Ethiopia",
  },
  {
    slug: "yemrehanna-kristos",
    name: "Yemrehanna Kristos",
    location: "Extension destination (northern circuit) — Near Lalibela",
    heroTitle: "Yemrehanna Kristos",
    heroAccent: "from Lalibela.",
    about: [
      "Yemrehanna Kristos is an optional extension from Lalibela where practical. Further architectural or historical detail is not expanded beyond that named optional extension.",
    ],
    highlights: [],
    thingsToDo: [
      "Optional extension visit when practical from Lalibela",
    ],
    image: "/images/tevan-portrait.jpg",
    imageAlt: "Local perspective on Gondar and northern Ethiopia",
  },
  {
    slug: "axum",
    name: "Axum",
    alsoKnownAs: ["Aksum"],
    location: "Extension destination (northern circuit) — Northern Ethiopia; ancient Aksumite kingdom centre (UNESCO-identified)",
    heroTitle: "Axum",
    heroAccent: "ancient kingdom.",
    about: [
      "Axum (Aksum) is the ancient African kingdom centre with monuments evidencing a major civilisation. It is a history-enthusiast destination on northern circuits, with stelae, inscriptions, archaeological areas, royal tombs, the St Mary of Zion complex, the Aksum Museum, and optional Yeha or other historical sites according to access.",
    ],
    highlights: [
      "Ancient kingdom heritage",
      "Northern Stelae Park / major stelae, Ezana inscriptions, archaeological areas, royal tombs",
      "St Mary of Zion complex and Aksum Museum",
    ],
    thingsToDo: [
      "Historical exploration",
      "Museum and archaeological visits",
      "Optional Yeha or other historical sites according to current access and conditions",
    ],
    image: "/images/tevan-founder.jpg",
    imageAlt: "A local guide sharing the landscape and stories of northern Ethiopia",
  },
  {
    slug: "yeha",
    name: "Yeha",
    location: "Extension destination (northern circuit) — Near Axum / northern historical area",
    heroTitle: "Yeha",
    heroAccent: "optional from Aksum.",
    about: [
      "Yeha is an optional historical excursion considered according to current access and conditions from Aksum. Site detail is not expanded beyond that framing.",
    ],
    highlights: [],
    thingsToDo: [
      "Optional historical excursion when access and conditions allow",
    ],
    image: "/images/tevan-portrait.jpg",
    imageAlt: "Local perspective on Gondar and northern Ethiopia",
  },
  {
    slug: "highland-villages",
    name: "Highland villages of the Simien approach",
    location: "Gondar–Debark road corridor; highland farmland and villages on the journey north toward Simien",
    heroTitle: "Highland villages",
    heroAccent: "the Simien approach.",
    about: [
      "On the road north from Gondar toward Debark and the park, highland road travel includes farming, villages and geography — the living highlands between the royal city and the escarpment. This is not a separate ticketed attraction; it is the landscape and community corridor travellers pass through when leaving Gondar for Simien. Related near-Gondar rural walking and village visits are available on separate Kosoye programmes.",
    ],
    highlights: [
      "Highland farming and village landscapes on the Gondar→Debark road",
      "Geographic transition from Gondar (~2,200 m) toward Debark and park altitudes",
      "Living highland context before park entry",
    ],
    thingsToDo: [
      "Observe farmland and village life from the road journey (commentary with local guide as offered on day trips)",
      "Combine with Debark park formalities and onward Simien walking",
      "Related rural walking and village visits available on separate Kosoye programmes near Gondar",
    ],
    image: "/images/road-to-simien.jpg",
    imageAlt: "Women collecting water along the road to the Simien Mountains",
  },
];
