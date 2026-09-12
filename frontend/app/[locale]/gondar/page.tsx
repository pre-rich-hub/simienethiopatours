import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@/components/Icon";
import { PageShell } from "@/components/PageShell";
import { FeatureGrid, SectionIntro } from "@/components/Editorial";
import { gondarPlacePath, gondarPlaceSummary, gondarPlaces } from "@/lib/gondar-destinations";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Gondar Destinations | Royal City, Heritage & Northern Extensions",
  description: "Fifteen Gondar and northern-extension destinations — from Fasil Ghebbi and Kosoye to Lake Tana, Lalibela and Axum — each with its own page.",
  path: "/gondar",
});

export default function GondarPage() {
  return (
    <PageShell lightHeader={false}>
      <section className="page-hero--image simien-page-hero editorial-hero">
        <Image src="/images/fasil-ghebbi.jpg" alt="Stone arches at the royal fortress of Fasil Ghebbi in Gondar" fill priority sizes="100vw" />
        <div className="page-hero__content shell">
          <div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Gondar</span></div>
          <p className="eyebrow">Gondar destinations</p>
          <h1 className="display">Fifteen places, <em>one royal city.</em></h1>
          <p className="lead">From Fasil Ghebbi and Kosoye to Debark, Lake Tana, Lalibela and Axum. Choose a place to read more.</p>
        </div>
      </section>

      <section className="section section--paper" id="in-brief">
        <div className="shell">
          <SectionIntro tag="In brief" title="The royal city," accent="and the way north." />
          <FeatureGrid items={[
            { title: "Who we are", body: `${site.name} is based in Gondar. Tesema “Tevan” Mulualem and the ${site.legalOperator} team plan city days and onward travel into the Simien Mountains.` },
            { title: "Where this is", body: "Gondar is the historic royal city of northern Ethiopia and the usual starting point for Simien journeys. These pages cover the city, nearby highland viewpoints such as Kosoye, and northern extensions some travelers combine with Gondar." },
            { title: "How to use these pages", body: "Read a destination, then plan a city day, a Simien trek, or a combined journey with the local team.", href: "/plan", linkLabel: "Plan from Gondar" },
          ]} />
        </div>
      </section>

      <section className="section" id="destinations">
        <div className="shell">
          <div className="simien-photo-grid simien-photo-grid--3">
            {gondarPlaces.map((place) => (
              <Link className="simien-photo-card dest-card" href={gondarPlacePath(place.slug)} key={place.slug}>
                <div className="simien-photo-card__image">
                  <Image src={place.image} alt={place.imageAlt} fill sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw" />
                  <span className="simien-photo-card__shade" />
                  <div className="simien-photo-card__overlay">
                    <p className="simien-photo-card__eyebrow">{place.location.split(";")[0]}</p>
                    <h2>{place.name}</h2>
                  </div>
                </div>
                <div className="simien-photo-card__body">
                  <p>{gondarPlaceSummary(place)}</p>
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
