import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@/components/Icon";
import { PageShell } from "@/components/PageShell";
import { journeyPackagePath, journeyPackageSummary, journeyPackages } from "@/lib/journey-packages";

export const metadata: Metadata = {
  title: "Journeys | Simien Treks, Gondar Experiences & Festival Packages",
  description: "Twenty-eight journey packages — from Simien in a Day and the Classic trek to Ras Dashen, Gondar experiences and festival journeys — each with its own page.",
  alternates: { canonical: "/treks" },
};

export default function TreksPage() {
  return (
    <PageShell lightHeader={false}>
      <section className="page-hero--image simien-page-hero editorial-hero">
        <Image src="/images/simien-panorama.jpg" alt="Wide panorama across the Simien Mountains" fill priority sizes="100vw" />
        <div className="page-hero__content shell">
          <div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Journeys</span></div>
          <p className="eyebrow">Journey packages</p>
          <h1 className="display">Twenty-eight journeys, <em>one local team.</em></h1>
          <p className="lead">From a Simien day trip to Ras Dashen, Gondar city experiences and festival journeys. Choose a package to read more.</p>
        </div>
      </section>

      <section className="section" id="journeys">
        <div className="shell">
          <div className="simien-photo-grid simien-photo-grid--3">
            {journeyPackages.map((journey) => (
              <Link className="simien-photo-card dest-card" href={journeyPackagePath(journey.slug)} key={journey.slug}>
                <div className="simien-photo-card__image">
                  <Image src={journey.image} alt={journey.imageAlt} fill sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw" />
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
        </div>
      </section>
    </PageShell>
  );
}
