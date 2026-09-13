import { getDestinations, destinationToPlace } from "@/lib/catalogue";
import { getLocale } from "next-intl/server";
import type { ReactNode } from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "@/components/Icon";
import { PageShell } from "@/components/PageShell";
import { FeatureGrid, SectionIntro } from "@/components/Editorial";
import { site } from "@/lib/site";
import { messagePageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return messagePageMetadata(locale, "simien");
}

const em = { em: (chunks: ReactNode) => <em>{chunks}</em> };

export default async function SimienPage() {
  const places = (await getDestinations(await getLocale(), "simien")).map(destinationToPlace);
  const t = await getTranslations("simien");
  const tCommon = await getTranslations("common");

  return (
    <PageShell lightHeader={false}>
      <section className="page-hero--image simien-page-hero editorial-hero">
        <Image src="/images/simien-panorama.jpg" alt={t("heroAlt")} fill priority sizes="100vw" />
        <div className="page-hero__content shell">
          <div className="breadcrumbs"><Link href="/">{tCommon("home")}</Link><span>/</span><span>{t("crumb")}</span></div>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h1 className="display">{t.rich("title", em)}</h1>
          <p className="lead">{t("lead")}</p>
        </div>
      </section>

      <section className="section section--paper" id="in-brief">
        <div className="shell">
          <SectionIntro tag={t("briefTag")} title={t("briefTitle")} accent={t("briefAccent")} />
          <FeatureGrid items={[
            { title: t("who"), body: t("whoBody", { name: site.name, operator: site.legalOperator }) },
            { title: t("where"), body: t("whereBody") },
            { title: t("how"), body: t("howBody"), href: "/plan", linkLabel: t("plan") },
            { title: t("planningGuide"), body: t("planningGuideBody"), href: "/simien-mountains/planning", linkLabel: t("planningGuideLink") },
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
                      {t("about", { name: place.name })}
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
