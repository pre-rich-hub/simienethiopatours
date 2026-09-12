import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@/components/Icon";
import { SectionIntro } from "@/components/Editorial";
import {
  journeyPackagePath,
  journeyPackageSummary,
  type JourneyPackage,
} from "@/lib/journey-packages";

export function JourneyPhotoCards({ journeys }: { journeys: readonly JourneyPackage[] }) {
  const columns = journeys.length <= 2 ? 2 : 3;

  return (
    <div className={`simien-photo-grid simien-photo-grid--${columns}`}>
      {journeys.map((journey) => (
        <Link className="simien-photo-card dest-card" href={journeyPackagePath(journey.slug)} key={journey.slug}>
          <div className="simien-photo-card__image">
            <Image
              src={journey.image}
              alt={journey.imageAlt}
              fill
              sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
            />
            <span className="simien-photo-card__shade" />
            <div className="simien-photo-card__overlay">
              <p className="simien-photo-card__eyebrow">{journey.duration}</p>
              <h2>{journey.name}</h2>
            </div>
          </div>
          <div className="simien-photo-card__body">
            <p>{journeyPackageSummary(journey)}</p>
            <div className="simien-photo-card__footer">
              <span className="simien-photo-card__explore">
                About {journey.name}
                <ArrowUpRight />
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function DestinationRoutes({
  journeys,
  paper,
}: {
  journeys: readonly JourneyPackage[];
  paper: boolean;
}) {
  if (journeys.length === 0) return null;

  return (
    <section className={`section ${paper ? "section--paper" : ""}`} id="routes">
      <div className="shell">
        <SectionIntro tag="Journeys" title="Routes that pass through here" />
        <JourneyPhotoCards journeys={journeys} />
      </div>
    </section>
  );
}
