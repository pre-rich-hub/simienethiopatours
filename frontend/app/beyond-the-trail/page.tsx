import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { EditorialHero, FeatureGrid, PageLinks, PlanningCall, SectionIntro, StorySection } from "@/components/Editorial";
import { ExperiencePhotoCards, type ExperiencePhotoItem } from "@/components/ExperiencePhotoCards";
import { cms, type ExperienceLink } from "@/lib/cms";

export const metadata: Metadata = { title: "Beyond the Trail | Culture, Festivals & Local Experiences", description: "Connect Gondar, Simien trekking, photography, running, festivals, food and local life with one Gondar-based team.", alternates: { canonical: "/beyond-the-trail" } };

// Image paths for the featured experience cards, keyed by position.
const experienceImages: readonly { src: string; alt: string; caption: string; position?: string }[] = [
  { src: "/images/fasil-ghebbi.jpg", alt: "The royal stone architecture of Fasil Ghebbi in Gondar", caption: "Royal Gondar → Simien" },
  { src: "/images/imet-gogo.jpg", alt: "Layered escarpments along the longer Simien expedition route", caption: "Escarpment → Ras Dashen" },
  { src: "/images/road-to-simien.jpg", alt: "Community life in the northern Ethiopian highlands", caption: "Living culture · Northern Ethiopia" },
  { src: "/images/road-to-simien.jpg", alt: "Open country and quiet paths outside Gondar", caption: "Gondar · Paths beyond the city" },
  { src: "/images/simien-panorama.jpg", alt: "Wide Simien Mountain landscape in changing highland light", caption: "Landscape · Wildlife · Light" },
  { src: "/images/tevan-founder.jpg", alt: "A local guide sharing northern Ethiopia through personal experience", caption: "Gondar · Through local eyes", position: "center 28%" },
];

const localExperiences: readonly ExperiencePhotoItem[] = [
  { title: "Coffee & food", tag: "Taste · Story · Welcome", body: "Discover coffee preparation, injera, local ingredients, spices and the stories behind shared meals. Tell us your interests and dietary needs so the experience fits you.", href: "/plan?experience=food-coffee", linkLabel: "Plan food & coffee", image: { src: "/images/road-to-simien.jpg", alt: "Everyday highland life connected to food and coffee traditions", caption: "Prepared and shared locally" } },
  { title: "Village & community visits", tag: "Listen · Meet · Understand", body: "Village walks, farming, traditional homes, bread making, local food and family conversations can be arranged with willing hosts. The encounter follows community life and local wishes.", href: "/plan?experience=community", linkLabel: "Ask about community visits", image: { src: "/images/tevan-founder.jpg", alt: "A local host and guide in the northern Ethiopian landscape", caption: "Introductions with local context", position: "center 28%" } },
  { title: "Gondar & Kosoye", tag: "City · Country · View", body: "Move from the city into countryside, rural walking routes and highland views. Connect the city with the people and landscapes around it.", href: "/plan?experience=kosoye", linkLabel: "Explore Kosoye", image: { src: "/images/simien-panorama.jpg", alt: "Highland views in the country beyond Gondar", caption: "Gondar → Kosoye highlands" } },
];

export default async function BeyondPage() {
  const experiences = await cms.getExperienceLinks();

  // Map the first 6 experiences to the photo card format.
  const featuredExperiences: readonly ExperiencePhotoItem[] = experiences.slice(0, 6).map((exp, i) => {
    const img = experienceImages[i] || experienceImages[0];
    return { ...exp, image: img };
  });

  return <PageShell lightHeader={false}>
    <EditorialHero eyebrow="Beyond the trail" title="More than trekking." accent="More ways to connect." lead="Castles, coffee, festivals, countryside and mountain mornings. Build a northern Ethiopia journey around what you actually want to experience." image={{ src: "/images/road-to-simien.jpg", alt: "Everyday life in the highlands on the road toward Simien" }} parent={{ label: "Journeys", href: "/treks" }} />
    <PageLinks items={[{ label: "Experiences", href: "#experiences" }, { label: "Food & communities", href: "#local-experiences" }, { label: "Travel services", href: "#services" }, { label: "Custom journeys", href: "#custom" }]} />
    <section className="section" id="experiences"><div className="shell"><SectionIntro tag="Choose your way" title="The mountain is" accent="only the beginning." /><p className="content-lead">Before the trail, there is Gondar. Beyond it are villages, traditions and roads into landscapes worth taking time to understand. These experiences connect the pieces.</p><ExperiencePhotoCards items={featuredExperiences} /></div></section>
    <section className="section section--paper" id="local-experiences"><div className="shell"><SectionIntro tag="Sit down. Slow down." title="Local life," accent="shared with respect." /><ExperiencePhotoCards items={localExperiences} /></div></section>
    <section className="section" id="services"><div className="shell"><SectionIntro tag="One local point of contact" title="Arrive. Move." accent="Explore." /><FeatureGrid items={[
      { title: "Airport transfers", body: "Arrange Gondar pickup and drop-off around your arrival, trek and onward travel." },
      { title: "Private transport", body: "Coordinate a vehicle for Gondar, Debark, Simien or a longer journey according to the route and local conditions." },
      { title: "Local guides", body: "Understand the history, landscape, wildlife and everyday life with guides who know the region." },
      { title: "Trekking support", body: "Bring together camping equipment, food, camp teams, scouts and pack support according to the trek's requirements." },
      { title: "Accommodation", body: "Connect hotels, guesthouses, lodges and camps with your comfort, budget and trekking schedule.", href: "/where-to-stay-gondar-simien", linkLabel: "Explore where to stay" },
      { title: "Connected planning", body: "Keep arrival, transport, guiding, mountain days and the return journey coordinated through one local team.", href: "/plan?experience=travel-services", linkLabel: "Arrange your travel" },
    ]} /></div></section>
    <StorySection id="custom" tag="Custom northern Ethiopia" title="Your priorities." accent="Your journey." paper image={{ src: "/images/imet-gogo.jpg", alt: "A wide Simien Mountain landscape for a personally planned northern Ethiopia journey", caption: "Built around your time and interests" }} paragraphs={[
      "You may have five days or three weeks. You may want mountains without trekking every day, a festival with time for photography, or Gondar's history followed by wildlife and camping. Tell us what matters most.",
      "Possible extensions include Lalibela, Axum, Bahir Dar and Danakil. We discuss how they fit your dates, available time and current access before building the final route.",
      "Local knowledge means knowing when to change a plan. We consider weather, roads, walking ability and the interests you discover along the way, so the journey makes sense when you are actually here.",
    ]}><Link className="text-link" href="/plan?experience=custom">Build a custom journey</Link></StorySection>
    <PlanningCall title="Tell us your idea. We'll build the journey." experience="custom" label="Plan my journey" />
  </PageShell>;
}
