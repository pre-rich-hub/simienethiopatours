"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "@/components/Icon";
import { gondarExperiences } from "@/lib/experiences";

const categories = ["All", "History", "Food", "Coffee", "Photography", "Local life", "Culture", "Gondar + Simien"];

// Replace these paths as the final Gondar photography becomes available.
const experiencePhotography = {
  "royal-gondar": { src: "/images/fasil-ghebbi.jpg", alt: "Stone arches and royal architecture at Fasil Ghebbi", caption: "Fasil Ghebbi · Royal Gondar" },
  "local-gondar": { src: "/images/tevan-founder.jpg", alt: "A local Gondar guide in the northern Ethiopian highlands", caption: "Gondar · Through local eyes" },
  "food-coffee": { src: "/images/road-to-simien.jpg", alt: "Everyday life around Gondar and the northern highlands", caption: "Food & coffee · Shared locally" },
  "gondar-photo": { src: "/images/fasil-ghebbi.jpg", alt: "Historic stone details for a Gondar photography walk", caption: "Gondar · Light and architecture" },
  "history-culture": { src: "/images/fasil-ghebbi.jpg", alt: "Historic royal architecture in Gondar", caption: "Royal city · History and culture" },
  "market-life": { src: "/images/road-to-simien.jpg", alt: "Daily life connecting Gondar with the surrounding highlands", caption: "Gondar · Market and local life" },
  "kosoye": { src: "/images/simien-panorama.jpg", alt: "Open highland country beyond Gondar", caption: "Kosoye · Countryside and views" },
  "gondar-heritage-simien": { src: "/images/imet-gogo.jpg", alt: "The Simien escarpment reached from Gondar", caption: "Gondar to Simien · One journey" },
} as const;

export function ExperienceSelector() {
  const [active, setActive] = useState("All");
  const filtered = gondarExperiences.filter((item) => active === "All" || (item.categories as readonly string[]).includes(active));
  return <div className="gondar-experience-selector">
    <div className="content-filters" role="group" aria-label="Filter Gondar experiences">{categories.map((category) => <button key={category} type="button" aria-pressed={active === category} onClick={() => setActive(category)}>{category}</button>)}</div>
    <p className="filter-count" role="status">{filtered.length} {filtered.length === 1 ? "experience" : "experiences"}{active !== "All" ? ` · ${active}` : " to make your own"}</p>
    <div className="content-grid content-grid--2">{filtered.map((item, index) => {
      const photo = experiencePhotography[item.id];
      return <article className="gondar-experience-card" key={item.id}>
        <div className="gondar-experience-card__image">
          <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 720px) 100vw, 50vw" />
          <span className="gondar-experience-card__shade" />
          <span className="gondar-card__number">{String(index + 1).padStart(2, "0")}</span>
          <span className="gondar-experience-card__caption">{photo.caption}</span>
        </div>
        <div className="gondar-experience-card__body">
          <div className="gondar-card__header"><span className="eyebrow eyebrow--copper">{item.categories.join(" · ")}</span></div>
          <h3>{item.title}</h3><p>{item.body}</p>
          <dl className="experience-facts"><div><dt>Time</dt><dd>{item.id === "gondar-heritage-simien" ? "5-day starting itinerary" : "Tailored to your available time"}</dd></div><div><dt>Style</dt><dd>Private or small group · Starts in Gondar</dd></div><div><dt>Best for</dt><dd>{item.fit}</dd></div></dl>
          <Link className="text-link" href={"href" in item ? item.href : `/plan?experience=${item.id}`}>{"href" in item ? "Read the five-day itinerary" : "Request this experience"}<ArrowUpRight /></Link>
        </div>
      </article>;
    })}</div>
    <p className="content-note">Your quote confirms guiding, transport, site entry, food and any other inclusions for the experience you choose.</p>
  </div>;
}
