import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "@/components/Icon";
import { PageShell } from "@/components/PageShell";
import { Gallery } from "@/components/Gallery";
import { buttonVariants } from "@/components/ui/button";
import { cms } from "@/lib/cms";
import { localeFromParam, pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    locale: localeFromParam(locale),
    title: "Gallery | Gondar & the Simien Mountains",
    description: "A visual journey through the Simien Mountains and Gondar. Explore highland landscapes, wild geladas, royal architecture and life along the trail.",
    path: "/gallery",
    ogTitle: "A little closer to extraordinary | Gondar Simien Gallery",
    image: {
      url: "/images/simien-panorama.jpg",
      alt: "The layered landscape of the Simien Mountains",
    },
  });
}

export default async function GalleryPage() {
  const photographs = await cms.getGallery();

  return <PageShell>
    <section className="gallery-intro shell" aria-labelledby="gallery-heading">
      <div className="gallery-intro__top"><p className="eyebrow eyebrow--copper">Gondar & the Simien Mountains</p><span>A visual collection · 01—08</span></div>
      <div className="gallery-intro__body">
        <h1 id="gallery-heading">A little closer to<br /><em>extraordinary.</em></h1>
        <div><p>Beyond the map, before the journey. A glimpse of the landscapes, everyday encounters and quiet moments that stay with you.</p><span className="gallery-intro__invitation">Our world, through the lens <ArrowUpRight size={20} style={{ transform: "rotate(225deg)" }} /></span></div>
      </div>
    </section>
    <Gallery photographs={photographs} />
    <section className="gallery-next shell" aria-labelledby="gallery-next-heading">
      <div><p className="eyebrow eyebrow--copper">From a photograph to a memory</p><h2 id="gallery-next-heading">Imagine yourself <em>here.</em></h2><p>Tell us what caught your eye. We’ll help you find your own way into the highlands.</p><Link className={buttonVariants({ variant: "ctaDark", size: "cta" })} href="/plan">Make it your journey <ArrowUpRight size={16} /></Link></div>
      <aside className="gallery-field-notes"><span className="eyebrow eyebrow--copper">A little preparation</span><h3>Before you go,<br /><em>ask us.</em></h3><p>Seasons, packing, altitude and life on the trail. Tell us what you are imagining and we will help you prepare.</p><Link className="text-link" href="/plan">Start the planner <ArrowUpRight size={16} /></Link></aside>
    </section>
  </PageShell>;
}
