import type { ReactNode } from "react";
import Image from "@/components/Image";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "@/components/Icon";
import { buttonVariants } from "@/components/ui/button";
import clientPhotos from "@/lib/client-photos.json";
import type { AppLocale } from "@/i18n/routing";

const em = { em: (chunks: ReactNode) => <em>{chunks}</em> };

export async function CustomTourCard() {
  const t = await getTranslations("home");
  const locale = (await getLocale()) as AppLocale;
  const photo = clientPhotos.kosoye;

  return (
    <div className="custom-tour-card">
      <div className="custom-tour-card__image">
        <Image src={photo.url} alt={photo.alt[locale]} fill sizes="(max-width: 900px) 100vw, 42vw" />
      </div>
      <div className="custom-tour-card__body">
        <span className="eyebrow eyebrow--copper">{t("customTourTag")}</span>
        <h3>{t.rich("customTourTitle", em)}</h3>
        <p>{t("customTourBody")}</p>
        <Link className={buttonVariants({ variant: "ctaGold", size: "cta" })} href="/custom-built-tour">
          {t("customTourCta")} <ArrowUpRight size={16} />
        </Link>
      </div>
    </div>
  );
}
