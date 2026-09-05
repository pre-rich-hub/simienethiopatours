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
} as const;

export const journeys = [
  {
    slug: "simien-day",
    duration: "1 day",
    title: "Simien in a Day",
    style: "First encounter",
    difficulty: "Gentle to moderate",
    summary:
      "A carefully paced first look at the escarpment and highland wildlife for travelers with limited time.",
    image: "/images/chenek-camp.jpg",
    fit: "Short stays, families and cultural itineraries",
  },
  {
    slug: "simien-classic",
    duration: "3 days",
    title: "The Simien Classic",
    style: "Short real trek",
    difficulty: "Moderate",
    summary:
      "Leave the vehicle behind, walk the plateau and spend two mountain nights under a wide highland sky.",
    image: "/images/geech-camp.jpg",
    fit: "Active first-time trekkers",
  },
  {
    slug: "simien-essential",
    duration: "4 days",
    title: "Simien Essential",
    style: "Signature journey",
    difficulty: "Moderate to challenging",
    summary:
      "The most complete short immersion: escarpment walking, Geech, Imet Gogo and a deeper sense of the park.",
    image: "/images/imet-gogo.jpg",
    fit: "Travelers who want the strongest short itinerary",
  },
  {
    slug: "ras-dashen",
    duration: "6 days",
    title: "Ras Dashen Challenge",
    style: "Summit objective",
    difficulty: "Challenging",
    summary:
      "A demanding, altitude-aware journey for strong walkers who want a summit goal—not a rushed checklist.",
    image: "/images/giant-lobelia.jpg",
    fit: "Fit hikers with mountain experience",
  },
  {
    slug: "full-simien",
    duration: "10 days",
    title: "The Full Simien Journey",
    style: "Deep expedition",
    difficulty: "Challenging",
    summary:
      "A long traverse through changing terrain, remote camps and the full scale of the northern highlands.",
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
