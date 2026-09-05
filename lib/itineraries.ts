import type { Feature, ItineraryDay } from "@/components/Editorial";
import { classicJourneys } from "@/lib/classic-itineraries";

export type JourneyDetail = {
  slug: string; inquiry: string; title: string; heroTitle: string; heroAccent: string;
  description: string; image: string; imageAlt: string; duration: string; route: string[];
  facts: { label: string; value: string }[]; introduction: string[];
  days: ItineraryDay[]; highlights: Feature[]; preparation: string[]; inclusions: string[];
  exclusions?: string[]; notice?: string; related?: Feature[];
};

export const detailedJourneys: JourneyDetail[] = [
  ...classicJourneys,
  {
    slug: "10-day-simien-ras-dashen", inquiry: "full-simien",
    title: "10-Day Simien Mountains & Ras Dashen Expedition",
    heroTitle: "From the escarpment", heroAccent: "to Ras Dashen.",
    description: "Ten days through high passes, remote valleys and mountain communities, with a Ras Dashen summit attempt and a return through the quieter lowlands.",
    image: "/images/simien-panorama.jpg", imageAlt: "Ridges and escarpments across the Simien Mountains", duration: "10 days · 9 nights",
    route: ["Gondar", "Debark", "Sankaber", "Geech", "Imet Gogo", "Inatye", "Chenek", "Bwahit Pass", "Ambiko", "Ras Dashen", "Ambiko", "Sona", "Mekarebya", "Mulit", "Adi Arkay", "Gondar"],
    facts: [
      { label: "Duration", value: "10 days / 9 nights" }, { label: "Start & finish", value: "Gondar" },
      { label: "Walking", value: "Challenging" }, { label: "Travel style", value: "Private or small group" },
      { label: "Highest objective", value: "Ras Dashen · approx. 4,550 m" }, { label: "Stay", value: "1 hotel night + 8 camping nights" },
    ],
    introduction: [
      "The journey begins among Gondar’s royal history, then follows the famous Simien escarpment through Sankaber, Geech and Imet Gogo. Geladas may graze on the plateau while the valleys open far below the trail.",
      "Beyond Chenek, the character changes. Cross Bwahit Pass, descend toward the Meseha Valley and prepare at Ambiko for a summit attempt. After Ras Dashen, the proposed route continues through Sona, Mekarebya and Mulit toward Adi Arkay instead of retracing the whole approach.",
      "This expedition is for fit travelers prepared for long mountain days, high altitude and basic camps. The summit is one chapter; the changing landscapes and the people behind the trek are the rest of the story.",
    ],
    days: [
      { title: "Arrival in Gondar", subtitle: "The royal city", overnight: "Gondar hotel", paragraphs: ["Meet your guide and settle into your hotel. If arrival time allows, take a relaxed introduction to Gondar and the Royal Enclosure area.", "In the evening, review the route, walking pace, altitude, weather, equipment, camp arrangements and summit-day expectations with the team."] },
      { title: "Gondar → Debark → Sankaber", subtitle: "The city disappears. The mountains begin.", overnight: "Sankaber camp", paragraphs: ["Travel north toward Debark, where park arrangements are completed and your mountain team comes together. Continue into the park for an introductory walk selected around your start point and arrival time.", "Take your first steps along the escarpment, look for geladas and settle into your first highland camp."] },
      { title: "Sankaber → Geech", subtitle: "Following the escarpment", overnight: "Geech camp", paragraphs: ["Follow the high escarpment through cliffs, valleys and highland scenery, passing the Jinbar Waterfall area when the selected route allows.", "Watch for geladas and highland birds, and notice the farming landscapes and giant lobelias along the way. Reach Geech for an evening in the mountains, with time for the light if weather and energy permit."] },
      { title: "Geech → Imet Gogo → Chenek", subtitle: "The day of the great views", overnight: "Chenek camp", paragraphs: ["Walk toward Imet Gogo for one of the great views across the Simien ridges and valleys. Continue through the highlands via Inatye toward Chenek, according to the confirmed route.", "This is a long mountain day with many reasons to stop: wildlife, changing cloud, dramatic formations and wide views. Settle into camp before moving beyond the classic circuit tomorrow."] },
      { title: "Chenek → Bwahit Pass → Ambiko", subtitle: "Down into the great valley", overnight: "Ambiko camp", paragraphs: ["Climb toward Bwahit Pass before descending toward the Meseha Valley and Ambiko. Steep ground and significant elevation changes make this a demanding stage.", "The scenery becomes more remote as the summit approaches. At Ambiko, review the next day with your guide and prepare for an early start."] },
      { title: "Ambiko → Ras Dashen → Ambiko", subtitle: "The summit attempt", overnight: "Ambiko camp", paragraphs: ["Begin before sunrise and make a measured ascent toward Ras Dashen, also called Ras Dejen. Long walking hours, altitude, steep sections and rocky terrain make this the expedition’s most demanding objective.", "Your guide assesses conditions and the group’s progress throughout the attempt. Reaching the summit depends on those conditions; after the climb, return to Ambiko to rest."] },
      { title: "Ambiko → Sona", subtitle: "Beyond the summit", overnight: "Sona camp", paragraphs: ["Continue toward Sona on the onward traverse, subject to the confirmed route and local access. This stage carries the expedition beyond its summit objective into another part of the mountain landscape.", "Vegetation, settlements and the character of the trail change as the journey turns toward the lower valleys."] },
      { title: "Sona → Mekarebya", subtitle: "Into the quieter Simien", overnight: "Mekarebya camp", paragraphs: ["Descend into a less-traveled part of the region, where the trail is as much about rural life and changing landscapes as famous viewpoints.", "Depending on local arrangements, there may be opportunities to learn about farming, meet community members, watch birds or share coffee. Encounters follow the wishes and daily routines of the people who live here."] },
      { title: "Mekarebya → Mulit", subtitle: "The last full walking chapter", overnight: "Mulit camp", paragraphs: ["Continue toward Mulit through warmer country, with the high peaks gradually receding behind you. The final route and daily effort are confirmed for the operating conditions.", "Spend the last camp evening with your trekking team, looking back through photographs and stories from the escarpment, the summit approach and the valleys."] },
      { title: "Mulit → Adi Arkay → Gondar", subtitle: "From trail to road", paragraphs: ["Complete the final walk toward Adi Arkay, where the vehicle meets you for the return toward Gondar.", "Finish with a hotel or airport transfer according to your confirmed onward arrangements. An additional night in Gondar or a longer northern Ethiopia journey can be arranged separately."] },
    ],
    highlights: [
      { title: "Imet Gogo", body: "Look across the scale of the escarpment, with ridges and valleys unfolding beyond the trail." },
      { title: "Chenek", body: "Spend time where mountain scenery and the possibility of highland wildlife meet." },
      { title: "Bwahit Pass", body: "Cross a major high point on the approach to the Ras Dashen side of the range." },
      { title: "Ras Dashen", body: "Work toward Ethiopia’s highest summit with a local team and an itinerary that allows for the realities of the mountain." },
      { title: "The lowland descent", body: "Continue beyond the familiar circuit into changing vegetation, warmer valleys and rural communities." },
      { title: "Wildlife in its own time", body: "Look for geladas, Walia ibex and highland birds. Ethiopian wolves are rare, and no sighting is guaranteed." },
    ],
    preparation: [
      "Expect long walking days, steep ascents and descents, uneven ground and substantial changes in elevation. Previous hiking experience is recommended.",
      "Prepare for cold highland nights and basic camping. Discuss your walking experience, sleeping equipment, warm layers and weather protection before departure.",
      "Daily distances, walking times, campsite choices and access are confirmed in your final itinerary. This is a proposed ten-day progression, adapted when mountain or local conditions require it.",
    ],
    inclusions: ["Gondar pickup, approach transport, return transport and agreed transfers", "English-speaking local guide and required park arrangements, including a scout", "Tents, mattresses and sleeping equipment as specified in your quotation", "Cook and camp support, with mules and handlers where required", "Trekking meals and drinking-water arrangements as agreed", "The first Gondar hotel night, city introduction and summit attempt when included in your package"],
  },
  {
    slug: "gondar-heritage-simien", inquiry: "gondar-heritage-simien", title: "Gondar, Heritage & Simien — 5 Days",
    heroTitle: "From the city of emperors", heroAccent: "to the highlands.",
    description: "Five days connecting Gondar’s royal history, Woleka heritage and the landscapes, wildlife and local life of the Simien Mountains.",
    image: "/images/fasil-ghebbi.jpg", imageAlt: "Stone royal architecture at Fasil Ghebbi in Gondar", duration: "5 days · 4 nights",
    route: ["Gondar", "Fasil Ghebbi", "Debre Berhan Selassie", "Kuskuam", "Woleka", "Debark", "Simien Mountains", "Gondar"],
    facts: [
      { label: "Duration", value: "5 days / 4 nights" }, { label: "Start & finish", value: "Gondar" },
      { label: "Walking", value: "Adapted to your ability" }, { label: "Travel style", value: "Private or small group" },
      { label: "City stay", value: "2 nights in Gondar" }, { label: "Mountain stay", value: "2 nights · lodge or camp by arrangement" },
    ],
    introduction: [
      "History, culture and landscape belong to one connected journey here. Begin among Gondar’s castles and churches, then follow the road through Woleka and Debark into the Simien Mountains.",
      "The trip leaves time for Ethiopian food, coffee and respectful encounters as well as the famous sights. Choose a more active mountain section or a gentler combination of scenic drives, viewpoints and short walks.",
    ],
    days: [
      { title: "Welcome to Gondar", subtitle: "The city of emperors", overnight: "Gondar", paragraphs: ["Meet your local guide, settle into your hotel and take the day at your arrival pace. A gentle city walk, a local café or time to rest can make the first chapter.", "In the evening, talk through the heritage visits and mountain experience ahead."] },
      { title: "Fasil Ghebbi · Debre Berhan Selassie · Kuskuam", subtitle: "Walking through history", overnight: "Gondar", paragraphs: ["Explore the royal compound at Fasil Ghebbi and connect its palaces with the political, religious and cultural life of the historic capital.", "Visit Debre Berhan Selassie and its painted ceiling, then continue to Kuskuam and the story of Empress Mentewab, as opening arrangements allow. Finish in the living city with food, coffee and conversation."] },
      { title: "Gondar → Woleka → Debark → Simien", subtitle: "Beyond the city", overnight: "Simien Mountains", paragraphs: ["Stop in the Woleka area to learn about its association with Ethiopia’s Beta Israel heritage. Your guide provides historical context and helps arrange encounters respectfully, without treating community life as a display.", "Continue toward Debark for park arrangements, then enter the highlands. Depending on timing, begin with short walks, viewpoints, photography and opportunities to observe geladas."] },
      { title: "A full day in the Simien Mountains", subtitle: "Choose your mountain pace", overnight: "Simien Mountains", paragraphs: ["Your guide selects the route around your fitness, interests, accommodation, weather and trail access. Active options may explore the Geech and Imet Gogo areas where the itinerary makes them practical.", "A gentler day can combine scenic drives, viewpoints, short walks and wildlife watching, including the Chenek area when appropriate. These are alternative approaches to the day, with time to stop and experience the highlands."] },
      { title: "Simien → Debark → Gondar", subtitle: "The road back", paragraphs: ["Enjoy a final mountain walk or viewpoint if your schedule allows, then return through Debark toward Gondar.", "Continue to your hotel or airport according to your plans. Extra Gondar time, a longer trek or an onward northern Ethiopia journey can be arranged around current access and your travel window."] },
    ],
    highlights: [
      { title: "Royal heritage", body: "Fasil Ghebbi, Debre Berhan Selassie and Kuskuam connect the different chapters of Gondar’s past." },
      { title: "Living culture", body: "Make room for Woleka heritage, the city’s everyday streets, local food and coffee." },
      { title: "Mountain days", body: "Escarpments, highland landscapes and wildlife opportunities, with walking matched to your pace." },
      { title: "More history", body: "Add time in Gondar for architecture, churches and the stories beyond the monuments." },
      { title: "More adventure", body: "Extend the mountain section or discuss a separate Ras Dashen expedition." },
      { title: "More comfort", body: "Discuss accommodation and transport choices that fit your preferred balance of comfort and exploration." },
    ],
    preparation: ["Mountain visits are selected as a workable route, rather than a promise to reach every named viewpoint in one day.", "Guides explain local customs, respectful photography and the context of community visits. Follow the wishes of hosts and ask before photographing people.", "Weather, wildlife and access vary. Your final quote confirms accommodation, daily arrangements and the mountain route."],
    inclusions: ["Gondar arrival and departure arrangements as agreed", "Local guiding for city, heritage and mountain experiences", "Private transport between Gondar, Woleka, Debark and the mountains", "Two Gondar nights and two mountain nights in the agreed accommodation", "Site entry, park arrangements, meals and any camping support as specified in your quotation"],
  },
];

