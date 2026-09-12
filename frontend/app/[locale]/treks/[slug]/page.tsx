import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "@/components/Icon";
import { PageShell } from "@/components/PageShell";
import { EditorialHero, Itinerary, SectionIntro, StorySection } from "@/components/Editorial";
import { getJourneyPackage, journeyPackagePath, journeyPackages, type JourneyPackage, type JourneySegment } from "@/lib/journey-packages";
import { jsonLdScript, localeFromParam, pageMetadata, tourJsonLd } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return journeyPackages.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = localeFromParam(localeParam);
  const journey = getJourneyPackage(slug);
  if (!journey) return {};
  const tNav = await getTranslations({ locale, namespace: "nav" });
  if (slug === "simien-day-trip") {
    const t = await getTranslations({ locale, namespace: "trek" });
    const overview = t.raw("dayTrip.overview") as string[];
    return pageMetadata({
      locale,
      title: `${t("dayTrip.name")} | ${tNav("journeys")}`,
      description: overview[0] ?? "",
      path: journeyPackagePath(journey.slug),
      image: { url: journey.image, alt: journey.imageAlt },
    });
  }
  return pageMetadata({
    locale,
    title: `${journey.name} | ${tNav("journeys")}`,
    description: journey.overview[0] ?? "",
    path: journeyPackagePath(journey.slug),
    image: { url: journey.image, alt: journey.imageAlt },
  });
}

function localizeDayTrip(journey: JourneyPackage, t: Awaited<ReturnType<typeof getTranslations<"trek">>>): JourneyPackage {
  return {
    ...journey,
    name: t("dayTrip.name"),
    duration: t("dayTrip.duration"),
    route: t("dayTrip.route"),
    difficulty: t("dayTrip.difficulty"),
    heroTitle: t("dayTrip.heroTitle"),
    heroAccent: t("dayTrip.heroAccent"),
    overview: t.raw("dayTrip.overview"),
    highlights: t.raw("dayTrip.highlights"),
    segments: t.raw("dayTrip.segments") as JourneySegment[],
    included: t.raw("dayTrip.included"),
    excluded: t.raw("dayTrip.excluded"),
  };
}

export default async function JourneyPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: localeParam, slug } = await params;
  const locale = localeFromParam(localeParam);
  const source = getJourneyPackage(slug);
  if (!source) notFound();
  const t = await getTranslations("trek");
  const tNav = await getTranslations("nav");
  const journey = slug === "simien-day-trip" ? localizeDayTrip(source, t) : source;

  const lead = [journey.duration, journey.route, journey.difficulty].filter(Boolean).join(" · ");

  return (
    <PageShell lightHeader={false}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(tourJsonLd({
        name: journey.name,
        description: journey.overview[0] ?? "",
        path: journeyPackagePath(journey.slug),
        locale,
        image: journey.image,
        duration: journey.duration,
        route: journey.route,
      })) }} />
      <EditorialHero
        eyebrow={tNav("journeys")}
        title={journey.heroTitle}
        accent={journey.heroAccent}
        lead={lead}
        image={{ src: journey.image, alt: journey.imageAlt }}
        parent={{ label: tNav("journeys"), href: "/treks" }}
      />

      <StorySection id="overview" tag={t("overview")} title={journey.name} paragraphs={journey.overview} />

      {journey.highlights.length > 0 && (
        <section className="section section--paper" id="highlights">
          <div className="shell">
            <SectionIntro tag={t("highlights")} title={t("highlights")} />
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
          <SectionIntro tag={t("itinerary")} title={t("itinerary")} />
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
            <SectionIntro tag={t("included")} title={t("included")} />
            <ul className="editorial-list dest-things">
              {journey.included.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <SectionIntro tag={t("excluded")} title={t("excluded")} />
            <ul className="editorial-list dest-things">
              {journey.excluded.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="shell content-note">
          {journey.includedNote && <p>{journey.includedNote}</p>}
          <p>{t("inclusionsNote")}</p>
        </div>
      </section>

      <p className="shell dest-back">
        <Link className="text-link" href="/treks">
          {t("allJourneys")} <ArrowUpRight />
        </Link>
      </p>
    </PageShell>
  );
}
