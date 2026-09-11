export type SimienPlace = {
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

export function simienPlacePath(slug: string): string {
  return `/simien-mountains/${slug}`;
}

export function simienPlaceSummary(place: Pick<SimienPlace, "about">): string {
  return place.about[0] ?? "";
}

export function getSimienPlace(slug: string): SimienPlace | undefined {
  return simienPlaces.find((place) => place.slug === slug);
}

export const simienPlaces: SimienPlace[] = [
  {
    slug: "simien-mountains-national-park",
    name: "Simien Mountains National Park",
    location: "Northern Ethiopia highlands; accessed via Gondar to Debark",
    heroTitle: "Simien Mountains",
    heroAccent: "National Park",
    about: [
      "Simien Mountains National Park is a highland landscape of plateaus, deep valleys and dramatic escarpments, with remote villages and highland culture.",
      "The park is globally important for biodiversity, including endemic Walia ibex, Gelada and Ethiopian wolf. It is the setting for day trips, multi-day treks, wildlife observation, photography, mountain camping and Ras Dashen summit expeditions.",
    ],
    highlights: [
      "Scale of highland escarpments and deep valleys",
      "Endemic wildlife habitat (Gelada, Walia ibex; Ethiopian wolf sightings possible but uncommon)",
      "Giant lobelia / Afro-alpine vegetation",
      "Highland birdlife",
      "High-altitude adventure including Ras Dashen routes",
    ],
    thingsToDo: [
      "Day trips from Gondar via Debark",
      "Multi-day trekking along the classic corridor and longer summit routes",
      "Wildlife observation (sightings not guaranteed)",
      "Landscape and wildlife photography",
      "Mountain camping",
      "Ras Dashen summit expeditions (demanding; success not guaranteed)",
    ],
    image: "/images/simien-panorama.jpg",
    imageAlt: "Wide panorama across the Simien Mountains",
  },
  {
    slug: "debark",
    name: "Debark",
    location: "Northern Ethiopia; principal gateway town to Simien Mountains National Park; approximately 100 km from Gondar by road (generally up to around two hours depending on conditions)",
    heroTitle: "Debark",
    heroAccent: "the gateway town.",
    about: [
      "Debark is the principal gateway town for Simien Mountains National Park. Park arrangements and formalities are completed here before continuing into the mountains. It is a transit point rather than a sightseeing destination in its own right.",
    ],
    highlights: [
      "Gateway role for Simien journeys",
      "Park formalities and onward access into the highlands",
    ],
    thingsToDo: [
      "Complete park arrangements and formalities",
      "Continue by road or on foot toward trekking areas",
      "Brief transit stop on Gondar–Simien itineraries",
    ],
    image: "/images/road-to-simien.jpg",
    imageAlt: "Highland road in northern Ethiopia on the approach toward the Simien Mountains",
  },
  {
    slug: "buyit-ras",
    name: "Buyit Ras",
    location: "Simien Mountains; western / Sankaber area",
    heroTitle: "Buyit Ras",
    heroAccent: "a possible start.",
    about: [
      "Buyit Ras is mentioned in source itineraries as a possible trek starting point toward Sankaber, depending on conditions and the route selected. Detail beyond that logistical role is not expanded in the source.",
    ],
    highlights: [],
    thingsToDo: [
      "Introductory trekking toward Sankaber when selected as the start point",
    ],
    image: "/images/imet-gogo.jpg",
    imageAlt: "Highland landscape in the Simien Mountains",
  },
  {
    slug: "sankaber",
    name: "Sankaber",
    location: "Simien Mountains National Park; altitude approximately 3,200–3,250 m",
    heroTitle: "Sankaber",
    heroAccent: "the classic start.",
    about: [
      "Sankaber (Sankaber Camp) is a gateway to the classic Simien trekking routes and one of the most important starting points for multi-day treks. The area offers escarpment views and is known as an excellent area for spotting Gelada baboons. It is a common first overnight camp.",
    ],
    highlights: [
      "First dramatic Simien escarpment views on many itineraries",
      "Known Gelada habitat (sightings not guaranteed)",
      "Classic trek starting and overnight point",
    ],
    thingsToDo: [
      "Trekking on introductory highland trails",
      "Wildlife viewing",
      "Overnight camping at Sankaber Camp",
    ],
    image: "/images/imet-gogo.jpg",
    imageAlt: "Open plateau and escarpment typical of Simien trail country around Sankaber",
  },
  {
    slug: "geech",
    name: "Geech",
    location: "Simien Mountains National Park; altitude approximately 3,600 m",
    heroTitle: "Geech",
    heroAccent: "highland camp.",
    about: [
      "Geech (Geech Camp) is a classic overnight stop on Simien treks. Approaching camp, the landscape becomes increasingly Afro-alpine, with highland grasslands, giant lobelia and escarpment scenery. An optional nearby sunset viewpoint is noted in source itineraries.",
    ],
    highlights: [
      "Classic overnight camp on western/classic routes",
      "Giant lobelia highland vegetation",
      "Escarpment scenery and peaceful mountain surroundings",
      "Optional sunset viewpoint nearby",
    ],
    thingsToDo: [
      "Trekking and overnight camping",
      "Wildlife observation and photography",
      "Optional sunset viewpoint walk when conditions allow",
    ],
    image: "/images/geech-camp.jpg",
    imageAlt: "Tents on the high plateau near Geech",
  },
  {
    slug: "jinbar-waterfall",
    name: "Jinbar Waterfall",
    alsoKnownAs: ["Jinbar River", "Geech Abyss", "Genbar"],
    location: "Between Sankaber and Geech on the western Simien trekking route",
    heroTitle: "Jinbar Waterfall",
    heroAccent: "Geech Abyss.",
    about: [
      "Jinbar Waterfall (also Jinbar River / Geech Abyss; one itinerary uses Jinbar/Genbar) is where the Jinbar River disappears over the escarpment edge and plunges into the Geech Abyss. It is one of the defining scenes of the western Simien trekking route and a highlight of the Sankaber–Geech day.",
    ],
    highlights: [
      "Waterfall viewpoint above the Geech Abyss / deep gorge",
      "Defining scene on the Sankaber–Geech trek day",
    ],
    thingsToDo: [
      "Viewpoint stop during trek",
      "Photography of the waterfall and gorge",
    ],
    image: "/images/simien-panorama.jpg",
    imageAlt: "Deep valleys and escarpments in the Simien Mountains",
  },
  {
    slug: "imet-gogo",
    name: "Imet Gogo",
    location: "Simien Mountains; approximately 3,926 m",
    heroTitle: "Imet Gogo",
    heroAccent: "the signature view.",
    about: [
      "Imet Gogo is one of the signature viewpoints in the Simien Mountains. From the top, deep gorges, distant ridges and sheer cliffs form a panoramic escarpment landscape. It is the visual climax of many short and classic treks. Wildlife and birds of prey may be present around the cliffs (sightings not guaranteed).",
    ],
    highlights: [
      "Panoramic escarpment views",
      "Defining viewpoint on 3-day and classic itineraries",
      "Cliff habitat for wildlife and birds of prey (possible, not guaranteed)",
    ],
    thingsToDo: [
      "Viewpoint hike from Geech corridor routes",
      "Landscape photography",
      "Wildlife watching around cliffs when present",
    ],
    image: "/images/imet-gogo.jpg",
    imageAlt: "The immense cliffs and valleys seen from Imet Gogo",
  },
  {
    slug: "inatye",
    name: "Inatye",
    location: "Simien Mountains; between Imet Gogo and Chenek on classic routes",
    heroTitle: "Inatye",
    heroAccent: "highland country.",
    about: [
      "Inatye is a highland area passed on longer classic days continuing from Imet Gogo toward Chenek across dramatic highland terrain. It forms part of the big mountain day toward Chenek rather than a standalone overnight destination in the source.",
    ],
    highlights: [
      "Dramatic highland ridges and valleys",
      "Segment of the Imet Gogo–Chenek mountain day",
    ],
    thingsToDo: [
      "Trekking through on classic and longer routes",
    ],
    image: "/images/chenek-camp.jpg",
    imageAlt: "Highland ridges in the Simien Mountains",
  },
  {
    slug: "chenek",
    name: "Chenek",
    alsoKnownAs: ["Chennek"],
    location: "Simien Mountains National Park; altitude around 3,600–3,620 m",
    heroTitle: "Chenek",
    heroAccent: "among the peaks.",
    about: [
      "Chenek (Chenek Camp) is a major destination on longer Simien trekking routes, set among dramatic mountain scenery often described as a natural amphitheater of surrounding peaks. It is particularly known for wildlife opportunities including Gelada and Walia ibex, and is an important staging point for Bwahit and Ras Dashen routes. Optional morning hikes toward the Bwahit area are noted on some itineraries.",
    ],
    highlights: [
      "Classic wildlife area (Gelada, Walia ibex — sightings not guaranteed)",
      "High-altitude camp before summit / Bwahit routes",
      "Surrounding peaks and amphitheater-like setting",
    ],
    thingsToDo: [
      "Overnight camping",
      "Wildlife viewing and photography",
      "Optional morning hikes toward the Bwahit area (fitness, weather and time permitting)",
    ],
    image: "/images/chenek-camp.jpg",
    imageAlt: "Chenek camp among the Simien cliffs",
  },
  {
    slug: "ambaras",
    name: "Ambaras",
    location: "Simien Mountains; road pickup area after Imet Gogo on the 3-day trek",
    heroTitle: "Ambaras",
    heroAccent: "the road pickup.",
    about: [
      "Ambaras is often the road pickup point after Imet Gogo on the 3-day trek before the return to Gondar. Further attractions are not stated in the source beyond this logistical role.",
    ],
    highlights: [],
    thingsToDo: [
      "Vehicle pickup after trek; transfer toward Gondar",
    ],
    image: "/images/road-to-simien.jpg",
    imageAlt: "Mountain road in the Simien highlands",
  },
  {
    slug: "siha-gorge",
    name: "Siha Gorge",
    location: "Simien Mountains; between Imet Gogo and Chenek on the detailed 10-day expedition (Day 4)",
    heroTitle: "Siha Gorge",
    heroAccent: "on the long day.",
    about: [
      "Siha Gorge appears on the detailed 10-Day Simien Mountains & Ras Dashen Expedition itinerary as an area continued through after Imet Gogo on the way toward Chenek. Source detail is limited to highland scenery en route on that great-views day.",
    ],
    highlights: [
      "Highland scenery on the Geech → Imet Gogo → Chenek day",
      "Named waypoint on the detailed 10-day expedition",
    ],
    thingsToDo: [
      "Trekking through on longer expedition routes",
    ],
    image: "/images/simien-panorama.jpg",
    imageAlt: "Highland scenery in the Simien Mountains",
  },
  {
    slug: "bwahit-pass",
    name: "Bwahit Pass",
    alsoKnownAs: ["Bwahit", "Buahit"],
    location: "Simien Mountains; high point more than 4,000 m; pass approximately 4,200 m in itineraries",
    heroTitle: "Bwahit Pass",
    heroAccent: "above 4,000 m.",
    about: [
      "Bwahit (Bwahit Pass / Bwahit massif) is a major high point of the Simien range. The climb demands good fitness. It is used as a high-altitude finale on some classic routes or on the Chenek–Ambiko approach via Bwahit Pass before descending toward Meseha Valley en route to Ambiko and Ras Dashen.",
    ],
    highlights: [
      "High-altitude scenery and mountain challenge",
      "Gateway toward Ambiko / Ras Dashen",
      "Pass crossing on summit approaches (~4,200 m in itineraries)",
    ],
    thingsToDo: [
      "High-altitude trekking",
      "Optional morning hike from Chenek when used as a finale rather than a summit approach",
    ],
    image: "/images/chenek-camp.jpg",
    imageAlt: "High mountain terrain in the Simien Mountains",
  },
  {
    slug: "ambiko",
    name: "Ambiko",
    location: "Simien Mountains; approximately 3,200 m; traditional base for Ras Dejen / Ras Dashen summit",
    heroTitle: "Ambiko",
    heroAccent: "summit base camp.",
    about: [
      "Ambiko (Ambiko Camp) is the traditional base for the Ras Dashen (Ras Dejen) summit attempt. It is reached after crossing the Bwahit area, descending toward Meseha Valley, then climbing again to camp. Summit briefings and preparation take place here before the long summit day.",
    ],
    highlights: [
      "Base camp for Ethiopia’s highest summit",
      "Remote high-mountain setting",
    ],
    thingsToDo: [
      "Overnight camping",
      "Summit briefing and preparation",
      "Start and finish of the Ras Dashen ascent day",
    ],
    image: "/images/giant-lobelia.jpg",
    imageAlt: "Afro-alpine highland landscape in the Simien Mountains",
  },
  {
    slug: "ras-dashen",
    name: "Ras Dashen",
    alsoKnownAs: ["Ras Dejen"],
    location: "Simien Mountains massif; Ethiopia’s highest mountain; summit approximately 4,500+ m / approximately 4,543–4,550 m depending on wording in source",
    heroTitle: "Ras Dashen",
    heroAccent: "Ras Dejen.",
    about: [
      "Ras Dashen (also Ras Dejen) is Ethiopia’s highest mountain. UNESCO identifies Ras Dejen/Dashen within the Simien massif as Ethiopia’s highest point. Reaching the summit is a serious mountain experience rather than sightseeing: a demanding long day from Ambiko, typically with a pre-sunrise start. Summit success cannot be guaranteed; safety conditions determine the final decision.",
    ],
    highlights: [
      "Summit of Ethiopia (“roof of Ethiopia” framing in source)",
      "Vast highland panoramas from the high massif",
      "Defining objective of summit expeditions",
    ],
    thingsToDo: [
      "Summit trek (demanding round trip from Ambiko; source estimates ~14–16 km and ~8–10+ hours on detailed itineraries)",
      "Photography when conditions allow",
    ],
    image: "/images/simien-panorama.jpg",
    imageAlt: "Layered ridges in the high Simien Mountains",
  },
  {
    slug: "meseha-valley",
    name: "Meseha Valley",
    alsoKnownAs: ["Mesheha", "Meseha River"],
    location: "Simien Mountains; between Bwahit Pass and Ambiko / on descent from Ambiko toward Sona",
    heroTitle: "Meseha Valley",
    heroAccent: "the remote side.",
    about: [
      "Meseha Valley (Meseha River) is the valley and river landscape on the Ras Dashen approach and on the post-summit descent toward lower Simien. It marks a marked elevation change from the highlands and the remote side of the Simien journey.",
    ],
    highlights: [
      "Remote valley scenery",
      "Elevation change between high passes and Ambiko / lower camps",
    ],
    thingsToDo: [
      "Trekking on summit approach and post-summit descent routes",
    ],
    image: "/images/simien-panorama.jpg",
    imageAlt: "Highland landscape in the Simien Mountains",
  },
  {
    slug: "sona",
    name: "Sona",
    location: "Lower / eastern Simien trekking corridor after Ambiko",
    heroTitle: "Sona",
    heroAccent: "the quieter side.",
    about: [
      "Sona (Sona Camp) sits on the quieter, more remote side of the Simien landscape reached after descending from Ambiko toward the Meseha River area. It forms part of the full transect toward Adi Arkay, beyond the classic escarpment circuit.",
      "Continuing from Sona toward Mulit, the corridor passes Mekarebya Camp in the lower valleys: river landscape, remote countryside, a shift from cooler highland environment to warmer valleys with different vegetation and birdlife, and — depending on local conditions — possible swimming at suitable natural pools.",
    ],
    highlights: [
      "Remote valley / lowland-transition landscapes",
      "Beyond the classic escarpment circuit",
      "Corridor link toward Mekarebya and Mulit on full expeditions",
    ],
    thingsToDo: [
      "Overnight camping",
      "Trekking on the eastern / lower transect",
    ],
    image: "/images/giant-lobelia.jpg",
    imageAlt: "Highland landscape in the Simien Mountains",
  },
  {
    slug: "mulit",
    name: "Mulit",
    location: "Lower Simien; Incya River area on approach to Adi Arkay",
    heroTitle: "Mulit",
    heroAccent: "Incya River.",
    about: [
      "Mulit (Mulit Camp) is a quieter section of the lower Simien landscape following the Incya River area on the approach to Adi Arkay. Source notes opportunities to observe birdlife and experience rural village life.",
      "On the Sona–Mulit corridor, Mekarebya Camp precedes Mulit: further into lower valleys along river landscape, with possible natural pools depending on conditions.",
    ],
    highlights: [
      "Incya River area",
      "Birdlife and rural village life",
      "Different perspective of the Simien region after the high camps",
    ],
    thingsToDo: [
      "Trekking and overnight camping",
      "Observation of birdlife and rural life (as encountered; not staged guarantees)",
    ],
    image: "/images/road-to-simien.jpg",
    imageAlt: "Rural highland landscape in northern Ethiopia",
  },
  {
    slug: "adi-arkay",
    name: "Adi Arkay",
    location: "End of the full Simien transect; vehicle pickup point before return to Gondar",
    heroTitle: "Adi Arkay",
    heroAccent: "the crossing ends.",
    about: [
      "Adi Arkay is where the final walk of the Grand / Full Simien expedition meets the vehicle before the drive back toward Gondar. Source detail is logistical rather than scenic: completion point of the long Simien crossing.",
    ],
    highlights: [
      "Completion point of the long Simien transect",
      "Vehicle pickup before return to Gondar",
    ],
    thingsToDo: [
      "Final walk to the pickup point",
      "Vehicle transfer toward Gondar",
    ],
    image: "/images/road-to-simien.jpg",
    imageAlt: "Road through the northern Ethiopian highlands",
  },
];
