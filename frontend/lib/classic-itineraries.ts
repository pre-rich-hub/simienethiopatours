import type { ItineraryDay } from "@/components/Editorial";
import type { JourneyDetail } from "@/lib/itineraries";

const sankaber: ItineraryDay = {
  title: "Gondar → Debark → Sankaber", subtitle: "The first steps into the highlands", overnight: "Sankaber camp",
  paragraphs: [
    "Meet your guide and driver in Gondar after an early breakfast. Travel north through highland farmland and villages to Debark, where the team completes park arrangements before continuing into the mountains.",
    "Begin an introductory escarpment walk toward Sankaber, with the starting point selected for the day’s conditions and your pace. The Buyit Ras area is one possible start. Look for geladas in the grasslands and take time to notice the valleys opening below the plateau.",
    "Settle into camp for dinner and your first mountain night. The opening walk is adjusted to the group; even a shorter walk takes place at altitude.",
  ],
};
const geech: ItineraryDay = {
  title: "Sankaber → Jinbar Waterfall → Geech", subtitle: "Escarpments, highland life and giant lobelias", overnight: "Geech camp",
  paragraphs: [
    "Follow the escarpment through open grasslands and mountain scenery toward the Jinbar area. Stop at the waterfall viewpoint when the route allows; water flow and visibility change with the season and weather.",
    "Continue toward Geech through the highland landscape, with time to learn about its plants, wildlife and farming communities. The trail climbs toward camp among the giant lobelias.",
    "After a full walking day, settle into camp. A short evening viewpoint walk is an option if weather, daylight and the group’s energy allow.",
  ],
};
const chenek: ItineraryDay = {
  title: "Geech → Imet Gogo → Inatye → Chenek", subtitle: "The big mountain day", overnight: "Chenek camp",
  paragraphs: [
    "Leave early for Imet Gogo, where cliffs, deep gorges and distant ridges reveal the scale of the Simien landscape. Pause at the viewpoint before continuing through the high country toward Chenek.",
    "The proposed route continues via Inatye, with substantial ascents and descents. This is a demanding full day; Imet Gogo is a viewpoint along the route, not its highest point.",
    "Look for geladas, highland birds and Walia ibex in suitable habitat as you approach Chenek. Arrive at camp with time to rest and enjoy the surrounding cliffs. Sightings and clear views are never guaranteed.",
  ],
};
const returnFromChenek: ItineraryDay = {
  title: "Chenek → Debark → Gondar", subtitle: "One last look at the mountains",
  paragraphs: [
    "Enjoy a short morning walk around Chenek if conditions and your return schedule allow. Take time to watch the rocky slopes for wildlife and the changing light across the highlands.",
    "Meet the vehicle for the drive through Debark to Gondar. Hotel drop-off and any onward travel are agreed in advance; allow enough time for the mountain transfer.",
  ],
};
const mountainPreparation = [
  "Expect several hours of walking on uneven ground, with steep ascents and descents. Fitness, altitude, weather and the chosen trail all affect the effort. Tell us your walking experience and preferred pace before choosing a route.",
  "Camping means cold nights and basic facilities. Bring warm and waterproof layers, suitable walking footwear and personal essentials. Confirm the sleeping equipment, water arrangements and packing list with the team.",
  "Start points, camps and pickup locations are confirmed before departure. Walking distances and times vary with the selected trail; the itinerary does not represent a measured GPS route.",
];
const mountainInclusions = [
  "Gondar pickup, return transport and agreed trail transfers",
  "English-speaking local guide, park arrangements and scout as required",
  "Camping equipment, camp crew, cooking and baggage support as agreed",
  "Meals and drinking-water arrangements during the mountain section",
];
const exclusions = ["Flights and travel insurance", "Personal trekking equipment and expenses", "Alcoholic drinks and tips", "Services outside the agreed itinerary"];
const mountainHighlights = [
  { title: "Walk the escarpment", body: "Follow changing highland terrain from Sankaber toward Geech, with the Jinbar gorge along the proposed route." },
  { title: "Imet Gogo", body: "Make time for the panoramic viewpoint, giant lobelias and the ridges beyond the plateau." },
  { title: "Life in the mountains", body: "Mountain camps, wildlife watching and local interpretation bring the landscape into focus." },
];

