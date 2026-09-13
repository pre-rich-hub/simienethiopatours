import type { Feature } from "@/components/Editorial";

export const simienReasons: Feature[] = [
  { title: "The trekker", tag: "Escarpments & trails", body: "Walk from open plateaus into a landscape of cliffs and deep valleys. Choose a short introduction or consecutive days on the trail.", href: "/treks" },
  { title: "The wildlife lover", tag: "Time to observe", body: "Leave room to watch geladas, look for Walia ibex in suitable habitat and notice highland birdlife. Encounters follow the animals’ own rhythms.", href: "#wildlife", linkLabel: "Meet the wildlife" },
  { title: "The photographer", tag: "Light & landscape", body: "Build your days around the subjects that interest you: escarpments, giant lobelias, wildlife or the changing mountain light.", href: "/gallery" },
  { title: "The mountain walker", tag: "Higher ambitions", body: "Discuss Bwahit or a Ras Dashen expedition with time for preparation, acclimatization and a complete return route.", href: "/treks/ras-dashen-challenge" },
  { title: "The curious traveler", tag: "A living highland", body: "Discover how communities farm, work and live around the mountains through local interpretation and respectfully arranged visits.", href: "/gondar/gondar" },
  { title: "The traveler with one day", tag: "A first encounter", body: "Travel from Gondar for selected viewpoints, wildlife watching and a walk, then return to the city without camping.", href: "/treks/simien-day-trip" },
];

export const moreSimienPlaces: Feature[] = [
  { id: "sankaber", title: "Sankaber", tag: "The classic starting point", body: "An introduction to the escarpment and a first camp on many multi-day routes. Walk the plateau and look for geladas in the surrounding grasslands.", href: "/treks/3-day-simien-trek", linkLabel: "Walk from Sankaber" },
  { id: "bwahit", title: "Bwahit", tag: "Higher mountain country", body: "A demanding mountain objective beyond the classic viewpoints. The pass toward Ambiko and a summit hike are different plans; your guide helps match the route to your experience.", href: "/treks/ras-dashen-challenge", linkLabel: "Explore the summit approach" },
  { id: "ras-dashen", title: "Ras Dashen", tag: "Also known as Ras Dejen", body: "Ethiopia’s highest mountain is an expedition objective. Plan enough time for the approach, acclimatization, the summit attempt and the journey back.", href: "/treks/10-day-simien-ras-dashen", linkLabel: "Explore the ten-day expedition" },
];

export const simienDurations: Feature[] = [
  { title: "One day", tag: "A taste of Simien", body: "A return trip from Gondar with selected viewpoints, wildlife watching and an adaptable walk. No camping required.", href: "/treks/simien-day-trip", linkLabel: "Explore the day trip" },
  { title: "Two days", tag: "A short mountain escape", body: "Allow more time for walking and wildlife with one mountain night. The team shapes the route and stay around your dates and pace.", href: "/plan?experience=simien-two-day", linkLabel: "Plan a two-day escape" },
  { title: "Three days", tag: "A short trekking journey", body: "Walk from Sankaber to Geech and Imet Gogo, with two camping nights and a return to Gondar on the final day.", href: "/treks/3-day-simien-trek", linkLabel: "Read the three-day itinerary" },
  { title: "Four days", tag: "The classic trail", body: "Continue via Imet Gogo and Inatye to Chenek, adding a third camp and a fuller crossing of the central escarpment.", href: "/treks/4-day-simien-classic", linkLabel: "Read the four-day itinerary" },
  { title: "Five days", tag: "Royal city & mountains", body: "Combine Gondar’s history with three mountain camps, or choose the heritage-focused alternative with more city time.", href: "/treks/5-day-gondar-simien", linkLabel: "Connect Gondar and Simien" },
  { title: "Longer expeditions", tag: "Ras Dashen & beyond", body: "More time opens higher objectives and quieter valleys. Start with the ten-day outline, then tailor the walking and acclimatization plan.", href: "/treks/10-day-simien-ras-dashen", linkLabel: "Explore the longer journey" },
];

export const simienWildlife: Feature[] = [
  { title: "Gelada", body: "Watch troops feeding and moving through highland grasslands. Stay at a respectful distance and let the animals choose their path." },
  { title: "Walia ibex", body: "This wild mountain goat is endemic to the Simien Mountains. Look across rocky slopes and cliffs with your guide, especially on routes reaching suitable habitat." },
  { title: "Ethiopian wolf", body: "A rare highland canid whose presence adds to the region’s conservation importance. A sighting is a possibility, never an itinerary promise." },
  { title: "Highland birdlife", body: "Scan the cliffs and grasslands for raptors and other highland birds. Slow walks give you time to notice more than the famous mammals." },
];

export const simienPlanning: Feature[] = [
  { title: "Getting here", body: "Start in Gondar, travel north to Debark and continue into the park after local arrangements. Transfers and the first walking point depend on your itinerary.", href: "/plan", linkLabel: "Plan the approach" },
  { title: "Season & weather", body: "The right time depends on your priorities: walking conditions, greener landscapes, photography or a quieter visit. Ask about conditions for your travel dates.", href: "/plan", linkLabel: "Ask about your dates" },
  { title: "Packing & camping", body: "Prepare for changing weather and cold mountain nights. Confirm which camping equipment is supplied and what you need to carry personally.", href: "/plan", linkLabel: "Ask about your kit" },
  { title: "Walking difficulty", body: "Consider daily effort, altitude and terrain alongside the number of days. Share your experience so the team can recommend an appropriate route.", href: "/plan", linkLabel: "Discuss the walking" },
  { title: "Where to stay", body: "Connect your Gondar hotel, any Debark stop and your mountain lodge or camps with the walking route.", href: "/plan", linkLabel: "Plan your stays" },
  { title: "What will it cost?", body: "Group size, transport, route, nights, equipment and meal arrangements shape the quote. Ask for an itemized plan for your dates.", href: "/plan", linkLabel: "Request a personal quote" },
];

