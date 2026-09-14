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

/** Client-approved website copy; preserve stable route slugs. */
export const simienPlaces: SimienPlace[] = [
  {
    "slug": "simien-mountains-national-park",
    "name": "Simien Mountains National Park",
    "location": "Northern Ethiopia highlands; accessed via Gondar to Debark",
    "heroTitle": "Simien Mountains",
    "heroAccent": "National Park",
    "about": [
      "Simien Mountains National Park is a highland landscape of plateaus, deep valleys and dramatic escarpments, with remote villages and living highland culture. The park is globally important for biodiversity and is known habitat for endemic Walia ibex, Gelada and Ethiopian wolf. It is the setting for day trips, multi-day treks, wildlife observation, photography, mountain camping and Ras Dashen summit expeditions."
    ],
    "highlights": [
      "Scale of highland escarpments and deep valleys",
      "Known habitat for Gelada, Walia ibex and Ethiopian wolf (sightings possible, never guaranteed)",
      "Giant lobelia and Afro-alpine vegetation",
      "Highland birdlife and cliff-edge scenery",
      "High-altitude adventure including Ras Dashen routes"
    ],
    "thingsToDo": [
      "Day trips from Gondar via Debark",
      "Multi-day trekking along the classic corridor and longer summit routes",
      "Wildlife observation with a local guide (sightings not guaranteed)",
      "Landscape and wildlife photography",
      "Mountain camping at established trek camps",
      "Ras Dashen summit expeditions (demanding; summit success not guaranteed)"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789386859/simien-mountains.jpg",
    "imageAlt": "A waterfall descending between green cliffs in the Simien Mountains"
  },
  {
    "slug": "debark",
    "name": "Debark",
    "location": "Northern Ethiopia; principal gateway town to Simien Mountains National Park; approximately 100 km from Gondar by road (generally up to around two hours depending on conditions)",
    "heroTitle": "Debark",
    "heroAccent": "the gateway town.",
    "about": [
      "Debark is the principal gateway town for Simien Mountains National Park. Park arrangements and formalities are completed here before continuing into the mountains. For most travellers it is a transit and logistics stop rather than a long sightseeing stay, linking the royal city of Gondar with the highland escarpment."
    ],
    "highlights": [
      "Gateway role for all Simien journeys from Gondar",
      "Park formalities and onward access into the highlands",
      "Highland market-town character on the road north"
    ],
    "thingsToDo": [
      "Complete park arrangements and formalities with your guide",
      "Continue by road or on foot toward trekking areas",
      "Brief transit stop on Gondar–Simien itineraries",
      "Stock final supplies if needed before entering the park"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789397581/Debark.png",
    "imageAlt": "Thatched buildings and green grounds near Debark"
  },
  {
    "slug": "buyit-ras",
    "name": "Buyit Ras",
    "location": "Simien Mountains; western approach toward Sankaber",
    "heroTitle": "Buyit Ras",
    "heroAccent": "a possible start.",
    "about": [
      "Buyit Ras sits on the western approach into the classic Simien trekking corridor and is often used as a trailhead when conditions and the selected route favour a walk into Sankaber rather than a road drop closer to camp. The area introduces travellers to the first open highland views, escarpment edges and grassland habitat where Gelada are often observed. It is a practical start point for 3-day and 5-day programmes that begin walking soon after park entry."
    ],
    "highlights": [
      "Common trek starting point toward Sankaber",
      "First open escarpment views on many western approaches",
      "Known Gelada habitat on the approach trails (sightings not guaranteed)",
      "Flexible trailhead choice depending on weather and group fitness"
    ],
    "thingsToDo": [
      "Begin guided trekking toward Sankaber when selected as the start point",
      "Short introductory highland walks after park entry",
      "Wildlife watching and photography along the approach",
      "Acclimatisation walking before the first overnight camp"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789386873/buhit-ras.jpg",
    "imageAlt": "A hiker overlooking the mountains at Buyit Ras"
  },
  {
    "slug": "sankaber",
    "name": "Sankaber",
    "location": "Simien Mountains National Park; altitude approximately 3,200–3,250 m",
    "heroTitle": "Sankaber",
    "heroAccent": "the classic start.",
    "about": [
      "Sankaber (Sankaber Camp) is a gateway to the classic Simien trekking routes and one of the most important starting points for multi-day treks. The area offers escarpment views and is known habitat for Gelada baboons. It is a common first overnight camp on 2-day introductions, 3-day adventures, 4-day classic treks and longer summit expeditions."
    ],
    "highlights": [
      "First dramatic Simien escarpment views on many itineraries",
      "Known Gelada habitat (sightings not guaranteed)",
      "Classic trek starting and overnight point",
      "Accessible highland walking for first mountain days"
    ],
    "thingsToDo": [
      "Trekking on introductory highland trails",
      "Wildlife viewing along the escarpment rim",
      "Overnight camping at Sankaber Camp",
      "Photography of cliffs, valleys and highland light"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789386871/Sankaber.jpg",
    "imageAlt": "Layered cliffs and green valleys near Sankaber in the Simien Mountains"
  },
  {
    "slug": "geech",
    "name": "Geech",
    "location": "Simien Mountains National Park; altitude approximately 3,600 m",
    "heroTitle": "Geech",
    "heroAccent": "highland camp.",
    "about": [
      "Geech (Geech Camp) is a classic overnight stop on Simien treks. Approaching camp, the landscape becomes increasingly Afro-alpine, with highland grasslands, giant lobelia and escarpment scenery. An optional nearby sunset viewpoint is often offered when time and weather allow. Geech is the usual base before the climb to Imet Gogo."
    ],
    "highlights": [
      "Classic overnight camp on western and classic routes",
      "Giant lobelia highland vegetation",
      "Escarpment scenery and quieter mountain surroundings",
      "Optional sunset viewpoint nearby",
      "Staging point for Imet Gogo the following day"
    ],
    "thingsToDo": [
      "Trekking and overnight camping",
      "Wildlife observation and photography",
      "Optional sunset viewpoint walk when conditions allow",
      "Rest and acclimatisation before higher viewpoint days"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789386842/Guche-camp-simen.jpg",
    "imageAlt": "A tent beside a shelter and giant lobelias at Geech camp"
  },
  {
    "slug": "jinbar-waterfall",
    "name": "Jinbar Waterfall (Geech Abyss)",
    "alsoKnownAs": [
      "Jinbar River",
      "Geech Abyss",
      "Genbar"
    ],
    "location": "Between Sankaber and Geech on the western Simien trekking route",
    "heroTitle": "Jinbar Waterfall",
    "heroAccent": "Geech Abyss.",
    "about": [
      "Jinbar Waterfall (also known as Jinbar River / Geech Abyss; sometimes Genbar in local usage) is where the Jinbar River disappears over the escarpment edge and plunges into the Geech Abyss. It is one of the defining scenes of the western Simien trekking route and a highlight of the Sankaber–Geech day. Water volume varies with season and recent rainfall."
    ],
    "highlights": [
      "Waterfall viewpoint above the Geech Abyss / deep gorge",
      "Defining scene on the Sankaber–Geech trek day",
      "Strong subject for landscape photography",
      "Seasonal variation in flow and spray"
    ],
    "thingsToDo": [
      "Viewpoint stop during the Sankaber–Geech trek",
      "Photography of the waterfall and gorge",
      "Short guided approach walks to safe viewing positions"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789386844/Jinbar_Waterfall.jpg",
    "imageAlt": "Two visitors at the Jinbar Waterfall viewpoint"
  },
  {
    "slug": "imet-gogo",
    "name": "Imet Gogo",
    "location": "Simien Mountains; approximately 3,926 m",
    "heroTitle": "Imet Gogo",
    "heroAccent": "the signature view.",
    "about": [
      "Imet Gogo is one of the signature viewpoints in the Simien Mountains. From the top, deep gorges, distant ridges and sheer cliffs form a panoramic escarpment landscape. It is the visual climax of many short and classic treks and a focus for photography programmes. Wildlife and birds of prey may be present around the cliffs (sightings not guaranteed)."
    ],
    "highlights": [
      "Panoramic escarpment views at approximately 3,926 m",
      "Defining viewpoint on 3-day and classic itineraries",
      "Cliff habitat for wildlife and birds of prey (possible, not guaranteed)",
      "Strong light for landscape photography, especially morning and late day"
    ],
    "thingsToDo": [
      "Viewpoint hike from Geech corridor routes",
      "Landscape photography",
      "Wildlife watching around cliffs when present",
      "Rest and interpretation with your guide at the viewpoint"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789397557/imet-gogo.png",
    "imageAlt": "Cliffs and deep valleys seen from Imet Gogo"
  },
  {
    "slug": "inatye",
    "name": "Inatye",
    "location": "Simien Mountains; between Imet Gogo and Chenek on classic routes",
    "heroTitle": "Inatye",
    "heroAccent": "highland country.",
    "about": [
      "Inatye is a highland ridge and valley section passed on longer classic days continuing from Imet Gogo toward Chenek. The terrain is open and dramatic, with deep drops, distant peaks and frequent wildlife habitat along the escarpment. It forms part of the big mountain day toward Chenek rather than a standalone overnight destination, and is named on 5-day Royal City & Mountain Adventure itineraries."
    ],
    "highlights": [
      "Dramatic highland ridges and valleys",
      "Segment of the Imet Gogo–Chenek mountain day",
      "Open views toward Chenek and surrounding peaks",
      "Wildlife habitat along the escarpment edge (sightings not guaranteed)"
    ],
    "thingsToDo": [
      "Trekking through on classic and longer routes",
      "Photography of ridges, valleys and distant camps",
      "Wildlife observation while moving between viewpoints"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789397558/Inatye.png",
    "imageAlt": "Steep cliffs above green slopes near Inatye"
  },
  {
    "slug": "chenek",
    "name": "Chenek",
    "alsoKnownAs": [
      "Chennek"
    ],
    "location": "Simien Mountains National Park; altitude around 3,600–3,620 m (also spelled Chennek)",
    "heroTitle": "Chenek",
    "heroAccent": "among the peaks.",
    "about": [
      "Chenek (Chenek Camp) is a major destination on longer Simien trekking routes, set among dramatic mountain scenery often described as a natural amphitheatre of surrounding peaks. It is particularly known for wildlife opportunities including Gelada and Walia ibex, and is an important staging point for Bwahit and Ras Dashen routes. Optional morning hikes toward the Bwahit area are offered on some itineraries when fitness, weather and time allow."
    ],
    "highlights": [
      "Classic wildlife area (Gelada, Walia ibex — sightings not guaranteed)",
      "High-altitude camp before summit and Bwahit routes",
      "Surrounding peaks and amphitheatre-like setting",
      "End point of the 4-Day Classic corridor"
    ],
    "thingsToDo": [
      "Overnight camping",
      "Wildlife viewing and photography",
      "Optional morning hikes toward the Bwahit area (fitness, weather and time permitting)",
      "Rest day or staging before Ambiko on summit itineraries"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789386843/cheenk-camp.jpg",
    "imageAlt": "Travellers sharing an outdoor meal at Chenek camp"
  },
  {
    "slug": "ambaras",
    "name": "Ambaras",
    "location": "Simien Mountains; road corridor after Imet Gogo on shorter western treks",
    "heroTitle": "Ambaras",
    "heroAccent": "the road pickup.",
    "about": [
      "Ambaras is a road-access area on the western Simien corridor, often used as the vehicle pickup point after Imet Gogo on the 3-day trekking adventure before the return to Gondar. The surrounding highland slopes and villages mark the transition from foot travel back to the park road network. It is a practical logistics point rather than a multi-night camp, but the approach walk offers continuing escarpment views and rural highland scenery."
    ],
    "highlights": [
      "Common road pickup after Imet Gogo on 3-day itineraries",
      "Highland road corridor linking trek end to Debark and Gondar",
      "Village and farmland context on the western approach",
      "Flexible exit point when weather or group pace requires an earlier transfer"
    ],
    "thingsToDo": [
      "Complete the walk from Imet Gogo to the road",
      "Vehicle pickup and transfer toward Debark / Gondar",
      "Short photography stops along the highland road when time allows"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789397557/Ambaras.png",
    "imageAlt": "Rocky pinnacles rising above green slopes near Ambaras"
  },
  {
    "slug": "siha-gorge",
    "name": "Siha Gorge",
    "location": "Simien Mountains; between Imet Gogo and Chenek on the detailed 10-day expedition (Day 4)",
    "heroTitle": "Siha Gorge",
    "heroAccent": "on the long day.",
    "about": [
      "Siha Gorge is a named highland gorge section on the great-views day from Geech via Imet Gogo toward Chenek. The route continues through deep cuts in the escarpment, with steep walls, distant ridges and open Afro-alpine terrain. It is highlighted on the 10-Day Simien Mountains & Ras Dashen Expedition as part of one of the most scenic walking days of the full crossing."
    ],
    "highlights": [
      "Highland gorge scenery on the Geech → Imet Gogo → Chenek day",
      "Named waypoint on the detailed 10-day expedition",
      "Deep escarpment cuts and long ridge views",
      "Strong landscape photography subject in clear weather"
    ],
    "thingsToDo": [
      "Trekking through on longer expedition and classic corridor routes",
      "Viewpoint and photography stops with your guide",
      "Wildlife watching along cliff edges when animals are present"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789397564/siha-gorge.png",
    "imageAlt": "An ibex standing on a rocky ridge in the Simien Mountains"
  },
  {
    "slug": "bwahit-pass",
    "name": "Bwahit Pass",
    "alsoKnownAs": [
      "Bwahit",
      "Buahit"
    ],
    "location": "Simien Mountains; high point more than 4,000 m; pass approximately 4,200 m in itineraries (also spelled Buahit)",
    "heroTitle": "Bwahit Pass",
    "heroAccent": "above 4,000 m.",
    "about": [
      "Bwahit (Bwahit Pass / Bwahit massif) is a major high point of the Simien range. The climb demands good fitness and careful pacing. It is used as a high-altitude finale on some classic routes or on the Chenek–Ambiko approach via Bwahit Pass before descending toward Meseha Valley en route to Ambiko and Ras Dashen. Optional morning hikes from Chenek toward the Bwahit area are available when used as a finale rather than a summit approach."
    ],
    "highlights": [
      "High-altitude scenery and mountain challenge",
      "Gateway toward Ambiko / Ras Dashen",
      "Pass crossing on summit approaches (~4,200 m in itineraries)",
      "Optional finale hike from Chenek on 4-day programmes"
    ],
    "thingsToDo": [
      "High-altitude trekking across the pass",
      "Optional morning hike from Chenek when used as a finale",
      "Photography of the high massif and surrounding valleys",
      "Acclimatisation walking before Ambiko on summit itineraries"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789397585/Bwahit.png",
    "imageAlt": "Rocky ridges and open highland terrain around Bwahit"
  },
  {
    "slug": "ambiko",
    "name": "Ambiko",
    "location": "Simien Mountains; approximately 3,200 m; traditional base for Ras Dashen (Ras Dejen) summit",
    "heroTitle": "Ambiko",
    "heroAccent": "summit base camp.",
    "about": [
      "Ambiko (Ambiko Camp) is the traditional base for the Ras Dashen (Ras Dejen) summit attempt. It is reached after crossing the Bwahit area, descending toward Meseha Valley, then climbing again to camp. Summit briefings and preparation take place here before the long summit day. On full expeditions, Ambiko is also the overnight after the summit before the eastern transect toward Sona."
    ],
    "highlights": [
      "Base camp for Ethiopia’s highest summit",
      "Remote high-mountain setting",
      "Staging for pre-sunrise summit departures",
      "Return overnight after summit day on 10-day expeditions"
    ],
    "thingsToDo": [
      "Overnight camping",
      "Summit briefing and preparation",
      "Start and finish of the Ras Dashen ascent day",
      "Rest and recovery after the summit attempt"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789397573/Ambiko.png",
    "imageAlt": "A thatched stone hut on a mountainside near Ambiko"
  },
  {
    "slug": "ras-dashen",
    "name": "Ras Dashen (Ras Dejen)",
    "alsoKnownAs": [
      "Ras Dejen"
    ],
    "location": "Simien Mountains massif; Ethiopia’s highest mountain; summit approximately 4,500+ m (approximately 4,543–4,550 m depending on measurement)",
    "heroTitle": "Ras Dashen",
    "heroAccent": "Ras Dejen.",
    "about": [
      "Ras Dashen (also Ras Dejen) is Ethiopia’s highest mountain and the high point of the Simien massif. Reaching the summit is a serious mountain experience rather than sightseeing: a demanding long day from Ambiko, typically with a pre-sunrise start. Detailed itineraries estimate roughly 14–16 km round trip and 8–10+ hours. Summit success cannot be guaranteed; safety conditions determine the final decision."
    ],
    "highlights": [
      "Summit of Ethiopia within the Simien massif",
      "Vast highland panoramas from the high massif",
      "Defining objective of Challenge and expedition itineraries",
      "Long, committing mountain day from Ambiko"
    ],
    "thingsToDo": [
      "Summit trek (demanding round trip from Ambiko)",
      "Photography when conditions allow",
      "Guided pacing and turnaround decisions based on weather and group condition"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789397607/ras-dashen.png",
    "imageAlt": "A grassy escarpment overlooking the mountains on the Ras Dashen route"
  },
  {
    "slug": "meseha-valley",
    "name": "Meseha Valley",
    "alsoKnownAs": [
      "Mesheha",
      "Meseha River"
    ],
    "location": "Simien Mountains; between Bwahit Pass and Ambiko / on descent from Ambiko toward Sona (also spelled Mesheha)",
    "heroTitle": "Meseha Valley",
    "heroAccent": "the remote side.",
    "about": [
      "Meseha Valley (Meseha River) is the valley and river landscape on the Ras Dashen approach and on the post-summit descent toward lower Simien. Crossing from Bwahit Pass into the valley marks a clear elevation change from the high plateaus. On full transect itineraries, the descent continues past the river corridor toward Sona, with remote scenery and a shift in vegetation."
    ],
    "highlights": [
      "Remote valley scenery",
      "Elevation change between high passes and Ambiko / lower camps",
      "River corridor on summit approach and eastern descent",
      "Quieter side of the Simien journey beyond the classic escarpment circuit"
    ],
    "thingsToDo": [
      "Trekking on summit approach and post-summit descent routes",
      "Photography of valley walls and river landscapes",
      "Observation of changing vegetation and birdlife at lower elevations"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789397598/meseha-river.png",
    "imageAlt": "A pool and waterfall between rock walls in the Meseha River landscape"
  },
  {
    "slug": "sona",
    "name": "Sona",
    "location": "Lower / eastern Simien trekking corridor after Ambiko",
    "heroTitle": "Sona",
    "heroAccent": "the quieter side.",
    "about": [
      "Sona (Sona Camp) sits on the quieter, more remote side of the Simien landscape reached after descending from Ambiko toward the Meseha River area. It forms part of the full transect toward Adi Arkay, beyond the classic escarpment circuit. Continuing from Sona toward Mulit, the corridor passes Mekarebya Camp in the lower valleys: river landscape, remote countryside, a shift from cooler highland environment to warmer valleys with different vegetation and birdlife, and — depending on local conditions — possible swimming at suitable natural pools."
    ],
    "highlights": [
      "Remote valley / lowland-transition landscapes",
      "Beyond the classic escarpment circuit",
      "Corridor link toward Mekarebya and Mulit on full expeditions",
      "Community and agricultural landscapes further east"
    ],
    "thingsToDo": [
      "Overnight camping",
      "Trekking on the eastern / lower transect",
      "Observation of rural life and changing ecosystems",
      "Possible natural-pool stop when conditions allow (Mekarebya corridor)"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789397573/Sona.png",
    "imageAlt": "Grazing animals and fields beneath the mountains near Sona"
  },
  {
    "slug": "mulit",
    "name": "Mulit",
    "location": "Lower Simien; Incya River area on approach to Adi Arkay",
    "heroTitle": "Mulit",
    "heroAccent": "Incya River.",
    "about": [
      "Mulit (Mulit Camp) is a quieter section of the lower Simien landscape following the Incya River area on the approach to Adi Arkay. The camp offers opportunities to observe birdlife and experience rural village life after the high camps of the western escarpment and summit corridor. On the Sona–Mulit corridor, Mekarebya Camp precedes Mulit: further into lower valleys along river landscape, with possible natural pools depending on conditions."
    ],
    "highlights": [
      "Incya River area",
      "Birdlife and rural village life",
      "Different perspective of the Simien region after the high camps",
      "Final overnight before Adi Arkay on full expeditions"
    ],
    "thingsToDo": [
      "Trekking and overnight camping",
      "Observation of birdlife and rural life as encountered",
      "Photography of river valleys and village landscapes",
      "Preparation for the final walk to the vehicle pickup"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789397607/incya-river.png",
    "imageAlt": "A clear pool between rocks along the Incya River corridor"
  },
  {
    "slug": "adi-arkay",
    "name": "Adi Arkay",
    "location": "End of the full Simien transect; vehicle pickup point before return to Gondar",
    "heroTitle": "Adi Arkay",
    "heroAccent": "the crossing ends.",
    "about": [
      "Adi Arkay is where the final walk of the Grand / Full Simien expedition meets the vehicle before the drive back toward Gondar. After days on the eastern transect through Sona, Mekarebya and Mulit, the trail meets the road network here. It is the practical completion point of the long Simien crossing rather than a sightseeing town in its own right."
    ],
    "highlights": [
      "Completion point of the long Simien transect",
      "Vehicle pickup before return to Gondar",
      "Transition from foot expedition to road travel",
      "Sense of journey’s end after classic corridor, summit and eastern valleys"
    ],
    "thingsToDo": [
      "Final walk to the pickup point",
      "Vehicle transfer toward Gondar",
      "Rest and debrief after the expedition"
    ],
    "image": "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789397608/adi-arkay.png",
    "imageAlt": "A winding road through green hills near Adi Arkay"
  }
];
