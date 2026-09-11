export const site = {
  name: "Gondar Simien Tours",
  legalOperator: "Simien Ethio Tours",
  phoneDisplay: "+251 956 61 6969",
  phone: "+251956616969",
  email: "info@simienethiotours.com",
  address: "Fasil Castle Street, Gondar, Ethiopia",
  whatsapp: "https://wa.me/251956616969",
  tripadvisor:
    "https://www.tripadvisor.com/Attraction_Review-g317059-d32805557-Reviews-Tesema_Travels-Gonder_Amhara_Region.html",
  operatorSite: "https://simienethiotours.com/",
  social: {
    x: "#",
    instagram: "#",
    facebook: "#",
    tiktok: "#",
    youtube: "#",
  },
} as const;

export const journeys = [
  {
    slug: "simien-day-trip",
    href: "/treks/simien-day-trip",
    duration: "1 Day",
    title: "Simien in a Day",
    style: "First encounter",
    difficulty: "Easy to Moderate",
    summary:
      "A one-day introduction to Simien Mountains National Park from Gondar: short walks, escarpment viewpoints and time in known Gelada habitat.",
    image: "/images/chenek-camp.jpg",
    fit: "Travellers with limited time",
  },
  {
    slug: "3-day-simien-trek",
    href: "/treks/3-day-simien-trek",
    duration: "3 Days / 2 Nights",
    title: "3-Day Simien Trek",
    style: "Western corridor",
    difficulty: "Moderate to Challenging",
    summary:
      "A three-day trek as far as Imet Gogo, with overnight camps at Sankaber and Geech. Does not reach Chenek.",
    image: "/images/geech-camp.jpg",
    fit: "Active first-time trekkers",
  },
  {
    slug: "4-day-simien-classic",
    href: "/treks/4-day-simien-classic",
    duration: "4 Days / 3 Nights",
    title: "4-Day Simien Classic",
    style: "Signature journey",
    difficulty: "Moderate to Challenging",
    summary:
      "The signature classic corridor: Sankaber, Geech, Imet Gogo and Chenek, with three nights in mountain camps.",
    image: "/images/imet-gogo.jpg",
    fit: "Travellers who want the classic trail",
  },
  {
    slug: "ras-dashen-challenge",
    href: "/treks/ras-dashen-challenge",
    duration: "5 Days / 4 Nights",
    title: "Ras Dashen Challenge",
    style: "Summit objective",
    difficulty: "Challenging",
    summary:
      "Classic corridor into Chenek, then Bwahit Pass and Ambiko for a Ras Dashen summit attempt. Success is not guaranteed.",
    image: "/images/giant-lobelia.jpg",
    fit: "Fit hikers prepared for a mountain challenge",
  },
  {
    slug: "10-day-simien-ras-dashen",
    href: "/treks/10-day-simien-ras-dashen",
    duration: "10 Days / 9 Nights",
    title: "10-Day Simien Expedition",
    style: "Full crossing",
    difficulty: "Challenging",
    summary:
      "Full Simien crossing: classic corridor, Ras Dashen summit attempt, then the quieter eastern transect toward Adi Arkay.",
    image: "/images/simien-panorama.jpg",
    fit: "Experienced trekkers who value depth",
  },
] as const;

export const sourceLinks = {
  simienUnesco: "https://whc.unesco.org/en/list/9/",
  gondarUnesco: "https://whc.unesco.org/en/list/19/",
  gondarTourism: "https://gcctso.gov.et/",
  operatorAbout: "https://simienethiotours.com/about-us/",
  operatorContact: "https://simienethiotours.com/contact-us/",
} as const;
