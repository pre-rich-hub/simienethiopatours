import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageShell } from "@/components/PageShell";
import Image from "@/components/Image";
import { ArrowUpRight } from "@/components/Icon";
import { FeatureGrid, SectionIntro, PlanningCall } from "@/components/Editorial";
import { messagePageMetadata, howToJsonLd, jsonLdScript, localeFromParam } from "@/lib/seo";
import clientPhotos from "@/lib/client-photos.json";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return messagePageMetadata(locale, "customTour");
}

const em = { em: (chunks: ReactNode) => <em>{chunks}</em> };

export default async function CustomTourPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = localeFromParam(localeParam);
  const t = await getTranslations("customTour");
  const tMeta = await getTranslations({ locale, namespace: "meta" });
  const tCommon = await getTranslations("common");
  const meta = tMeta.raw("customTour" as never) as { title: string; description: string };

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            howToJsonLd({
              name: meta.title,
              description: meta.description,
              path: "/custom-built-tour",
              locale,
              steps: [
                { name: t("step1Title"), text: t("step1Body") },
                { name: t("step2Title"), text: t("step2Body") },
                { name: t("step3Title"), text: t("step3Body") },
              ],
            }),
          ),
        }}
      />
      <section className="page-hero plan-hero">
        <div className="shell plan-hero__grid">
          <div>
            <div className="breadcrumbs">
              <Link href="/">{tCommon("home")}</Link>
              <span>/</span>
              <span>{t("crumb")}</span>
            </div>
            <p className="eyebrow eyebrow--copper">{t("eyebrow")}</p>
            <h1 className="display">{t.rich("title", em)}</h1>
          </div>
          <p className="lead">{t("lead")}</p>
        </div>
      </section>

      <section className="section section--paper" id="how-it-works">
        <div className="shell">
          <SectionIntro tag={t("briefTag")} title={t("briefTitle")} accent={t("briefAccent")} />
          <FeatureGrid
            items={[
              { title: t("step1Title"), body: t("step1Body") },
              { title: t("step2Title"), body: t("step2Body") },
              { title: t("step3Title"), body: t("step3Body") },
            ]}
          />
        </div>
      </section>

      <section className="section" id="shaped-around">
        <div className="shell">
          <SectionIntro tag={t("shapeTag")} title={t("shapeTitle")} accent={t("shapeAccent")} />
          <FeatureGrid
            columns={2}
            items={[
              { title: t("shapeDurationTitle"), body: t("shapeDurationBody") },
              { title: t("shapeInterestsTitle"), body: t("shapeInterestsBody") },
              { title: t("shapeStyleTitle"), body: t("shapeStyleBody") },
              { title: t("shapeComfortTitle"), body: t("shapeComfortBody") },
            ]}
          />
        </div>
      </section>

      <section className="section section--paper" id="examples">
        <div className="shell">
          <SectionIntro tag={t("examplesTag")} title={t("examplesTitle")} accent={t("examplesAccent")} />
          <p className="lead">{t("examplesLead")}</p>
          <div className="ethiopia-destination-grid">
            {[
              {
                tag: t("example1Tag"), title: t("example1Title"), body: t("example1Body"), href: "/gondar", linkLabel: t("example1Link"),
                image: clientPhotos["gondar-market-local-life"].url, imageAlt: clientPhotos["gondar-market-local-life"].alt[locale],
              },
              {
                tag: t("example2Tag"), title: t("example2Title"), body: t("example2Body"), href: "/treks/run-the-simien-7-days", linkLabel: t("example2Link"),
                image: clientPhotos.chenek.url, imageAlt: clientPhotos.chenek.alt[locale],
              },
              {
                tag: t("example3Tag"), title: t("example3Title"), body: t("example3Body"), href: "/treks/southern-ethiopia-journey", linkLabel: t("example3Link"),
                image: clientPhotos.axum.url, imageAlt: clientPhotos.axum.alt[locale],
              },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="ethiopia-destination-card">
                <div className="ethiopia-destination-card__photo">
                  <Image src={item.image} alt={item.imageAlt} fill sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw" />
                </div>
                <div className="ethiopia-destination-card__body">
                  <p className="eyebrow eyebrow--copper">{item.tag}</p>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                  <div className="ethiopia-destination-card__footer">
                    <span className="simien-photo-card__explore">{item.linkLabel} <ArrowUpRight size={16} /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PlanningCall
        title={t("finalTitle")}
        eyebrow={t("finalEyebrow")}
        label={t("finalCta")}
        experience="custom-built-tour"
      />
    </PageShell>
  );
}
