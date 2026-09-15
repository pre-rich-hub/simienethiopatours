import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "@/components/Icon";
import { PageShell } from "@/components/PageShell";
import { Gallery } from "@/components/Gallery";
import { buttonVariants } from "@/components/ui/button";
import { cms } from "@/lib/cms";
import { galleryImageUrl } from "@/lib/gallery-data";
import { resolveMediaUrl } from "@/lib/media-url";
import { localeFromParam, pageMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: localeFromParam(locale), namespace: "gallery" });
  return pageMetadata({
    locale: localeFromParam(locale),
    title: t("title"), description: t("description"),
    path: "/gallery",
    ogTitle: "A little closer to extraordinary | Gondar Simien Gallery",
    image: {
      url: resolveMediaUrl(galleryImageUrl(2)),
      alt: t("imageAlt"),
    },
  });
}

export default async function GalleryPage() {
  const galleryPhotos = await cms.getGallery();
  const t = await getTranslations("gallery");

  return <PageShell>
    <section className="gallery-intro shell" aria-labelledby="gallery-heading">
      <div className="gallery-intro__top"><p className="eyebrow eyebrow--copper">{t("eyebrow")}</p><span>{t("collection", { count: galleryPhotos.length })}</span></div>
      <div className="gallery-intro__body">
        <h1 id="gallery-heading">{t.rich("heading", { br: () => <br />, em: chunks => <em>{chunks}</em> })}</h1>
        <div><p>{t("lead")}</p><p className="gallery-intro__scenic">{t("scenicNote")}</p><span className="gallery-intro__invitation">{t("invitation")} <ArrowUpRight size={20} style={{ transform: "rotate(225deg)" }} /></span></div>
      </div>
    </section>
    <Gallery photographs={galleryPhotos} />
    <section className="gallery-next shell" aria-labelledby="gallery-next-heading">
      <div><p className="eyebrow eyebrow--copper">{t("nextEyebrow")}</p><h2 id="gallery-next-heading">{t.rich("nextTitle", { em: chunks => <em>{chunks}</em> })}</h2><p>{t("nextLead")}</p><Link className={buttonVariants({ variant: "ctaDark", size: "cta" })} href="/plan">{t("makeJourney")} <ArrowUpRight size={16} /></Link></div>
      <aside className="gallery-field-notes"><span className="eyebrow eyebrow--copper">{t("prepEyebrow")}</span><h3>{t.rich("prepTitle", { br: () => <br />, em: chunks => <em>{chunks}</em> })}</h3><p>{t("prepLead")}</p><Link className="text-link" href="/plan">{t("startPlanner")} <ArrowUpRight size={16} /></Link></aside>
    </section>
  </PageShell>;
}
