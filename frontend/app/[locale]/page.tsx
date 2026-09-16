import { Suspense, type ReactNode } from "react";
import Image from "@/components/Image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight, ArrowUpRight, CheckCircle2, Compass, Map, Mountain, Route, TentTree } from "@/components/Icon";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FeatureGrid, SectionIntro } from "@/components/Editorial";
import { ExperiencePhotoCards } from "@/components/ExperiencePhotoCards";
import { HomeHeroMedia } from "@/components/HomeHeroMedia";
import { ReviewsShowcase } from "@/components/ReviewsShowcase";
import { DurationSelector } from "@/components/DurationSelector";
import { site, sourceLinks } from "@/lib/site";
import { getHomeCatalogue } from "@/lib/home-catalogue";
import { getLocale } from "next-intl/server";
import { cms } from "@/lib/cms";
import { resolveMediaUrl } from "@/lib/media-url";
import { buttonVariants } from "@/components/ui/button";
import { messagePageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return messagePageMetadata(locale, "home");
}

const em = { em: (chunks: ReactNode) => <em>{chunks}</em> };

async function HomeReviews() {
  const reviews = await cms.getTestimonials();
  return <ReviewsShowcase reviews={reviews} />;
}

export default async function Home() {
  const t = await getTranslations("home");
  const tCta = await getTranslations("cta");
  const home = await getHomeCatalogue(await getLocale());
  const homeHorizons = home.horizons;
  const homeSignatureJourneys = home.signatures;

  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <section className="hero">
          <HomeHeroMedia alt={t("heroAlt")} />
          <div className="hero__content">
            <h1 className="display">{t.rich("heroTitle", em)}</h1>
            <p className="hero__lead">{t("heroLead")}</p>
            <div className="hero__actions">
              <Link className={buttonVariants({ variant: "ctaCopper", size: "cta" })} href="/simien-mountains">{t("exploreSimien")} <ArrowUpRight size={16} /></Link>
            </div>
          </div>
        </section>

        <section className="home-trust" aria-label={t("trustAria")}>
          <div className="shell">
            <span><CheckCircle2 />{t("trustOwned")}</span>
            <span><Map />{t("trustBased")}</span>
            <span><Mountain />{t("trustSpecialists")}</span>
            <span><Compass />{t("trustGuide")}</span>
            <a href={sourceLinks.operatorAbout} target="_blank" rel="noreferrer">{t("trustVerified")} <ArrowUpRight /></a>
          </div>
        </section>

        <section className="section section--paper" id="who-we-are" aria-labelledby="who-we-are-title">
          <div className="shell">
            <div className="content-heading">
              <p className="eyebrow eyebrow--copper">{t("whoTag")}</p>
              <h2 className="section-title" id="who-we-are-title">{t.rich("whoTitle", em)}</h2>
            </div>
            <FeatureGrid items={[
              { title: t("whoWeAre"), body: t("whoWeAreBody", { name: site.name, operator: site.legalOperator }), href: "/about", linkLabel: t("whoStory") },
              { title: t("whereOperate"), body: t("whereOperateBody", { address: site.address }), href: "/simien-mountains", linkLabel: t("whereOperateLink") },
              { title: t("howPlanning"), body: t("howPlanningBody"), href: "/plan", linkLabel: t("startPlanner") },
            ]} />
          </div>
        </section>

        <section className="section section--paper discover-section">
          <div className="shell discover-section__heading">
            <div><p className="eyebrow eyebrow--copper">{t("horizonsTag")}</p><h2 className="section-title">{t.rich("horizonsTitle", em)}</h2></div>
            <p className="lead">{t("horizonsLead")}</p>
          </div>
          <div className="discover-grid shell">
            {homeHorizons.map((place) => {
              const key = place.slug === "gelada-country" ? "gelada" : place.slug === "imet-gogo" ? "imet-gogo" : place.slug === "ras-dashen" ? "ras-dashen" : null;
              const copy = key ? (t.raw(`horizons.${key}` as never) as { title?: string; tag?: string; short: string; detail: string }) : null;
              return (
              <Link
                href={place.href} locale={place.locale}
                className={`discover-card${place.tall ? " discover-card--tall" : ""}`}
                key={place.href}
              >
                {place.image && <Image src={place.image} alt={place.imageAlt} fill sizes={place.tall ? "(max-width: 720px) 100vw, 43vw" : "(max-width: 720px) 100vw, 28vw"} />}
                <div>
                  <span>{copy?.tag ?? place.tag}</span>
                  <h3>{copy?.title ?? place.title}</h3>
                  <p>{copy?.short ?? place.short}</p>
                  <div className="discover-card__details"><div><p>{copy?.detail ?? place.detail}</p></div></div>
                  <span className="discover-card__cta">{t("exploreMore")} <ArrowUpRight /></span>
                </div>
              </Link>
              );
            })}
          </div>
          <div className="discover-section__cta">
            <Link className={`${buttonVariants({ variant: "ctaGold", size: "cta" })} max-[720px]:w-auto!`} href="/simien-mountains">{t("exploreMore")} <ArrowRight size={16} /></Link>
          </div>
        </section>

        <section className="section time-section" id="journey-collections">
          <div className="shell time-section__intro">
            <p className="eyebrow eyebrow--copper">{t("clarityTag")}</p>
            <h2 className="section-title">{t.rich("clarityTitle", em)}</h2>
            <p className="lead">{t("clarityLead")}</p>
          </div>
          <div className="shell"><DurationSelector collections={home.collections} /></div>
        </section>

        <section className="section featured-journeys">
          <div className="shell featured-journeys__header">
            <div><p className="eyebrow eyebrow--copper">{t("signatureTag")}</p><h2 className="section-title">{t.rich("signatureTitle", em)}</h2></div>
            <Link className="text-link" href="/treks">{t("viewEveryJourney")} <ArrowUpRight /></Link>
          </div>
          <div className="shell journey-mosaic">
            {homeSignatureJourneys.map((journey, index) => (
              <Link id={journey.slug} key={journey.slug} className={`journey-tile journey-tile--${index + 1}`} href={journey.href} locale={journey.locale}>
                {journey.image && <Image src={journey.image} alt={journey.imageAlt} fill sizes="(max-width: 720px) 100vw, 45vw" />}
                <div className="journey-tile__overlay">
                  <span>{journey.duration}{journey.difficulty ? ` · ${journey.difficulty}` : ""}</span>
                  <h3>{journey.title}</h3>
                  <p>{journey.summary}</p>
                  <b>{t("discover")} <ArrowUpRight /></b>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="section reviews-home" id="reviews">
          <div className="shell">
            <div className="reviews-home__heading"><SectionIntro tag={t("reviewsTag")} title={t("reviewsTitle")} accent={t("reviewsAccent")} /><div><p className="lead">{t("reviewsLead")}</p></div></div>
            <Suspense fallback={<div className="reviews-showcase-fallback" role="status">{t("reviewsLoading")}</div>}>
              <HomeReviews />
            </Suspense>
          </div>
        </section>

        <section className="section tevan-section">
          <div className="shell tevan-section__grid">
            <div className="tevan-section__portrait image-frame"><Image src="/images/tevan-founder.jpg" alt={t("tevanAlt")} fill sizes="(max-width: 720px) 100vw, 42vw" /><span className="image-caption">{t("tevanCaption")}</span></div>
            <div className="tevan-section__copy">
              <p className="eyebrow eyebrow--copper">{t("tevanTag")}</p>
              <blockquote>&ldquo;{t("tevanQuote")}&rdquo;</blockquote>
              <p>{t("tevanBody")}</p>
              <div className="tevan-section__links">
                <Link className={buttonVariants({ variant: "ctaDark", size: "cta" })} href="/about">{t("readStory")}</Link>
                <Link className="text-link" href="/plan">{tCta("planWithTevan")} <ArrowUpRight /></Link>
              </div>
              <div className="credential"><CheckCircle2 /><span>{t("certifiedGuide")}<br/><a href={sourceLinks.operatorAbout} target="_blank" rel="noreferrer">{t("viewCredentials")}</a></span></div>
            </div>
          </div>
        </section>

        <section className="section proof-section section--paper">
          <div className="shell proof-section__heading"><p className="eyebrow eyebrow--copper">{t("proofTag")}</p><h2 className="section-title">{t.rich("proofTitle", em)}</h2></div>
          <div className="shell proof-grid">
            <div><TentTree /><h3>{t("proofPrepared")}</h3><p>{t("proofPreparedBody")}</p></div>
            <div><Compass /><h3>{t("proofGuidance")}</h3><p>{t("proofGuidanceBody")}</p></div>
            <div><Mountain /><h3>{t("proofRespect")}</h3><p>{t("proofRespectBody")}</p></div>
          </div>
        </section>

        <section className="section section--dark trail-proof">
          <div className="shell trail-proof__grid">
            <div className="trail-proof__copy">
              <p className="eyebrow eyebrow--copper">{t("trailTag")}</p>
              <h2 className="section-title">{t.rich("trailTitle", em)}</h2>
              <p className="lead lead--light">{t("trailLead")}</p>
              <Link className="text-link text-link--light" href="/plan">{t("planLocalTeam")} <ArrowUpRight /></Link>
            </div>
            <div className="route-card">
              <div className="route-card__top"><span><Route />{t("routeName")}</span><b>{t("fieldKnowledge")}</b></div>
              <div className="route-card__map" aria-hidden="true"><svg viewBox="0 0 500 240"><path d="M21 190C83 158 92 98 153 121s73 83 130 43 94-134 193-103"/><circle cx="21" cy="190" r="6"/><circle cx="153" cy="121" r="6"/><circle cx="283" cy="164" r="6"/><circle cx="476" cy="61" r="6"/></svg><span className="pin pin--a">Gondar</span><span className="pin pin--b">Sankaber</span><span className="pin pin--c">Geech</span><span className="pin pin--d">Imet Gogo</span></div>
              <dl>
                <div><dt>{t("walkingTime")}</dt><dd>{t("walkingValue")}</dd></div>
                <div><dt>{t("trailCondition")}</dt><dd>{t("trailValue")}</dd></div>
                <div><dt>{t("gps")}</dt><dd>{t("gpsValue")}</dd></div>
              </dl>
              <small>{t("noInvented")}</small>
            </div>
          </div>
        </section>

        <section className="section section--paper"><div className="shell"><SectionIntro tag={t("beyondTag")} title={t("beyondTitle")} accent={t("beyondAccent")} /><ExperiencePhotoCards items={home.beyond} /></div></section>
        <section className="final-call">
          <Image src={resolveMediaUrl("https://res.cloudinary.com/ps4gvvqu/image/upload/v1789571200/buhit-ras.jpg")} alt={t("finalAlt")} fill sizes="100vw" />
          <div className="final-call__veil" />
          <div className="final-call__content shell">
            <p className="eyebrow">{t("finalEyebrow")}</p>
            <h2>{t("finalTitle")}</h2>
            <p>{t("finalLead")}</p>
            <div>
              <Link className={buttonVariants({ variant: "ctaCopper", size: "cta" })} href="/plan">{t("planMyJourney")} <ArrowUpRight /></Link>
              <a className={buttonVariants({ variant: "ctaOutline", size: "cta" })} href={site.whatsapp} target="_blank" rel="noreferrer">{t("chatOnWhatsApp")}</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
