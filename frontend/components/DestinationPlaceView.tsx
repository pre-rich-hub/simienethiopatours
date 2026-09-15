import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "@/components/Icon";
import { PageShell } from "@/components/PageShell";
import { DestinationRoutes } from "@/components/JourneyPhotoCards";
import { EditorialHero, PlanningCall, SectionIntro, StorySection } from "@/components/Editorial";
import {
  breadcrumbJsonLd,
  destinationJsonLd,
  jsonLdScript,
} from "@/lib/seo";
import type { AppLocale } from "@/i18n/routing";
import { enrichDestinationPlace } from "@/lib/destination-enrichment";
import type { JourneyPackage } from "@/lib/journey-packages";

type PlaceView = {
  name: string;
  heroTitle: string;
  heroAccent: string;
  location: string;
  image: string;
  imageAlt: string;
  alsoKnownAs: string[];
  about: string[];
  highlights: string[];
  thingsToDo: string[];
  path: string;
  slug: string;
};

export async function DestinationPlaceView({
  place,
  locale,
  hub,
  routes,
}: {
  place: PlaceView;
  locale: AppLocale;
  hub: { eyebrowKey: "simienEyebrow" | "gondarEyebrow"; href: string; backKey: "backSimien" | "backGondar" };
  routes: readonly (JourneyPackage & { summary?: string; locale?: AppLocale })[];
}) {
  const t = await getTranslations("destination");
  const tCommon = await getTranslations("common");
  const enriched = enrichDestinationPlace(place, locale);
  const paperAfterHighlights = enriched.highlights.length > 0;

  return (
    <PageShell lightHeader={!enriched.image}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript({
            "@context": "https://schema.org",
            "@graph": [
              destinationJsonLd({
                name: enriched.name,
                description: enriched.about[0] ?? "",
                path: enriched.path,
                locale,
                image: enriched.image || undefined,
                location: enriched.location,
                alternateName: enriched.alsoKnownAs,
              }),
              breadcrumbJsonLd([
                { name: tCommon("home"), path: "/", locale },
                { name: t(hub.eyebrowKey), path: hub.href, locale },
                { name: enriched.name, path: enriched.path, locale },
              ]),
            ],
          }),
        }}
      />
      <EditorialHero
        eyebrow={t(hub.eyebrowKey)}
        title={enriched.heroTitle}
        accent={enriched.heroAccent}
        lead={enriched.location}
        image={{ src: enriched.image, alt: enriched.imageAlt }}
        parent={{ label: t(hub.eyebrowKey), href: hub.href }}
      />

      {enriched.alsoKnownAs.length > 0 && (
        <p className="shell content-note">{t("alsoKnownAs", { names: enriched.alsoKnownAs.join(", ") })}</p>
      )}
      <StorySection id="about" tag={t("about")} title={enriched.name} paragraphs={enriched.about} />

      {enriched.highlights.length > 0 && (
        <section className="section section--paper" id="highlights">
          <div className="shell">
            <SectionIntro tag={t("highlights")} title={t("highlightsTitle")} accent={t("highlightsAccent")} />
            <div className={`dest-highlights dest-highlights--${enriched.highlights.length > 1 ? "2" : "1"}`}>
              {enriched.highlights.map((item, index) => (
                <article className="dest-highlight" key={item}>
                  <span className="eyebrow eyebrow--copper">{String(index + 1).padStart(2, "0")}</span>
                  <p>{item}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {enriched.thingsToDo.length > 0 && (
        <section className={`section ${paperAfterHighlights ? "" : "section--paper"}`} id="things-to-do">
          <div className="shell editorial-grid">
            <SectionIntro tag={t("thingsToDo")} title={t("thingsToDoTitle")} accent={t("thingsToDoAccent")} />
            <ul className="editorial-list dest-things">
              {enriched.thingsToDo.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <DestinationRoutes journeys={routes} paper={paperAfterHighlights && enriched.thingsToDo.length > 0} />

      {routes.length === 0 ? (
        <section className="section section--paper">
          <div className="shell">
            <SectionIntro tag={t("planTag")} title={t("planTitle")} />
            <p className="lead">{t("planLead", { name: enriched.name })}</p>
          </div>
        </section>
      ) : null}

      <PlanningCall
        title={t("callTitle", { name: enriched.name })}
        eyebrow={t("callEyebrow")}
        label={t("callLabel")}
      />

      <p className="shell dest-back">
        <Link className="text-link" href={hub.href}>
          {t(hub.backKey)} <ArrowUpRight />
        </Link>
      </p>
    </PageShell>
  );
}
