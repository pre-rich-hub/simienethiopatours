import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Compass, Map, Mountain, Route, TentTree } from "@/components/Icon";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SectionIntro } from "@/components/Editorial";
import { ExperiencePhotoCards } from "@/components/ExperiencePhotoCards";
import { ReviewsShowcase } from "@/components/ReviewsShowcase";
import { DurationSelector } from "@/components/DurationSelector";
import { journeys, site, sourceLinks } from "@/lib/site";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <section className="hero">
          <div className="hero__media">
            <Image src="/images/imet-gogo.jpg" alt="The high plateau and dramatic escarpment at Imet Gogo in the Simien Mountains" fill priority sizes="100vw" />
            <div className="hero__veil" /><div className="hero__grain" />
          </div>
          <div className="hero__content">
            <h1 className="display">Your local gateway to the <em>Simien Mountains.</em></h1>
            <p className="hero__lead">Discover Gondar. Explore Simien. Travel deeper with a local team that knows the mountain and handles the details.</p>
            <div className="hero__actions">
              <Link className="button button--copper" href="/simien-mountains">Explore the Simien <ArrowUpRight size={16} /></Link>
            </div>
          </div>
        </section>

        <section className="home-trust" aria-label="Trust markers">
          <div className="shell">
            <span><CheckCircle2 />100% locally owned</span>
            <span><Map />Based in Gondar</span>
            <span><Mountain />Simien specialists</span>
            <span><Compass />Certified local guide</span>
            <a href={sourceLinks.operatorAbout} target="_blank" rel="noreferrer">Verified operator details <ArrowUpRight /></a>
          </div>
        </section>

        <section className="section journey-arc" id="journey">
          <div className="shell intro-grid">
            <div><p className="eyebrow eyebrow--copper">The way north</p><h2 className="section-title">The journey changes <em>before your eyes.</em></h2></div>
            <p className="lead">Gondar is the cultural and practical doorway. Then the city loosens its hold: farmland, villages, climbing road, Debark—and finally a horizon cut open by the Simien escarpment.</p>
          </div>
          <div className="journey-arc__visual shell">
            <div className="image-frame journey-arc__main"><Image src="/images/road-to-simien.jpg" alt="Highland life on the road north from Gondar toward the Simien Mountains" fill sizes="(max-width: 720px) 100vw, 65vw" /><span className="image-caption">Road north · Amhara highlands</span></div>
            <div className="journey-arc__aside">
              <div className="journey-arc__line" aria-hidden="true"><i /><i /><i /><i /></div>
              <ol><li><span>01</span>Gondar</li><li><span>02</span>Road north</li><li><span>03</span>Debark</li><li><span>04</span>Escarpment</li></ol>
              <p>City → farmland → highlands → trail</p>
            </div>
          </div>
        </section>

        <section className="section section--paper discover-section">
          <div className="shell discover-section__heading">
            <div><p className="eyebrow eyebrow--copper">Find your horizon</p><h2 className="section-title">Where will the mountains <em>take you?</em></h2></div>
            <p className="lead">Not a checklist. Three different ways to feel the scale of the landscape.</p>
          </div>
          <div className="discover-grid shell">
            <Link href="/simien-mountains#imet-gogo" className="discover-card discover-card--tall">
              <Image src="/images/imet-gogo.jpg" alt="Rocky promontory at Imet Gogo above the Simien escarpment" fill sizes="(max-width: 720px) 100vw, 43vw" />
              <div>
                <span>Simien icon</span><h3>Imet Gogo</h3><p>Walk into the view.</p>
                <div className="discover-card__details"><div><p>Walk from Geech to a dramatic viewpoint overlooking the Simien escarpments, deep valleys and distant ridges. Take time to pause and enjoy the panorama.</p></div></div>
                <span className="discover-card__cta">Explore more <ArrowUpRight /></span>
              </div>
            </Link>
            <Link href="/simien-mountains#wildlife" className="discover-card">
              <Image src="/images/gelada-troop.jpg" alt="A wild troop of geladas grazing in the Simien Mountains" fill sizes="(max-width: 720px) 100vw, 28vw" />
              <div>
                <span>Wildlife</span><h3>Gelada country</h3><p>Observe. Never stage.</p>
                <div className="discover-card__details"><div><p>Watch wild geladas graze and interact on the highland grasslands. Explore with a local guide, giving each troop space to go about its day.</p></div></div>
                <span className="discover-card__cta">Explore more <ArrowUpRight /></span>
              </div>
            </Link>
            <Link href="/treks#ras-dashen" className="discover-card">
              <Image src="/images/giant-lobelia.jpg" alt="Giant lobelias across the high Afroalpine landscape of the Simien Mountains" fill sizes="(max-width: 720px) 100vw, 28vw" />
              <div>
                <span>High country</span><h3>Ras Dashen</h3><p>The summit journey.</p>
                <div className="discover-card__details"><div><p>Journey through giant-lobelia country and remote mountain landscapes on a demanding multi-day trek, with time to acclimatize before the summit approach.</p></div></div>
                <span className="discover-card__cta">Explore more <ArrowUpRight /></span>
              </div>
            </Link>
          </div>
        </section>

        <section className="section time-section" id="journey-collections">
          <div className="shell time-section__intro">
            <p className="eyebrow eyebrow--copper">Choose with clarity</p>
            <h2 className="section-title">How do you want to <em>meet the mountains?</em></h2>
            <p className="lead">From a first encounter to a full highland expedition, begin with the experience that feels like yours. Every journey is privately refined around your time and pace.</p>
          </div>
          <div className="shell"><DurationSelector /></div>
        </section>

        <section className="section featured-journeys">
          <div className="shell featured-journeys__header">
            <div><p className="eyebrow eyebrow--copper">Signature journeys</p><h2 className="section-title">Possibilities, <em>not packages.</em></h2></div>
            <Link className="text-link" href="/treks">View every journey <ArrowUpRight /></Link>
          </div>
          <div className="shell journey-mosaic">
            {journeys.slice(1, 4).map((journey, index) => (
              <Link id={journey.slug} key={journey.slug} className={`journey-tile journey-tile--${index + 1}`} href={`/treks#${journey.slug}`}>
                <Image src={journey.image} alt={`Landscape associated with ${journey.title}`} fill sizes="(max-width: 720px) 100vw, 45vw" />
                <div className="journey-tile__overlay"><span>{journey.duration} · {journey.difficulty}</span><h3>{journey.title}</h3><p>{journey.summary}</p><b>Discover <ArrowUpRight /></b></div>
              </Link>
            ))}
          </div>
        </section>

        <section className="section reviews-home" id="reviews">
          <div className="shell">
            <div className="reviews-home__heading"><SectionIntro tag="Traveler reviews" title="Their journeys." accent="In their own words." /><div><p className="lead">Independent feedback from travelers who met Tevan in Gondar and experienced northern Ethiopia with local guidance.</p><Link className="text-link" href="/reviews">See all traveler reviews <ArrowUpRight /></Link></div></div>
            <ReviewsShowcase />
          </div>
        </section>

        <section className="section tevan-section">
          <div className="shell tevan-section__grid">
            <div className="tevan-section__portrait image-frame"><Image src="/images/tevan-founder.jpg" alt="Tesema ‘Tevan’ Mulualem on a trail in the Simien Mountains" fill sizes="(max-width: 720px) 100vw, 42vw" /><span className="image-caption">Tevan · Founder & local guide</span></div>
            <div className="tevan-section__copy"><p className="eyebrow eyebrow--copper">The mountains I call home</p><blockquote>“Knowing a place is different from simply knowing the way through it.”</blockquote><p>My name is Tesema “Tevan” Mulualem. I built Gondar Simien Tours around a simple idea: help people experience the place I know—not just visit it. That means honest routes, real preparation and space for the moments no itinerary can schedule.</p><div className="tevan-section__links"><Link className="button button--dark" href="/about">Read Tevan’s story</Link><Link className="text-link" href="/plan">Plan with Tevan <ArrowUpRight /></Link></div><div className="credential"><CheckCircle2 /><span>Nationally certified professional guide<br/><a href={sourceLinks.operatorAbout} target="_blank" rel="noreferrer">View verified credentials</a></span></div></div>
          </div>
        </section>

        <section className="section proof-section section--paper">
          <div className="shell proof-section__heading"><p className="eyebrow eyebrow--copper">Proof, not promises</p><h2 className="section-title">If we say it, <em>we should show it.</em></h2></div>
          <div className="shell proof-grid">
            <div><TentTree /><h3>Prepared behind the scenes</h3><p>Guides, scouts, cooks, drivers, mule handlers, food and camp equipment coordinated before you reach the trail.</p></div>
            <div><Compass /><h3>First-hand guidance</h3><p>Advice shaped around your time, ability and interests—not an itinerary pushed onto every traveler.</p></div>
            <div><Mountain /><h3>Respect for the mountain</h3><p>Altitude, weather and wildlife are treated honestly. The route can flex when real conditions require judgment.</p></div>
          </div>
        </section>

        <section className="section section--dark trail-proof">
          <div className="shell trail-proof__grid">
            <div className="trail-proof__copy"><p className="eyebrow eyebrow--copper">Route intelligence</p><h2 className="section-title">We walk the trails <em>we sell.</em></h2><p className="lead lead--light">Good planning is honest about what is known, what changes, and what still needs checking. Route decisions account for walking comfort, altitude, weather and current local conditions.</p><Link className="text-link text-link--light" href="/travel-guide">Read the field notes <ArrowUpRight /></Link></div>
            <div className="route-card">
              <div className="route-card__top"><span><Route />Simien Essential</span><b>Field knowledge</b></div>
              <div className="route-card__map" aria-hidden="true"><svg viewBox="0 0 500 240"><path d="M21 190C83 158 92 98 153 121s73 83 130 43 94-134 193-103"/><circle cx="21" cy="190" r="6"/><circle cx="153" cy="121" r="6"/><circle cx="283" cy="164" r="6"/><circle cx="476" cy="61" r="6"/></svg><span className="pin pin--a">Gondar</span><span className="pin pin--b">Sankaber</span><span className="pin pin--c">Geech</span><span className="pin pin--d">Imet Gogo</span></div>
              <dl><div><dt>Walking time</dt><dd>Route dependent</dd></div><div><dt>Trail condition</dt><dd>Checked before departure</dd></div><div><dt>GPS data</dt><dd>Survey in progress</dd></div></dl>
              <small>No invented kilometre or elevation figures. Final route confirmed for current conditions.</small>
            </div>
          </div>
        </section>

        <section className="section section--paper"><div className="shell"><SectionIntro tag="Beyond the trail" title="More ways to" accent="travel deeper." /><ExperiencePhotoCards items={[
          { title: "Living culture & festivals", tag: "Celebrate · Understand · Connect", body: "Connect Gondar’s celebrations with the Simien Mountains, local stories and time to understand what you are seeing.", href: "/festival-journeys", image: { src: "/images/fasil-ghebbi.jpg", alt: "Gondar's historic royal city, the setting for cultural journeys", caption: "Gondar · Living culture" } },
          { title: "Running & photography", tag: "Move · Observe · Create", body: "Find quieter Gondar paths or build a mountain journey around the photographs you hope to make.", href: "/beyond-the-trail", image: { src: "/images/simien-panorama.jpg", alt: "Open highland landscapes for active and photography journeys", caption: "Highland paths · Changing light" } },
          { title: "Your stay, thoughtfully planned", tag: "Gondar · Lodge · Camp", body: "Bring together city hotels, mountain lodges and camping around the experience you want.", href: "/where-to-stay-gondar-simien", image: { src: "/images/geech-camp.jpg", alt: "Tents at Geech camp in the Simien Mountains", caption: "Mountain nights · Geech" } },
        ]} /></div></section>
        <section className="final-call">
          <Image src="/images/simien-panorama.jpg" alt="A wide panorama of the Simien Mountains escarpment" fill sizes="100vw" />
          <div className="final-call__veil" />
          <div className="final-call__content shell"><p className="eyebrow">You bring the curiosity. We handle the complexity.</p><h2>Start with one simple question.</h2><p>Tell us how much time you have—or that you have no idea yet. That is enough to begin.</p><div><Link className="button button--copper" href="/plan">Plan my journey <ArrowUpRight /></Link><a className="button button--outline" href={site.whatsapp} target="_blank" rel="noreferrer">Chat on WhatsApp</a></div></div>
        </section>
      </main>
      <Footer />
    </>
  );
}
