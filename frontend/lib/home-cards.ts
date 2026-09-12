export type HomeHorizonCard = {
  id: string;
  title: string;
  tag: string;
  short: string;
  detail: string;
  href: string;
  image: string;
  imageAlt: string;
  tall?: boolean;
};

export type HomeClarityCard = {
  id: string;
  title: string;
  summary: string;
  href: string;
  image: string;
  imageAlt: string;
};

export type HomeClarityCollection = {
  id: string;
  label: string;
  cards: readonly HomeClarityCard[];
};

export type HomeSignatureJourney = {
  slug: string;
  href: string;
  duration: string;
  title: string;
  summary: string;
  image: string;
  imageAlt: string;
};

export type HomeBeyondCard = {
  id: string;
  title: string;
  tag: string;
  body: string;
  href: string;
  image: { src: string; alt: string; caption: string };
};

export const homeHorizons: readonly HomeHorizonCard[] = [
  {
    id: "imet-gogo",
    title: "Imet Gogo",
    tag: "Simien icon",
    short: "Signature Simien viewpoint at approximately 3,926 m — deep gorges, ridges and sheer cliffs.",
    detail: "Visual climax of many 3-day and classic treks; also a focus for photography programmes.",
    href: "/simien-mountains/imet-gogo",
    image: "/images/imet-gogo.jpg",
    imageAlt: "Rocky promontory at Imet Gogo above the Simien escarpment",
    tall: true,
  },
  {
    id: "gelada",
    title: "Gelada country",
    tag: "Wildlife",
    short: "Known habitat for Gelada, with Walia ibex and (uncommonly) Ethiopian wolf also present in the park.",
    detail: "Sightings are never guaranteed; programmes allow time to observe when troops or individuals are found.",
    href: "/treks/gelada-country",
    image: "/images/gelada-troop.jpg",
    imageAlt: "A wild troop of geladas grazing in the Simien Mountains",
  },
  {
    id: "ras-dashen",
    title: "Ras Dashen",
    tag: "High country",
    short: "Ethiopia’s highest summit (also Ras Dejen; approximately 4,500+ m / ~4,543–4,550 m in source wording).",
    detail: "A demanding Ambiko-based summit day on Challenge and expedition itineraries — success depends on conditions.",
    href: "/simien-mountains/ras-dashen",
    image: "/images/giant-lobelia.jpg",
    imageAlt: "Giant lobelias across the high Afroalpine landscape of the Simien Mountains",
  },
];

export const homeClarityCollections: readonly HomeClarityCollection[] = [
  {
    id: "by-time",
    label: "By time",
    cards: [
      {
        id: "day",
        title: "One day in Simien",
        summary: "Gondar–Debark–park day trip with short walks and escarpment viewpoints (Easy to Moderate).",
        href: "/treks/simien-day-trip",
        image: "/images/chenek-camp.jpg",
        imageAlt: "Highland landscape typical of a Simien day trip from Gondar",
      },
      {
        id: "classic",
        title: "3–4 day classic corridor",
        summary: "Sankaber–Geech–Imet Gogo (3 days) or continue to Chenek on the 4-Day Classic.",
        href: "/treks/4-day-simien-classic",
        image: "/images/imet-gogo.jpg",
        imageAlt: "Imet Gogo viewpoint on the classic Simien corridor",
      },
      {
        id: "long",
        title: "5–10 day mountain journeys",
        summary: "Gondar + Simien combinations, Ras Dashen Challenge, or the 10-day full transect.",
        href: "/treks",
        image: "/images/simien-panorama.jpg",
        imageAlt: "Wide Simien escarpment on a longer mountain journey",
      },
    ],
  },
  {
    id: "by-interest",
    label: "By interest",
    cards: [
      {
        id: "trekking",
        title: "Trekking",
        summary: "Multi-day highland routes from Sankaber through Geech toward Chenek and beyond.",
        href: "/treks",
        image: "/images/geech-camp.jpg",
        imageAlt: "Tents at Geech camp on a multi-day Simien trek",
      },
      {
        id: "wildlife",
        title: "Wildlife",
        summary: "Flexible 2–4 day wildlife-focused journeys and Gelada-country day programmes (sightings not guaranteed).",
        href: "/simien-mountains",
        image: "/images/gelada-troop.jpg",
        imageAlt: "Geladas in highland grassland in Simien Mountains National Park",
      },
      {
        id: "culture",
        title: "Culture & heritage",
        summary: "Royal Gondar sites, living-city experiences, Kosoye highlands and festival-linked journeys.",
        href: "/gondar",
        image: "/images/fasil-ghebbi.jpg",
        imageAlt: "Stone arches at the royal fortress of Fasil Ghebbi in Gondar",
      },
    ],
  },
  {
    id: "by-effort",
    label: "By effort",
    cards: [
      {
        id: "gentle",
        title: "Gentler day / introduction",
        summary: "Simien in a Day or 2-day Simien Introduction with overnight camp near Sankaber.",
        href: "/treks/simien-day-trip",
        image: "/images/road-to-simien.jpg",
        imageAlt: "The highland road used on gentler Simien introductions from Gondar",
      },
      {
        id: "classic-trek",
        title: "Classic trek",
        summary: "Moderate to Challenging 3- or 4-day corridor to Imet Gogo and Chenek.",
        href: "/treks/4-day-simien-classic",
        image: "/images/imet-gogo.jpg",
        imageAlt: "Classic Simien corridor views toward Imet Gogo and Chenek",
      },
      {
        id: "summit",
        title: "Summit expedition",
        summary: "Ras Dashen Challenge and longer expedition routes via Bwahit Pass and Ambiko.",
        href: "/treks/ras-dashen-challenge",
        image: "/images/giant-lobelia.jpg",
        imageAlt: "Afro-alpine landscape on Ras Dashen expedition country",
      },
    ],
  },
];

