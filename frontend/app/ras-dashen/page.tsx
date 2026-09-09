import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { AtAGlance, EditorialHero, Faq, FeatureGrid, PageLinks, PlanningCall, SectionIntro, StorySection } from "@/components/Editorial";
import { sourceLinks } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ras Dashen Trek | Ethiopia's Highest Mountain",
  description: "Trek Ras Dashen, Ethiopia's highest mountain, through the Simien escarpments, high passes and remote valleys. Honest guidance on difficulty, altitude and what to expect.",
  alternates: { canonical: "/ras-dashen" },
};

const packing = {
  clothing: ["Warm base layer", "Fleece or insulating layer", "Waterproof jacket", "Hiking trousers", "Warm hat and gloves", "Hiking socks", "Warm evening clothing"],
  footwear: ["Proper hiking boots, worn in before the trip", "Spare socks", "Camp shoes"],
  personal: ["Sunscreen and sunglasses", "Headlamp", "Personal medication", "Reusable water bottle", "Power bank", "Personal toiletries"],
  optional: ["Trekking poles", "Binoculars", "Camera", "Extra snacks", "Lightweight dry bag"],
};

const faqItems = [
  { q: "Is Ras Dashen the highest mountain in Ethiopia?", a: "Yes. Ras Dashen, also written Ras Dejen, is the highest peak in Ethiopia and the highest point in the Simien Mountains." },
  { q: "How high is Ras Dashen?", a: "Approximately 4,500 metres above sea level. Published elevations vary slightly between sources, so we say approximately rather than claim one exact number." },
  { q: "Do I need technical climbing experience?", a: "No. The standard trekking route does not normally require technical mountaineering skills, but it is a demanding high-altitude trek." },
  { q: "How many days do I need?", a: "Routes are commonly planned from around 6 to 10 days, depending on whether you want a summit-focused trip or a longer crossing toward Adi Arkay. We confirm the right length with you before booking." },
  { q: "Can beginners trek Ras Dashen?", a: "Some active first-time high-altitude trekkers manage it with the right preparation. Tell us your fitness and hiking experience and we'll be honest about whether it's a good fit." },
  { q: "Will I see wildlife?", a: "There are good opportunities to see geladas and Walia ibex, and a smaller chance of Ethiopian wolves. Sightings are never guaranteed." },
  { q: "What if I can't reach the summit?", a: "Weather, trail conditions and altitude can all affect a summit attempt. If continuing isn't safe, your guide may recommend turning back. That's not a failure — your safety comes first, and the mountain will still be there." },
  { q: "Do you organize the whole trip from Gondar?", a: "Yes. Depending on your selected journey, we arrange local transportation, the trekking team and mountain logistics from Gondar." },
];

