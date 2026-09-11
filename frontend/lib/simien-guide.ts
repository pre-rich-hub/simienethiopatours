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