export const timkatDays: ItineraryDay[] = [
  { title: "Arrive in Gondar", subtitle: "Meet the city and your local team", overnight: "Gondar", paragraphs: ["Settle into your hotel and meet your guide. According to arrival time, enjoy a short orientation, traditional dinner and a briefing on the festival, its meaning and visitor etiquette."] },
  { title: "Gondar & Timkat eve", subtitle: "Ketera · the beginning of the celebration", overnight: "Gondar", paragraphs: ["Explore selected royal-city sites before joining the atmosphere of Ketera, the eve of Timkat. Learn about the Tabot processions and the significance of the ceremonies as your guide explains where visitors may respectfully observe."] },
  { title: "Timkat in Gondar", subtitle: "The main festival day", overnight: "Gondar", paragraphs: ["Begin early for the morning ceremonies and the celebration associated with Fasil’s Pool. Experience chanting, music and processions with cultural interpretation and guidance from your local team.", "Return to your hotel later and leave time to rest. Access and the order of events follow local arrangements."] },
  { title: "Gondar → Debark → Simien", subtitle: "From the festival to the highlands", overnight: "Simien Mountains", paragraphs: ["Travel north through Debark and into the mountains. Depending on timing and conditions, enjoy introductory walks, viewpoints and opportunities to observe geladas before arriving at your lodge or camp."] },
  { title: "A day in the Simien Mountains", subtitle: "Escarpments, wildlife and local life", overnight: "Simien Mountains", paragraphs: ["Spend a full day in the highlands. Routes may include the Geech or Imet Gogo areas when suitable for your base and walking ability, or a gentler set of viewpoints and short walks.", "The day is adapted to weather, access, fitness and the group’s interests."] },
  { title: "Simien → Gondar", subtitle: "A final mountain morning", paragraphs: ["Enjoy a last walk or viewpoint if time permits, then return toward Gondar for your hotel or airport transfer. Extra trekking or onward journeys to Lalibela, Axum or other northern destinations can be discussed for your dates."] },
];
