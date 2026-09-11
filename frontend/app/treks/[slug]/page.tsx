import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "@/components/Icon";
import { PageShell } from "@/components/PageShell";
import { EditorialHero, Itinerary, SectionIntro, StorySection } from "@/components/Editorial";
import { getJourneyPackage, journeyPackagePath, journeyPackages } from "@/lib/journey-packages";

export const dynamicParams = false;

export function generateStaticParams() {
  return journeyPackages.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const journey = getJourneyPackage(slug);
  if (!journey) return {};
  return {
    title: `${journey.name} | Journeys`,
    description: journey.overview[0],
    alternates: { canonical: journeyPackagePath(journey.slug) },
  };
}

export default async function JourneyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const journey = getJourneyPackage(slug);
  if (!journey) notFound();

  const lead = [journey.duration, journey.route, journey.difficulty].filter(Boolean).join(" · ");

  return (
    <PageShell lightHeader={false}>
      <EditorialHero
        eyebrow="Journeys"
        title={journey.heroTitle}
        accent={journey.heroAccent}
        lead={lead}
        image={{ src: journey.image, alt: journey.imageAlt }}
        parent={{ label: "Journeys", href: "/treks" }}
      />

      <StorySection id="overview" tag="Overview" title={journey.name} paragraphs={journey.overview} />

      {journey.highlights.length > 0 && (
        <section className="section section--paper" id="highlights">
          <div className="shell">
            <SectionIntro tag="Highlights" title="Highlights" />
            <div className={`dest-highlights dest-highlights--${journey.highlights.length > 1 ? "2" : "1"}`}>
              {journey.highlights.map((item, index) => (
                <article className="dest-highlight" key={item}>
                  <span className="eyebrow eyebrow--copper">{String(index + 1).padStart(2, "0")}</span>
                  <p>{item}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={`section ${journey.highlights.length ? "" : "section--paper"}`} id="itinerary">
        <div className="shell">
          <SectionIntro tag="Itinerary" title="Itinerary" />
          {journey.itineraryMode === "days" && journey.days && (
            <Itinerary days={journey.days} id="day-by-day" />
          )}
          {journey.itineraryMode === "segments" && journey.segments && (
            <ol className="editorial-list dest-things">
              {journey.segments.map((segment) => (
                <li key={segment.label}>
                  <strong>{segment.label}</strong> {segment.body}
                </li>
              ))}
            </ol>
          )}
          {journey.itineraryMode === "outline" && journey.outline && (
            <div className="prose">
              {journey.outline.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section section--paper" id="included">
        <div className="shell editorial-grid">
          <div>
            <SectionIntro tag="Included" title="Included" />
            <ul className="editorial-list dest-things">
              {journey.included.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <SectionIntro tag="Excluded" title="Excluded" />
            <ul className="editorial-list dest-things">
              {journey.excluded.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="shell content-note">
          {journey.includedNote && <p>{journey.includedNote}</p>}
          <p>Exact inclusions in a booking are confirmed in the final quotation.</p>
        </div>
      </section>

      <p className="shell dest-back">
        <Link className="text-link" href="/treks">
          All journeys <ArrowUpRight />
        </Link>
      </p>
    </PageShell>
  );
}
