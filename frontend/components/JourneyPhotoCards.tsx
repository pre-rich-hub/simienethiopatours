import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "@/components/Icon";
import { SectionIntro } from "@/components/Editorial";
import type { JourneyPackage } from "@/lib/journey-packages";
import { cardBlurb } from "@/lib/card-blurb";

export async function JourneyPhotoCards({ journeys }: { journeys: readonly (JourneyPackage & { summary?: string; locale?: "en" | "es" | "de" | "fr" })[] }) {
  const t = await getTranslations("treks");
  const columns = journeys.length <= 2 ? 2 : 3;

  return (
    <div className={`simien-photo-grid simien-photo-grid--${columns}`}>
      {journeys.map((journey) => (
        <Link className="simien-photo-card dest-card" href={`/treks/${journey.slug}`} locale={journey.locale} key={journey.slug}>
          <div className="simien-photo-card__image">
            {journey.image && <Image
              src={journey.image}
              alt={journey.imageAlt}
              fill
              sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
            />}
            <span className="simien-photo-card__shade" />
            <div className="simien-photo-card__overlay">
              <p className="simien-photo-card__eyebrow">{journey.duration}</p>
              <h2>{journey.name}</h2>
            </div>
          </div>
          <div className="simien-photo-card__body">
            <p>{cardBlurb(journey.summary ?? journey.overview[0] ?? "", 140)}</p>
            <div className="simien-photo-card__footer">
              <span className="simien-photo-card__explore">
                {t("about", { name: journey.name })}
                <ArrowUpRight />
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export async function DestinationRoutes({
  journeys,
  paper,
}: {
  journeys: readonly (JourneyPackage & { summary?: string; locale?: "en" | "es" | "de" | "fr" })[];
  paper: boolean;
}) {
  if (journeys.length === 0) return null;
  const t = await getTranslations("destination");

  return (
    <section className={`section ${paper ? "section--paper" : ""}`} id="routes">
      <div className="shell">
        <SectionIntro tag={t("relatedJourneysTag")} title={t("relatedJourneysTitle")} />
        <JourneyPhotoCards journeys={journeys} />
      </div>
    </section>
  );
}
