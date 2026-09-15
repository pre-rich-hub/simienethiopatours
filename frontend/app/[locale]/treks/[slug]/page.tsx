import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "@/components/Icon";
import { PageShell } from "@/components/PageShell";
import { AtAGlance, BookingCard, EditorialHero, Itinerary, SectionIntro, StorySection, PlanningCall, FeatureGrid } from "@/components/Editorial";
import { getTourForRoute, getTours, getDestinations, requireContentLocale, tourToJourney } from "@/lib/catalogue";
import { enrichTourRecord } from "@/lib/tour-enrichment";
import { catalogueMetadata } from "@/lib/catalogue-seo";
import { breadcrumbJsonLd, jsonLdScript, localeFromParam, tourJsonLd } from "@/lib/seo";
const journeyPackagePath = (slug: string) => `/treks/${slug}`;
export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = localeFromParam(localeParam);
  const record = await getTourForRoute(slug, locale);
  if (!record) return {};
  requireContentLocale(record, locale);
  const journey = tourToJourney(record);
  return catalogueMetadata({ locale, title: journey.name, description: record.summary ?? journey.overview[0] ?? "", path: record.path, image: journey.image ? { url: journey.image, alt: journey.imageAlt } : null }, record.availableLocales);
}

export default async function JourneyPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: localeParam, slug } = await params;
  const locale = localeFromParam(localeParam);
  const raw = await getTourForRoute(slug, locale);
  if (!raw) notFound();
  requireContentLocale(raw, locale);
  const record = enrichTourRecord(raw);
  const source = tourToJourney(raw);
  if (!source) notFound();
  const t = await getTranslations("trek");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");
  const journey = source;

  const allDestinations = await getDestinations(locale);
  const destinations = allDestinations.filter(p => p.tourSlugs.includes(slug));
  const publishedPaths = new Set([...(await getTours(locale)).map(t => t.path), ...allDestinations.map(p => p.path), "/plan", "/treks", "/gondar", "/simien-mountains", "/explore-ethiopia", "/southern-ethiopia", "/about", "/gallery", "/journal"]);
  const related = record.related.map(item => ({ ...item, href: item.href && (/^https?:\/\//.test(item.href) || publishedPaths.has(item.href)) ? item.href : undefined }));
  const lead = [journey.duration, journey.route, journey.difficulty].filter(Boolean).join(" · ");

  return (
    <PageShell lightHeader={!journey.image}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript({ "@context": "https://schema.org", "@graph": [
        tourJsonLd({ name: journey.name, description: journey.overview[0] ?? "", path: journeyPackagePath(journey.slug), locale, image: journey.image, duration: journey.duration, route: journey.route }),
        breadcrumbJsonLd([{ name: tCommon("home"), path: "/", locale }, { name: tNav("journeys"), path: "/treks", locale }, { name: journey.name, path: journeyPackagePath(journey.slug), locale }]),
      ] }) }} />
      <EditorialHero
        eyebrow={tNav("journeys")}
        title={journey.heroTitle}
        accent={journey.heroAccent}
        lead={lead}
        image={{ src: journey.image, alt: journey.imageAlt }}
        parent={{ label: tNav("journeys"), href: "/treks" }}
      />

      <section className="section section--paper" id="journey-details">
        <div className="shell">
          <div className="journey-split">
            <div className="journey-split__main">
              {journey.facts.length > 0 && <AtAGlance facts={journey.facts} bare />}

              <div id="overview">
                <StorySection tag={t("overview")} title={journey.name} paragraphs={journey.overview} bare />
              </div>

              {journey.highlights.length > 0 && (
                <div id="highlights">
                  <SectionIntro tag={t("highlights")} title={t("highlights")} />
                  <div className={`dest-highlights dest-highlights--${journey.highlights.length > 1 ? "2" : "1"}`}>
                    {record.highlights.map((item, index) => (
                      <article className="dest-highlight" key={`${index}-${item.title}`}>
                        <span className="eyebrow eyebrow--copper">{item.title}</span>
                        <p>{item.body}</p>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              <div id="itinerary">
                <SectionIntro tag={t("itinerary")} title={t("itinerary")} />
                {journey.itineraryIntro && <p className="content-note">{journey.itineraryIntro}</p>}
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
                {journey.itineraryNotes && <div className="content-note">{journey.itineraryNotes.map((note) => <p key={note}>{note}</p>)}</div>}
              </div>

              <div id="included">
                <div className="editorial-grid">
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
                {journey.includedNote && (
                  <p className="content-note">{journey.includedNote}</p>
                )}
              </div>
            </div>
            <aside className="journey-split__aside">
              <BookingCard duration={journey.duration} difficulty={journey.difficulty} route={journey.route} experience={record.inquiry ?? record.slug} />
            </aside>
          </div>
        </div>
      </section>

      {journey.preparation.length > 0 && <section className="section shell"><SectionIntro tag={t("preparationTag")} title={t("preparationTitle")} /><ul className="editorial-list">{journey.preparation.map(item => <li key={item}>{item}</li>)}</ul></section>}
      {destinations.length > 0 && <section className="section shell"><SectionIntro tag={t("destinationsTag")} title={t("destinationsTitle")} /><nav className="page-links">{destinations.map(p => <Link key={p.slug} href={p.path} locale={p.locale}>{p.name}</Link>)}</nav></section>}
      {related.length > 0 && <section className="section shell"><FeatureGrid items={related} /></section>}
      <PlanningCall title={journey.name} experience={record.inquiry ?? record.slug} />
      <p className="shell dest-back">
        <Link className="text-link" href="/treks">
          {t("allJourneys")} <ArrowUpRight />
        </Link>
      </p>
    </PageShell>
  );
}
