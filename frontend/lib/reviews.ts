export type ReviewSource = "Tripadvisor" | "Google";

export type TravelerReview = {
  name: string;
  initials: string;
  date: string;
  source: ReviewSource;
  title?: string;
  text: string;
  avatarTone: "clay" | "sky" | "forest" | "sand" | "slate" | "berry";
  translatedFrom?: string;
};

// Review copy transcribed from the supplied Tripadvisor and Google review reference.
// Non-English originals are translated into English below (translatedFrom notes the source language);
// reviews left mid-sentence in the source material are trimmed to the last complete, faithful clause
// rather than fabricating an ending. Two Tripadvisor entries used the reviewer's anonymized platform
// handle rather than a name, so they're labeled "Tripadvisor Traveler" instead of showing the raw handle.
export const travelerReviews: readonly TravelerReview[] = [
  { name: "Margherita F", initials: "MF", date: "7 months ago", source: "Tripadvisor", title: "Getting to Know the Real Gondar and Its People", text: "Tesema is a knowledgeable, professional, friendly and helpful guide.", avatarTone: "berry", translatedFrom: "Italian" },
  { name: "Tripadvisor Traveler", initials: "T", date: "7 months ago", source: "Tripadvisor", title: "Wandering Around Gondar with Our Friend Tesema", text: "Our stay in Gondar was wonderful.", avatarTone: "sand", translatedFrom: "Italian" },
  { name: "Tripadvisor Traveler", initials: "T", date: "7 months ago", source: "Tripadvisor", title: "Exceptional Service with Simien Ethio Tours – Highly Recommended in Gondar!", text: "We recently joined Simien Ethio Tours.", avatarTone: "sky", translatedFrom: "Chinese" },
  { name: "Romain GC", initials: "RG", date: "5 months ago", source: "Tripadvisor", title: "Travel to Ethiopia", text: "Tesema is a great person. He gave me a lot of good advice. Nice visit.", avatarTone: "slate" },
  { name: "Marek C", initials: "MC", date: "6 months ago", source: "Tripadvisor", title: "Simien", text: "A very pleasant trip a short distance from Gondar, where you can also see geladas.", avatarTone: "forest", translatedFrom: "Slovak" },
  { name: "Voken Granger", initials: "VG", date: "7 months ago", source: "Google", text: "Tevan replies very quickly and is very friendly, responding to needs right away. If you're traveling to Gondar, you can talk to them — sometimes there are pleasant surprises, including with pricing!", avatarTone: "forest", translatedFrom: "Chinese" },
  { name: "高慶樺", initials: "高", date: "7 months ago", source: "Google", text: "The top choice for touring Gondar: professional, trustworthy and great value — Simien Ethio Tours!", avatarTone: "sand", translatedFrom: "Chinese" },
  { name: "Tyrell Heaton", initials: "TH", date: "7 months ago", source: "Google", text: "My wife and I visited Gonder and were greeted by Tessema upon our arrival to town. He is an exceptional host.", avatarTone: "sky" },
  { name: "Margherita Ferrari", initials: "M", date: "7 months ago", source: "Google", text: "Tesema (Tevan) was extremely kind and helpful. He organized a city tour for us, saving us money on transportation.", avatarTone: "clay" },
  { name: "Eugenio Capra", initials: "E", date: "7 months ago", source: "Google", text: "Excellent experience, well organized with kind and helpful people. Every promise was kept. Very satisfied.", avatarTone: "slate", translatedFrom: "Italian" },
  { name: "Sasa Lazic", initials: "S", date: "7 months ago", source: "Google", text: "Tesema is a very professional and knowledgeable guide… and also a master tea maker.", avatarTone: "berry" },
];

export const reviewSources = [
  { source: "Tripadvisor" as const, verdict: "Excellent", total: 20 },
  { source: "Google" as const, verdict: "Excellent", total: 21 },
] as const;
