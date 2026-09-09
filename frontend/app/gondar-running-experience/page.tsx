import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { AtAGlance, EditorialHero, FeatureGrid, PageLinks, PlanningCall, SectionIntro, StorySection } from "@/components/Editorial";
import { ExperiencePhotoCards } from "@/components/ExperiencePhotoCards";

export const metadata: Metadata = { title: "Gondar Running Experience | Hidden Trails & Local Routes", description: "Run or walk with a local guide on quieter Gondar paths, dirt tracks and countryside routes. Easy, active and trail options adapted to your pace.", alternates: { canonical: "/gondar-running-experience" } };

export default function RunningPage() {
  return <PageShell lightHeader={false}>
    <EditorialHero eyebrow="Gondar hidden running experience" title="Run Gondar." accent="Discover another side." lead="The city is your starting line. The countryside is your trail. Follow quieter paths, farmland and highland views with a local guide who knows the way." image={{ src: "/images/road-to-simien.jpg", alt: "A quiet road through the northern Ethiopian highlands outside Gondar" }} />
    <AtAGlance facts={[{ label: "Start & finish", value: "Gondar · meeting point agreed" }, { label: "Style", value: "Private or small group" }, { label: "Pace", value: "Run or walk at your level" }, { label: "Route", value: "Selected for the day" }, { label: "Distance & time", value: "Agreed before the run" }, { label: "Surfaces", value: "Local paths, dirt tracks & mixed terrain" }]} />
    <PageLinks items={[{ label: "Choose your pace", href: "#pace" }, { label: "The experience", href: "#experience" }, { label: "What to bring", href: "#preparation" }]} />
    <StorySection tag="From city to countryside" title="Watch Gondar change" accent="as you move." image={{ src: "/images/simien-panorama.jpg", alt: "Open highland country beyond Gondar", caption: "City edge → Countryside → Highland view" }} paragraphs={[
      "The traffic becomes quieter. Buildings become fewer. The road becomes a track, and the track leads into the countryside. You may pass farmland, small neighbourhoods, livestock and people moving between villages.",
      "Your guide brings more than directions: the story of a village, the connection between the fields and the city, a viewpoint worth pausing for. You concentrate on the movement; we choose and explain the route.",
      "There is no race and no pressure to keep someone else’s pace. We discuss your time, fitness, preferred distance, terrain and interests before choosing the day’s route.",
    ]} />
    <section className="section section--paper" id="pace"><div className="shell"><SectionIntro tag="Your pace. Your experience." title="Choose the run" accent="that feels like you." /><ExperiencePhotoCards items={[
      { title: "Easy", tag: "Shorter · Gentler", body: "A relaxed run or walk with room for sightseeing, local stories and pauses. A good starting point when you want to move without chasing a workout.", href: "/plan?experience=gondar-running", linkLabel: "Plan an easy outing", image: { src: "/images/road-to-simien.jpg", alt: "A gentler highland route outside Gondar", caption: "Relaxed pace · Room to pause" } },
      { title: "Active", tag: "Moderate · Mixed terrain", body: "A more sustained run through local paths and countryside, with distance and effort agreed around your regular running experience.", href: "/plan?experience=gondar-running", linkLabel: "Plan an active run", image: { src: "/images/simien-panorama.jpg", alt: "Open highland terrain and distant ridges", caption: "Mixed terrain · Steady movement" } },
      { title: "Trail", tag: "Longer · More elevation", body: "Hills, natural surfaces and a greater challenge for experienced runners. Terrain, elevation and the available time shape the route.", href: "/plan?experience=gondar-running", linkLabel: "Plan a trail run", image: { src: "/images/imet-gogo.jpg", alt: "Rugged highland terrain in northern Ethiopia", caption: "Natural surface · Greater challenge" } },
    ]} /><p className="content-note">Routes vary with weather, visibility, traffic, terrain and local conditions. Quieter alternatives are chosen where practical; the experience is not guaranteed to be entirely traffic-free.</p></div></section>
    <section className="section" id="experience"><div className="shell"><SectionIntro tag="A morning in motion" title="Run. Discover." accent="Slow down for coffee." /><ol className="route-sequence" aria-label="Running experience outline"><li>Meet & discuss the route</li><li>Warm up</li><li>Follow local paths</li><li>Pause for views & stories</li><li>Return to Gondar</li><li>Coffee or breakfast by arrangement</li></ol><FeatureGrid items={[
      { title: "Run + coffee", body: "Finish with a traditional coffee experience or local breakfast when it fits the route. Leave time to sit and talk after moving through the highlands." },
      { title: "Run + culture", body: "Learn about the communities along the way. Say hello, listen, respect people’s routines and ask before stopping to photograph them." },
      { title: "Run + photography", body: "Bring a small camera or phone for landscape, views and moments beyond the main monuments. Stop when the light or a story catches your attention." },
    ]} /></div></section>
    <section className="section section--paper" id="preparation"><div className="shell editorial-grid"><SectionIntro tag="Before we set off" title="Bring curiosity." accent="And the right shoes." /><div className="prose"><p>Wear shoes suitable for both dirt paths and paved surfaces. Pack for the weather and the agreed length of the outing.</p><ul className="editorial-list"><li>Comfortable running shoes and lightweight clothing</li><li>Water and sun protection</li><li>A small phone or camera</li><li>A light jacket when conditions call for it</li><li>Any personal medication you normally need</li></ul><p>Tell your guide about your regular running, preferred pace and any concerns. If conditions change, the route changes with them.</p><Link className="text-link" href="/gondar">Explore more of Gondar</Link></div></div></section>
    <PlanningCall title="Make your morning part of the adventure." experience="gondar-running" label="Plan my run" />
  </PageShell>;
}
