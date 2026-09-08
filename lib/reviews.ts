export type ReviewSource = "Tripadvisor" | "Google";

export type TravelerReview = {
  name: string;
  initials: string;
  date: string;
  source: ReviewSource;
  title?: string;
  text: string;
  avatarTone: "clay" | "sky" | "forest" | "sand" | "slate" | "berry";
};

// Review copy transcribed from the supplied Tripadvisor and Google review reference.
export const travelerReviews: readonly TravelerReview[] = [
  { name: "Margherita F", initials: "MF", date: "7 months ago", source: "Tripadvisor", title: "Conoscere la vera Gondar e la sua gente", text: "Tesema è una guida preparata, seria, simpatica e disponibile…", avatarTone: "berry" },
  { name: "NorthStar687124211…", initials: "N", date: "7 months ago", source: "Tripadvisor", title: "A spasso per Gondar con il nostro amico Tesema", text: "Il nostro soggiorno a Gondar è stato magnifico grazie a…", avatarTone: "sand" },
  { name: "Voyage583300535…", initials: "V", date: "7 months ago", source: "Tripadvisor", title: "Exceptional Service with Simien Ethio Tours – Highly Recommended in Gondar!", text: "我們最近參加了 Simien Ethio Tours…", avatarTone: "sky" },
  { name: "Romain GC", initials: "RG", date: "5 months ago", source: "Tripadvisor", title: "Travel to Ethiopia", text: "Tesema is a great person. He gave me a lot of good advice. Nice visit.", avatarTone: "slate" },
  { name: "Marek C", initials: "MC", date: "6 months ago", source: "Tripadvisor", title: "Simien", text: "Velmi prijemny vylet kusok od mesta Gondar, kde je tiez mozne vidiet Gelaty, kedze je t…", avatarTone: "forest" },
  { name: "Voken Granger", initials: "V", date: "7 months ago", source: "Google", text: "Tevan回覆非常迅速，十分友善，即時回應需求，來到Gondar旅遊可以跟他們談談，有時候會有驚喜，包含價格！", avatarTone: "forest" },
  { name: "高慶樺", initials: "高", date: "7 months ago", source: "Google", text: "在貢德爾 (Gondar) 旅遊的首選：專業、誠信且超值的 Simien Ethio Tours！…", avatarTone: "sand" },
  { name: "Tyrell Heaton", initials: "TH", date: "7 months ago", source: "Google", text: "My wife and I visited Gonder and were greeted by Tessema upon our arrival to town. He is an exceptional host and pays…", avatarTone: "sky" },
  { name: "Margherita Ferrari", initials: "M", date: "7 months ago", source: "Google", text: "Tesema (Tevan) was extremely kind and helpful. He organized a city tour for us, saving us money on transportation and…", avatarTone: "clay" },
  { name: "Eugenio Capra", initials: "E", date: "7 months ago", source: "Google", text: "Esperienza ottima, bene organizzata con persone gentili e disponibili. Ogni promessa mantenuta. Molto soddisfatto…", avatarTone: "slate" },
  { name: "Sasa Lazic", initials: "S", date: "7 months ago", source: "Google", text: "Tesema is a very professional and knowledgeable guide… and also a master tea maker.", avatarTone: "berry" },
];

export const reviewSources = [
  { source: "Tripadvisor" as const, verdict: "Excellent", total: 20 },
  { source: "Google" as const, verdict: "Excellent", total: 21 },
] as const;
