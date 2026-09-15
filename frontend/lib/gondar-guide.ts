import type { Feature } from "@/components/Editorial";
import type { PlanningGuideSection } from "@/lib/simien-guide";

export const gondarPlanningCards: Feature[] = [
  {
    title: "City time",
    body: "Half-day and full-day programmes cover Fasil Ghebbi, churches and living-city walks. Extra nights leave room for markets, coffee and a slower pace before the mountains.",
    href: "/gondar",
    linkLabel: "Explore Gondar destinations",
  },
  {
    title: "Heritage & etiquette",
    body: "Royal compounds and active churches ask for modest dress, quiet attention and permission before photographing people at worship.",
    href: "/gondar/fasil-ghebbi",
    linkLabel: "Read about Fasil Ghebbi",
  },
  {
    title: "Gondar with Simien",
    body: "Combine imperial heritage with mountain camps on five-day outlines, or keep more city time before a separate trek.",
    href: "/treks/5-day-gondar-simien",
    linkLabel: "See a combined outline",
  },
  {
    title: "Explore Ethiopia extensions",
    body: "Lake Tana / Bahir Dar, Lalibela, Axum and related stops can extend a Gondar–Simien journey when your schedule allows.",
    href: "/explore-ethiopia",
    linkLabel: "Explore Ethiopia",
  },
];

export const gondarPlanningIntro = [
  "Gondar is the historic royal city of northern Ethiopia and the usual practical gateway toward Simien Mountains National Park. Fasil Ghebbi—the Royal Enclosure—is inscribed on the UNESCO World Heritage List and anchors most heritage days in the city.",
  "Use this guide to decide how much city time you want, how to visit heritage sites respectfully, how Gondar pairs with a Simien trek, and which northern extensions may fit afterward. Details for your dates are confirmed in a written proposal.",
];

export const gondarPlanningSections: PlanningGuideSection[] = [
  {
    id: "city-time",
    paragraphs: [
      "Gondar sits at approximately 2,200 m and works well as a base before or after mountain days. A focused half-day can cover the Royal Enclosure with selected churches; a full day adds Fasilides’ Bath, Debre Berhan Selassie, viewpoints such as Kuskuam, or a quieter walk through markets and neighbourhoods.",
      "Extra nights help if you want coffee and food experiences, photography walks, countryside running near Kosoye, or simply recovery after a trek. Festival periods such as Timkat, centred on Fasil’s Pool, need more planning and earlier conversation about access and pacing.",
      "Tell the team whether Gondar is an introduction, a cultural focus, or a soft landing after Simien—the same city supports different rhythms.",
    ],
  },
  {
    id: "heritage-etiquette",
    paragraphs: [
      "At Fasil Ghebbi and related compounds, follow guide and site instructions, stay on permitted paths and treat walls, courtyards and interiors as living heritage rather than a backdrop for climbing or propped photography.",
      "Active churches and sacred spaces call for modest clothing that covers shoulders and legs, removed hats where customary, quiet voices and patience around worship. Ask before photographing people, especially during prayer or ceremony.",
      "Markets and neighbourhoods are everyday workplaces. Move with courtesy, agree prices clearly when buying, and avoid blocking doorways or stalls for photos. A local guide helps you read context that visitors often miss.",
    ],
  },
  {
    id: "combining-simien",
    paragraphs: [
      "Most Simien journeys begin with a road transfer north from Gondar via Debark for park arrangements. Combining city and mountain time is common: heritage first, then the escarpment; or trek first and return to Gondar for recovery and culture.",
      "Five-day outlines such as Gondar with three mountain camps, or a heritage-focused alternative with more city time, are useful starting points. Day trips and short treks leave Gondar hotel nights on either side. Longer Ras Dashen programmes still usually bookend with Gondar logistics.",
      "Share how many nights you want in the city versus on the trail. The team will align hotels, transfers and walking days so neither side of the journey feels rushed.",
    ],
  },
  {
    id: "northern-extensions",
    paragraphs: [
      "Northern Ethiopia destinations published on this site—including Lake Tana / Bahir Dar, Blue Nile Falls when conditions allow, Lalibela and Axum—can extend a Gondar and Simien journey when your schedule and interests support the extra travel.",
      "Lake circuits offer a softer contrast to highland trekking: monasteries, boat excursions subject to conditions, and optional falls visits that vary with season and water. Lalibela’s rock-hewn churches pair naturally on longer northern combinations; Axum adds further historical depth when time allows.",
      "Extensions change flights, road days and pacing. Raise them early in planning so the written proposal covers realistic sequencing rather than squeezing too much into too few days.",
    ],
  },
];
