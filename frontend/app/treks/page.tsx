import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, CircleAlert, Compass, Mountain } from "@/components/Icon";
import { PageShell } from "@/components/PageShell";
import { FeatureGrid, SectionIntro } from "@/components/Editorial";
import { cms } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Simien Mountains Treks & Private Journeys",
  description: "Compare one-day, three-day, four-day, Ras Dashen and full Simien journeys—honestly organized by time, difficulty and travel style.",
  alternates: { canonical: "/treks" },
};

export default async function TreksPage() {
  const journeys = await cms.getAllTours();

  return <PageShell lightHeader={false}>
    <section className="page-hero--image">
      <Image src="/images/simien-panorama.jpg" alt="Wide panorama across the Simien Mountains" fill priority sizes="100vw" />
      <div className="page-hero__content shell"><div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Journeys</span></div><p className="eyebrow">Private · flexible · locally guided</p><h1 className="display">Find your way <em>into Simien.</em></h1><p className="lead">Choose by the time you have, how you want to walk and what you want to feel. Every route is refined around current conditions.</p></div>
    </section>
    <section className="section">
      <div className="shell intro-grid"><div><p className="eyebrow eyebrow--copper">The collection</p><h2 className="section-title">{journeys.length} clear way{journeys.length !== 1 ? "s" : ""} to <em>begin.</em></h2></div><p className="lead">From a first mountain encounter to a longer expedition, choose a route around your time, walking experience and interests. Camping, Gondar time and the daily pace are planned with you.</p></div>
      <div className="shell journey-grid">
        {journeys.map((journey) => <article className="journey-card" id={journey.slug} key={journey.slug}>
          <div className="journey-card__image">
            <Image src={journey.image} alt={`Simien landscape for ${journey.title}`} fill sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw" />
            <span className="journey-card__shade" />
            <span className="journey-card__badge">{journey.duration}</span>
            <div className="journey-card__overlay">
              <p className="journey-card__eyebrow">{journey.style}</p>
              <h2>{journey.title}</h2>
            </div>
          </div>
          <div className="journey-card__body">
            <p>{journey.summary}</p>
            <dl className="journey-card__facts">
              <div><Mountain size={18} /><div><dt>Walking</dt><dd>{journey.difficulty}</dd></div></div>
              <div><Compass size={18} /><div><dt>Best fit</dt><dd>{journey.fit}</dd></div></div>
            </dl>
            <div className="journey-card__footer">
              <Link className="journey-card__explore" href={journey.href}>Read the itinerary <ArrowUpRight /></Link>
              <Link className="button button--dark button--small" href={`/plan?journey=${journey.slug}`}>Ask about this journey <ArrowUpRight size={15} /></Link>
            </div>
          </div>
        </article>)}
      </div>
    </section>
    <section className="section section--paper"><div className="shell"><SectionIntro tag="Culture, light and mountain days" title="Connect the" accent="chapters." /><FeatureGrid columns={2} items={[
      { title: "Royal City & Mountain Adventure", tag: "5 days / 4 nights", body: "One Gondar hotel night, then three camping nights on the classic trail through Sankaber, Geech, Imet Gogo and Chenek.", href: "/treks/5-day-gondar-simien", linkLabel: "Read the five-day trekking journey" },
      { title: "Gondar, Heritage & Simien", tag: "5 days / 4 nights", body: "Castles, churches and Woleka heritage lead into two nights in the mountains. Adapt the walking and comfort to your pace.", href: "/treks/gondar-heritage-simien", linkLabel: "Read the five-day itinerary" },
      { title: "Photography journeys", tag: "1–5 days", body: "Create more time for wildlife, landscapes and the changing light on a photography-focused mountain journey.", href: "/simien-photography-tour" },
      { title: "Beyond the trail", tag: "Make the journey your own", body: "Add festivals, local food, running, village experiences and time to discover Gondar.", href: "/beyond-the-trail" },
    ]} /></div></section>
    <section className="section section--paper honest-section">
      <div className="shell honest-grid"><div><p className="eyebrow eyebrow--copper">Before you choose</p><h2 className="section-title">An honest route is a <em>better route.</em></h2></div><div className="honest-points"><p><Check />We explain daily effort, camping and altitude in plain language.</p><p><Check />We confirm the route against current weather, trail and road conditions.</p><p><Check />We never guarantee a wild animal sighting.</p><p><CircleAlert />Prices are quoted personally because group size, season and logistics change the real cost.</p></div></div>
    </section>
    <section className="inline-cta"><div className="shell"><p>Not sure which journey fits?</p><h2>Tell us what you want the mountain to feel like.</h2><Link className="button button--copper" href="/plan">Start the planner <ArrowUpRight /></Link></div></section>
  </PageShell>;
}
