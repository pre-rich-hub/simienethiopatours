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
    slug: "simien-day",
    href: "/treks/simien-day-trip",
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
    href: "/treks/3-day-simien-trek",
    duration: "3 days",
    title: "The Simien Classic",
    style: "Short real trek",
    difficulty: "Moderate to challenging",
    summary:
      "Leave the vehicle behind, walk the plateau and spend two mountain nights under a wide highland sky.",
    image: "/images/geech-camp.jpg",
    fit: "Active first-time trekkers",
  },
  {
    slug: "simien-essential",
    href: "/treks/4-day-simien-classic",
    duration: "4 days",
    title: "4-Day Simien Classic",
    style: "Signature journey",
    difficulty: "Moderate to challenging",
    summary:
      "Follow the escarpment through Geech, Imet Gogo and Inatye to Chenek, with three nights in mountain camps.",
    image: "/images/imet-gogo.jpg",
    fit: "Travelers who want the strongest short itinerary",
  },
  {
    slug: "ras-dashen",
    href: "/treks/ras-dashen-challenge",
    duration: "5-day outline + return",
    title: "Ras Dashen Challenge",
    style: "Summit objective",
    difficulty: "Challenging",
    summary:
      "A five-day summit approach ending at Ambiko. Additional acclimatization and return days complete the expedition.",
    image: "/images/giant-lobelia.jpg",
    fit: "Fit hikers with mountain experience",
  },
  {
    slug: "full-simien",
    href: "/treks/10-day-simien-ras-dashen",
    duration: "10 days",
    title: "Simien & Ras Dashen Expedition",
    style: "Deep expedition",
    difficulty: "Challenging",
    summary:
      "Ten days from Gondar through highland camps, a Ras Dashen summit attempt and the quieter valleys toward Adi Arkay.",
    image: "/images/simien-panorama.jpg",
    fit: "Experienced trekkers who value depth",
  },
  {
    slug: "5-day-gondar-simien",
    href: "/treks/5-day-gondar-simien",
    duration: "5 days",
    title: "Royal City & Mountain Adventure",
    style: "City & trail",
    difficulty: "Moderate to challenging",
    summary:
      "Gondar's royal heritage followed by three camping nights on the classic Simien escarpment through Sankaber, Geech, Imet Gogo and Chenek.",
    image: "/images/fasil-ghebbi.jpg",
    fit: "Travelers who want culture and trekking in one trip",
  },
  {
    slug: "gondar-heritage-simien",
    href: "/treks/gondar-heritage-simien",
    duration: "5 days",
    title: "Gondar, Heritage & Simien",
    style: "Heritage & mountains",
    difficulty: "Adapted to your ability",
    summary:
      "Royal castles, Woleka heritage and adaptable mountain days in the Simien highlands with two city and two mountain nights.",
    image: "/images/fasil-ghebbi.jpg",
    fit: "Culture-focused travelers with flexible pacing",
  },
] as const;

export const sourceLinks = {
  simienUnesco: "https://whc.unesco.org/en/list/9/",
  gondarUnesco: "https://whc.unesco.org/en/list/19/",
  gondarTourism: "https://gcctso.gov.et/",
  operatorAbout: "https://simienethiotours.com/about-us/",
  operatorContact: "https://simienethiotours.com/contact-us/",
} as const;
