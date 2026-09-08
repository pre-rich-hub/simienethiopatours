"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, X } from "@/components/Icon";

const photographs = [
  { src: "/images/imet-gogo.jpg", title: "At the edge of forever", location: "Imet Gogo", category: "Landscapes", alt: "Rocky Imet Gogo promontory above the deep Simien valleys", story: "Ridges unfold beyond the escarpment. At Imet Gogo, the scale of the mountains invites you to stop walking and simply look.", href: "/simien-mountains", link: "Discover the Simien" },
  { src: "/images/gelada-troop.jpg", title: "In wild company", location: "Simien highlands", category: "Wildlife", alt: "Wild geladas gathered in the grass of the Simien highlands", story: "A troop grazes, rests and moves through the highland grass. Keep a respectful distance and let their everyday rhythm set the pace.", href: "/simien-mountains", link: "Meet the mountains" },
  { src: "/images/fasil-ghebbi.jpg", title: "Stories set in stone", location: "Fasil Ghebbi · Gondar", category: "Culture & life", alt: "Stone vaults and royal architecture at Fasil Ghebbi in Gondar", story: "Stone passageways and royal architecture hold another side of the highlands. Gondar gives the journey a beginning long before the first trail.", href: "/gondar", link: "Explore Gondar" },
  { src: "/images/geech-camp.jpg", title: "Room to slow down", location: "Geech camp", category: "On the trail", alt: "Colourful trekking tents pitched at Geech camp in the Simien Mountains", story: "A tent, open country and time to settle in. Mountain camps bring the small moments between walking days into view.", href: "/treks", link: "Find your trek" },
  { src: "/images/road-to-simien.jpg", title: "The life between", location: "The road to Simien", category: "Culture & life", alt: "Women collecting water along the road to the Simien Mountains", story: "The road to the mountains passes through a lived-in landscape. Conversations and permission come first when photographing the people who call it home.", href: "/beyond-the-trail", link: "Go beyond the trail" },
  { src: "/images/giant-lobelia.jpg", title: "Wonder in the details", location: "Simien highlands", category: "Landscapes", alt: "Giant lobelias growing in the open Simien highlands", story: "Look away from the horizon for a moment. The sculptural forms of giant lobelias give the highland landscape a character all its own.", href: "/simien-photography-tour", link: "Explore photography journeys" },
  { src: "/images/chenek-camp.jpg", title: "Where the trail takes you", location: "Chenek camp", category: "On the trail", alt: "Mountain landscape around Chenek camp in the Simien Mountains", story: "The country around Chenek is a reason to linger. Each turn of the trail offers another perspective on the escarpment.", href: "/treks", link: "Explore the journeys" },
  { src: "/images/simien-panorama.jpg", title: "Some things need to be felt.", location: "Simien Mountains · Ethiopia", category: "Landscapes", alt: "An expansive panorama of the Simien Mountains and their layered valleys", story: "A photograph offers a glimpse. The open space, the mountain air and the feeling of standing here belong to the journey itself.", href: "/plan", link: "Plan your own moment" },
];
const categories = ["All photographs", "Landscapes", "Wildlife", "Culture & life", "On the trail"];

export function Gallery() {
  const [category, setCategory] = useState(categories[0]);
  const [selected, setSelected] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const filtered = photographs.filter((photo) => category === categories[0] || photo.category === category);
  const photo = selected === null ? null : filtered[selected];
  const isOpen = selected !== null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) return;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  function move(direction: number) {
    setSelected((current) => current === null ? null : (current + direction + filtered.length) % filtered.length);
  }

  return <section className="gallery-collection" aria-label="Photograph gallery">
    <div className="gallery-toolbar shell">
      <div className="gallery-filters" role="group" aria-label="Filter photographs">{categories.map((item) => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div>
      <p className="gallery-count" role="status">{String(filtered.length).padStart(2, "0")} photographs</p>
    </div>
    <div className={`gallery-grid ${category !== categories[0] ? "gallery-grid--filtered" : ""}`}>
      {filtered.map((item, index) => <button type="button" className="gallery-tile" key={item.src} onClick={(event) => { triggerRef.current = event.currentTarget; setSelected(index); }} aria-label={`View ${item.title} — ${item.location}`}>
        <Image src={item.src} alt={item.alt} fill priority={index < 4} sizes={category !== categories[0] ? "(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw" : index === 7 ? "100vw" : "(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw"} />
        <span className="gallery-tile__shade" />
        <span className="gallery-tile__category">{item.category}</span>
        <span className="gallery-tile__title">{item.title}</span>
        <span className="gallery-tile__bottom"><span>{item.location}</span><span className="gallery-tile__expand" aria-hidden="true"><ArrowUpRight size={18} /></span></span>
      </button>)}
    </div>
    <div className="gallery-colophon shell"><span>A glimpse of the place. A beginning for your journey.</span><Link href="/photo-credits">Photography & credits <ArrowUpRight size={13} /></Link></div>
    <dialog ref={dialogRef} className="gallery-viewer" aria-labelledby="gallery-photo-title" aria-describedby="gallery-photo-story" onCancel={(event) => { event.preventDefault(); setSelected(null); }} onClick={(event) => { if (event.target === event.currentTarget) setSelected(null); }} onKeyDown={(event) => { if (event.key === "ArrowRight") { event.preventDefault(); move(1); } if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); } }}>
      {photo && <>
        <div className="gallery-viewer__top"><span>{String((selected ?? 0) + 1).padStart(2, "0")} / {String(filtered.length).padStart(2, "0")} <span> · {photo.category}</span></span><button type="button" aria-label="Close photograph" onClick={() => setSelected(null)} autoFocus><X size={22} /></button></div>
        <div className="gallery-viewer__image"><Image key={photo.src} src={photo.src} alt={photo.alt} fill sizes="(max-width: 720px) 100vw, 90vw" /></div>
        <div className="gallery-viewer__caption" aria-live="polite" aria-atomic="true"><div><p className="eyebrow">{photo.location}</p><h2 id="gallery-photo-title">{photo.title}</h2><p id="gallery-photo-story">{photo.story}</p><Link className="text-link text-link--light" href={photo.href}>{photo.link} <ArrowUpRight size={15} /></Link></div><div className="gallery-viewer__arrows"><button type="button" aria-label="Previous photograph" onClick={() => move(-1)} disabled={filtered.length < 2}><ArrowRight style={{ transform: "rotate(180deg)" }} /></button><button type="button" aria-label="Next photograph" onClick={() => move(1)} disabled={filtered.length < 2}><ArrowRight /></button></div></div>
      </>}
    </dialog>
  </section>;
}
