import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { EditorialHero, FeatureGrid, PageLinks, PlanningCall, SectionIntro, StorySection } from "@/components/Editorial";
import { experienceLinks } from "@/lib/experiences";

export const metadata: Metadata = { title: "Beyond the Trail | Culture, Festivals & Local Experiences", description: "Connect Gondar, Simien trekking, photography, running, festivals, food and local life with one Gondar-based team.", alternates: { canonical: "/beyond-the-trail" } };

export default function BeyondPage() {
  return <PageShell lightHeader={false}>
    <EditorialHero eyebrow="Beyond the trail" title="More than trekking." accent="More ways to connect." lead="Castles, coffee, festivals, countryside and mountain mornings. Build a northern Ethiopia journey around what you actually want to experience." image={{ src: "/images/road-to-simien.jpg", alt: "Everyday life in the highlands on the road toward Simien" }} parent={{ label: "Journeys", href: "/treks" }} />
    <PageLinks items={[{ label: "Experiences", href: "#experiences" }, { label: "Food & communities", href: "#local-experiences" }, { label: "Travel services", href: "#services" }, { label: "Custom journeys", href: "#custom" }]} />
    <section className="section" id="experiences"><div className="shell"><SectionIntro tag="Choose your way" title="The mountain is" accent="only the beginning." /><p className="content-lead">Before the trail, there is Gondar. Beyond it are villages, traditions and roads into landscapes worth taking time to understand. These experiences connect the pieces.</p><FeatureGrid items={experienceLinks} /></div></section>
    <section className="section section--paper" id="local-experiences"><div className="shell"><SectionIntro tag="Sit down. Slow down." title="Local life," accent="shared with respect." /><FeatureGrid items={[
      { title: "Coffee & food", body: "Discover coffee preparation, injera, local ingredients, spices and the stories behind shared meals. Tell us your interests and dietary needs so the experience fits you.", href: "/plan?experience=food-coffee", linkLabel: "Plan food & coffee" },
      { title: "Village & community visits", body: "Village walks, farming, traditional homes, bread making, local food and family conversations can be arranged with willing hosts. The encounter follows community life and local wishes.", href: "/plan?experience=community", linkLabel: "Ask about community visits" },
      { title: "Gondar & Kosoye", body: "Move from the royal city into countryside, rural walking routes and highland views. Connect the city with the people and landscapes around it.", href: "/plan?experience=kosoye", linkLabel: "Explore Kosoye" },
    ]} /></div></section>
    <section className="section" id="services"><div className="shell"><SectionIntro tag="One local point of contact" title="Arrive. Move." accent="Explore." /><FeatureGrid items={[
      { title: "Airport transfers", body: "Arrange Gondar pickup and drop-off around your arrival, trek and onward travel." },
      { title: "Private transport", body: "Coordinate a vehicle for Gondar, Debark, Simien or a longer journey according to the route and local conditions." },
      { title: "Local guides", body: "Understand the history, landscape, wildlife and everyday life with guides who know the region." },
      { title: "Trekking support", body: "Bring together camping equipment, food, camp teams, scouts and pack support according to the trek’s requirements." },
      { title: "Accommodation", body: "Connect hotels, guesthouses, lodges and camps with your comfort, budget and trekking schedule.", href: "/where-to-stay-gondar-simien", linkLabel: "Explore where to stay" },
      { title: "Connected planning", body: "Keep arrival, transport, guiding, mountain days and the return journey coordinated through one local team.", href: "/plan?experience=travel-services", linkLabel: "Arrange your travel" },
    ]} /></div></section>
    <StorySection id="custom" tag="Custom northern Ethiopia" title="Your priorities." accent="Your journey." paper paragraphs={[
      "You may have five days or three weeks. You may want mountains without trekking every day, a festival with time for photography, or Gondar’s history followed by wildlife and camping. Tell us what matters most.",
      "Possible extensions include Lalibela, Axum, Bahir Dar and Danakil. We discuss how they fit your dates, available time and current access before building the final route.",
      "Local knowledge means knowing when to change a plan. We consider weather, roads, walking ability and the interests you discover along the way, so the journey makes sense when you are actually here.",
    ]}><Link className="text-link" href="/plan?experience=custom">Build a custom journey</Link></StorySection>
    <PlanningCall title="Tell us your idea. We’ll build the journey." experience="custom" label="Plan my journey" />
  </PageShell>;
}
