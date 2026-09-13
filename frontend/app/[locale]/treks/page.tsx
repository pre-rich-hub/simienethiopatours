import type { ReactNode } from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { FeatureGrid, SectionIntro } from "@/components/Editorial";
import { JourneyPhotoCards } from "@/components/JourneyPhotoCards";
import { PageShell } from "@/components/PageShell";
import { getTours, tourToJourney } from "@/lib/catalogue";
import { getLocale } from "next-intl/server";
import { site } from "@/lib/site";
import { messagePageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return messagePageMetadata(locale, "treks");
}

const em = { em: (chunks: ReactNode) => <em>{chunks}</em> };

export default async function TreksPage() {
  const journeyPackages = (await getTours(await getLocale())).map(tourToJourney);
  const t = await getTranslations("treks");
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
            { title: t("what"), body: t("whatBody") },
            { title: t("how"), body: t("howBody"), href: "/plan", linkLabel: t("planThis") },
            { title: t("planningGuide"), body: t("planningGuideBody"), href: "/simien-mountains/planning", linkLabel: t("planningGuideLink") },
          ]} columns={2} />
        </div>
      </section>

      <section className="section" id="journeys">
        <div className="shell">
          <JourneyPhotoCards journeys={journeyPackages} />
        </div>
      </section>
    </PageShell>
  );
}
