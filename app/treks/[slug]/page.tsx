import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { AtAGlance, EditorialHero, FeatureGrid, Itinerary, PageLinks, PlanningCall, SectionIntro, StorySection } from "@/components/Editorial";
import { detailedJourneys } from "@/lib/itineraries";

export const dynamicParams = false;
export function generateStaticParams() { return detailedJourneys.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const journey = detailedJourneys.find((item) => item.slug === slug);
  return journey ? { title: journey.title, description: journey.description, alternates: { canonical: `/treks/${slug}` } } : {};
}

export default async function JourneyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const journey = detailedJourneys.find((item) => item.slug === slug);
  if (!journey) notFound();
  return <PageShell lightHeader={false}>
    <EditorialHero eyebrow={journey.duration} title={journey.heroTitle} accent={journey.heroAccent} lead={journey.description} image={{ src: journey.image, alt: journey.imageAlt }} parent={{ label: "Journeys", href: "/treks" }} />
    <AtAGlance facts={journey.facts} />
    {journey.notice && <div className="shell"><p className="content-note">{journey.notice}</p></div>}
    <PageLinks items={[{ label: "The journey", href: "#journey" }, { label: "Day by day", href: "#day-by-day" }, { label: "Highlights", href: "#highlights" }, { label: "Preparation & inclusions", href: "#preparation" }]} />
    <StorySection id="journey" tag="The journey" title="Let the story" accent="unfold." paragraphs={journey.introduction} />
    <section className="section section--paper" id="day-by-day"><div className="shell">
      <SectionIntro tag={journey.duration} title="Your journey," accent="day by day." />
      <ol className="route-sequence" aria-label="Proposed route">{journey.route.map((stop, index) => <li key={`${stop}-${index}`}>{stop}</li>)}</ol>
      <Itinerary days={journey.days} />
      <p className="content-note">The route is a planning outline. Daily walking, campsite choices and transfers are confirmed for your group and current conditions.</p>
    </div></section>
    <section className="section" id="highlights"><div className="shell"><SectionIntro tag="Along the way" title="The moments" accent="that stay with you." /><FeatureGrid items={journey.highlights} /></div></section>
    <section className="section section--paper" id="preparation"><div className="shell editorial-grid">
      <div><SectionIntro tag="Before you choose" title="Good preparation." accent="Clear expectations." /><div className="prose">{journey.preparation.map((item) => <p key={item}>{item}</p>)}<Link className="text-link" href="/where-to-stay-gondar-simien">Explore where to stay</Link></div></div>
      <div className="prose"><h2 className="content-subtitle">What your package can include</h2><ul className="editorial-list">{journey.inclusions.map((item) => <li key={item}>{item}</li>)}</ul>{journey.exclusions && <><h3 className="content-subtitle">Not included unless agreed</h3><ul className="editorial-list">{journey.exclusions.map((item) => <li key={item}>{item}</li>)}</ul></>}<p>Exact inclusions, exclusions and prices are confirmed in your personal quotation. Tell us your dates, group size, preferred comfort and walking experience. See the <Link href="/whats-included">full inclusions guide</Link> for every journey.</p><h3 className="content-subtitle">Continue the story</h3><p>Add local Gondar experiences or discuss an onward journey to Lalibela, Axum, Bahir Dar or Danakil, subject to current access and the time available.</p><Link className="text-link" href="/beyond-the-trail">Go beyond the trail</Link></div>
    </div></section>
    {journey.related && <section className="section"><div className="shell"><SectionIntro tag="Find your fit" title="Another way" accent="into Simien." /><FeatureGrid items={journey.related} /></div></section>}
    <PlanningCall title="Tell Tevan what you want the journey to feel like." experience={journey.inquiry} label="Plan this journey" />
  </PageShell>;
}
