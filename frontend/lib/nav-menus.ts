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
    slug: "fasil-ghebbi",
    href: "/gondar/fasil-ghebbi",
    tag: "UNESCO World Heritage",
    title: "Fasil Ghebbi",
    style: "Royal Enclosure",
    summary: "The royal enclosure associated with Emperor Fasilides — castles, compounds and the core of Gondar’s imperial story.",
    image: "/images/fasil-ghebbi.jpg",
  },
  {
    slug: "kosoye-mountains",
    href: "/gondar/kosoye-mountains",
    tag: "Countryside near Gondar",
    title: "Kosoye Mountains",
    style: "Village visits · Highland walking",
    summary: "Rural villages, farmland walks and community-based cultural experience beyond the city’s castles.",
    image: "/images/road-to-simien.jpg",
  },
  {
    slug: "lalibela",
    href: "/gondar/lalibela",
    tag: "Northern extension",
    title: "Lalibela",
    style: "Rock-hewn churches",
    summary: "A city carved downward into stone — living church complexes on the northern circuit.",
    image: "/images/tevan-founder.jpg",
  },
];
