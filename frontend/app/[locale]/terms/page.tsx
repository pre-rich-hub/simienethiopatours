import { Link } from "@/i18n/navigation";
import { PageShell } from "@/components/PageShell";
import { site } from "@/lib/site";
import { localeFromParam, pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    locale: localeFromParam(locale),
    title: "Website Terms",
    description: "Planning information, wildlife, safety, images, and booking terms for the Gondar Simien Tours website.",
    path: "/terms",
    index: false,
  });
}

export default function TermsPage() { return <PageShell><section className="page-hero"><div className="shell"><div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Terms</span></div><h1 className="display">Website <em>terms.</em></h1></div></section><section className="section"><article className="legal-copy shell"><h2>Planning information</h2><p>Website itineraries are starting points. Routes, access, park requirements, weather, wildlife, transport and accommodation can change. A journey is not confirmed until you receive and accept a written proposal from {site.legalOperator}.</p><h2>No wildlife guarantee</h2><p>Wildlife encounters cannot be guaranteed. Guides aim for patient, respectful observation while prioritizing visitor and animal welfare.</p><h2>Health and safety</h2><p>Mountain travel involves altitude, remote terrain and variable weather. Website content is general information, not medical advice. Travelers should seek appropriate professional advice, disclose relevant needs during planning and obtain suitable travel insurance.</p><h2>Images and content</h2><p>Photography sources and licenses are listed on the <Link href="/photo-credits">photo credits page</Link>. Destination images illustrate real places but do not represent a guaranteed view, season or specific departure.</p><h2>Booking terms</h2><p>Payment, cancellation, inclusion and liability terms must be supplied with the written trip proposal before booking. Email <a href={`mailto:${site.email}`}>{site.email}</a> for the current operating terms.</p></article></section></PageShell>; }
