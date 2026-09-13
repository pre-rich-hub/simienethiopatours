import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "@/components/Icon";
import { PageShell } from "@/components/PageShell";
import { DestinationRoutes } from "@/components/JourneyPhotoCards";
import { EditorialHero, SectionIntro, StorySection } from "@/components/Editorial";
import { getDestinationForRoute, getTours, destinationToPlace, tourToJourney, requireContentLocale, resolveMediaUrl } from "@/lib/catalogue";
import { localizedMetadata } from "@/lib/catalogue-seo";
import { localeFromParam } from "@/lib/seo";

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = localeFromParam(localeParam);
  const record = await getDestinationForRoute(slug, locale);
  if (!record) return {};
  requireContentLocale(record, locale);
  return localizedMetadata({ locale, title: `${record.name} | Northern Ethiopia`, description: record.overview[0] ?? "", path: record.path, image: { url: resolveMediaUrl(record.imageUrl), alt: record.imageAlt } }, record.availableLocales);
}

export default async function NorthernDestinationPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: localeParam, slug } = await params;
  const locale = localeFromParam(localeParam);
  const t = await getTranslations("destination");
  const record = await getDestinationForRoute(slug, locale);
  if (!record) notFound();
  requireContentLocale(record, locale);
  const place = destinationToPlace(record);
  const routes = (await getTours(locale)).filter(tour => record.tourSlugs.includes(tour.slug)).map(tourToJourney);
  return (
    <PageShell lightHeader={!place.image}>
      <EditorialHero
        eyebrow={t("northernEyebrow")}
        title={place.heroTitle}
        accent={place.heroAccent}
        lead={place.location}
        image={place.image ? { src: place.image, alt: place.imageAlt } : undefined}
        parent={{ label: t("northernEyebrow"), href: "/northern-ethiopia" }}
      />
      {place.alsoKnownAs.length > 0 && (
        <p className="shell content-note">{t("alsoKnownAs", { names: place.alsoKnownAs.join(", ") })}</p>
      )}
      <StorySection id="about" tag={t("about")} title={place.name} paragraphs={place.about} />
      {place.highlights.length > 0 && (
        <section className="section section--paper">
          <div className="shell">
            <SectionIntro tag={t("highlights")} title={t("highlights")} />
            <div className="dest-highlights dest-highlights--2">
              {place.highlights.map((item, index) => (
                <article className="dest-highlight" key={`${index}-${item}`}>
                  <span className="eyebrow eyebrow--copper">{String(index + 1).padStart(2, "0")}</span>
                  <p>{item}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="section">
        <div className="shell editorial-grid">
          <SectionIntro tag={t("thingsToDo")} title={t("thingsToDo")} />
          <ul className="editorial-list dest-things">
            {place.thingsToDo.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
      <DestinationRoutes journeys={routes} paper={place.highlights.length > 0} />
      <p className="shell dest-back">
        <Link className="text-link" href="/northern-ethiopia">
          {t("backNorthern")} <ArrowUpRight />
        </Link>
      </p>
    </PageShell>
  );
}
