import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "@/components/Icon";
import { PageShell } from "@/components/PageShell";
import { DestinationRoutes } from "@/components/JourneyPhotoCards";
import { EditorialHero, SectionIntro, StorySection } from "@/components/Editorial";
import { journeysThroughPlace } from "@/lib/destination-routes";
import { getSimienPlace, simienPlacePath, simienPlaces } from "@/lib/simien-destinations";
import { localeFromParam, pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return simienPlaces.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const place = getSimienPlace(slug);
  if (!place) return {};
  return pageMetadata({
    locale: localeFromParam(locale),
    title: `${place.name} | Simien Mountains`,
    description: place.about[0] ?? "",
    path: simienPlacePath(place.slug),
    image: { url: place.image, alt: place.imageAlt },
  });
}

export default async function SimienPlacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const place = getSimienPlace(slug);
  if (!place) notFound();
  const routes = journeysThroughPlace("simien", place.slug);

  return (
    <PageShell lightHeader={false}>
      <EditorialHero
        eyebrow="Simien Mountains"
        title={place.heroTitle}
        accent={place.heroAccent}
        lead={place.location}
        image={{ src: place.image, alt: place.imageAlt }}
        parent={{ label: "Simien Mountains", href: "/simien-mountains" }}
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
        <Link className="text-link" href="/simien-mountains">
          All Simien destinations <ArrowUpRight />
        </Link>
      </p>
    </PageShell>
  );
}