/** Full planning-guide body (English). Section headings come from i18n chrome keys. */
export type PlanningGuideSection = {
  id: string;
  paragraphs: string[];
};

export const simienPlanningIntro = [
  "Simien Mountains National Park is a UNESCO World Heritage highland of plateaus, deep valleys and escarpments, reached from Gondar via Debark. Use this guide to choose a route length, understand altitude and weather, prepare for camping, and plan responsible wildlife time—then shape the details with the local team.",
  "Website itineraries are starting points. Park requirements, camps, access and conditions can change. A journey is confirmed only when you accept a written proposal.",
];

export const simienPlanningSections: PlanningGuideSection[] = [
  {
    id: "route-choice",
    paragraphs: [
      "Start with how many days you have and how far you want to walk into the western corridor. A day trip from Gondar suits limited time: selected viewpoints, short walks and wildlife watching without camping. Two days add one mountain night around Sankaber. Three days typically reach Imet Gogo with camps at Sankaber and Geech, and do not include Chenek.",
      "Four days continue via Inatye to Chenek—the classic corridor many travellers mean by “the Simien trek.” Five-day combinations weave Gondar heritage with three mountain camps, or keep more city time on a heritage-focused outline. Longer programmes open Bwahit, Ambiko and a Ras Dashen (Ras Dejen) summit attempt; summit success depends on conditions and is never guaranteed.",
      "Match the outline to your curiosity: wildlife-focused days stay flexible around habitat rather than a fixed camp checklist; photography journeys leave room for light and weather; summit routes need extra time for acclimatization and return logistics.",
    ],
  },
  {
    id: "altitude",
    paragraphs: [
      "Gondar sits around 2,200 m. Trekking camps on common western routes sit higher: Sankaber around 3,200–3,250 m, Geech and Chenek higher still, with Imet Gogo near 3,926 m. Bwahit Pass approaches about 4,200 m; Ambiko base for Ras Dashen programmes sits lower in the Meseha Valley after the pass.",
      "Altitude affects people differently. Share previous mountain experience, any health considerations and how quickly you prefer to gain height. Extra days help on higher objectives. Website content is general information, not medical advice—seek professional guidance and suitable insurance before travel.",
    ],
  },
  {
    id: "weather",
    paragraphs: [
      "Highland weather changes quickly: sun, wind, cloud and cold nights can arrive in the same day. Walking conditions, greener landscapes, photography light and quieter trails each favour different travel windows. Ask about current conditions for your dates rather than relying on a single “best month” claim.",
      "Expect cold mountain nights even when days feel warm. Rain, mist and mud can slow progress; the guide may adjust daily stages within the agreed framework when weather or group condition requires it.",
    ],
  },
  {
    id: "packing",
    paragraphs: [
      "Prepare layered clothing for changing weather, a warm night layer, sturdy walking shoes, sun protection, a reusable water bottle and any personal medications. Trekking poles help some walkers on steep or uneven ground.",
      "Confirm which camping and sleeping equipment is supplied for your quotation and what you must bring or hire personally—especially a sleeping bag if it is not included. Pre-trip briefings and packing guidance are part of how the team prepares you before the first walking day.",
    ],
  },
  {
    id: "camping",
    paragraphs: [
      "Multi-day Simien journeys typically use designated mountain camps such as Sankaber, Geech and Chenek, with tents, sleeping mattresses and camp kitchen support when included in your proposal. Day trips return to Gondar without an overnight in the park.",
      "Camp life is part of the experience: early starts, shared meals and nights that can be cold and windy. Your written quote explains accommodation, meals and equipment for your dates. Tell the team about comfort needs early so the plan stays realistic.",
    ],
  },
  {
    id: "permits",
    paragraphs: [
      "Park entry is arranged via Debark before you continue into Simien Mountains National Park. Required entrance fees, trekking or camping permits and park scout or ranger support are organized as part of the local logistics for confirmed journeys.",
      "Exact inclusions appear in your written proposal. Transfers, first walking points and overnight places depend on the itinerary you agree. Routes, access and park requirements can change—treat published outlines as planning aids, not fixed guarantees.",
    ],
  },
  {
    id: "fitness",
    paragraphs: [
      "Difficulty combines daily distance, steep or uneven terrain, altitude and consecutive mountain days—not only the headline length of the trek. Day trips stay adjustable to the group; classic corridor treks are typically moderate to challenging; Ras Dashen programmes are summit-oriented challenges for fit hikers.",
      "Share honest walking comfort, recent fitness and any concerns about long days. The team can recommend a shorter introduction, a classic corridor, or a slower summit outline with extra recovery time. Pushing beyond your comfort level rarely improves the journey.",
    ],
  },
  {
    id: "wildlife",
    paragraphs: [
      "Gelada troops often feed in highland grasslands along the escarpment; Walia ibex may be seen on rocky slopes when habitat and timing align; Ethiopian wolves are rare highland canids whose presence matters for conservation. Highland birds reward slow looking. None of these encounters can be promised on an itinerary.",
      "Watch from a respectful distance, stay with your guide’s instructions, never feed or crowd animals, and let wildlife choose its path. Patient observation protects both visitors and the animals that make the Simien distinctive.",
    ],
  },
];
