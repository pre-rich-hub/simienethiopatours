import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@/components/Icon";
import { PageShell } from "@/components/PageShell";
import { FeatureGrid, SectionIntro } from "@/components/Editorial";
import { sourceLinks } from "@/lib/site";
import { cms } from "@/lib/cms";

export const metadata: Metadata = { title: "Simien Field Notes | Practical Travel Guide", description: "Plain-language planning notes for Simien seasons, altitude, packing, wildlife and travel from Gondar.", alternates: { canonical: "/travel-guide" } };

export default async function GuidePage() {
  const notes = await cms.getFieldNotes();

  return <PageShell>
    <section className="page-hero guide-hero"><div className="shell guide-hero__grid"><div><div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Field notes</span></div><p className="eyebrow eyebrow--copper">Practical knowledge · honest preparation</p><h1 className="display">Before the <em>mountain.</em></h1><p className="lead">The useful things to know before Gondar becomes a road, and the road becomes a trail.</p></div><div className="image-frame"><Image src="/images/geech-camp.jpg" alt="Colorful tents at Geech camp in the Simien Mountains" fill priority sizes="(max-width: 720px) 100vw, 42vw" /></div></div></section>
    <section className="section"><div className="shell notes-grid">{notes.map((note, index) => <article key={note.title} id={note.tag.toLowerCase()}><span>0{index+1} · {note.tag}</span><h2>{note.title}</h2><p>{note.body}</p></article>)}</div></section>
    <section className="section section--paper"><div className="shell"><SectionIntro tag="Plan the whole journey" title="Before, during" accent="and after the trail." /><FeatureGrid items={[
      { title: "Where to stay", body: "Compare Gondar hotels and guesthouses, Debark stops, Simien lodges and trekking camps around your itinerary.", href: "/where-to-stay-gondar-simien" },
      { title: "Festival dates & journeys", body: "Find the dated festival calendar and plan Timkat, Genna, Meskel or Enkutatash with time in the mountains.", href: "/festival-journeys" },
      { title: "Equipment & local support", body: "Understand the preparation and the people behind your mountain journey, then confirm the gear and services in your quote.", href: "/about#equipment" },
    ]} /></div></section>
    <section className="section section--dark guide-sources"><div className="shell"><div><p className="eyebrow eyebrow--copper">Use current sources</p><h2 className="section-title">Mountain information <em>can change.</em></h2></div><div><p>Park procedures, access, weather, flights, visas, health advice and public safety should be checked again close to travel. This guide is orientation—not medical, legal or official entry advice.</p><a href={sourceLinks.simienUnesco} target="_blank" rel="noreferrer">UNESCO park profile <ArrowUpRight /></a><a href={sourceLinks.gondarTourism} target="_blank" rel="noreferrer">Gondar tourism department <ArrowUpRight /></a><a href={sourceLinks.operatorContact} target="_blank" rel="noreferrer">Current local contact <ArrowUpRight /></a></div></div></section>
    <section className="inline-cta"><div className="shell"><p>Still unsure?</p><h2>Ask the question before it becomes a worry.</h2><Link className="button button--copper" href="/plan">Ask Tevan <ArrowUpRight /></Link></div></section>
  </PageShell>;
}
