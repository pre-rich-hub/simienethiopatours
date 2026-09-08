import type { NavMegaMenuCard } from "@/components/NavMegaMenu";
import { journeys } from "@/lib/site";

export const journeyMenuCards: NavMegaMenuCard[] = journeys.slice(1, 4).map((journey) => ({
  slug: journey.slug,
  href: journey.href,
  tag: journey.duration,
  title: journey.title,
  style: `${journey.style} · Private`,
  summary: journey.summary,
  image: journey.image,
}));

export const simienMenuCards: NavMegaMenuCard[] = [
  {
    slug: "simien-photography",
    href: "/simien-photography-tour",
    tag: "Photography",
    title: "Simien Photography Tour",
    style: "1–5 days · Flexible",
    summary: "Build a journey around landscapes, wildlife and changing light, with time to walk, watch and wait.",
    image: "/images/gelada-troop.jpg",
  },
  {
    slug: "festival-journeys",
    href: "/festival-journeys",
    tag: "Living culture",
    title: "Festivals & Holiday Journeys",
    style: "Timkat · Genna · Meskel",
    summary: "Experience Ethiopia's meaningful celebrations with local interpretation and time in the mountains.",
    image: "/images/road-to-simien.jpg",
  },
  {
    slug: "ras-dashen",
    href: "/ras-dashen",
    tag: "Highest peak",
    title: "Ras Dashen",
    style: "Ethiopia's highest mountain",
    summary: "You don't just climb Ras Dashen — you cross the Simien Mountains. Difficulty, altitude and route, honestly explained.",
    image: "/images/giant-lobelia.jpg",
  },
];

export const gondarMenuCards: NavMegaMenuCard[] = [
  {
    slug: "heritage-simien",
    href: "/treks/gondar-heritage-simien",
    tag: "5 days · 4 nights",
    title: "Gondar, Heritage & Simien",
    style: "Royal city + mountains",
    summary: "Castles, churches and Woleka heritage, followed by two nights in the Simien highlands.",
    image: "/images/fasil-ghebbi.jpg",
  },
  {
    slug: "gondar-running",
    href: "/gondar-running-experience",
    tag: "Easy · Active · Trail",
    title: "Hidden Gondar Running",
    style: "Countryside routes",
    summary: "Follow quieter paths, farmland and highland views with a local running guide, at your own pace.",
    image: "/images/road-to-simien.jpg",
  },
  {
    slug: "local-eyes",
    href: "/gondar#experiences",
    tag: "Local life",
    title: "Gondar Through Local Eyes",
    style: "History · Food · Coffee",
    summary: "Markets, coffee, neighbourhoods and conversations — choose your way to discover the city.",
    image: "/images/tevan-portrait.jpg",
  },
];
