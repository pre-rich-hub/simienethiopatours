/** Shared home-card shapes. Live home data comes from `getHomeCatalogue` (catalogue + tourMedia). */

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
  locale?: "en" | "es" | "de" | "fr";
  id: string;
  title: string;
  summary: string;
  href: string;
  image: string;
  imageAlt: string;
  duration?: string;
  style?: string;
  difficulty?: string;
  fit?: string;
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
  locale?: "en" | "es" | "de" | "fr";
  id: string;
  title: string;
  tag: string;
  body: string;
  href: string;
  image: { src: string; alt: string; caption: string };
};
