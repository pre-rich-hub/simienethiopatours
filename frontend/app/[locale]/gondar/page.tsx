import { getDestinations, destinationToPlace } from "@/lib/catalogue";
import { getLocale } from "next-intl/server";
import Image from "@/components/Image";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "@/components/Icon";
import { PageShell } from "@/components/PageShell";
import { FeatureGrid, SectionIntro } from "@/components/Editorial";
import { site } from "@/lib/site";
import { messagePageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { resolveMediaUrl } from "@/lib/media-url";
import clientPhotos from "@/lib/client-photos.json";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return messagePageMetadata(locale, "gondar");
}

export default async function GondarPage() {
  const places = (await getDestinations(await getLocale(), "gondar")).map(destinationToPlace);
  return (
    <PageShell lightHeader={false}>
      <section className="page-hero--image simien-page-hero editorial-hero">
        <Image src={resolveMediaUrl(clientPhotos.fasil.url)} alt={clientPhotos.fasil.alt.en} fill priority sizes="100vw" />
        <div className="page-hero__content shell">
          <div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Gondar</span></div>
          <p className="eyebrow">Gondar destinations</p>
          <h1 className="display">Explore Gondar, <em>the royal city.</em></h1>
          <p className="lead">Explore the city and nearby countryside. Choose a place to read more.</p>
        </div>
      </section>

      <section className="section section--paper" id="in-brief">
        <div className="shell">
          <SectionIntro tag="In brief" title="The royal city," accent="and the way north." />
          <FeatureGrid items={[
            { title: "Who we are", body: `${site.name} is based in Gondar. Tesema “Tevan” Mulualem and the ${site.legalOperator} team plan city days and onward travel into the Simien Mountains.` },
            { title: "Where this is", body: "Gondar is the historic royal city of northern Ethiopia and the usual starting point for Simien journeys. These pages cover the city, nearby highland viewpoints such as Kosoye, and northern extensions some travelers combine with Gondar." },
            { title: "How to use these pages", body: "Read a destination, then plan a city day, a Simien trek, or a combined journey with the local team.", href: "/plan", linkLabel: "Plan from Gondar" },
            { title: "Planning guide", body: "City time, heritage etiquette, combining Gondar with Simien, and northern extensions—practical answers before you inquire.", href: "/gondar/planning", linkLabel: "Read the Gondar planning guide" },
          ]} columns={2} />
        </div>
      </section>

      <section className="section" id="destinations">
        <div className="shell">
          <div className="simien-photo-grid simien-photo-grid--3">
            {places.map((place) => (
              <Link className="simien-photo-card dest-card" href={place.path} locale={place.locale} key={place.slug}>
                <div className="simien-photo-card__image">
                  {place.image && <Image src={place.image} alt={place.imageAlt} fill sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw" />}
                  <span className="simien-photo-card__shade" />
                  <div className="simien-photo-card__overlay">
                    <p className="simien-photo-card__eyebrow">{place.location.split(";")[0]}</p>
                    <h2>{place.name}</h2>
                  </div>
                </div>
                <div className="simien-photo-card__body">
                  <p>{place.overview[0] ?? ""}</p>
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
