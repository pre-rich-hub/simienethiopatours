import { Link } from "@/i18n/navigation";
import { PageShell } from "@/components/PageShell";
import { site } from "@/lib/site";
import { localeFromParam, pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    locale: localeFromParam(locale),
    title: "Privacy",
    description: "How Gondar Simien Tours handles planner inquiries, hosting logs, and requests about your information.",
    path: "/privacy",
    index: false,
  });
}

export default function PrivacyPage() { return <PageShell><section className="page-hero"><div className="shell"><div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Privacy</span></div><h1 className="display">Privacy.</h1></div></section><section className="section"><article className="legal-copy shell"><h2>Information you choose to share</h2><p>The journey planner asks for contact and trip-planning details so the local team can respond to your inquiry. In the default configuration, the site opens your own email application and does not retain those details on this website. If a secure contact webhook is configured, the inquiry is sent to the operator’s selected contact system.</p><h2>Technical information</h2><p>Standard hosting logs may record technical information such as IP address, browser and requested pages for security and reliability. This build does not add advertising trackers or marketing cookies.</p><h2>Your choices</h2><p>Do not include medical, passport, payment or other sensitive information in the initial inquiry. You can ask what information is held about you, request correction or deletion, or raise a privacy question by emailing <a href={`mailto:${site.email}`}>{site.email}</a>.</p><p><strong>Last updated:</strong> 4 September 2026.</p></article></section></PageShell>; }
