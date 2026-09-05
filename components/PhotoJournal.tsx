"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const photos = [
  { src: "/images/imet-gogo.jpg", title: "The escarpment opens", location: "Imet Gogo", category: "Landscape", alt: "Rocky Imet Gogo promontory above the Simien valleys", story: "Ridges, cloud and the scale of the valleys make a different composition as the weather changes." },
  { src: "/images/gelada-troop.jpg", title: "Time to observe", location: "Simien highlands", category: "Wildlife", alt: "A troop of wild geladas grazing in highland grass", story: "A troop moves through the grass at its own pace. Watch patiently and let the animals shape the moment." },
  { src: "/images/road-to-simien.jpg", title: "Life along the road", location: "Northern highlands", category: "People", alt: "Women collecting water along the road toward the Simien Mountains", story: "The road connects daily life with the landscape. Photographing people begins with a conversation and permission." },
  { src: "/images/fasil-ghebbi.jpg", title: "The city before the trail", location: "Fasil Ghebbi · Gondar", category: "Culture", alt: "Stone vaults and royal architecture at Fasil Ghebbi", story: "Gondar’s stone architecture is an opening chapter in a photographic journey toward the mountains." },
  { src: "/images/geech-camp.jpg", title: "A mountain night begins", location: "Geech camp", category: "Camping", alt: "Colourful trekking tents at Geech camp in the highlands", story: "Staying in the mountains leaves more time for the evening light, camp details and the next morning’s start." },
  { src: "/images/giant-lobelia.jpg", title: "Look at the details", location: "Simien highlands", category: "Landscape", alt: "Giant lobelias growing across the Simien highlands", story: "Between the great viewpoints, giant lobelias and small changes in the terrain tell their own story." },
];
const categories = ["All", "Landscape", "Wildlife", "People", "Culture", "Camping"];

export function PhotoJournal() {
  const [active, setActive] = useState("All");
  const filtered = photos.filter((photo) => active === "All" || photo.category === active);
  return <div>
    <div className="content-filters" role="group" aria-label="Filter photography journal">{categories.map((category) => <button key={category} type="button" aria-pressed={active === category} onClick={() => setActive(category)}>{category}</button>)}</div>
    <p className="filter-count" role="status">{filtered.length} {filtered.length === 1 ? "photograph" : "photographs"} · {active === "All" ? "The visual story" : active}</p>
    <div className="photo-journal">{filtered.map((photo) => <figure key={photo.src}><div className="image-frame"><Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 720px) 100vw, 45vw" /></div><figcaption><span>{photo.location} · {photo.category}</span><h3>{photo.title}</h3><p>{photo.story}</p></figcaption></figure>)}</div>
    <p className="content-note">Destination photographs illustrate the landscape and experiences. <Link href="/photo-credits">View photographers and image credits.</Link></p>
  </div>;
}
