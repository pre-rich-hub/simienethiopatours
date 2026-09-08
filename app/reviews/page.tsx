import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { EditorialHero, PlanningCall, SectionIntro } from "@/components/Editorial";
import { ReviewsShowcase } from "@/components/ReviewsShowcase";

export const metadata: Metadata = {
  title: "Traveler Reviews | Gondar Simien Tours",
  description: "Read Tripadvisor and Google feedback from travelers who explored Gondar and northern Ethiopia with Tesema ‘Tevan’ Mulualem.",
  alternates: { canonical: "/reviews" },
};

export default function ReviewsPage() {
  return <PageShell lightHeader={false}>
    <EditorialHero
      eyebrow="Traveler reviews"
      title="Their journeys."
      accent="In their own words."
      lead="Independent feedback from travelers who met Tevan in Gondar and explored northern Ethiopia with local guidance."
      image={{ src: "/images/tevan-founder.jpg", alt: "Tesema ‘Tevan’ Mulualem guiding in the northern Ethiopian highlands" }}
      parent={{ label: "Our story", href: "/about" }}
    />
    <section className="section section--paper reviews-page">
      <div className="shell">
        <div className="reviews-page__heading">
          <SectionIntro tag="Tripadvisor & Google" title="Excellent experiences," accent="shared by travelers." />
          <p className="lead">The strongest proof of a journey is how it felt to the person who was there. These reviews are reproduced from the feedback supplied to us.</p>
        </div>
        <ReviewsShowcase />
      </div>
    </section>
    <PlanningCall title="Ready to shape your own story?" label="Plan with Tevan" />
  </PageShell>;
}
