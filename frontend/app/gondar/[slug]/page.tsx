import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "@/components/Icon";
import { PageShell } from "@/components/PageShell";
import { DestinationRoutes } from "@/components/JourneyPhotoCards";
import { EditorialHero, SectionIntro, StorySection } from "@/components/Editorial";
import { journeysThroughPlace } from "@/lib/destination-routes";
import { getGondarPlace, gondarPlacePath, gondarPlaces } from "@/lib/gondar-destinations";

export const dynamicParams = false;

export function generateStaticParams() {
  return gondarPlaces.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const place = getGondarPlace(slug);
  if (!place) return {};
  return {
    title: `${place.name} | Gondar`,
    description: place.about[0],
    alternates: { canonical: gondarPlacePath(place.slug) },
  };
}

export default async function GondarPlacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const place = getGondarPlace(slug);
  if (!place) notFound();
  const routes = journeysThroughPlace("gondar", place.slug);

  return (
    <PageShell lightHeader={false}>
      <EditorialHero
        eyebrow="Gondar"
        title={place.heroTitle}
        accent={place.heroAccent}
        lead={place.location}
        image={{ src: place.image, alt: place.imageAlt }}
        parent={{ label: "Gondar", href: "/gondar" }}
      />

      <StorySection id="about" tag="About" title={place.name} paragraphs={place.about} />

      {place.highlights.length > 0 && (
        <section className="section section--paper" id="highlights">
          <div className="shell">
            <SectionIntro tag="Highlights" title="Highlights" />
            <div className={`dest-highlights dest-highlights--${place.highlights.length > 1 ? "2" : "1"}`}>
              {place.highlights.map((item, index) => (
                <article className="dest-highlight" key={item}>
                  <span className="eyebrow eyebrow--copper">{String(index + 1).padStart(2, "0")}</span>
                  <p>{item}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={`section ${place.highlights.length ? "" : "section--paper"}`} id="things-to-do">
        <div className="shell editorial-grid">
          <SectionIntro tag="Things to do" title="Things to do" />
          <ul className="editorial-list dest-things">
            {place.thingsToDo.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <DestinationRoutes journeys={routes} paper={place.highlights.length > 0} />

      <p className="shell dest-back">
        <Link className="text-link" href="/gondar">
          All Gondar destinations <ArrowUpRight />
        </Link>
      </p>
    </PageShell>
  );
}
