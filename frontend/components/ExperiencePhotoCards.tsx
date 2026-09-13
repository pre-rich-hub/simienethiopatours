import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "@/components/Icon";
import { cardBlurb } from "@/lib/card-blurb";

export type ExperiencePhotoItem = {
  locale?: "en" | "es" | "de" | "fr";
  title: string;
  body: string;
  tag?: string;
  href?: string;
  linkLabel?: string;
  image: { src: string; alt: string; caption: string; position?: string };
};

export async function ExperiencePhotoCards({ items, compact = false }: { items: readonly ExperiencePhotoItem[]; compact?: boolean }) {
  const t = await getTranslations("cta");
  return <div className={`experience-photo-grid ${compact ? "experience-photo-grid--compact" : ""}`}>
    {items.map((item, index) => <article className="experience-photo-card" key={item.title}>
      <div className="experience-photo-card__image">
        {item.image.src && <Image
          src={item.image.src}
          alt={item.image.alt}
          fill
          sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
          style={{ objectPosition: item.image.position || "center" }}
        />}
        <span className="experience-photo-card__shade" />
        <span className="experience-photo-card__number">{String(index + 1).padStart(2, "0")}</span>
        <span className="experience-photo-card__caption">{item.image.caption}</span>
      </div>
      <div className="experience-photo-card__body">
        <p className="eyebrow eyebrow--copper">{item.tag || "Personally arranged"}</p>
        <h3>{item.title}</h3>
        <p>{cardBlurb(item.body, 140)}</p>
        {item.href && <Link href={item.href} locale={item.locale} className="text-link">{item.linkLabel || t("exploreExperience")}<ArrowUpRight /></Link>}
      </div>
    </article>)}
  </div>;
}