export const classicJourneys: JourneyDetail[] = [
  {
    slug: "simien-day-trip", inquiry: "simien-day", title: "Simien Mountains Day Trip from Gondar",
    heroTitle: "One day.", heroAccent: "A whole new world.",
    description: "Leave Gondar for an introduction to the Simien escarpment, gelada watching and a mountain walk, with a return to the city the same evening.",
    duration: "1 day · Gondar to Gondar", image: "/images/simien-panorama.jpg", imageAlt: "Cliffs and high plateaus in the Simien Mountains",
    notice: "Imet Gogo, Chenek and Ras Dashen need different routing and more time — this route does not include them. Wildlife and views depend on conditions; Walia ibex are not a standard promise on the western day-trip route.",
    route: ["Gondar", "Debark", "Western Simien escarpment", "Debark", "Gondar"],
    facts: [{ label: "Duration", value: "1 day · no camping" }, { label: "Start & finish", value: "Gondar" }, { label: "Walking", value: "Short walks, adjusted to your pace" }, { label: "Style", value: "Private or small group" }, { label: "Departure", value: "Around 6:30 am · confirmed in advance" }, { label: "Best for", value: "A first mountain encounter" }],
    introduction: [
      "An early start takes you from Gondar’s streets into cooler highlands, farmland and villages. Beyond Debark, the road opens onto the escarpment and its enormous valleys.",
      "This day balances the drive with time outside the vehicle: a scenic walk, wildlife watching and stops chosen around your interests. It suits travelers based in Gondar who want mountain scenery without overnight camping. Families can discuss a suitable walking pace with the team.",
    ],
    days: [{ title: "From Gondar to the escarpment and back", subtitle: "A flexible day, with an early start", paragraphs: ["The schedule below is an outline. Pickup time, viewpoints and the length of the walk are confirmed for your date, hotel and group."], stages: [
      { label: "Around 6:30 am · Gondar pickup", body: "Meet at your hotel or agreed location for a briefing on the drive, altitude, weather and walking plans." },
      { label: "Morning · Gondar to Debark", body: "Travel through farming landscapes and villages with local interpretation from your guide. Complete the park arrangements in Debark before continuing into the highlands." },
      { label: "In the park · Watch and walk", body: "Search for geladas and, if a troop is present, take time to observe feeding, grooming and social behaviour. Follow a selected walk around the western escarpment or Sankaber area, matched to fitness and available time." },
      { label: "Midday · Lunch with a view", body: "Enjoy a packed lunch or locally arranged meal at a suitable stop. Pause for views, photographs and the story of the valleys below." },
      { label: "Afternoon · Final viewpoints", body: "Explore the agreed section of the park, watching for highland birds and noticing the vegetation. The day’s route determines which habitats are accessible; a short visit does not cover every wildlife area." },
      { label: "Evening · Return to Gondar", body: "Drive back through Debark to your agreed drop-off point. The return time depends on road, weather and park conditions." },
    ] }],
    highlights: [{ title: "Time with geladas", body: "Observe wild troops at a respectful distance when they are present. Your guide helps explain their behaviour." }, { title: "A walk at your pace", body: "Choose a shorter, gentler introduction or a longer walking section when conditions and time allow." }, { title: "The edge of the highlands", body: "Look across cliffs, villages and distant ridges from selected escarpment viewpoints." }],
    preparation: ["The day includes several hours on the road. An early departure leaves more time for walking and viewpoints; tell us about any fixed evening plans.", "Even short walks take place well above Gondar. Discuss walking comfort with your guide, and bring warm layers, rain protection, sun protection and suitable shoes."],
    inclusions: ["Gondar hotel pickup and drop-off with agreed transport", "English-speaking local guide and local assistance", "Park entry and permit arrangements, including a scout where required", "The selected mountain walk, viewpoints and wildlife stops", "Lunch and drinking-water arrangements"],
    exclusions: ["Personal expenses and alcoholic drinks", "Tips and travel insurance", "Any services outside the agreed package"],
    related: [{ title: "Stay for three days", body: "Add two mountain nights and a walking journey to Geech and Imet Gogo.", href: "/treks/3-day-simien-trek" }, { title: "The four-day classic", body: "Continue through Imet Gogo and Inatye to Chenek with three camping nights.", href: "/treks/4-day-simien-classic" }, { title: "A day for photography", body: "Plan stops and time for your photographic interests.", href: "/simien-photography-tour" }],
  },
  {
    slug: "3-day-simien-trek", inquiry: "simien-classic", title: "3-Day Simien Mountains Trekking Adventure",
    heroTitle: "Three days", heroAccent: "into the mountains.",
    description: "Walk from Sankaber to Geech, explore the Jinbar gorge and reach the Imet Gogo viewpoint before returning to Gondar. A short trek with two mountain nights.",
    duration: "3 days · 2 nights", image: "/images/geech-camp.jpg", imageAlt: "Tents at Geech camp in the Simien highlands",
    notice: "The final day combines walking and the return drive. Discuss onward flight timing before booking, and allow extra days if a summit objective like Ras Dashen interests you — it is not part of this three-day route.",
    route: ["Gondar", "Debark", "Sankaber", "Jinbar Waterfall", "Geech", "Imet Gogo", "Agreed road pickup", "Gondar"],
    facts: [{ label: "Duration", value: "3 days / 2 nights" }, { label: "Start & finish", value: "Gondar" }, { label: "Walking", value: "Moderate to challenging" }, { label: "Stay", value: "Sankaber + Geech camps" }, { label: "Main viewpoint", value: "Imet Gogo" }, { label: "Style", value: "Private or small group" }],
    introduction: ["This short trek brings together escarpment walking, highland wildlife and two nights beneath the mountain sky. It is designed for active travelers with limited time who want to experience the landscape on foot.", "The first day introduces the plateau; the second follows the Jinbar area toward Geech. On the final day, an early start makes room for Imet Gogo before the walk to the agreed vehicle pickup and the drive back to Gondar."],
    days: [sankaber, geech, { title: "Geech → Imet Gogo → Gondar", subtitle: "The panorama and the road home", paragraphs: ["Start early from Geech and walk through giant-lobelia country toward Imet Gogo. From the viewpoint, pause above the gorges and look across the highland ridges.", "Continue toward the confirmed road pickup, often in the Ambaras area, for your return through Debark to Gondar. The guide sets the turnaround and walking plan to leave enough time for the transfer.", "This is a substantial final walking day followed by a drive. Chenek is not part of this three-day outline; choose the four-day classic if reaching Chenek is a priority."] }],
    highlights: mountainHighlights, preparation: mountainPreparation,
    inclusions: [...mountainInclusions, "Two camping nights; meal coverage confirmed from the first mountain lunch through the return day"], exclusions,
    related: [{ title: "Continue to Chenek", body: "The four-day classic allows a full crossing from Geech via Imet Gogo and Inatye.", href: "/treks/4-day-simien-classic" }, { title: "Add Gondar’s royal history", body: "One hotel night and three mountain camps connect the city with the classic trail.", href: "/treks/5-day-gondar-simien" }, { title: "Prepare for the trail", body: "Read about packing, walking difficulty and the mountain environment.", href: "/travel-guide" }],
  },
  {
    slug: "4-day-simien-classic", inquiry: "simien-essential", title: "4-Day Simien Classic Trek",
    heroTitle: "Beyond the road.", heroAccent: "Into the highlands.",
    description: "Follow the classic trail from Sankaber through Geech, Imet Gogo and Inatye to Chenek. Four days of escarpments, wildlife watching and mountain camping.",
    duration: "4 days · 3 nights", image: "/images/imet-gogo.jpg", imageAlt: "The rocky viewpoint and deep valleys at Imet Gogo",
    route: ["Gondar", "Debark", "Sankaber", "Geech", "Imet Gogo", "Inatye", "Chenek", "Gondar"],
    facts: [{ label: "Duration", value: "4 days / 3 nights" }, { label: "Start & finish", value: "Gondar" }, { label: "Walking", value: "Moderate to challenging" }, { label: "Stay", value: "Sankaber, Geech + Chenek camps" }, { label: "Key stage", value: "Geech to Chenek via Inatye" }, { label: "Style", value: "Private or small group" }],
    introduction: ["Four days give the classic route time to unfold beyond its first viewpoints. Walk through highland grasslands, pause at the Jinbar gorge and continue past Imet Gogo into the rugged country around Chenek.", "Three camping nights bring time for the changing light and the daily rhythm of the mountains. Your guide connects the scenery with its plants, wildlife and local communities."],
    days: [sankaber, geech, chenek, { ...returnFromChenek, paragraphs: [returnFromChenek.paragraphs[0], "An optional walk toward the Bwahit area can be discussed for fit walkers if weather and transfer time permit. This is not a promised Bwahit summit; the final morning remains part of your return day.", returnFromChenek.paragraphs[1]] }],
    highlights: [...mountainHighlights, { title: "Chenek country", body: "A third camp brings more time among the cliffs and the opportunity to look for Walia ibex in suitable habitat." }, { title: "The Inatye crossing", body: "A sustained mountain day connects the Imet Gogo viewpoint to the Chenek landscape." }, { title: "Your local team", body: "Guides and camp crew organize the walking and camp routines, with time to understand the region." }],
    preparation: mountainPreparation, inclusions: [...mountainInclusions, "Three camping nights at the agreed camps"], exclusions,
    related: [{ title: "Shorter on time?", body: "The three-day route returns after Imet Gogo, with two mountain nights.", href: "/treks/3-day-simien-trek" }, { title: "Begin with Gondar", body: "Add a royal-city arrival day before the four-day mountain route.", href: "/treks/5-day-gondar-simien" }, { title: "Go beyond Chenek", body: "Explore the full ten-day expedition and its Ras Dashen summit attempt.", href: "/treks/10-day-simien-ras-dashen" }],
  },
  {
    slug: "5-day-gondar-simien", inquiry: "gondar-royal-mountains", title: "5-Day Gondar & Simien Royal City and Mountain Adventure",
    heroTitle: "From royal castles", heroAccent: "to mountain cliffs.",
    description: "Begin with Gondar’s royal history, then walk the classic Simien route through Sankaber, Geech, Imet Gogo and Chenek. One hotel night and three nights in mountain camps.",
    duration: "5 days · 4 nights", image: "/images/fasil-ghebbi.jpg", imageAlt: "Royal stone buildings at Fasil Ghebbi in Gondar",
    notice: "Arrival time determines how much Gondar sightseeing fits on day one. Add a city night if you want a fuller heritage programme — a final hotel night after the return is an extra arrangement, not included by default.",
    route: ["Gondar", "Fasil Ghebbi", "Debark", "Sankaber", "Jinbar Waterfall", "Geech", "Imet Gogo", "Inatye", "Chenek", "Gondar"],
    facts: [{ label: "Duration", value: "5 days / 4 nights" }, { label: "Start & finish", value: "Gondar" }, { label: "Walking", value: "Moderate to challenging" }, { label: "City stay", value: "1 hotel night in Gondar" }, { label: "Mountain stay", value: "3 camping nights" }, { label: "Best for", value: "History, trekking + wildlife" }],
    introduction: ["Gondar’s royal compounds and the Simien escarpments tell different stories of northern Ethiopia. This journey connects them: an arrival day in the historic city followed by three main trekking days and a final mountain morning.", "The mountain section is an active camping journey. Follow the escarpment from Sankaber to Geech, cross the high country via Imet Gogo and Inatye, then rest at Chenek before returning to Gondar."],
    days: [{ title: "Arrive in Gondar", subtitle: "The royal city", overnight: "Gondar hotel", paragraphs: ["Meet the team at the airport or agreed arrival point and transfer to your hotel. Depending on arrival time, visit Fasil Ghebbi and learn how Gondar’s royal compound fits into the history of the Ethiopian Empire.", "Other city visits depend on opening times and the time available. In the evening, meet your guide for a briefing on the route, camping equipment and the mountain days ahead."] }, sankaber, geech, chenek, returnFromChenek],
    highlights: [{ title: "The royal city", body: "An arrival-time visit to Fasil Ghebbi introduces Gondar’s architecture and the stories behind its stone walls." }, ...mountainHighlights, { title: "A night at Chenek", body: "End the trekking crossing among dramatic cliffs, with wildlife watching and a final morning walk when conditions allow." }, { title: "Make more time", body: "Extend your Gondar stay, add photography days or plan a longer expedition toward Ras Dashen." }],
    preparation: mountainPreparation,
    inclusions: [...mountainInclusions, "Agreed Gondar airport pickup and city sightseeing", "One Gondar hotel night and three camping nights", "Agreed site entries and mountain meals; arrival-day meals depend on the schedule"], exclusions,
    related: [{ title: "More heritage, a gentler pace", body: "The separate five-day Heritage & Simien journey includes two Gondar nights and two mountain nights, with adaptable walks.", href: "/treks/gondar-heritage-simien" }, { title: "Only the mountain section", body: "Start with the four-day classic if your Gondar time is already arranged.", href: "/treks/4-day-simien-classic" }, { title: "Extend toward Ras Dashen", body: "Explore the ten-day expedition for a longer journey through the mountains and lower valleys.", href: "/treks/10-day-simien-ras-dashen" }],
  },
  {
    slug: "ras-dashen-challenge", inquiry: "ras-dashen", title: "Ras Dashen Challenge | Summit Approach & Expedition Planning",
    heroTitle: "Toward the roof", heroAccent: "of Ethiopia.",
    description: "Explore a demanding five-day approach and summit outline via Sankaber, Geech, Chenek and Ambiko. Additional acclimatization, camping and return days complete your expedition.",
    duration: "5-day summit outline · additional return days", image: "/images/giant-lobelia.jpg", imageAlt: "Giant lobelia in the high-altitude Simien landscape",
    notice: "This outline ends back at Ambiko after the summit attempt on day five. It is not a five-day return trip to Gondar. Depending on the return route and acclimatization time you need, this commonly becomes a 6-day summit approach, a 7-day expedition with an extra acclimatization day, or an 8-day journey that combines the classic Simien route with the Ras Dashen attempt — the complete duration, additional nights and exit route are agreed with you before booking.",
    route: ["Gondar", "Debark", "Sankaber", "Geech", "Imet Gogo", "Inatye", "Chenek", "Bwahit Pass", "Ambiko", "Ras Dashen", "Ambiko", "Additional return stages to be agreed"],
    facts: [{ label: "Outline", value: "5 days through the summit attempt" }, { label: "Full duration", value: "Includes additional return days" }, { label: "Walking", value: "Challenging expedition" }, { label: "Start", value: "Gondar" }, { label: "Outline ends", value: "Ambiko after summit descent" }, { label: "Nights", value: "Approach camps + summit and return nights" }],
    introduction: ["Ras Dashen, also known as Ras Dejen, is Ethiopia’s highest mountain. The approach begins with the classic escarpment before crossing the Bwahit area into the Meseha Valley and continuing toward Ambiko.", "This is a proposed sequence for experienced mountain walkers to discuss with the local team. The five stages shown do not establish that five days is enough for your preparation or acclimatization. Extra days and a workable return are part of designing the complete journey."],
    days: [sankaber, geech, chenek, { title: "Chenek → Bwahit Pass → Ambiko", subtitle: "Across the pass and into the valley", overnight: "Ambiko camp", paragraphs: ["Cross the Bwahit area before descending toward the Meseha Valley and climbing again toward Ambiko. The sustained walking and large elevation changes make this a demanding approach day.", "Rest at camp, review equipment and receive the summit briefing. The team assesses whether the group and conditions are ready to proceed or the plan needs more time."] }, { title: "Ambiko → Ras Dashen → Ambiko", subtitle: "Summit attempt · return stages still to follow", overnight: "Ambiko; include this and onward nights in the full plan", paragraphs: ["Begin before sunrise for the long ascent toward Ras Dashen. Altitude, steep ground and the group’s progress determine the pace and turnaround; reaching the summit is conditional.", "Descend to Ambiko after the attempt. You are still in the mountains: further camping, walking and transport are needed to return to Gondar. The complete exit route is agreed as part of the expedition, before departure."] }],
    highlights: [{ title: "The classic approach", body: "Sankaber, Geech and Imet Gogo introduce the escarpment before the route continues beyond Chenek." }, { title: "Bwahit and the Meseha Valley", body: "High passes and deep valleys change the character of the trek on the way to Ambiko." }, { title: "A mountain objective", body: "Approach Ras Dashen with preparation, flexible timing and realistic expectations of the summit attempt." }],
    preparation: [...mountainPreparation, "Discuss acclimatization, additional rest days and the complete exit route with the team. Do not book onward transport around a five-day finish in Gondar: day five of this outline ends at Ambiko."],
    inclusions: ["Local mountain team, park arrangements and agreed camping support", "Meals, equipment and transfers for the complete confirmed itinerary", "Additional summit-night and return-stage arrangements explicitly included in your quotation"], exclusions,
    related: [{ title: "The ten-day expedition", body: "See an outline that includes the summit approach, onward valley stages and the final return to Gondar.", href: "/treks/10-day-simien-ras-dashen" }, { title: "Four days on the classic trail", body: "Explore the central escarpment and Chenek without a Ras Dashen summit objective.", href: "/treks/4-day-simien-classic" }, { title: "Discuss your preparation", body: "Read the practical notes and share your mountain experience with the local team.", href: "/travel-guide#altitude" }],
  },
];
