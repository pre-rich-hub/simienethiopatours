import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, MessageCircle, Phone } from "@/components/Icon";
import { PageShell } from "@/components/PageShell";
import { InquiryForm } from "@/components/InquiryForm";
import { site } from "@/lib/site";
import { planningOptions } from "@/lib/experiences";

export const metadata: Metadata = { title: "Plan Your Simien Journey", description: "Tell Tevan your timing, walking comfort and interests to receive a locally planned Gondar and Simien journey.", alternates: { canonical: "/plan" } };

export default async function PlanPage({ searchParams }: { searchParams: Promise<{ experience?: string; journey?: string }> }) {
  const query = await searchParams;
  const requested = query.experience || query.journey;
  const selected = planningOptions.find((option) => option.id === requested)?.id || "";
  return <PageShell>
    <section className="page-hero plan-hero"><div className="shell plan-hero__grid"><div><div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Plan your journey</span></div><p className="eyebrow eyebrow--copper">No fixed script · no booking pressure</p><h1 className="display">You bring the curiosity. <em>We handle the complexity.</em></h1></div><p className="lead">You do not need to know the route. Tell us your time, interests and the questions on your mind. We will help make the options clear.</p></div></section>
    <section className="section plan-section"><div className="shell plan-layout"><div className="plan-sidebar"><p className="eyebrow">What happens next</p><ol><li><span>01</span><div><strong>You share the outline</strong><p>Dates, group, interests and how you like to travel.</p></div></li><li><span>02</span><div><strong>Tevan asks useful questions</strong><p>Walking comfort, altitude, camping and priorities.</p></div></li><li><span>03</span><div><strong>We shape the journey</strong><p>A route and quote grounded in current logistics.</p></div></li></ol><div className="direct-contact"><h2>Prefer to talk?</h2><a href={site.whatsapp} target="_blank" rel="noreferrer"><MessageCircle />WhatsApp Tevan</a><a href={`tel:${site.phone}`}><Phone />{site.phoneDisplay}</a><a href={`mailto:${site.email}`}><Mail />{site.email}</a><p><Clock />Gondar is on East Africa Time (UTC+3).</p></div></div><div className="plan-form"><p className="eyebrow eyebrow--copper">Your journey outline</p><h2>Start where you are.</h2><InquiryForm key={selected} initialExperience={selected} /></div></div></section>
  </PageShell>;
}
