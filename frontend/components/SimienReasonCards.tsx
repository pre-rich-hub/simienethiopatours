import Image from "@/components/Image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "@/components/Icon";
import { simienReasons } from "@/lib/simien-guide";
import { cardBlurb } from "@/lib/card-blurb";
import clientPhotos from "@/lib/client-photos.json";

const reasonPhotography = [
  { src: clientPhotos["imet-gogo"].url, alt: clientPhotos["imet-gogo"].alt.en, place: "Imet Gogo" },
  { src: clientPhotos["gelada-country"].url, alt: clientPhotos["gelada-country"].alt.en, place: "Simien highlands" },
  { src: clientPhotos.chenek.url, alt: clientPhotos.chenek.alt.en, place: "Chenek" },
  { src: clientPhotos.chenek.url, alt: clientPhotos.chenek.alt.en, place: "Chenek" },
  { src: clientPhotos.debark.url, alt: clientPhotos.debark.alt.en, place: "The living highlands" },
  { src: clientPhotos.simien.url, alt: clientPhotos.simien.alt.en, place: "A first encounter" },
] as const;

export async function SimienReasonCards() {
  const t = await getTranslations("cta");
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
          <p>{cardBlurb(reason.body, 140)}</p>
          {reason.href && <Link href={reason.href} className="text-link">{reason.linkLabel || t("exploreExperience")}<ArrowUpRight /></Link>}
        </div>
      </article>;
    })}
  </div>;
}
