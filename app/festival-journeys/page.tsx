import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { AtAGlance, EditorialHero, FeatureGrid, Itinerary, PageLinks, PlanningCall, SectionIntro, StorySection } from "@/components/Editorial";
import { timkatDays } from "@/lib/itineraries";

export const metadata: Metadata = { title: "Ethiopian Festivals & Simien Journeys | Timkat, Genna & Meskel", description: "Combine Gondar’s living traditions with the Simien Mountains. Explore Timkat, Genna, Meskel and Enkutatash journeys with local cultural guidance.", alternates: { canonical: "/festival-journeys" } };
const festivals = [
  { title: "Timkat & Simien", tag: "6 days / 5 nights", body: "The signature festival journey: Gondar’s Timkat celebration followed by two mountain nights and a full day in Simien.", href: "/plan?experience=timkat-simien", linkLabel: "Plan Timkat & Simien" },
  { title: "Timkat & Ras Dashen", tag: "Suggested 8–10 days", body: "Combine the festival with a demanding multi-day mountain journey toward Ras Dashen. Duration and acclimatization plans are tailored to your experience and the chosen route.", href: "/plan?experience=timkat-ras-dashen", linkLabel: "Plan festival & summit" },
  { title: "Genna & Simien", tag: "Suggested 6–8 days", body: "Experience Ethiopian Christmas and local cultural life before entering the mountains. Choose the places and pace that suit your interests.", href: "/plan?experience=genna-simien", linkLabel: "Plan Genna & Simien" },
  { title: "Meskel & Simien", tag: "September celebration", body: "Connect Meskel’s traditions with Gondar and the highlands. A journey through living culture, local interpretation and mountain landscapes.", href: "/plan?experience=meskel-simien", linkLabel: "Plan Meskel & Simien" },
  { title: "Enkutatash & Simien", tag: "Ethiopian New Year", body: "Build a more intimate local celebration into a journey through Gondar, highland wildlife and mountain trails.", href: "/plan?experience=enkutatash-simien", linkLabel: "Plan New Year in the highlands" },
];

export default function FestivalsPage() {
  return <PageShell>
    <EditorialHero eyebrow="Ethiopian festivals & holiday journeys" title="Living culture." accent="Mountain journeys." lead="Experience Ethiopia’s meaningful celebrations with local interpretation, then follow the road from historic Gondar into the Simien highlands." />
    <PageLinks items={[{ label: "Festival calendar", href: "#calendar" }, { label: "Timkat: day by day", href: "#timkat" }, { label: "Choose a celebration", href: "#celebrations" }, { label: "Cultural guidance", href: "#respect" }]} />
    <section className="section" id="calendar"><div className="shell"><SectionIntro tag="Plan for the right moment" title="Your festival" accent="calendar." />
      <div className="table-scroll"><table className="editorial-table"><caption>Gregorian dates for 2026 and 2027</caption><thead><tr><th scope="col">Celebration</th><th scope="col">2026</th><th scope="col">2027</th></tr></thead><tbody>
        <tr><th scope="row">Genna · Ethiopian Christmas</th><td>7 January</td><td>7 January</td></tr>
        <tr><th scope="row">Timkat · Ethiopian Epiphany</th><td>19 January</td><td>19 January</td></tr>
        <tr><th scope="row">Enkutatash · Ethiopian New Year</th><td>11 September</td><td>12 September</td></tr>
        <tr><th scope="row">Meskel</th><td>27 September</td><td>28 September</td></tr>
      </tbody></table></div>
      <p className="content-note">Calendar dates: <a href="https://www.timeanddate.com/holidays/ethiopia/2026" target="_blank" rel="noreferrer">2026</a> and <a href="https://www.timeanddate.com/holidays/ethiopia/2027" target="_blank" rel="noreferrer">2027</a>. Ceremony times, access and local arrangements are confirmed closer to departure. Plan to arrive before the main celebration.</p>
    </div></section>
    <section className="section section--paper" id="timkat"><div className="shell"><SectionIntro tag="Our signature festival journey" title="Timkat in Gondar." accent="Then the mountains." /><p className="content-lead">A six-day outline with three nights in Gondar and two in Simien. For the January 2027 celebration, the main Timkat day falls on 19 January; Ketera is the eve of the festival.</p><Itinerary days={timkatDays} /></div></section>
    <AtAGlance facts={[{ label: "Journey", value: "6 days / 5 nights" }, { label: "Start & finish", value: "Gondar" }, { label: "City stay", value: "3 nights" }, { label: "Mountain stay", value: "2 nights" }, { label: "Best for", value: "Culture, photography & mountain discovery" }, { label: "Style", value: "Private or small group" }]} />
    <section className="section" id="celebrations"><div className="shell"><SectionIntro tag="Festival → Gondar → Simien" title="Choose your" accent="celebration." /><FeatureGrid items={festivals} /></div></section>
    <StorySection id="respect" tag="Our festival philosophy" title="Understand what" accent="you are witnessing." paper paragraphs={[
      "These are living religious and cultural events. Your guide explains what is happening, why it matters, where visitors may stand and what should be respected. Follow local instructions and ask before photographing people.",
      "Couples, families, photographers and cultural travelers can each experience the celebration differently. Tell us your comfort preferences, interest in Orthodox traditions, dates and walking ability so the festival and mountain sections work together.",
      "Festivals follow community life and local arrangements. The final itinerary accounts for ceremonial schedules, access, roads and conditions at the time of your visit.",
    ]} />
    <PlanningCall title="Which celebration would you like to experience?" experience="festivals" label="Plan my festival journey" />
  </PageShell>;
}
