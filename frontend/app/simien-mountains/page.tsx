import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@/components/Icon";
import { PageShell } from "@/components/PageShell";
import { simienPlacePath, simienPlaceSummary, simienPlaces } from "@/lib/simien-destinations";

export const metadata: Metadata = {
  title: "Simien Mountains Destinations | Places, Camps & Viewpoints",
  description: "Eighteen Simien Mountains destinations — from Debark and Sankaber to Imet Gogo, Chenek, Ras Dashen and Adi Arkay — each with its own page.",
  alternates: { canonical: "/simien-mountains" },
};

export default function SimienPage() {
  return (
    <PageShell lightHeader={false}>
      <section className="page-hero--image simien-page-hero editorial-hero">
        <Image src="/images/simien-panorama.jpg" alt="Wide panorama across the Simien Mountains" fill priority sizes="100vw" />
        <div className="page-hero__content shell">
          <div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Simien Mountains</span></div>
          <p className="eyebrow">Simien destinations</p>
          <h1 className="display">Eighteen places, <em>one highland.</em></h1>
          <p className="lead">From the Debark gateway to Imet Gogo, Chenek, Ras Dashen and the quieter eastern transect. Choose a place to read more.</p>
        </div>
      </section>

      <section className="section" id="destinations">
        <div className="shell">
          <div className="simien-photo-grid simien-photo-grid--3">
            {simienPlaces.map((place) => (
              <Link className="simien-photo-card dest-card" href={simienPlacePath(place.slug)} key={place.slug}>
                <div className="simien-photo-card__image">
                  <Image src={place.image} alt={place.imageAlt} fill sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw" />
                  <span className="simien-photo-card__shade" />
                  <div className="simien-photo-card__overlay">
                    <p className="simien-photo-card__eyebrow">{place.location.split(";")[0]}</p>
                    <h2>{place.name}</h2>
                  </div>
                </div>
                <div className="simien-photo-card__body">
                  <p>{simienPlaceSummary(place)}</p>
                  <div className="simien-photo-card__footer">
                    <span className="simien-photo-card__explore">
                      About {place.name}
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
