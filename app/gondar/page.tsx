import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { EditorialHero, FeatureGrid, PageLinks, PlanningCall, SectionIntro, StorySection } from "@/components/Editorial";
import { ExperienceSelector } from "@/components/ExperienceSelector";
import { site, sourceLinks } from "@/lib/site";

export const metadata: Metadata = { title: "Gondar Tours | History, Culture, Food & Local Experiences", description: "Discover Gondar with a local guide: royal heritage, food, coffee, photography, markets, Kosoye countryside and journeys into the Simien Mountains.", alternates: { canonical: "/gondar" } };

export default function GondarPage() {
  return <PageShell lightHeader={false}>
    <EditorialHero eyebrow="Gondar tours & experiences" title="The royal city," accent="through local eyes." lead="Come for the castles. Stay for the stories, coffee, food and everyday life of the city we call home." image={{ src: "/images/fasil-ghebbi.jpg", alt: "Stone arches at the royal fortress of Fasil Ghebbi in Gondar" }} />
    <PageLinks items={[{ label: "Why start here", href: "#why-gondar" }, { label: "The living city", href: "#local-eyes" }, { label: "Choose an experience", href: "#experiences" }, { label: "What to see", href: "#what-to-see" }, { label: "Countryside & running", href: "#countryside" }, { label: "Before you trek Simien", href: "#before-simien" }, { label: "Gondar + Simien", href: "#simien" }]} />
    <section className="section" id="why-gondar"><div className="shell editorial-grid">
      <div><SectionIntro tag="Why start in Gondar" title="The city before" accent="the mountain." /></div>
      <div className="prose">
        <p>Gondar became Ethiopia’s permanent capital under Emperor Fasilides in 1636, and its royal heritage still shapes the city. But Gondar is not only history — it’s coffee in a small café, a conversation in the street, a meal shared around a table, and the last preparation before the road climbs toward Simien.</p>
        <p>For travelers heading to the mountains, Gondar is more than somewhere to pass through. Spend a little time here and Ethiopia starts to feel less like a destination and more like a place.</p>
      </div>
    </div></section>
    <StorySection id="local-eyes" tag="See Gondar through local eyes" title="Walk through history." accent="Then meet the city." image={{ src: "/images/tevan-founder.jpg", alt: "A local guide sharing the landscape and stories of northern Ethiopia", caption: "Local perspective · Gondar" }} paragraphs={[
      "Gondar’s castles and churches tell the story of an imperial capital. At Fasil Ghebbi, royal residences and historic stone buildings reveal the city’s layered past. But there is also a Gondar of opening shops, markets, roasting coffee and everyday conversations.",
      "Ancient walls stand beside modern streets. Traditional meals and religious life sit alongside the routines of a working city. We connect the famous places with the people and stories around them.",
      "Your guide can follow your interest in royal history, architecture, food, coffee, local neighbourhoods, photography or the surrounding countryside. The experience begins with what you are curious about.",
    ]}><a className="source-link" href={sourceLinks.gondarUnesco} target="_blank" rel="noreferrer">Fasil Ghebbi history · UNESCO World Heritage Centre ↗</a></StorySection>
    <section className="section section--paper" id="experiences"><div className="shell"><SectionIntro tag="Choose your way to discover the city" title="Your Gondar," accent="your interests." /><ExperienceSelector /><p className="content-note">Read travelers’ experiences on <a href={site.tripadvisor} target="_blank" rel="noreferrer">our Tripadvisor profile</a>.</p></div></section>
    <section className="section" id="what-to-see"><div className="shell">
      <SectionIntro tag="What to see" title="Know what's" accent="worth your time." />
      <p className="content-lead">You don't need to tick off a list of attractions. We help you focus on the places that fit your time and interests.</p>
      <FeatureGrid items={[
        { title: "Fasil Ghebbi", body: "The Royal Enclosure at the heart of historic Gondar — castles, palaces and churches reflecting centuries of Ethiopian history and architecture." },
        { title: "Fasilides’ Bath", body: "A peaceful site closely associated with Gondar’s royal past, and especially important during the city’s Timkat celebrations." },
        { title: "Debre Birhan Selassie", body: "Known for its distinctive ceiling paintings and its place in Gondar’s religious heritage." },
        { title: "Qusquam", body: "A quieter historic area connected with Empress Mentewab and Gondar’s royal history." },
        { title: "Woleka & Beta Israel history", body: "Gondar’s story also includes the history and heritage of Ethiopia’s Beta Israel community." },
        { title: "Gorgora & Lake Tana", body: "For travelers with more time, Lake Tana and Gorgora offer a different side of northern Ethiopia — water, history and quieter landscapes." },
      ]} />
    </div></section>
    <section className="split-image-story" id="countryside"><div className="image-frame"><Image src="/images/road-to-simien.jpg" alt="Everyday life in the northern Ethiopian highlands" fill sizes="(max-width: 720px) 100vw, 55vw" /></div><div><p className="eyebrow eyebrow--copper">City edge → countryside → local life</p><h2>A different way to move through Gondar.</h2><p>Explore Kosoye’s surrounding countryside at walking pace, or join a local running guide on quieter paths and dirt tracks. Routes follow your ability, interests and the conditions on the day.</p><Link href="/gondar-running-experience" className="text-link">Discover hidden Gondar running</Link></div></section>
    <section className="section section--paper" id="before-simien"><div className="shell">
      <SectionIntro tag="Before you trek Simien" title="Your time in Gondar" accent="is also your preparation." />
      <p className="content-lead">You shouldn’t have to arrive and figure everything out yourself. Before heading toward the mountains, we help you understand the practical side of the journey.</p>
      <FeatureGrid columns={2} items={[
        { title: "What to expect", body: "Walking, weather, altitude, accommodation and mountain conditions, explained honestly before you decide." },
        { title: "What to bring", body: "Clothing, footwear, personal items and anything specific to your trip." },
        { title: "What we provide", body: "Your guide, support team, camping system and other equipment included in your booking." },
        { title: "How it works", body: "Where you meet, when you leave, how transport works and what happens once you reach the mountains." },
      ]} />
      <p className="content-note">Read more on the <Link href="/travel-guide">travel guide</Link>, or see exactly what’s included on each journey in our <Link href="/whats-included">inclusions guide</Link>.</p>
    </div></section>
    <StorySection id="simien" tag="History today. Highlands tomorrow." title="Gondar is where" accent="the journey begins." image={{ src: "/images/imet-gogo.jpg", alt: "The Simien escarpment beyond Gondar", caption: "Gondar → Simien Mountains" }} paragraphs={[
      "Start with the royal city, food and coffee, then follow the road through farmland and Debark into the Simien Mountains. Escarpments, geladas, camping and highland walking become the next chapter.",
      "Our five-day Gondar, Heritage & Simien journey connects city history, Woleka and two mountain nights. Add more time for culture, photography or a longer trek when you want the story to continue.",
      "For a more active five-day adventure, begin with one night in Gondar and follow the classic camping route through Sankaber, Geech, Imet Gogo and Chenek, with three nights in the mountains. Travelers with a summit in mind can continue the story toward Ras Dashen.",
    ]}><Link className="text-link" href="/treks/5-day-gondar-simien">Explore the Royal City & Mountain Adventure</Link><p><Link className="text-link" href="/treks/gondar-heritage-simien">Explore the heritage-focused journey</Link></p><p><Link className="text-link" href="/ras-dashen">Explore the Ras Dashen trek</Link></p></StorySection>
    <section className="section"><div className="shell editorial-grid">
      <div><SectionIntro tag="Travel local" title="Leave something" accent="behind." /></div>
      <div className="prose">
        <p>We believe tourism should create value where the journey actually happens: working with local people, purchasing locally where practical, respecting communities and wildlife, and thinking about the future of the mountains. Local doesn’t mean cheap — it means connected and accountable.</p>
        <Link className="text-link" href="/about#local">Meet Tevan Local</Link>
      </div>
    </div></section>
    <PlanningCall title="Tell us what you want to discover in Gondar." experience="gondar" label="Build my Gondar experience" />
  </PageShell>;
}
