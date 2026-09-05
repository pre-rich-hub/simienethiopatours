import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@/components/Icon";
import { PageShell } from "@/components/PageShell";
import { sourceLinks } from "@/lib/site";

export const metadata: Metadata = { title: "The Simien Mountains", description: "A local introduction to the Simien Mountains landscape, wildlife, places and practical gateway from Gondar.", alternates: { canonical: "/simien-mountains" } };

export default function SimienPage() {
  return <PageShell lightHeader={false}>
    <section className="page-hero--image simien-page-hero"><Image src="/images/imet-gogo.jpg" alt="The immense cliffs and valleys seen from Imet Gogo" fill priority sizes="100vw" /><div className="page-hero__content shell"><div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Simien Mountains</span></div><p className="eyebrow">UNESCO World Heritage landscape · Northern Ethiopia</p><h1 className="display">Life above <em>the clouds.</em></h1><p className="lead">Jagged peaks. Deep valleys. Afroalpine grasslands. A mountain world that rewards time, patience and good local judgment.</p></div></section>
    <section className="section simien-intro"><div className="shell editorial-grid"><div><span className="chapter-index">01</span><h2 className="section-title">A landscape carved <em>over millions of years.</em></h2></div><div className="prose"><p>The Simien is not one viewpoint. It is a high plateau broken by dramatic cliffs and gorges, with escarpments dropping as much as 1,500 metres. UNESCO recognizes the park for both exceptional natural beauty and globally important biodiversity.</p><p>The experience changes by season and even by the hour: wind, sun, cloud and cold can move quickly across the high country.</p><a className="source-link" href={sourceLinks.simienUnesco} target="_blank" rel="noreferrer">Source: UNESCO World Heritage Centre ↗</a></div></div></section>
    <section className="simien-places section section--paper" id="imet-gogo"><div className="shell"><p className="eyebrow eyebrow--copper">Places that shape the journey</p><div className="place-gallery">
      <article><div className="image-frame"><Image src="/images/imet-gogo.jpg" alt="The promontory at Imet Gogo" fill sizes="(max-width: 720px) 100vw, 45vw" /></div><span>01</span><h2>Imet Gogo</h2><p>A high promontory and a defining sense of scale—often the emotional centre of a classic multi-day walk.</p></article>
      <article><div className="image-frame"><Image src="/images/chenek-camp.jpg" alt="Chenek camp among the Simien cliffs" fill sizes="(max-width: 720px) 100vw, 45vw" /></div><span>02</span><h2>Chenek</h2><p>Open highlands, vast escarpment walls and important wildlife habitat. Routes here depend on time and current access.</p></article>
      <article><div className="image-frame"><Image src="/images/geech-camp.jpg" alt="Tents on the high plateau near Geech" fill sizes="(max-width: 720px) 100vw, 45vw" /></div><span>03</span><h2>Geech</h2><p>A mountain camp, cold evening air and the feeling that the road is now far behind you.</p></article>
    </div></div></section>
    <section className="section wildlife-guide section--dark" id="wildlife"><div className="shell wildlife-guide__grid"><div className="image-frame"><Image src="/images/gelada-troop.jpg" alt="Gelada troop grazing in the highlands" fill sizes="(max-width: 720px) 100vw, 48vw" /></div><div><p className="eyebrow eyebrow--copper">Wildlife</p><h2 className="section-title">Watch quietly. <em>Stay curious.</em></h2><p className="lead lead--light">The park is important habitat for geladas, the endemic Walia ibex and the endangered Ethiopian wolf. Encounters remain wild: their timing, distance and visibility are never ours to command.</p><Link className="button button--copper" href="/plan">Plan a wildlife journey <ArrowUpRight /></Link></div></div></section>
    <section className="section"><div className="shell fact-band"><div><span>Gateway</span><strong>Gondar → Debark → Park</strong></div><div><span>Approach</span><strong>Private and small-group</strong></div><div><span>Route</span><strong>Confirmed for conditions</strong></div><div><span>Altitude</span><strong>Prepare, layer, acclimatize</strong></div></div></section>
  </PageShell>;
}
