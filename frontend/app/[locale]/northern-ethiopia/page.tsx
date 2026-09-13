import { getDestinations, destinationToPlace } from "@/lib/catalogue";
import { getLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "@/components/Icon";
import { PageShell } from "@/components/PageShell";
import { FeatureGrid, SectionIntro } from "@/components/Editorial";
import { site } from "@/lib/site";
import { localeFromParam, pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    locale: localeFromParam(locale),
    title: "Northern Ethiopia Extensions",
    description: "Explore northern Ethiopia extensions to combine with a Gondar and Simien journey.",
    path: "/northern-ethiopia",
  });
}

export default async function NorthernPage() {
  const places = (await getDestinations(await getLocale(), "northern")).map(destinationToPlace);
  return (
    <PageShell lightHeader>
      <section className="page-hero editorial-hero">
        
        <div className="shell">
          <div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Northern Ethiopia</span></div>
          <p className="eyebrow">Northern Ethiopia extensions</p>
          <h1 className="display">Explore <em>Northern Ethiopia.</em></h1>
          <p className="lead">Explore published northern destinations to combine with your journey.</p>
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
