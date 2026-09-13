import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageShell } from "@/components/PageShell";
import {
  FeatureGrid,
  PageLinks,
  PlanningCall,
  StorySection,
} from "@/components/Editorial";
import { OperatorFaq } from "@/components/OperatorFaq";
import { sourceLinks } from "@/lib/site";
import {
  gondarPlanningCards,
  gondarPlanningIntro,
  gondarPlanningSections,
} from "@/lib/gondar-guide";
import { getOperatorFaqItems, operatorFaqForJsonLd } from "@/lib/operator-faq";
import {
  breadcrumbJsonLd,
  faqPageJsonLd,
  jsonLdScript,
  localeFromParam,
  pageMetadata,
} from "@/lib/seo";
import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/routing";

const PATH = "/gondar/planning";

const SECTION_KEYS = ["cityTime", "heritageEtiquette", "combiningSimien", "northernExtensions"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = localeFromParam(localeParam);
  const t = await getTranslations({ locale, namespace: "gondarPlanning" });
  return pageMetadata({
    locale,
    path: PATH,
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

const em = { em: (chunks: ReactNode) => <em>{chunks}</em> };

export default async function GondarPlanningPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeFromParam(localeParam) as AppLocale;
  const t = await getTranslations("gondarPlanning");
  const tCommon = await getTranslations("common");
  const faqItems = await getOperatorFaqItems();

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript({
            "@context": "https://schema.org",
            "@graph": [
              faqPageJsonLd(operatorFaqForJsonLd(faqItems)),
              breadcrumbJsonLd([
                { name: tCommon("home"), path: "/", locale },
                { name: t("hubCrumb"), path: "/gondar", locale },
                { name: t("crumb"), path: PATH, locale },
              ]),
            ],
          }),
        }}
      />

      <section className="page-hero editorial-hero">
        <div className="shell">
          <div className="breadcrumbs">
            <Link href="/">{tCommon("home")}</Link>
            <span>/</span>
            <Link href="/gondar">{t("hubCrumb")}</Link>
            <span>/</span>
            <span>{t("crumb")}</span>
          </div>
          <p className="eyebrow eyebrow--copper">{t("eyebrow")}</p>
          <h1 className="display">{t.rich("title", em)}</h1>
          <p className="lead">{t("lead")}</p>
          <p>
            <a className="text-link" href={sourceLinks.gondarUnesco} target="_blank" rel="noreferrer">
              {t("unescoLink")}
            </a>
          </p>
        </div>
      </section>

      <PageLinks
        items={[
          ...gondarPlanningSections.map((section, index) => ({
            href: `#${section.id}`,
            label: t(`sections.${SECTION_KEYS[index]}.nav`),
          })),
          { href: "#next-steps", label: t("linkNext") },
          { href: "#operator-faq", label: t("linkFaq") },
        ]}
      />

      <StorySection
        tag={t("introTag")}
        title={t("introTitle")}
        accent={t("introAccent")}
        paper
        paragraphs={gondarPlanningIntro}
      >
        <Link className="text-link" href="/plan">
          {t("linkPlan")}
        </Link>
      </StorySection>

      {gondarPlanningSections.map((section, index) => {
        const key = SECTION_KEYS[index];
        return (
          <StorySection
            key={section.id}
            id={section.id}
            tag={t(`sections.${key}.tag`)}
            title={t(`sections.${key}.title`)}
            accent={t(`sections.${key}.accent`)}
            paper={index % 2 === 1}
            paragraphs={section.paragraphs}
          >
            {key === "combiningSimien" ? (
              <Link className="text-link" href="/simien-mountains/planning">
                {t("linkSimienGuide")}
              </Link>
            ) : null}
            {key === "northernExtensions" ? (
              <Link className="text-link" href="/northern-ethiopia">
                {t("linkNorthern")}
              </Link>
            ) : null}
          </StorySection>
        );
      })}

      <section className="section" id="next-steps">
        <div className="shell">
          <FeatureGrid items={gondarPlanningCards} columns={2} />
        </div>
      </section>

      <OperatorFaq paper />
      <PlanningCall title={t("callTitle")} eyebrow={t("callEyebrow")} label={t("callLabel")} />
    </PageShell>
  );
}
