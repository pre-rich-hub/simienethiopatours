import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { EditorialHero, PageLinks, PlanningCall, SectionIntro, StorySection } from "@/components/Editorial";
import { ExperienceSelector } from "@/components/ExperienceSelector";
import { site, sourceLinks } from "@/lib/site";

export const metadata: Metadata = { title: "Gondar Tours | History, Culture, Food & Local Experiences", description: "Discover Gondar with a local guide: royal heritage, food, coffee, photography, markets, Kosoye countryside and journeys into the Simien Mountains.", alternates: { canonical: "/gondar" } };

export default function GondarPage() {
  return <PageShell lightHeader={false}>
    <EditorialHero eyebrow="Gondar tours & experiences" title="The royal city," accent="through local eyes." lead="Come for the castles. Stay for the stories, coffee, food and everyday life of the city we call home." image={{ src: "/images/fasil-ghebbi.jpg", alt: "Stone arches at the royal fortress of Fasil Ghebbi in Gondar" }} />
    <PageLinks items={[{ label: "The living city", href: "#local-eyes" }, { label: "Choose an experience", href: "#experiences" }, { label: "Countryside & running", href: "#countryside" }, { label: "Gondar + Simien", href: "#simien" }]} />
    <StorySection id="local-eyes" tag="See Gondar through local eyes" title="Walk through history." accent="Then meet the city." paragraphs={[
      "Gondar’s castles and churches tell the story of an imperial capital. At Fasil Ghebbi, royal residences and historic stone buildings reveal the city’s layered past. But there is also a Gondar of opening shops, markets, roasting coffee and everyday conversations.",
      "Ancient walls stand beside modern streets. Traditional meals and religious life sit alongside the routines of a working city. We connect the famous places with the people and stories around them.",
      "Your guide can follow your interest in royal history, architecture, food, coffee, local neighbourhoods, photography or the surrounding countryside. The experience begins with what you are curious about.",
    ]}><a className="source-link" href={sourceLinks.gondarUnesco} target="_blank" rel="noreferrer">Fasil Ghebbi history · UNESCO World Heritage Centre ↗</a></StorySection>
    <section className="section section--paper" id="experiences"><div className="shell"><SectionIntro tag="Choose your way to discover the city" title="Your Gondar," accent="your interests." /><ExperienceSelector /><p className="content-note">Read travelers’ experiences on <a href={site.tripadvisor} target="_blank" rel="noreferrer">our Tripadvisor profile</a>.</p></div></section>
    <section className="split-image-story" id="countryside"><div className="image-frame"><Image src="/images/road-to-simien.jpg" alt="Everyday life in the northern Ethiopian highlands" fill sizes="(max-width: 720px) 100vw, 55vw" /></div><div><p className="eyebrow eyebrow--copper">City edge → countryside → local life</p><h2>A different way to move through Gondar.</h2><p>Explore Kosoye’s surrounding countryside at walking pace, or join a local running guide on quieter paths and dirt tracks. Routes follow your ability, interests and the conditions on the day.</p><Link href="/gondar-running-experience" className="text-link">Discover hidden Gondar running</Link></div></section>
    <StorySection id="simien" tag="History today. Highlands tomorrow." title="Gondar is where" accent="the journey begins." paragraphs={[
      "Start with the royal city, food and coffee, then follow the road through farmland and Debark into the Simien Mountains. Escarpments, geladas, camping and highland walking become the next chapter.",
      "Our five-day Gondar, Heritage & Simien journey connects city history, Woleka and two mountain nights. Add more time for culture, photography or a longer trek when you want the story to continue.",
      "For a more active five-day adventure, begin with one night in Gondar and follow the classic camping route through Sankaber, Geech, Imet Gogo and Chenek, with three nights in the mountains.",
    ]}><Link className="text-link" href="/treks/5-day-gondar-simien">Explore the Royal City & Mountain Adventure</Link><p><Link className="text-link" href="/treks/gondar-heritage-simien">Explore the heritage-focused journey</Link></p></StorySection>
    <PlanningCall title="Tell us what you want to discover in Gondar." experience="gondar" label="Build my Gondar experience" />
  </PageShell>;
}
