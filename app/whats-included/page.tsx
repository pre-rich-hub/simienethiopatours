import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { EditorialHero, PlanningCall, SectionIntro } from "@/components/Editorial";
import { Check, ChevronDown, CircleAlert } from "@/components/Icon";
import { inclusionEntries } from "@/lib/inclusions";

export const metadata: Metadata = {
  title: "What's Included | Gondar Simien Tours",
  description: "Clear inclusions and exclusions for every Gondar Simien Tours journey, from a one-day introduction to the full ten-day Simien & Ras Dashen expedition.",
  alternates: { canonical: "/whats-included" },
};

export default function WhatsIncludedPage() {
  return <PageShell lightHeader={false}>
    <EditorialHero
      eyebrow="Before you book"
      title="Clearly included."
      accent="Clearly explained."
      lead="Every Gondar Simien Tours journey is different, so exact inclusions depend on the package you choose. Below are the standard inclusions for each type of journey — your final quotation always takes priority and will clearly confirm exactly what's included in your booking."
      image={{ src: "/images/chenek-camp.jpg", alt: "A mountain camp set up for a Simien trek" }}
      parent={{ label: "Journeys", href: "/treks" }}
    />
    <section className="section"><div className="shell">
      <SectionIntro tag="Every journey, one at a time" title="Choose a journey" accent="to see what's included." />
      <div className="inclusions-list">
        {inclusionEntries.map((entry) => <details className="inclusion-item" key={entry.id}>
          <summary>
            <span><strong>{entry.title}</strong><small>{entry.tag}</small></span>
            <ChevronDown aria-hidden="true" />
          </summary>
          <div className="inclusion-item__body">
            {entry.intro && <p className="inclusion-item__intro">{entry.intro}</p>}
            <div className="inclusion-item__grid">
              <div className="inclusion-item__grid--included">
                <h4>Included</h4>
                <ul>{entry.included.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul>
              </div>
              <div className="inclusion-item__grid--excluded">
                <h4>Not included</h4>
                <ul>{entry.excluded.map((item) => <li key={item}><CircleAlert size={15} />{item}</li>)}</ul>
                {entry.excludedNote && <p className="inclusion-item__note">{entry.excludedNote}</p>}
              </div>
            </div>
            {entry.note && <p className="inclusion-item__note">{entry.note}</p>}
            {entry.href && <p className="inclusion-item__note"><Link className="text-link" href={entry.href}>{entry.linkLabel || "Explore this journey"}</Link></p>}
          </div>
        </details>)}
      </div>
    </div></section>
    <section className="section section--paper"><div className="shell editorial-grid">
      <div><SectionIntro tag="The golden rule" title="Your final quotation" accent="is the final word." /></div>
      <div className="prose">
        <p>Website descriptions explain the standard package. Your personalized quotation confirms your actual trip. Before payment, every traveler receives a clear breakdown of transport, guide and support team, park fees and permits, accommodation, camping, meals, water, mule support, equipment, optional services and exclusions.</p>
        <p>No guessing. No hidden mandatory costs. No confusion about what you're paying for. You bring the curiosity — we handle the complexity.</p>
      </div>
    </div></section>
    <PlanningCall title="Tell us which journey you're considering." label="Ask about inclusions" />
  </PageShell>;
}
