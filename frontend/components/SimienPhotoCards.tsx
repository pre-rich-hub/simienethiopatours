import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@/components/Icon";
import type { Feature } from "@/components/Editorial";

type Photo = { src: string; alt: string; caption: string };
type PhotoSet = "places" | "wildlife" | "durations" | "planning";

// Replace any path below when its final Simien photograph is ready.
const photography: Record<PhotoSet, readonly Photo[]> = {
  places: [
    { src: "/images/imet-gogo.jpg", alt: "Open plateau and escarpment near a classic Simien trailhead", caption: "Sankaber · Trail country" },
    { src: "/images/chenek-camp.jpg", alt: "High mountain terrain on the route toward Bwahit", caption: "Bwahit · Higher country" },
    { src: "/images/simien-panorama.jpg", alt: "Layered ridges in the high Simien Mountains", caption: "Ras Dashen · Expedition country" },
  ],
  wildlife: [
    { src: "/images/gelada-troop.jpg", alt: "A gelada troop feeding in highland grass", caption: "Gelada · Highland grasslands" },
    { src: "/images/chenek-camp.jpg", alt: "Rocky Walia ibex habitat around Chenek", caption: "Walia ibex · Rocky habitat" },
    { src: "/images/giant-lobelia.jpg", alt: "Afro-alpine habitat in the Simien highlands", caption: "Ethiopian wolf · Afro-alpine habitat" },
    { src: "/images/simien-panorama.jpg", alt: "Open cliffs and valleys where highland birds can be observed", caption: "Birdlife · Cliffs and sky" },
  ],
  durations: [
    { src: "/images/imet-gogo.jpg", alt: "A first view over the Simien escarpment", caption: "One day · First impressions" },
    { src: "/images/simien-panorama.jpg", alt: "A broad mountain view on a short Simien escape", caption: "Two days · One mountain night" },
    { src: "/images/geech-camp.jpg", alt: "Tents at Geech during a three-day Simien journey", caption: "Three days · Geech and Imet Gogo" },
    { src: "/images/chenek-camp.jpg", alt: "Chenek landscape on the classic four-day route", caption: "Four days · The classic trail" },
    { src: "/images/fasil-ghebbi.jpg", alt: "Historic stone architecture in Gondar before a mountain journey", caption: "Five days · City and mountains" },
    { src: "/images/giant-lobelia.jpg", alt: "Remote highland scenery on a longer Simien expedition", caption: "Longer journeys · Deeper into Simien" },
  ],
  planning: [
    { src: "/images/road-to-simien.jpg", alt: "The road north from Gondar toward the Simien Mountains", caption: "Getting here · The road north" },
    { src: "/images/simien-panorama.jpg", alt: "Changing weather moving across the Simien landscape", caption: "Seasons · Light and weather" },
    { src: "/images/geech-camp.jpg", alt: "Mountain tents illustrating preparation for cold camping nights", caption: "Packing · Mountain nights" },
    { src: "/images/imet-gogo.jpg", alt: "A rocky walking route through the Simien Mountains", caption: "Difficulty · Terrain and altitude" },
    { src: "/images/chenek-camp.jpg", alt: "A mountain camping area in the Simien highlands", caption: "Stays · City, lodge and camp" },
    { src: "/images/giant-lobelia.jpg", alt: "Highland landscape used to illustrate a personally planned journey", caption: "Your quote · Built around you" },
  ],
};

export function SimienPhotoCards({ items, photoSet, columns = 3 }: { items: readonly Feature[]; photoSet: PhotoSet; columns?: 2 | 3 }) {
  const photos = photography[photoSet];
  return <div className={`simien-photo-grid simien-photo-grid--${columns}`}>
    {items.map((item, index) => {
      const photo = photos[index];
      return <article className="simien-photo-card" id={item.id} key={item.title}>
        <div className="simien-photo-card__image">
          <Image src={photo.src} alt={photo.alt} fill sizes={columns === 2 ? "(max-width: 720px) 100vw, 50vw" : "(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"} />
          <span className="simien-photo-card__shade" />
          <span className="simien-photo-card__badge">{photoSet}</span>
          <div className="simien-photo-card__overlay">
            <p className="simien-photo-card__eyebrow">{item.tag || photo.caption}</p>
            <h3>{item.title}</h3>
          </div>
        </div>
        <div className="simien-photo-card__body">
          <p>{item.body}</p>
          {item.href && <div className="simien-photo-card__footer">
            <Link className="simien-photo-card__explore" href={item.href}>{item.linkLabel || "Explore experience"}<ArrowUpRight /></Link>
          </div>}
        </div>
      </article>;
    })}
  </div>;
}
