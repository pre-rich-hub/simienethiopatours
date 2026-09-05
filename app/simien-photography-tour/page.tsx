import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { EditorialHero, FeatureGrid, PageLinks, PlanningCall, SectionIntro, StorySection } from "@/components/Editorial";
import { PhotoJournal } from "@/components/PhotoJournal";

export const metadata: Metadata = { title: "Simien Mountains Photography Tour | Wildlife & Landscapes", description: "Photograph Simien landscapes, geladas, highland life and changing light with local guides. One-day experiences and longer photography journeys from Gondar.", alternates: { canonical: "/simien-photography-tour" } };

export default function PhotographyPage() {
  return <PageShell lightHeader={false}>
    <EditorialHero eyebrow="Simien photography tour" title="Where the mountains" accent="tell the story." lead="Walk, wait, listen and watch. Photograph the Simien escarpments, wildlife and highland life with time to follow the light." image={{ src: "/images/imet-gogo.jpg", alt: "Clouds above the escarpments at Imet Gogo in the Simien Mountains" }} />
    <PageLinks items={[{ label: "Field journal", href: "#journal" }, { label: "Photography routes", href: "#routes" }, { label: "Light & timing", href: "#light" }, { label: "Equipment & respect", href: "#preparation" }]} />
    <StorySection tag="Photography with a local eye" title="A little more time." accent="A different photograph." paragraphs={[
      "A photograph can begin with knowing where to arrive, when to wait and what to watch for. Our local team helps you read the landscape, understand wildlife movement and choose a place for the conditions you actually find.",
      "We leave room for escarpments under changing cloud, gelada troops moving naturally through the grass, giant lobelias, farming landscapes and the journey between famous viewpoints. People and community experiences are approached with permission and respect.",
      "Bring a phone, a small camera or a full photography kit. This is a locally guided journey built around your photographic interests; professional photography tuition is only included if specifically arranged with a qualified photographer.",
    ]} />
    <section className="section section--paper" id="journal"><div className="shell"><SectionIntro tag="A photographer’s field journal" title="Look beyond" accent="the postcard." /><PhotoJournal /></div></section>
    <section className="section" id="routes"><div className="shell"><SectionIntro tag="Choose your story" title="One day or" accent="a little deeper." /><FeatureGrid items={[
      { title: "A first day in Simien", tag: "1 day · Gondar → Simien → Gondar", body: "A focused day for escarpment landscapes, viewpoints and opportunities to observe geladas. Timing is built around the return journey; evening light is included only where practical.", href: "/plan?experience=photo-day", linkLabel: "Plan a photography day" },
      { title: "Wildlife & landscape", tag: "2–3 days", body: "Stay in the mountains for more time observing wildlife, exploring viewpoints and working with morning and evening light. Locations depend on your base, walking ability and access.", href: "/plan?experience=photo-wildlife", linkLabel: "Plan 2–3 days" },
      { title: "Photography expedition", tag: "4–5 days", body: "Build time to wait, walk and explore alternative viewpoints around Sankaber, Geech, Imet Gogo and Chenek. Choose your balance of wildlife, landscape, camp life and community encounters.", href: "/plan?experience=photo-expedition", linkLabel: "Plan an expedition" },
    ]} /></div></section>
    <section className="section section--paper" id="light"><div className="shell"><SectionIntro tag="Follow the light" title="The same place." accent="A changing story." /><FeatureGrid columns={2} items={[
      { title: "Early morning", body: "Cool air, long shadows and softer light can reveal layers of ridges. An overnight mountain stay makes an early start easier to build into the route." },
      { title: "Midday", body: "Look for scale and smaller details: lobelias, highland flowers, animals, farming terraces and trails crossing the landscape." },
      { title: "Golden hour", body: "Choose a viewpoint for the evening conditions and allow time to wait. Cloud, weather and the final return to camp guide the plan." },
      { title: "After dark", body: "On a suitable clear night, a mountain stay may allow time for the sky and camp atmosphere. Bring the equipment you need and discuss access and power arrangements." },
    ]} /></div></section>
    <section className="section" id="preparation"><div className="shell editorial-grid"><div><SectionIntro tag="Prepare for the photograph" title="Pack for" accent="your own goals." /><div className="prose"><p>Tell us your camera, experience, subjects, days available and preferred accommodation. Wildlife, landscape, travel photography and visual storytelling each need a different pace.</p><ul className="editorial-list"><li>A camera or phone you are comfortable using</li><li>A telephoto lens for wildlife and a wider lens for landscapes, if available</li><li>A tripod for lower light when appropriate</li><li>Extra batteries, memory cards and a power bank</li><li>Weather protection for your equipment</li></ul><Link className="text-link" href="/where-to-stay-gondar-simien">Plan your mountain stay</Link></div></div><div className="prose"><h2 className="content-subtitle">Photograph with respect</h2><p>Keep a respectful distance from wildlife, never chase or disturb animals for a picture, and follow park rules. Stay on appropriate trails, protect vegetation and take rubbish with you.</p><p>Ask before photographing people. A portrait can start with a conversation, and a person’s decision to decline is part of respectful travel.</p><p>Wildlife sightings, clear skies and specific photographs cannot be guaranteed. The promise is local knowledge, time to observe and a willingness to adapt.</p><h3 className="content-subtitle">Begin in Gondar</h3><p>Royal architecture, local life and the road north can become the first part of your photographic story.</p><Link className="text-link" href="/plan?experience=gondar-photo">Plan a Gondar photo walk</Link></div></div></section>
    <PlanningCall title="Tell us the photographs you hope to make." experience="photography" label="Plan my photography tour" />
  </PageShell>;
}
