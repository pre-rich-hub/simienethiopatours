import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, CircleAlert } from "@/components/Icon";
import { PageShell } from "@/components/PageShell";
import { journeys } from "@/lib/site";

export const metadata: Metadata = {
  title: "Simien Mountains Treks & Private Journeys",
  description: "Compare one-day, three-day, four-day, Ras Dashen and full Simien journeys—honestly organized by time, difficulty and travel style.",
  alternates: { canonical: "/treks" },
};

export default function TreksPage() {
  return <PageShell lightHeader={false}>
    <section className="page-hero--image">
      <Image src="/images/simien-panorama.jpg" alt="Wide panorama across the Simien Mountains" fill priority sizes="100vw" />
      <div className="page-hero__content shell"><div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Journeys</span></div><p className="eyebrow">Private · flexible · locally guided</p><h1 className="display">Find your way <em>into Simien.</em></h1><p className="lead">Choose by the time you have, how you want to walk and what you want to feel. Every route is refined around current conditions.</p></div>
    </section>
    <section className="section">
      <div className="shell intro-grid"><div><p className="eyebrow eyebrow--copper">The collection</p><h2 className="section-title">Five clear ways to <em>begin.</em></h2></div><p className="lead">These are starting points, not fixed conveyor belts. We can adjust pace, camping, Gondar time and special interests after a real conversation.</p></div>
      <div className="shell journey-list">
        {journeys.map((journey, index) => <article className="journey-row" id={journey.slug} key={journey.slug}>
          <div className="journey-row__number">0{index + 1}</div>
          <div className="journey-row__image image-frame"><Image src={journey.image} alt={`Simien landscape for ${journey.title}`} fill sizes="(max-width: 720px) 100vw, 38vw" /></div>
          <div className="journey-row__copy"><span>{journey.duration} · {journey.style}</span><h2>{journey.title}</h2><p>{journey.summary}</p><dl><div><dt>Walking</dt><dd>{journey.difficulty}</dd></div><div><dt>Best fit</dt><dd>{journey.fit}</dd></div></dl><Link className="button button--dark" href={`/plan?journey=${journey.slug}`}>Ask about this journey <ArrowUpRight /></Link></div>
        </article>)}
      </div>
    </section>
    <section className="section section--paper honest-section">
      <div className="shell honest-grid"><div><p className="eyebrow eyebrow--copper">Before you choose</p><h2 className="section-title">An honest route is a <em>better route.</em></h2></div><div className="honest-points"><p><Check />We explain daily effort, camping and altitude in plain language.</p><p><Check />We confirm the route against current weather, trail and road conditions.</p><p><Check />We never guarantee a wild animal sighting.</p><p><CircleAlert />Prices are quoted personally because group size, season and logistics change the real cost.</p></div></div>
    </section>
    <section className="inline-cta"><div className="shell"><p>Not sure which journey fits?</p><h2>Tell us what you want the mountain to feel like.</h2><Link className="button button--copper" href="/plan">Start the planner <ArrowUpRight /></Link></div></section>
  </PageShell>;
}
