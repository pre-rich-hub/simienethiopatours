import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "@/components/Icon";
import { PageShell } from "@/components/PageShell";
import { FeatureGrid, PageLinks, PlanningCall, SectionIntro, StorySection } from "@/components/Editorial";
import { sourceLinks } from "@/lib/site";

export const metadata: Metadata = { title: "About Us | Tevan’s Story", description: "Meet Tesema ‘Tevan’ Mulualem, the Gondar-based founder and guide behind Gondar Simien Tours. Local knowledge, personal guiding and careful preparation.", alternates: { canonical: "/about" } };

export default function AboutPage() {
  return <PageShell>
    <section className="about-hero page-hero"><div className="shell about-hero__grid"><div><div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Our story</span></div><p className="eyebrow eyebrow--copper">Tesema “Tevan” Mulualem · Founder & local guide</p><h1 className="display">The story <em>starts here.</em></h1><p className="lead">“I want people to experience the place I know—not just visit it.”</p></div><div className="about-hero__portrait image-frame"><Image src="/images/tevan-portrait.jpg" alt="Tesema ‘Tevan’ Mulualem standing in the Simien Mountains" fill priority sizes="(max-width: 720px) 100vw, 45vw" /></div></div></section>
    <PageLinks items={[{ label: "Tevan’s story", href: "#story" }, { label: "Our approach", href: "#approach" }, { label: "Tevan Local", href: "#local" }, { label: "Equipment & preparation", href: "#equipment" }]} />
    <StorySection id="story" tag="The road out of Gondar" title="Before the mountains" accent="became a tour." paragraphs={[
      "There is a road out of Gondar that I never get tired of taking. The city slowly disappears behind you. Houses become fewer, the landscape opens, the air changes and the road climbs. Then the Simien Mountains begin to appear. Every time I see them, I remember why I chose this work.",
      "My name is Tesema ‘Tevan’ Mulualem. I am a local guide from Gondar, Ethiopia, and I created Gondar Simien Tours around the place I know as home.",
      "Before the mountains were a destination on an itinerary, they were simply part of life. I learned how a familiar trail changes with the season, how clouds transform a valley in minutes, and how wildlife follows its own timetable. Knowing a place is different from simply knowing the way through it.",
    ]} />
    <StorySection tag="Then I started guiding" title="Seeing home" accent="through new eyes." paper paragraphs={[
      "A traveler stops to watch a gelada and asks another question. Someone notices the farming terraces or wonders why a village was built where it is. Someone tries Ethiopian coffee for the first time. Someone reaches a viewpoint and goes quiet.",
      "Guiding made me notice things I once took for granted. I realized that my job was to help people understand where they were, rather than simply point to the trail.",
      "That is why I wanted to build a personal kind of travel. A couple looking for a quiet mountain experience, a photographer waiting for the light and a strong hiker preparing for Ras Dashen need different journeys. The first step is listening.",
    ]} />
    <section className="section" id="approach"><div className="shell"><SectionIntro tag="The kind of travel I believe in" title="The right things." accent="At the right pace." /><FeatureGrid items={[
      { title: "Room for the unexpected", body: "A quiet trail, a conversation on the road, a mountain appearing through cloud or a coffee when nobody is in a hurry. Sometimes the moment you remember most was never on the itinerary." },
      { title: "Honest advice", body: "If a trek is too ambitious, I will say so. If it needs more time, we discuss it. If weather or local conditions change the plan, we adapt. Wildlife sightings and summit success are never promises." },
      { title: "Respect for home", body: "Slow down enough to notice. Respect wildlife, communities, people’s privacy and the landscape. The Simien Mountains are a place where people live, as well as a place travelers come to discover." },
    ]} /></div></section>
    <section className="section section--dark credentials-section"><div className="shell"><p className="eyebrow eyebrow--copper">Verified local expertise</p><div className="credentials-grid"><div><CheckCircle2 /><span>Founder & lead guide</span><strong>Tesema “Tevan” Mulualem</strong></div><div><CheckCircle2 /><span>Professional qualification</span><strong>Tour Guiding Level IV</strong></div><div><CheckCircle2 /><span>Operating company</span><strong>Simien Ethio Tours</strong></div><div><CheckCircle2 /><span>Based</span><strong>Fasil Castle Street, Gondar</strong></div></div><p className="credential-source">Credentials and licensing are published on the <a href={sourceLinks.operatorAbout} target="_blank" rel="noreferrer">official operating company site ↗</a>.</p></div></section>
    <section className="section tevan-local" id="local"><div className="shell tevan-local__grid"><div><p className="eyebrow eyebrow--copper">Tevan Local</p><h2 className="section-title">The people are <em>part of the journey.</em></h2></div><div><p className="lead">You may see one guide, but a much bigger team often stands behind the trek: scouts, cooks, drivers, mule handlers, accommodation providers, suppliers and community hosts. They are part of the experience.</p><div className="prose"><p>A successful journey depends on people working together. Tevan Local is our commitment to keep more value close to the people who make the journey possible, and to share evidence as that work grows.</p></div><div className="local-chain"><span>Traveler</span><i>→</i><span>Local team</span><i>→</i><span>Local business</span><i>→</i><span>Local future</span></div></div></div></section>
    <StorySection id="equipment" tag="Behind the scenes" title="You see the mountains." accent="We prepare for them." paper paragraphs={[
      "Before you arrive, routes are planned, transport is organized, food is prepared and the mountain team is coordinated. Weather and equipment need attention long before the first walking day.",
      "A tent matters when the wind moves through camp. A sleeping system matters when the temperature drops. Cooking equipment matters when dinner is being prepared after a long day on the trail. We prepare, check, clean, maintain and organize the gear before it becomes part of your journey.",
      "Your final quotation explains the camping and sleeping equipment included. Tell us your comfort needs and ask about anything you plan to bring or hire.",
    ]}><Link className="text-link" href="/travel-guide#packing">Read the preparation notes</Link></StorySection>
    <section className="section"><div className="shell founder-note"><p className="eyebrow eyebrow--copper">A note from Tevan</p><blockquote>“I have walked these mountains many times. But guiding has taught me that you never really see a place the same way twice. A traveler asks a question. Someone notices something you’ve walked past a hundred times. The light reaches the valley differently. Suddenly, you are seeing your own home through someone else’s eyes.”</blockquote><p>I want to share a place that means something to me. I hope that when you leave, the Simien means something to you too.</p><span>Tesema “Tevan” · Founder & local guide · Gondar, Ethiopia</span></div></section>
    <PlanningCall title="Before you book, tell me your story." eyebrow="Your time · Your curiosity · Your pace" label="Plan your journey with Tevan" />
  </PageShell>;
}
