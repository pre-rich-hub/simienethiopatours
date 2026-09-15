import type { ReactNode } from "react";
import Image from "@/components/Image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight, ChevronDown } from "@/components/Icon";
import { site } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";

export type Feature = { title: string; body: string; tag?: string; href?: string; linkLabel?: string; id?: string; image?: string; imageAlt?: string };
export type { TourDay as ItineraryDay } from "@/lib/tour-content";
import type { TourDay as ItineraryDay } from "@/lib/tour-content";

export async function EditorialHero({ eyebrow, title, accent, lead, image, parent }: {
  eyebrow: string; title: string; accent: string; lead: string;
  image?: { src: string; alt: string }; parent?: { label: string; href: string };
}) {
  if (image && !image.src) image = undefined;
  const tCommon = await getTranslations("common");
  const tNav = await getTranslations("nav");
  const crumbs = parent ?? { label: tNav("journeys"), href: "/treks" };
  return <section className={image ? "page-hero--image editorial-hero" : "page-hero editorial-hero"}>
    {image && <Image src={image.src} alt={image.alt} fill priority fetchPriority="high" loading="eager" sizes="100vw" />}
    <div className={`shell ${image ? "page-hero__content" : ""}`}>
      <div className="breadcrumbs"><Link href="/">{tCommon("home")}</Link><span>/</span><Link href={crumbs.href}>{crumbs.label}</Link></div>
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="display">{title} <em>{accent}</em></h1>
      <p className="lead">{lead}</p>
    </div>
  </section>;
}

export function SectionIntro({ tag, title, accent }: { tag: string; title: string; accent?: string }) {
  return <div className="content-heading"><p className="eyebrow eyebrow--copper">{tag}</p><h2 className="section-title">{title} {accent && <em>{accent}</em>}</h2></div>;
}

