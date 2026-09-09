import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@/components/Icon";
import { simienReasons } from "@/lib/simien-guide";

// Replace these six paths when the final photography is ready.
const reasonPhotography = [
  { src: "/images/imet-gogo.jpg", alt: "A trekker's view across the cliffs at Imet Gogo", place: "Imet Gogo" },
  { src: "/images/gelada-troop.jpg", alt: "Geladas grazing together in the Simien highlands", place: "Simien highlands" },
  { src: "/images/giant-lobelia.jpg", alt: "Giant lobelias beneath the open Simien sky", place: "Highland light" },
  { src: "/images/chenek-camp.jpg", alt: "The high mountain country around Chenek", place: "Chenek" },
  { src: "/images/road-to-simien.jpg", alt: "Everyday highland life on the road toward Simien", place: "The living highlands" },
  { src: "/images/simien-panorama.jpg", alt: "A wide first view into the Simien Mountains", place: "A first encounter" },
] as const;

export function SimienReasonCards() {
  return <div className="simien-reason-grid">
    {simienReasons.map((reason, index) => {
      const photo = reasonPhotography[index];
      return <article className="simien-reason-card" key={reason.title}>
        <div className="simien-reason-card__image">
          <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw" />
          <span className="simien-reason-card__veil" />
          <span className="simien-reason-card__number">{String(index + 1).padStart(2, "0")}</span>
          <span className="simien-reason-card__place">{photo.place}</span>
        </div>
        <div className="simien-reason-card__body">
          <p className="eyebrow eyebrow--copper">{reason.tag}</p>
          <h3>{reason.title}</h3>
          <p>{reason.body}</p>
          {reason.href && <Link href={reason.href} className="text-link">{reason.linkLabel || "Explore experience"}<ArrowUpRight /></Link>}
        </div>
      </article>;
    })}
  </div>;
}
