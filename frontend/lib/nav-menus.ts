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
    slug: "imet-gogo",
    href: "/simien-mountains/imet-gogo",
    tag: "Signature viewpoint",
    title: "Imet Gogo",
    style: "Classic western corridor",
    summary: "Panoramic escarpment views and the visual climax of many short and classic treks.",
    image: "/images/imet-gogo.jpg",
  },
  {
    slug: "chenek",
    href: "/simien-mountains/chenek",
    tag: "Wildlife camp",
    title: "Chenek",
    style: "Toward Chenek · Summit staging",
    summary: "A high camp among surrounding peaks, and a staging point for Bwahit and Ras Dashen routes.",
    image: "/images/chenek-camp.jpg",
  },
  {
    slug: "ras-dashen",
    href: "/simien-mountains/ras-dashen",
    tag: "Highest peak",
    title: "Ras Dashen",
    style: "Ethiopia’s highest mountain",
    summary: "A demanding summit day from Ambiko. Success is not guaranteed; conditions decide.",
    image: "/images/simien-panorama.jpg",
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
    href: "/gondar#countryside",
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