export function StorySection({ id, tag, title, accent, paragraphs, children, paper = false, image, bare = false }: {
  id?: string; tag: string; title: string; accent?: string; paragraphs: string[]; children?: ReactNode; paper?: boolean;
  image?: { src: string; alt: string; caption?: string; position?: string }; bare?: boolean;
}) {
  const content = <><SectionIntro tag={tag} title={title} accent={accent} /><div className="prose">{paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{children}</div></>;
  if (bare) return content;
  if (image) return <section id={id} className={`section story-section-photo ${paper ? "section--paper" : ""}`}>
    <div className="shell story-section-photo__layout">
      <div className="story-section-photo__image image-frame"><Image src={image.src} alt={image.alt} fill sizes="(max-width: 720px) 100vw, 48vw" style={{ objectPosition: image.position || "center" }} />{image.caption && <span className="image-caption">{image.caption}</span>}</div>
      <div className="story-section-photo__content">{content}</div>
    </div>
  </section>;
  return <section id={id} className={`section ${paper ? "section--paper" : ""}`}>
    <div className="shell editorial-grid">{content}</div>
  </section>;
}

export async function FeatureGrid({ items, columns = 3 }: { items: readonly Feature[]; columns?: 2 | 3 }) {
  const t = await getTranslations("cta");
  return <div className={`content-grid content-grid--${columns}`}>
    {items.map((item, index) => <article className="content-card" id={item.id} key={item.title}>
      {item.image && (item.href
        ? <Link href={item.href} className="content-card__image"><Image src={item.image} alt={item.imageAlt ?? ""} fill sizes="(max-width: 720px) 100vw, 31vw" /></Link>
        : <span className="content-card__image"><Image src={item.image} alt={item.imageAlt ?? ""} fill sizes="(max-width: 720px) 100vw, 31vw" /></span>)}
      <span className="eyebrow eyebrow--copper">{item.tag || String(index + 1).padStart(2, "0")}</span>
      <h3>{item.title}</h3><p>{item.body}</p>
      {item.href && <Link href={item.href} className="text-link">{item.linkLabel || t("exploreExperience")}<ArrowUpRight /></Link>}
    </article>)}
  </div>;
}

export function AtAGlance({ facts, bare = false }: { facts: readonly { label: string; value: string }[]; bare?: boolean }) {
  return <dl className={bare ? "trip-facts" : "trip-facts shell"}>{facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>;
}

export async function BookingCard({ duration, difficulty, route, experience }: {
  duration: string; difficulty: string; route: string; experience: string;
}) {
  const t = await getTranslations("booking");
  const startFinish = route.split(" → ")[0] || route;
  return <aside className="booking-card">
    <div className="booking-card__header">
      <p className="booking-card__eyebrow">{t("eyebrow")}</p>
      <h3>{t("title")}</h3>
    </div>
    <dl className="booking-card__facts">
      {duration && <div><dt>{t("duration")}</dt><dd>{duration}</dd></div>}
      <div><dt>{t("groupSize")}</dt><dd>{t("groupSizeValue")}</dd></div>
      {difficulty && <div><dt>{t("difficulty")}</dt><dd>{difficulty}</dd></div>}
      {startFinish && <div><dt>{t("startFinish")}</dt><dd>{startFinish}</dd></div>}
    </dl>
    <div className="booking-card__actions booking-card__actions--last">
      <Link className="booking-card__book" href={`/plan?experience=${experience}`}>{t("book")} <ArrowUpRight size={14} /></Link>
      <a className="booking-card__ask" href={site.whatsapp} target="_blank" rel="noreferrer">{t("ask")}</a>
    </div>
  </aside>;
}

export async function Itinerary({ days, id = "itinerary" }: { days: readonly ItineraryDay[]; id?: string }) {
  const t = await getTranslations("trek");
  return <div className="itinerary" id={id}>{days.map((day, index) => <details key={day.title} className="itinerary__day" open={index === 0}>
    <summary><span className="itinerary__number">{t("day", { n: day.dayLabel ?? String(index + 1).padStart(2, "0") })}</span><span><strong>{day.title}</strong><small>{day.subtitle}</small></span><ChevronDown /></summary>
    <div className="itinerary__body">{day.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      {day.stages && <ol className="editorial-list">{day.stages.map((stage) => <li key={stage.label}><strong>{stage.label}</strong><p>{stage.body}</p></li>)}</ol>}
      {day.notes && <ul className="editorial-list">{day.notes.map((note) => <li key={note}>{note}</li>)}</ul>}
      {day.overnight && <p className="itinerary__overnight"><b>{t("overnight")}</b> {day.overnight}</p>}
    </div>
  </details>)}</div>;
}

export function Faq({ items, id = "faq" }: { items: readonly { q: string; a: string }[]; id?: string }) {
  return <div className="faq-list" id={id}>{items.map((item) => <details className="faq-item" key={item.q}>
    <summary>{item.q}<ChevronDown /></summary>
    <p>{item.a}</p>
  </details>)}</div>;
}

export async function PageLinks({ items }: { items: { href: string; label: string }[] }) {
  const t = await getTranslations("common");
  return <nav className="page-links shell" aria-label={t("onThisPage")}>{items.map((item) => <a key={item.href} href={item.href}>{item.label}<ArrowUpRight size={13} /></a>)}</nav>;
}

export async function PlanningCall({ title, eyebrow, experience, label }: { title: string; eyebrow?: string; experience?: string; label?: string }) {
  const t = await getTranslations("cta");
  return <section className="inline-cta"><div className="shell"><p>{eyebrow ?? t("personallyPlanned")}</p><h2>{title}</h2><Link className={buttonVariants({ variant: "ctaCopper", size: "cta" })} href={experience ? `/plan?experience=${experience}` : "/plan"}>{label ?? t("planWithTevan")}<ArrowUpRight /></Link><a className="inline-contact" href={site.whatsapp} target="_blank" rel="noreferrer">{t("chatWithTevan")}</a></div></section>;
}
