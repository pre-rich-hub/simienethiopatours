import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Clock, Mail, MessageCircle, Phone } from "@/components/Icon";
import { PageShell } from "@/components/PageShell";
import { InquiryForm } from "@/components/InquiryForm";
import { site } from "@/lib/site";
import { planningOptions } from "@/lib/experiences";
import { messagePageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return messagePageMetadata(locale, "plan");
}

const em = { em: (chunks: ReactNode) => <em>{chunks}</em> };

const PREFILL_MESSAGE_MAX = 500;

function prefillMessage(query: { message?: string; subject?: string }) {
  return (query.message || query.subject || "").trim().slice(0, PREFILL_MESSAGE_MAX);
}

export default async function PlanPage({ searchParams }: { searchParams: Promise<{ experience?: string; journey?: string; message?: string; subject?: string }> }) {
  const t = await getTranslations("plan");
  const tCommon = await getTranslations("common");
  const query = await searchParams;
  const requested = query.experience || query.journey;
  const selected = planningOptions.find((option) => option.id === requested)?.id || "";
  const message = prefillMessage(query);
  return <PageShell>
    <section className="page-hero plan-hero"><div className="shell plan-hero__grid"><div><div className="breadcrumbs"><Link href="/">{tCommon("home")}</Link><span>/</span><span>{t("crumb")}</span></div><p className="eyebrow eyebrow--copper">{t("eyebrow")}</p><h1 className="display">{t.rich("title", em)}</h1></div><p className="lead">{t("lead", { name: site.name, operator: site.legalOperator, address: site.address })}</p></div></section>
    <section className="section plan-section"><div className="shell plan-layout"><div className="plan-sidebar"><p className="eyebrow">{t("next")}</p><ol><li><span>01</span><div><strong>{t("step1")}</strong><p>{t("step1Body")}</p></div></li><li><span>02</span><div><strong>{t("step2")}</strong><p>{t("step2Body")}</p></div></li><li><span>03</span><div><strong>{t("step3")}</strong><p>{t("step3Body")}</p></div></li></ol><div className="direct-contact"><h2>{t("preferTalk")}</h2>
                <p>{site.name} · {site.legalOperator}<br />{site.address}</p><a href={site.whatsapp} target="_blank" rel="noreferrer"><MessageCircle />{t("whatsappTevan")}</a><a href={`tel:${site.phone}`}><Phone />{site.phoneDisplay}</a><a href={`mailto:${site.email}`}><Mail />{site.email}</a><p><Clock />{t("timezone")}</p></div></div><div className="plan-form"><p className="eyebrow eyebrow--copper">{t("formTag")}</p><h2>{t("formTitle")}</h2><InquiryForm key={`${selected}:${message}`} initialExperience={selected} initialMessage={message} /></div></div></section>
  </PageShell>;
}
