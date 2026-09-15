import { getJourneyPackage } from "@/lib/journey-packages";

export const site = {
  name: "Gondar Simien Tours",
  legalOperator: "Simien Ethio Tours",
  phoneDisplay: "+251 956 61 6969",
  phone: "+251956616969",
  email: "info@gondersimientours.com",
  address: "Fasil Castle Street, Gondar, Ethiopia",
  whatsapp: "https://wa.me/251956616969",
  tripadvisor:
    "https://www.tripadvisor.com/Attraction_Review-g317059-d32805557-Reviews-Tesema_Travels-Gonder_Amhara_Region.html",
  operatorSite: "https://simienethiotours.com/",
  brand: {
    /** Circular seal used in chrome, favicon, and Organization JSON-LD. Swap to SVG when a vector export arrives. */
    badge: "/images/gondar-simien-tours-logo-badge.png",
    badgeWidth: 1206,
    badgeHeight: 1199,
    /** Open lockup (no circle). Not used in chrome. */
    lockup: "/images/gondar-simien-tours-logo.png",
  },
  /**
   * Verified public social profiles from simienethiotours.com.
   * Empty slots stay hidden in the footer.
   */
  social: {
    x: "",
    instagram: "https://www.instagram.com/tesemaethiopiatour/",
    facebook: "https://www.facebook.com/tesema.travels.Ethiopia/",
    tiktok: "",
    youtube: "",
  },
} as const;

export type SocialNetwork = keyof typeof site.social;

export function verifiedSocialLinks(): Array<{ network: SocialNetwork; href: string }> {
  return (Object.entries(site.social) as Array<[SocialNetwork, string]>)
    .filter(([, href]) => /^https?:\/\//i.test(href))
    .map(([network, href]) => ({ network, href }));
}

/** Teaser cards — images always taken from the approved journey package (not legacy /images/). */
export const journeys = [
  {
    slug: "simien-day-trip",
    href: "/treks/simien-day-trip",
    title: "Simien in a Day",
    style: "First encounter",
    fit: "Travellers with limited time",
  },
  {
    slug: "3-day-simien-trek",
    href: "/treks/3-day-simien-trek",
    title: "3-Day Simien Trek",
    style: "Western corridor",
    fit: "Active first-time trekkers",
  },
  {
    slug: "4-day-simien-classic",
    href: "/treks/4-day-simien-classic",
    title: "4-Day Simien Classic",
    style: "Signature journey",
    fit: "Travellers who want the classic trail",
  },
  {
    slug: "ras-dashen-challenge",
    href: "/treks/ras-dashen-challenge",
    title: "Ras Dashen Challenge",
    style: "Summit objective",
    fit: "Fit hikers prepared for a mountain challenge",
  },
  {
    slug: "10-day-simien-ras-dashen",
    href: "/treks/10-day-simien-ras-dashen",
    title: "10-Day Simien Expedition",
    style: "Full crossing",
    fit: "Experienced trekkers who value depth",
  },
].map((card) => {
  const approved = getJourneyPackage(card.slug)!;
  return {
    ...card,
    duration: approved.duration,
    difficulty: approved.difficulty,
    summary: approved.overview[0] ?? "",
    image: approved.image,
    imageAlt: approved.imageAlt,
  };
});

export const sourceLinks = {
  simienUnesco: "https://whc.unesco.org/en/list/9/",
  gondarUnesco: "https://whc.unesco.org/en/list/19/",
  gondarTourism: "https://gcctso.gov.et/",
  operatorAbout: "https://simienethiotours.com/about-us/",
  operatorContact: "https://simienethiotours.com/contact-us/",
} as const;