export default function RasDashenPage() {
  return <PageShell lightHeader={false}>
    <EditorialHero
      eyebrow="Ethiopia's highest peak"
      title="You don't just climb Ras Dashen."
      accent="You cross the Simien Mountains."
      lead="Ras Dashen rises to approximately 4,500 metres above sea level, the highest point in Ethiopia. Reaching it means walking through the same escarpments, high passes and remote valleys that define the whole Simien range — the summit is one moment in a much longer journey."
      image={{ src: "/images/giant-lobelia.jpg", alt: "Giant lobelias across the high-altitude landscape on the approach to Ras Dashen" }}
      parent={{ label: "Simien", href: "/simien-mountains" }}
    />
    <PageLinks items={[
      { label: "Why Ras Dashen", href: "#why" },
      { label: "At a glance", href: "#glance" },
      { label: "The route", href: "#route" },
      { label: "Difficulty & altitude", href: "#difficulty" },
      { label: "Packing", href: "#packing" },
      { label: "FAQ", href: "#faq" },
    ]} />

    <StorySection id="why" tag="Why Ras Dashen" title="More than" accent="a summit." paragraphs={[
      "For many travelers, reaching Ethiopia's highest point is reason enough. But the achievement means more once you understand the ground you crossed to get there: high plateaus, dramatic escarpments, deep valleys and remote communities, not just a single peak.",
      "The landscape changes constantly along the way — from open escarpment to steep passes, remote settlements and lower valleys. No two days on the trail look the same.",
      "The Simien Mountains are home to geladas, Walia ibex and, more rarely, Ethiopian wolves. We never promise wildlife. We create the conditions to observe it responsibly, at a respectful distance, and let the mountain decide the rest.",
      "This is also someone's home before it is anyone's holiday. People farm, travel and work throughout the highlands you pass through — a longer journey brings you closer to that life, and it's worth traveling through it with respect.",
    ]}>
      <p>Ras Dashen is not an easy walk. The difficulty comes from altitude, long walking days, steep ground, cold and changing weather, and cumulative fatigue — not technical climbing. You don't need to be a professional mountaineer, but you should take the mountain seriously.</p>
    </StorySection>

    <section className="section section--paper" id="glance"><div className="shell">
      <SectionIntro tag="Ras Dashen at a glance" title="The essentials," accent="honestly stated." />
      <AtAGlance facts={[
        { label: "Location", value: "Simien Mountains, northern Ethiopia" },
        { label: "Elevation", value: "Approximately 4,500 m" },
        { label: "Gateway", value: "Gondar → Debark" },
        { label: "Difficulty", value: "Challenging" },
        { label: "Technical climbing", value: "Not normally required" },
        { label: "Best for", value: "Active, experienced hikers" },
      ]} />
    </div></section>

    <section className="section" id="route"><div className="shell">
      <SectionIntro tag="The route" title="A journey through" accent="a mountain system." />
      <p className="content-lead">A classic approach moves through the same stages as our Simien treks, then continues beyond them toward the summit:</p>
      <ol className="route-sequence" aria-label="Ras Dashen route outline">
        <li>Gondar</li><li>Debark</li><li>Sankaber</li><li>Geech</li><li>Imet Gogo</li><li>Chenek</li><li>Bwahit Pass</li><li>Ambiko</li><li>Ras Dashen</li>
      </ol>
      <p className="content-note">On selected longer itineraries, the journey continues beyond the summit toward Sona, Mekarebya, Mulit and Adi Arkay — a full crossing of the range rather than a there-and-back summit trip. The exact route, camps and daily distances are confirmed for current trail and weather conditions before departure.</p>
    </div></section>

    <section className="section section--paper" id="difficulty"><div className="shell editorial-grid">
      <div>
        <SectionIntro tag="Difficulty & altitude" title="Take the mountain" accent="seriously." />
        <div className="prose">
          <p>The standard route doesn't normally require technical mountaineering skills, but it can be physically demanding. Some days are long, some climbs are steep, and altitude adds a challenge that fitness alone doesn't solve. Summit day is usually the hardest of the trek.</p>
          <p>At altitude, conditions can change quickly — cold mornings, strong sun, wind, cloud and rain are all possible within the same day. Pace, hydration, rest and gradual acclimatization matter more than speed. If you feel unwell, tell your guide; don't hide symptoms to try to reach the summit.</p>
        </div>
      </div>
      <div className="prose">
        <h2 className="content-subtitle">If you can't reach the summit</h2>
        <p>Weather, trail conditions, altitude or fatigue can all affect a summit attempt. The summit is never guaranteed, and if conditions make continuing unsafe, the responsible decision may be to turn around. We don't consider that a failure — the mountain will always be there, and your safety comes first.</p>
        <p>Before departure, we walk you through the route, altitude, weather, fitness expectations, equipment and food, so summit day isn't the first time you're thinking about any of it.</p>
      </div>
    </div></section>

    <section className="section" id="packing"><div className="shell">
      <SectionIntro tag="What to pack" title="Prepare for" accent="a mountain that changes." />
      <div className="editorial-grid">
        <div className="prose"><h3 className="content-subtitle">Clothing</h3><ul className="editorial-list">{packing.clothing.map((item) => <li key={item}>{item}</li>)}</ul>
          <h3 className="content-subtitle">Footwear</h3><ul className="editorial-list">{packing.footwear.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div className="prose"><h3 className="content-subtitle">Personal</h3><ul className="editorial-list">{packing.personal.map((item) => <li key={item}>{item}</li>)}</ul>
          <h3 className="content-subtitle">Optional</h3><ul className="editorial-list">{packing.optional.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </div>
      <p className="content-note">After booking, we provide a trip-specific preparation guide and confirm exactly what's included so you know what you still need to bring. Learn more about the park's conservation importance in the <a href={sourceLinks.simienUnesco} target="_blank" rel="noreferrer">UNESCO profile</a>.</p>
    </div></section>

    <section className="section section--paper" id="faq"><div className="shell">
      <SectionIntro tag="Ras Dashen FAQ" title="Common" accent="questions." />
      <Faq items={faqItems} />
    </div></section>

    <section className="section"><div className="shell">
      <SectionIntro tag="Choose your Ras Dashen trek" title="Two starting points," accent="one summit." />
      <p className="content-lead">Both journeys are planned around your dates, fitness and preferred pace — think of these as starting points for a conversation, not fixed packages.</p>
      <FeatureGrid columns={2} items={[
        { title: "Ras Dashen Challenge", tag: "Summit-focused outline", body: "A demanding approach and summit attempt via Sankaber, Geech, Chenek and Ambiko, with additional acclimatization and return days agreed before booking.", href: "/treks/ras-dashen-challenge", linkLabel: "Explore the Ras Dashen Challenge" },
        { title: "Full Simien & Ras Dashen", tag: "10 days · 9 nights", body: "Our longest journey: the classic escarpment, a Ras Dashen summit attempt and a full crossing through the quieter valleys toward Adi Arkay.", href: "/treks/10-day-simien-ras-dashen", linkLabel: "Explore the 10-day expedition" },
      ]} />
    </div></section>

    <PlanningCall title="Tell us about your Ras Dashen trek." experience="ras-dashen" label="Plan my Ras Dashen trek" />
  </PageShell>;
}