export const homeSignatureJourneys: readonly HomeSignatureJourney[] = [
  {
    slug: "4-day-simien-classic",
    href: "/treks/4-day-simien-classic",
    duration: "4 Days / 3 Nights",
    title: "4-Day Simien Classic Trek",
    summary:
      "Gondar to Sankaber, Geech, Imet Gogo and Chenek — the core classic corridor (~30–45 km walking depending on options).",
    image: "/images/imet-gogo.jpg",
    imageAlt: "Imet Gogo on the 4-Day Simien Classic corridor",
  },
  {
    slug: "3-day-simien-trek",
    href: "/treks/3-day-simien-trek",
    duration: "3 Days / 2 Nights",
    title: "3-Day Simien Mountains Trekking Adventure",
    summary:
      "Sankaber and Geech overnight, Jinbar Waterfall, then Imet Gogo and road pickup (does not reach Chenek).",
    image: "/images/geech-camp.jpg",
    imageAlt: "Geech camp on the 3-day Simien trek",
  },
  {
    slug: "ras-dashen-challenge",
    href: "/treks/ras-dashen-challenge",
    duration: "5–6 Days",
    title: "Ras Dashen Challenge",
    summary:
      "Classic corridor into Ambiko for a Ras Dashen summit attempt via Bwahit Pass — Challenging; summit not guaranteed.",
    image: "/images/giant-lobelia.jpg",
    imageAlt: "High Afroalpine country on the Ras Dashen Challenge",
  },
];

export const homeBeyondTheTrail: readonly HomeBeyondCard[] = [
  {
    id: "local-eyes",
    title: "Gondar Through Local Eyes",
    tag: "Living city",
    body: "Neighbourhoods, coffee, food and daily life beyond the monument circuit.",
    href: "/treks/gondar-through-local-eyes",
    image: {
      src: "/images/fasil-ghebbi.jpg",
      alt: "Gondar’s royal city, the setting for living-city walks beyond the monument circuit",
      caption: "Gondar · Local life",
    },
  },
  {
    id: "running",
    title: "Gondar Hidden Running Experience",
    tag: "Countryside",
    body: "Guided countryside and dirt-track runs from the city edge, adapted to Easy / Moderate / Challenging.",
    href: "/treks/gondar-running",
    image: {
      src: "/images/road-to-simien.jpg",
      alt: "Countryside paths near Gondar used for guided running",
      caption: "Gondar · Hidden running",
    },
  },
  {
    id: "timkat",
    title: "Timkat & Simien Mountains",
    tag: "Festival journey",
    body: "Suggested 6 days — Timkat in Gondar, then Simien escarpments and wildlife (festival dates confirmed closer to departure).",
    href: "/treks/timkat-simien",
    image: {
      src: "/images/fasil-ghebbi.jpg",
      alt: "Historic Gondar, the setting for Timkat before a Simien journey",
      caption: "Timkat · then Simien",
    },
  },
];
