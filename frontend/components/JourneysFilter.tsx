"use client";

import Image from "@/components/Image";
import { Link } from "@/i18n/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRight, Search } from "@/components/Icon";
import { cardBlurb } from "@/lib/card-blurb";
import type { JourneyPackage } from "@/lib/journey-packages";

const categoryIds = [
  "All",
  "core-trek",
  "summit-expedition",
  "wildlife-journey",
  "photography-journey",
  "gondar-cultural",
  "seasonal-festival",
  "private-combination",
] as const;

type FilterableJourney = JourneyPackage & {
  summary?: string;
  locale?: "en" | "es" | "de" | "fr";
  journeyType?: string;
};

export function JourneysFilter({ journeys }: { journeys: readonly FilterableJourney[] }) {
  const t = useTranslations("treks");
  const tCta = useTranslations("cta");
  const [active, setActive] = useState<(typeof categoryIds)[number]>("All");
  const [query, setQuery] = useState("");

  const available = new Set(journeys.map((journey) => journey.journeyType));
  const categories = categoryIds.filter((id) => id === "All" || available.has(id));
  const trimmedQuery = query.trim().toLowerCase();
  const filtered = journeys.filter((journey) => {
    const matchesType = active === "All" || journey.journeyType === active;
    const matchesQuery = !trimmedQuery || journey.name.toLowerCase().includes(trimmedQuery);
    return matchesType && matchesQuery;
  });
  const columns = filtered.length <= 2 ? 2 : 3;

  return (
    <div className="journeys-filter">
      <div className="journeys-filter__controls">
        <div className="content-filters" role="group" aria-label={t("filterAria")}>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={active === category}
              onClick={() => setActive(category)}
            >
              {t(`categories.${category}` as "categories.All")}
            </button>
          ))}
        </div>
        <div className="content-filters__search">
          <Search size={15} />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchAria")}
          />
        </div>
      </div>
      <p className="filter-count" role="status">
        {(filtered.length === 1 ? t("countOne", { count: filtered.length }) : t("countMany", { count: filtered.length }))
          + (active !== "All" ? t("countFiltered", { category: t(`categories.${active}` as "categories.All") }) : "")
          + (trimmedQuery ? t("countSearch", { query }) : (active === "All" ? t("countAll") : ""))}
      </p>
      {filtered.length === 0 && <p className="filter-count">{t("countNone")}</p>}
      <div className={`simien-photo-grid simien-photo-grid--${columns}`}>
        {filtered.map((journey) => (
          <Link className="simien-photo-card dest-card" href={`/treks/${journey.slug}`} locale={journey.locale} key={journey.slug}>
            <div className="simien-photo-card__image">
              {journey.image && <Image
                src={journey.image}
                alt={journey.imageAlt}
                fill
                sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
              />}
              <span className="simien-photo-card__shade" />
              <div className="simien-photo-card__overlay">
                <p className="simien-photo-card__eyebrow">{journey.duration}</p>
                <h2>{journey.name}</h2>
              </div>
            </div>
            <div className="simien-photo-card__body">
              <p>{cardBlurb(journey.summary ?? journey.overview[0] ?? "", 140)}</p>
              <div className="simien-photo-card__footer">
                <span className="simien-photo-card__explore">
                  {tCta("exploreMore")}
                  <ArrowUpRight />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
