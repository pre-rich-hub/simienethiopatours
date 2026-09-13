export type PhotoCredit = {
  file: string;
  subject: string;
  dimensions: string;
  sourceLabel: string;
  sourceUrl: string;
  author: string;
  license: string;
  attribution: string;
  status: "verified" | "verification-required";
};

/**
 * Rights manifest for every production photograph in public/images.
 * Scenic files are Wikimedia Commons originals with verified File: pages.
 * Tevan portraits are operator-supplied for site use.
 */
export const photoCredits: readonly PhotoCredit[] = [
  {
    file: "imet-gogo.jpg",
    subject: "Imet Gogo summit, Simien Mountains",
    dimensions: "3456 × 2592",
    sourceLabel: "Wikimedia Commons — File:Imet Gogo.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Imet_Gogo.jpg",
    author: "Ondřej Žváček",
    license: "CC BY 2.5",
    attribution: "Imet Gogo, Simien Mountains — Ondřej Žváček, CC BY 2.5, via Wikimedia Commons",
    status: "verified",
  },
  {
    file: "gelada-troop.jpg",
    subject: "Gelada troop, Simien Mountains National Park",
    dimensions: "3072 × 2304",
    sourceLabel: "Wikimedia Commons — File:TroupeDeGeladaSimien.JPG",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:TroupeDeGeladaSimien.JPG",
    author: "BluesyPete",
    license: "CC BY-SA 3.0",
    attribution: "Troop of geladas, Simien Mountains — BluesyPete, CC BY-SA 3.0, via Wikimedia Commons",
    status: "verified",
  },
  {
    file: "fasil-ghebbi.jpg",
    subject: "Fasilides Palace, Fasil Ghebbi, Gondar",
    dimensions: "2827 × 2039",
    sourceLabel: "Wikimedia Commons — File:Fasilides Palace 01.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Fasilides_Palace_01.jpg",
    author: "Bernard Gagnon",
    license: "CC BY-SA 3.0",
    attribution: "Fasilides Palace, Fasil Ghebbi, Gondar — Bernard Gagnon, CC BY-SA 3.0, via Wikimedia Commons",
    status: "verified",
  },
  {
    file: "geech-camp.jpg",
    subject: "Geech camp at dawn, Simien Mountains",
    dimensions: "3456 × 2592",
    sourceLabel: "Wikimedia Commons — File:Geech Camp.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Geech_Camp.jpg",
    author: "Ondřej Žváček",
    license: "CC BY 2.5",
    attribution: "Early morning, Geech Camp, Simien Mountains — Ondřej Žváček, CC BY 2.5, via Wikimedia Commons",
    status: "verified",
  },
  {
    file: "road-to-simien.jpg",
    subject: "Road toward Simien Mountains National Park",
    dimensions: "2403 × 1614",
    sourceLabel: "Wikimedia Commons — File:On The Road To Simien Mountains National Park, Ethiopia 1.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:On_The_Road_To_Simien_Mountains_National_Park,_Ethiopia_1.jpg",
    author: "A. Davey",
    license: "CC BY 2.0",
    attribution: "On the road to Simien Mountains National Park, Ethiopia — A. Davey, CC BY 2.0, via Wikimedia Commons",
    status: "verified",
  },
  {
    file: "giant-lobelia.jpg",
    subject: "Giant lobelias (Lobelia rhynchopetalum), Simien Mountains",
    dimensions: "3375 × 2406",
    sourceLabel: "Wikimedia Commons — File:Giant lobelias.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Giant_lobelias.jpg",
    author: "Bernard Gagnon",
    license: "CC BY-SA 3.0",
    attribution: "Giant lobelias, Simien Mountains National Park — Bernard Gagnon, CC BY-SA 3.0, via Wikimedia Commons",
    status: "verified",
  },
  {
    file: "chenek-camp.jpg",
    subject: "Chennek camp, Simien Mountains National Park",
    dimensions: "3388 × 2331",
    sourceLabel: "Wikimedia Commons — File:Chennek Camp.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Chennek_Camp.jpg",
    author: "Bernard Gagnon",
    license: "CC BY-SA 3.0",
    attribution: "Chennek camp (3500 m), Simien Mountains National Park — Bernard Gagnon, CC BY-SA 3.0, via Wikimedia Commons",
    status: "verified",
  },
  {
    file: "simien-panorama.jpg",
    subject: "Simien Mountains escarpment panorama",
    dimensions: "2848 × 407",
    sourceLabel: "Wikimedia Commons — File:Etiopia national parks banner.jpg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Etiopia_national_parks_banner.jpg",
    author: "Guistino (modified by Andro96)",
    license: "CC BY-SA 2.0",
    attribution: "View from Imet Gogo near Geech camp, Semien Mountains — Guistino, CC BY-SA 2.0, via Wikimedia Commons",
    status: "verified",
  },
  {
    file: "tevan-founder.jpg",
    subject: "Tevan in the Simien Mountains",
    dimensions: "1000 × 1099",
    sourceLabel: "Supplied by Simien Ethio Tours",
    sourceUrl: "https://simienethiotours.com/",
    author: "Simien Ethio Tours",
    license: "Operator-supplied for site use",
    attribution: "Simien Ethio Tours (operator-supplied photograph).",
    status: "verified",
  },
  {
    file: "tevan-portrait.jpg",
    subject: "Tevan portrait",
    dimensions: "1200 × 900",
    sourceLabel: "Supplied by Simien Ethio Tours",
    sourceUrl: "https://simienethiotours.com/",
    author: "Simien Ethio Tours",
    license: "Operator-supplied for site use",
    attribution: "Simien Ethio Tours (operator-supplied photograph).",
    status: "verified",
  },
];

export const verifiedPhotoCreditCount = photoCredits.filter((photo) => photo.status === "verified").length;
