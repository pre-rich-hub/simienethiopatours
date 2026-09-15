import type { ReactNode } from "react";
import Image from "@/components/Image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CheckCircle2, ShieldCheck, ArrowUpRight } from "@/components/Icon";
import { PageShell } from "@/components/PageShell";
import { FeatureGrid, PageLinks, PlanningCall, SectionIntro, StorySection } from "@/components/Editorial";
import { site, sourceLinks } from "@/lib/site";
import { messagePageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return messagePageMetadata(locale, "about");
}

const em = { em: (chunks: ReactNode) => <em>{chunks}</em> };

export default async function AboutPage() {
  const t = await getTranslations("about");
  const tCommon = await getTranslations("common");
  const tCta = await getTranslations("cta");

  return <PageShell>
    <section className="about-hero page-hero"><div className="shell about-hero__grid"><div><div className="breadcrumbs"><Link href="/">{tCommon("home")}</Link><span>/</span><span>{t("crumb")}</span></div><p className="eyebrow eyebrow--copper">{t("eyebrow")}</p><h1 className="display">{t.rich("title", em)}</h1><p className="lead">{t("lead")}</p></div><div className="about-hero__portrait image-frame"><Image src="/images/tevan-portrait.jpg" alt={t("heroAlt")} fill priority sizes="(max-width: 720px) 100vw, 45vw" /></div></div></section>
    <PageLinks items={[{ label: t("linkBrief"), href: "#in-brief" }, { label: t("linkStory"), href: "#story" }, { label: t("linkApproach"), href: "#approach" }, { label: t("linkLocal"), href: "#local" }, { label: t("linkEquipment"), href: "#equipment" }]} />
    <section className="section section--paper" id="in-brief"><div className="shell"><SectionIntro tag={t("briefTag")} title={t("briefTitle")} accent={t("briefAccent")} /><FeatureGrid items={[
      { title: t("who"), body: t("whoBody", { name: site.name, operator: site.legalOperator }) },
      { title: t("where"), body: t("whereBody", { address: site.address }) },
      { title: t("how"), body: t("howBody"), href: "/plan", linkLabel: tCta("planWithTevan") },
    ]} /></div></section>
    <StorySection id="story" tag={t("storyTag")} title={t("storyTitle")} accent={t("storyAccent")} paragraphs={t.raw("story")} />
    <StorySection tag={t("guidingTag")} title={t("guidingTitle")} accent={t("guidingAccent")} paper paragraphs={t.raw("guiding")} />
    <section className="section" id="approach"><div className="shell"><SectionIntro tag={t("approachTag")} title={t("approachTitle")} accent={t("approachAccent")} /><FeatureGrid items={[
      { title: t("unexpected"), body: t("unexpectedBody") },
      { title: t("honest"), body: t("honestBody") },
      { title: t("respect"), body: t("respectBody") },
    ]} /></div></section>
    <section className="section section--dark credentials-section"><div className="shell"><p className="eyebrow eyebrow--copper">{t("verified")}</p><div className="credentials-grid"><div><CheckCircle2 /><span>{t("role")}</span><strong>Tesema “Tevan” Mulualem</strong></div><div><CheckCircle2 /><span>{t("qualification")}</span><strong>{t("qualificationValue")}</strong></div><div><CheckCircle2 /><span>{t("operator")}</span><strong>Simien Ethio Tours</strong></div><div><CheckCircle2 /><span>{t("based")}</span><strong>{t("basedValue")}</strong></div></div><p className="credential-source"><ShieldCheck size={16} />{t.rich("credentialSource", { site: (chunks) => <a className="credential-source__link" href={sourceLinks.operatorAbout} target="_blank" rel="noreferrer">{chunks}<ArrowUpRight size={12} /></a> })}</p></div></section>
    <section className="section tevan-local" id="local"><div className="shell tevan-local__grid"><div><p className="eyebrow eyebrow--copper">{t("localTag")}</p><h2 className="section-title">{t.rich("localTitle", em)}</h2></div><div><p className="lead">{t("localLead")}</p><div className="prose"><p>{t("localBody")}</p></div><div className="local-chain"><span>{t("chainTraveler")}</span><i>→</i><span>{t("chainTeam")}</span><i>→</i><span>{t("chainBusiness")}</span><i>→</i><span>{t("chainFuture")}</span></div></div></div></section>
    <StorySection id="equipment" tag={t("equipmentTag")} title={t("equipmentTitle")} accent={t("equipmentAccent")} paper paragraphs={t.raw("equipment")}><Link className="text-link" href="/plan">{t("askPreparation")}</Link></StorySection>
    <section className="section"><div className="shell founder-note"><p className="eyebrow eyebrow--copper">{t("noteTag")}</p><blockquote>{t("noteQuote")}</blockquote><p>{t("noteClose")}</p><span>{t("noteSignoff")}</span></div></section>
    <PlanningCall title={t("callTitle")} eyebrow={t("callEyebrow")} label={t("callLabel")} />
  </PageShell>;
}
