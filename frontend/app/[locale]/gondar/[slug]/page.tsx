import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "@/components/Icon";
import { PageShell } from "@/components/PageShell";
import { DestinationRoutes } from "@/components/JourneyPhotoCards";
import { EditorialHero, SectionIntro, StorySection } from "@/components/Editorial";
import { getDestinationForRoute, getTours, tourToJourney, destinationToPlace, requireContentLocale } from "@/lib/catalogue";
import { catalogueMetadata } from "@/lib/catalogue-seo";
import {
  breadcrumbJsonLd,
  destinationJsonLd,
  jsonLdScript,
  localeFromParam,
} from "@/lib/seo";
import { permanentRedirect } from "next/navigation";
export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const record = await getDestinationForRoute(slug, locale);
  const place = record ? destinationToPlace(record) : null;
  if (!place) return {};
  requireContentLocale(record!, locale);
  return catalogueMetadata({
    locale: localeFromParam(locale),
    title: `${place.name} — Gondar`,
    description: place.about[0] ?? "",
    path: place.path,
    image: place.image ? { url: place.image, alt: place.imageAlt } : undefined,
  }, record!.availableLocales);
}

export default async function GondarPlacePage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const t = await getTranslations("destination");
  const tCommon = await getTranslations("common");
  const record = await getDestinationForRoute(slug, locale);
  const place = record ? destinationToPlace(record) : null;
  if (!place) notFound();
  if (!record) notFound();
  if (!record.path.startsWith("/gondar/")) permanentRedirect(`/${locale}${record.path}`);
  requireContentLocale(record, locale);
  const routes = (await getTours(locale)).filter(tour => record.tourSlugs.includes(tour.slug)).map(tourToJourney);
  const appLocale = localeFromParam(locale);

  return (
    <PageShell lightHeader={!place.image}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript({
            "@context": "https://schema.org",
            "@graph": [
              destinationJsonLd({
                name: place.name,
                description: place.about[0] ?? "",
                path: place.path,
                locale: appLocale,
                image: place.image || undefined,
                location: place.location,
                alternateName: place.alsoKnownAs,
              }),
              breadcrumbJsonLd([
                { name: tCommon("home"), path: "/", locale: appLocale },
                { name: t("gondarEyebrow"), path: "/gondar", locale: appLocale },
                { name: place.name, path: place.path, locale: appLocale },
              ]),
            ],
          }),
        }}
      />
      <EditorialHero
        eyebrow={t("gondarEyebrow")}
        title={place.heroTitle}
        accent={place.heroAccent}
        lead={place.location}
        image={{ src: place.image, alt: place.imageAlt }}
        parent={{ label: t("gondarEyebrow"), href: "/gondar" }}
      />

      {place.alsoKnownAs.length > 0 && (
        <p className="shell content-note">{t("alsoKnownAs", { names: place.alsoKnownAs.join(", ") })}</p>
      )}
      <StorySection id="about" tag={t("about")} title={place.name} paragraphs={place.about} />

      {place.highlights.length > 0 && (
        <section className="section section--paper" id="highlights">
          <div className="shell">
            <SectionIntro tag={t("highlights")} title={t("highlights")} />
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
        <Link className="text-link" href="/gondar">
          {t("backGondar")} <ArrowUpRight />
        </Link>
      </p>
    </PageShell>
  );
}
