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

/** Client-approved website copy; preserve stable route slugs. */
export const gondarPlaces: GondarPlace[] = [
  {
    "slug": "gondar",
    "name": "Gondar",
    "location": "Northern Ethiopia; gateway to Simien Mountains National Park; altitude approximately 2,200 m",
    "heroTitle": "Gondar",
    "heroAccent": "the royal city.",
    "about": [
      "Gondar is the historic royal city once capital of the Ethiopian Empire. Stone walls, royal compounds, churches and centuries of local history sit within a living modern city. It is Ethiopia’s Royal City and the natural gateway toward Simien — a base for heritage tours, food and coffee experiences, photography walks, market visits, countryside running, and the start of mountain journeys."
    ],
    "highlights": [
      "Imperial history and architecture",
      "Living city beyond the monuments",
      "Timkat festival association centred on Fasil’s Pool",
      "Gateway to Simien Mountains National Park",
      "Coffee culture, markets and highland rural links"
    ],
    "thingsToDo": [
      "City sightseeing and heritage tours",
      "Coffee and food experiences",
      "Photography walks",
      "Market and local-life visits",
      "Hidden countryside running",
      "Departures for Simien day trips and multi-day treks"
    ],
    "image": "/images/fasil-ghebbi.jpg",
    "imageAlt": "Stone arches at the royal fortress of Fasil Ghebbi in Gondar"
  },
  {
    "slug": "fasil-ghebbi",
    "name": "Fasil Ghebbi (Royal Enclosure)",
    "alsoKnownAs": [
      "Royal Enclosure",
      "historic Royal Compound"
    ],
    "location": "Gondar",
    "heroTitle": "Fasil Ghebbi",
    "heroAccent": "the Royal Enclosure.",
    "about": [
      "Fasil Ghebbi (Royal Enclosure / historic Royal Compound) is the royal enclosure associated with Emperor Fasilides and the Gondarine period. It is a UNESCO World Heritage Site and the core of Gondar’s imperial story, with castles, compounds and stone architecture that define the city’s royal identity."
    ],
    "highlights": [
      "Royal castles and compounds",
      "Imperial architecture and Gondarine history",
      "UNESCO World Heritage Site",
      "Central stop on half-day and full-day Gondar programmes"
    ],
    "thingsToDo": [
      "Guided heritage visits of the enclosure and castles",
      "Architectural and historical interpretation with a local guide",
      "Photography of courtyards, walls and towers",
      "Combine with churches and Fasilides’ Bath on city itineraries"
    ],
    "image": "/images/fasil-ghebbi.jpg",
    "imageAlt": "Stone arches at the royal fortress of Fasil Ghebbi in Gondar"
  },
  {
    "slug": "fasilides-bath",
    "name": "Fasilides’ Bath / Fasil’s Pool",
    "alsoKnownAs": [
      "Fasil’s Pool"
    ],
    "location": "Gondar",
    "heroTitle": "Fasilides’ Bath",
    "heroAccent": "Fasil’s Pool.",
    "about": [
      "Fasilides’ Bath (Fasil’s Pool) is a historic bath and pool complex with particular cultural significance during Timkat celebrations centred on the site. Outside festival time it remains a key heritage stop on Gondar itineraries, combining architecture, gardens and ceremonial history."
    ],
    "highlights": [
      "Historic bath and pool complex",
      "Strong Timkat ceremonial association",
      "Quiet heritage setting outside festival dates",
      "Photogenic architecture and grounds"
    ],
    "thingsToDo": [
      "Sightseeing visits year-round",
      "Festival observation during Timkat (schedules and access can change)",
      "Photography of the pool complex and surrounding walls",
      "Combine with Fasil Ghebbi and Debre Berhan Selassie"
    ],
    "image": "/images/fasil-ghebbi.jpg",
    "imageAlt": "A local guide sharing the landscape and stories of northern Ethiopia"
  },
  {
    "slug": "debre-berhan-selassie",
    "name": "Debre Berhan Selassie",
    "location": "Gondar",
    "heroTitle": "Debre Berhan Selassie",
    "heroAccent": "the painted ceiling.",
    "about": [
      "Debre Berhan Selassie is one of Gondar’s most remarkable historic churches. Its painted ceiling of winged angel faces is the detail most consistently highlighted by visitors and guides, and the church remains an active place of worship within Gondar’s religious landscape."
    ],
    "highlights": [
      "Historic church within Gondar’s sacred circuit",
      "Famous painted ceiling",
      "Living religious context alongside heritage tourism",
      "Strong subject for respectful photography (where permitted)"
    ],
    "thingsToDo": [
      "Cultural and religious heritage visit with a local guide",
      "Study of mural and ceiling painting traditions",
      "Quiet time for observation and interpretation",
      "Combine with other Gondar churches and royal sites"
    ],
    "image": "/images/road-to-simien.jpg",
    "imageAlt": "Local perspective on Gondar and northern Ethiopia"
  },
  {
    "slug": "kuskuam",
    "name": "Kuskuam",
    "alsoKnownAs": [
      "Qusquam"
    ],
    "location": "Gondar",
    "heroTitle": "Kuskuam",
    "heroAccent": "Empress Mentewab.",
    "about": [
      "Kuskuam is associated with Empress Mentewab and forms another chapter of Gondar’s royal history beyond Fasil Ghebbi. The ruined palace and church complex sit on higher ground above the city, offering a quieter heritage stop and a different perspective on Gondarine power and patronage."
    ],
    "highlights": [
      "Royal and heritage associations with Empress Mentewab",
      "Royal history beyond the main enclosure",
      "Elevated setting with views over Gondar",
      "Complementary stop on full-day heritage programmes"
    ],
    "thingsToDo": [
      "Heritage visit as part of Gondar city programmes",
      "Guided interpretation of Mentewab’s era",
      "Photography of ruins and highland city views",
      "Combine with Fasil Ghebbi and Debre Berhan Selassie"
    ],
    "image": "/images/fasil-ghebbi.jpg",
    "imageAlt": "A local guide sharing the landscape and stories of northern Ethiopia"
  },
  {
    "slug": "woleka",
    "name": "Woleka",
    "location": "Near Gondar, on the road toward Debark / Simien",
    "heroTitle": "Woleka",
    "heroAccent": "Beta Israel heritage.",
    "about": [
      "Woleka is historically associated with Ethiopia’s Beta Israel community. Visits are framed as a cultural stop emphasising heritage, history and respectful encounter — living heritage beyond monuments, typically on the way north toward Debark and Simien. Programmes focus on listening and learning rather than staged performance."
    ],
    "highlights": [
      "Beta Israel heritage associations",
      "Cultural stop on the Gondar–Debark corridor",
      "Living heritage beyond the royal enclosure",
      "Context for northern Ethiopia’s diverse communities"
    ],
    "thingsToDo": [
      "Heritage visit focused on listening and learning",
      "Respectful cultural encounter (not a staged show)",
      "Combine with the road journey toward Debark and Simien",
      "Photography only with consent and guide guidance"
    ],
    "image": "/images/road-to-simien.jpg",
    "imageAlt": "Local perspective on Gondar and northern Ethiopia"
  },
  {
    "slug": "kosoye-mountains",
    "name": "Kosoye Mountains",
    "location": "Near Gondar; rural highlands surrounding Kosoye",
    "heroTitle": "Kosoye Mountains",
    "heroAccent": "countryside near Gondar.",
    "about": [
      "The Kosoye Mountains / Kosoye highlands offer rural Ethiopian life, village visits, farmland walks and mountain landscapes beyond Gondar’s castles and busy streets. Programmes include village visits, coffee ceremony, traditional food tasting, countryside walking and cultural interaction — positioned as community-based, not a staged cultural show. Half-day (approximately 4–5 hours) and full-day (approximately 7–9 hours) formats are available."
    ],
    "highlights": [
      "Rural villages, traditional homes, farmland and highland scenery",
      "Local hospitality and community-based cultural experience",
      "Connection between people and mountains near Gondar",
      "Flexible half-day or full-day pacing"
    ],
    "thingsToDo": [
      "Village visit and countryside highland walking (adapted to fitness)",
      "Coffee ceremony and traditional food tasting",
      "Cultural interaction and photography",
      "Combine with Gondar heritage before or after Simien journeys"
    ],
    "image": "/images/road-to-simien.jpg",
    "imageAlt": "Everyday life in the northern Ethiopian highlands"
  },
  {
    "slug": "debark",
    "name": "Debark",
    "location": "Northern Ethiopia; principal gateway town to Simien Mountains National Park; approximately 100 km from Gondar by road (generally up to around two hours depending on conditions)",
    "heroTitle": "Debark",
    "heroAccent": "from the Gondar side.",
    "about": [
      "From the Gondar side, Debark is the principal gateway town on the road north toward Simien Mountains National Park. Park arrangements and formalities are completed here before continuing into the mountains. It is the operational hinge between royal-city stays and highland trekking."
    ],
    "highlights": [
      "Gateway role for Simien journeys from Gondar",
      "Park formalities before mountain entry",
      "Highland town on the Gondar–Simien corridor",
      "Practical supply and logistics stop"
    ],
    "thingsToDo": [
      "Complete park arrangements",
      "Transit toward trekking areas and camps",
      "Brief town stop on day trips and multi-day programmes"
    ],
    "image": "/images/road-to-simien.jpg",
    "imageAlt": "Highland road in northern Ethiopia on the approach toward the Simien Mountains"
  },
  {
    "slug": "lake-tana",
    "name": "Lake Tana / Bahir Dar",
    "location": "Northern-circuit extension — Northern Ethiopia; Lake Tana basin",
    "heroTitle": "Lake Tana",
    "heroAccent": "Bahir Dar.",
    "about": [
      "Lake Tana / Bahir Dar is a major cultural landscape with historic monasteries and islands or shore sites on northern Ethiopia’s tourism circuit. It offers a soft-adventure contrast to the Simien highlands — lake landscapes, selected monasteries, boat excursions subject to conditions, and optional Blue Nile Falls (appearance varies with season and water conditions). Commonly combined with Gondar and Simien on 5–7 day private journeys."
    ],
    "highlights": [
      "Water, monasteries and cultural lake landscape",
      "Soft-adventure contrast to Simien highlands",
      "Boat access to selected island and shore monasteries (conditions permitting)",
      "Optional Blue Nile Falls add-on when season allows"
    ],
    "thingsToDo": [
      "Boat excursion subject to conditions",
      "Monastery visits with a local guide",
      "Lakefront time in Bahir Dar",
      "Optional Blue Nile Falls visit when season and conditions allow",
      "Combine with Gondar heritage and Simien trekking"
    ],
    "image": "/images/fasil-ghebbi.jpg",
    "imageAlt": "A local guide sharing the landscape and stories of northern Ethiopia"
  },
  {
    "slug": "blue-nile-falls",
    "name": "Blue Nile Falls",
    "location": "Northern-circuit extension — Near Lake Tana / Bahir Dar area (optional add-on)",
    "heroTitle": "Blue Nile Falls",
    "heroAccent": "when conditions allow.",
    "about": [
      "Blue Nile Falls is an optional add-on depending on season and conditions. Appearance varies with season and water conditions and should not be presented as permanently spectacular. When flow is strong, the falls and surrounding gorge walks are a worthwhile half-day from Bahir Dar; in drier periods the volume may be modest."
    ],
    "highlights": [
      "Waterfall scenery when conditions are favourable",
      "Seasonal variation in volume and spray",
      "Gorge and countryside walks near the falls",
      "Easy add-on to Lake Tana / Bahir Dar programmes"
    ],
    "thingsToDo": [
      "Optional visit as part of Lake Tana / Bahir Dar programmes",
      "Viewpoint walking and photography",
      "Local guide interpretation of the Blue Nile corridor"
    ],
    "image": "/images/road-to-simien.jpg",
    "imageAlt": "Highland landscape in northern Ethiopia"
  },
  {
    "slug": "lalibela",
    "name": "Lalibela",
    "location": "Northern-circuit extension — Northern Ethiopia",
    "heroTitle": "Lalibela",
    "heroAccent": "carved in stone.",
    "about": [
      "Lalibela is the destination of rock-hewn church complexes, a sacred landscape carved downward into stone. The churches remain part of a living religious landscape, with active worship alongside heritage tourism. Optional Yemrehanna Kristos extension is available where practical. Lalibela pairs naturally with Gondar and Simien on 7–10 day northern combination journeys."
    ],
    "highlights": [
      "Principal rock-hewn church complexes",
      "Sacred stone architecture and living faith culture",
      "Strong subject for guided cultural and photographic visits",
      "Optional countryside and Yemrehanna Kristos extensions"
    ],
    "thingsToDo": [
      "Church visits with a local guide",
      "Religious and cultural experiences",
      "Optional countryside walk and coffee",
      "Optional Yemrehanna Kristos extension where practical",
      "Combine with Gondar and Simien on private northern circuits"
    ],
    "image": "/images/fasil-ghebbi.jpg",
    "imageAlt": "Historic stone architecture in northern Ethiopia"
  },
  {
    "slug": "yemrehanna-kristos",
    "name": "Yemrehanna Kristos",
    "location": "Northern-circuit extension — Near Lalibela",
    "heroTitle": "Yemrehanna Kristos",
    "heroAccent": "from Lalibela.",
    "about": [
      "Yemrehanna Kristos is a cave church complex near Lalibela, built within a natural rock shelter and noted for its wooden architecture, stonework and quieter setting compared with the main Lalibela churches. It is offered as an optional extension from Lalibela where road access and timing allow, and suits travellers who want a deeper look at Lasta’s sacred landscape beyond the principal rock-hewn circuit."
    ],
    "highlights": [
      "Cave church setting near Lalibela",
      "Distinctive wood and stone architecture",
      "Quieter alternative to the main Lalibela complexes",
      "Optional half-day or full-day extension when practical"
    ],
    "thingsToDo": [
      "Guided visit from Lalibela when access and timing allow",
      "Architectural and religious interpretation",
      "Photography where permitted",
      "Combine with additional Lalibela churches and countryside stops"
    ],
    "image": "/images/road-to-simien.jpg",
    "imageAlt": "Local perspective on Gondar and northern Ethiopia"
  },
  {
    "slug": "axum",
    "name": "Axum / Aksum",
    "alsoKnownAs": [
      "Aksum"
    ],
    "location": "Northern-circuit extension — Northern Ethiopia; ancient Aksumite kingdom centre",
    "heroTitle": "Axum",
    "heroAccent": "ancient kingdom.",
    "about": [
      "Axum (Aksum) is the ancient African kingdom centre with monuments evidencing a major civilisation. It is a history-focused destination on northern circuits, with stelae, inscriptions, archaeological areas, royal tombs, the St Mary of Zion complex, the Aksum Museum, and optional Yeha or other historical sites according to current access. Commonly combined with Gondar and Simien on 7–10 day historic northern routes."
    ],
    "highlights": [
      "Ancient kingdom heritage",
      "Northern Stelae Park / major stelae, Ezana inscriptions, archaeological areas, royal tombs",
      "St Mary of Zion complex and Aksum Museum",
      "Optional Yeha excursion when access allows"
    ],
    "thingsToDo": [
      "Historical exploration with a local guide",
      "Museum and archaeological visits",
      "Optional Yeha or other historical sites according to current access and conditions",
      "Combine with Gondar, Simien and Lalibela on longer northern circuits"
    ],
    "image": "/images/fasil-ghebbi.jpg",
    "imageAlt": "A local guide sharing the landscape and stories of northern Ethiopia"
  },
  {
    "slug": "yeha",
    "name": "Yeha",
    "location": "Northern-circuit extension — Near Axum / northern historical area",
    "heroTitle": "Yeha",
    "heroAccent": "optional from Aksum.",
    "about": [
      "Yeha is an early historic site near Axum, known for its monumental stone temple and associations with pre-Aksumite and early highland civilisation. It is offered as an optional historical excursion from Aksum according to current access and road conditions. The visit suits travellers interested in archaeology and the deeper timeline of northern Ethiopia beyond the Axum stelae fields."
    ],
    "highlights": [
      "Early monumental stone temple",
      "Pre-Aksumite / early highland historical context",
      "Optional half-day excursion from Axum",
      "Quieter archaeological stop on historic northern routes"
    ],
    "thingsToDo": [
      "Optional historical excursion when access and conditions allow",
      "Guided interpretation of the temple and surrounding site",
      "Photography of monumental masonry",
      "Combine with Axum stelae, museum and St Mary of Zion visits"
    ],
    "image": "/images/road-to-simien.jpg",
    "imageAlt": "Local perspective on Gondar and northern Ethiopia"
  },
  {
    "slug": "highland-villages",
    "name": "Highland villages & farming communities of the Simien approach",
    "location": "Gondar–Debark road corridor; highland farmland and villages on the journey north toward Simien",
    "heroTitle": "Highland villages",
    "heroAccent": "the Simien approach.",
    "about": [
      "On the road north from Gondar toward Debark and the park, highland farmland and villages form the living landscape between the royal city and the escarpment. Day-trip and approach programmes use this drive for geography and local-life commentary — farming, settlement patterns and the rise toward park altitudes. This is not a separate ticketed attraction; it is the community corridor travellers pass through when leaving Gondar for Simien. Related near-Gondar rural walking is also available on Kosoye programmes."
    ],
    "highlights": [
      "Highland farming and village landscapes on the Gondar → Debark road",
      "Geographic transition from Gondar (~2,200 m) toward Debark and park altitudes",
      "Living highland context before park entry",
      "Local-life commentary with a guide on day trips and trek departures"
    ],
    "thingsToDo": [
      "Observe farmland and village life from the road journey with guide commentary",
      "Combine with Debark park formalities and onward Simien walking",
      "Related rural walking and village visits on separate Kosoye programmes near Gondar",
      "Photography of highland fields and settlements from roadside stops"
    ],
    "image": "/images/road-to-simien.jpg",
    "imageAlt": "Women collecting water along the road to the Simien Mountains"
  }
];
