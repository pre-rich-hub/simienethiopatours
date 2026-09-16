import { resolveMediaUrl } from "@/lib/media-url";
import clientPhotos from "@/lib/client-photos.json";
import Image from "@/components/Image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "@/components/Icon";
import type { Feature } from "@/components/Editorial";

type Photo = { src: string; alt: string; caption: string };
type PhotoSet = "places" | "wildlife" | "durations" | "planning";

// Replace any path below when its final Simien photograph is ready.
const photography: Record<PhotoSet, readonly Photo[]> = {
  places: [
    { src: clientPhotos["sankaber"].url, alt: clientPhotos["sankaber"].alt.en, caption: "Sankaber · Trail country" },
    { src: clientPhotos.bwahit.url, alt: clientPhotos.bwahit.alt.en, caption: "Bwahit · Higher country" },
    { src: clientPhotos["ras-dashen"].url, alt: clientPhotos["ras-dashen"].alt.en, caption: "Ras Dashen · Expedition country" },
  ],
  wildlife: [
    { src: clientPhotos["gelada-country"].url, alt: clientPhotos["gelada-country"].alt.en, caption: "Gelada · Highland grasslands" },
    { src: clientPhotos["siha-gorge"].url, alt: clientPhotos["siha-gorge"].alt.en, caption: "Walia ibex · Rocky habitat" },
    { src: clientPhotos.chenek.url, alt: clientPhotos.chenek.alt.en, caption: "Afro-alpine habitat · Highland camps" },
    { src: clientPhotos.simien.url, alt: clientPhotos.simien.alt.en, caption: "Birdlife · Cliffs and sky" },
  ],
  durations: [
    { src: clientPhotos["sankaber"].url, alt: clientPhotos["sankaber"].alt.en, caption: "One day · First impressions" },
    { src: clientPhotos["sankaber"].url, alt: clientPhotos["sankaber"].alt.en, caption: "Two days · One mountain night" },
    { src: clientPhotos["geech"].url, alt: clientPhotos["geech"].alt.en, caption: "Three days · Geech and Imet Gogo" },
    { src: clientPhotos["chenek"].url, alt: clientPhotos["chenek"].alt.en, caption: "Four days · The classic trail" },
    { src: clientPhotos["fasil"].url, alt: clientPhotos["fasil"].alt.en, caption: "Five days · City and mountains" },
    { src: clientPhotos["ras-dashen"].url, alt: clientPhotos["ras-dashen"].alt.en, caption: "Longer journeys · Deeper into Simien" },
  ],
  planning: [
    { src: clientPhotos.debark.url, alt: clientPhotos.debark.alt.en, caption: "Getting here · The road north" },
    { src: clientPhotos["sankaber"].url, alt: clientPhotos["sankaber"].alt.en, caption: "Seasons · Light and weather" },
    { src: clientPhotos["geech"].url, alt: clientPhotos["geech"].alt.en, caption: "Packing · Mountain nights" },
    { src: clientPhotos["imet-gogo"].url, alt: clientPhotos["imet-gogo"].alt.en, caption: "Difficulty · Terrain and altitude" },
    { src: clientPhotos["chenek"].url, alt: clientPhotos["chenek"].alt.en, caption: "Stays · City, lodge and camp" },
    { src: clientPhotos.simien.url, alt: clientPhotos.simien.alt.en, caption: "Your quote · Built around you" },
  ],
};

export async function SimienPhotoCards({ items, photoSet, columns = 3 }: { items: readonly Feature[]; photoSet: PhotoSet; columns?: 2 | 3 }) {
  const t = await getTranslations("cta");
  const photos = photography[photoSet];
  return <div className={`simien-photo-grid simien-photo-grid--${columns}`}>
    {items.map((item, index) => {
      const photo = photos[index];
      return <article className="simien-photo-card" id={item.id} key={item.title}>
        <div className="simien-photo-card__image">
          <Image src={resolveMediaUrl(photo.src)} alt={photo.alt} fill sizes={columns === 2 ? "(max-width: 720px) 100vw, 50vw" : "(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"} />
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
            <Link className="simien-photo-card__explore" href={item.href}>{item.linkLabel || t("exploreMore")}<ArrowUpRight /></Link>
          </div>}
        </div>
      </article>;
    })}
  </div>;
}
