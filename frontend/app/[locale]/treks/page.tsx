import Image from "next/image";
import Link from "next/link";
import { FeatureGrid, SectionIntro } from "@/components/Editorial";
import { JourneyPhotoCards } from "@/components/JourneyPhotoCards";
import { PageShell } from "@/components/PageShell";
import { journeyPackages } from "@/lib/journey-packages";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Journeys | Simien Treks, Gondar Experiences & Festival Packages",
  description: "Twenty-eight journey packages — from Simien in a Day and the Classic trek to Ras Dashen, Gondar experiences and festival journeys — each with its own page.",
  path: "/treks",
});

export default function TreksPage() {
  return (
    <PageShell lightHeader={false}>
      <section className="page-hero--image simien-page-hero editorial-hero">
        <Image src="/images/simien-panorama.jpg" alt="Wide panorama across the Simien Mountains" fill priority sizes="100vw" />
        <div className="page-hero__content shell">
          <div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Journeys</span></div>
          <p className="eyebrow">Journey packages</p>
          <h1 className="display">Twenty-eight journeys, <em>one local team.</em></h1>
          <p className="lead">From a Simien day trip to Ras Dashen, Gondar city experiences and festival journeys. Choose a package to read more.</p>
        </div>
      </section>

      <section className="section section--paper" id="in-brief">
        <div className="shell">
          <SectionIntro tag="In brief" title="Starting points," accent="not fixed scripts." />
          <FeatureGrid items={[
            { title: "Who we are", body: `${site.name}, operated by ${site.legalOperator}, plans these journeys from Gondar with Tesema “Tevan” Mulualem.` },
            { title: "What these pages are", body: "Each journey page is a planning outline: name, duration, route, inclusions and a day-by-day or segment itinerary where the source provides one. Routes, camps and wildlife can change." },
            { title: "How to continue", body: "Read an outline, then tell us your time and walking comfort. A written proposal confirms what is included for your dates.", href: "/plan", linkLabel: "Plan this journey" },
          ]} />
        </div>
      </section>

      <section className="section" id="journeys">
        <div className="shell">
          <JourneyPhotoCards journeys={journeyPackages} />
        </div>
      </section>
    </PageShell>
  );
}
