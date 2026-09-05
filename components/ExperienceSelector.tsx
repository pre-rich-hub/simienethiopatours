"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "@/components/Icon";
import { gondarExperiences } from "@/lib/experiences";

const categories = ["All", "History", "Food", "Coffee", "Photography", "Local life", "Culture", "Gondar + Simien"];

export function ExperienceSelector() {
  const [active, setActive] = useState("All");
  const filtered = gondarExperiences.filter((item) => active === "All" || (item.categories as readonly string[]).includes(active));
  return <div>
    <div className="content-filters" role="group" aria-label="Filter Gondar experiences">{categories.map((category) => <button key={category} type="button" aria-pressed={active === category} onClick={() => setActive(category)}>{category}</button>)}</div>
    <p className="filter-count" role="status">{filtered.length} {filtered.length === 1 ? "experience" : "experiences"}{active !== "All" ? ` · ${active}` : " to make your own"}</p>
    <div className="content-grid content-grid--2">{filtered.map((item) => <article className="content-card" key={item.id}>
      <span className="eyebrow eyebrow--copper">{item.categories.join(" · ")}</span><h3>{item.title}</h3><p>{item.body}</p>
      <dl className="experience-facts"><div><dt>Time</dt><dd>{item.id === "gondar-heritage-simien" ? "5-day starting itinerary" : "Tailored to your available time"}</dd></div><div><dt>Style</dt><dd>Private or small group · Starts in Gondar</dd></div><div><dt>Best for</dt><dd>{item.fit}</dd></div></dl>
      <Link className="text-link" href={"href" in item ? item.href : `/plan?experience=${item.id}`}>{"href" in item ? "Read the five-day itinerary" : "Request this experience"}<ArrowUpRight /></Link>
    </article>)}</div>
    <p className="content-note">Your quote confirms guiding, transport, site entry, food and any other inclusions for the experience you choose.</p>
  </div>;
}
