import { resolveMediaUrl } from "@/lib/media-url";
import clientPhotos from "@/lib/client-photos.json";
import { getDestinations, destinationToPlace } from "@/lib/catalogue";
import { getLocale } from "next-intl/server";
import type { ReactNode } from "react";
import Image from "@/components/Image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageShell } from "@/components/PageShell";
import { FeatureGrid, SectionIntro } from "@/components/Editorial";
import { DestinationsFilter } from "@/components/DestinationsFilter";
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
        <Image src={resolveMediaUrl(clientPhotos.sankaber.url)} alt={t("heroAlt")} fill priority sizes="100vw" />
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
          <DestinationsFilter places={places} />
        </div>
      </section>
    </PageShell>
  );
}
