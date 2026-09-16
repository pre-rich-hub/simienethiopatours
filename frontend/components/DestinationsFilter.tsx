"use client";

import Image from "@/components/Image";
import { Link } from "@/i18n/navigation";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRight, Search } from "@/components/Icon";
import type { destinationToPlace } from "@/lib/catalogue";

type Place = ReturnType<typeof destinationToPlace>;

export function DestinationsFilter({ places }: { places: readonly Place[] }) {
  const t = useTranslations("destinationsFilter");
  const tCta = useTranslations("cta");
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");

  const categories = useMemo(() => {
    const available = Array.from(new Set(places.map((place) => place.type)));
    return ["All", ...available];
  }, [places]);

  const trimmedQuery = query.trim().toLowerCase();
  const filtered = places.filter((place) => {
    const matchesType = active === "All" || place.type === active;
    const matchesQuery = !trimmedQuery || place.name.toLowerCase().includes(trimmedQuery);
    return matchesType && matchesQuery;
  });

  const typeKey = (id: string) => (t.has(`types.${id}` as "types.All") ? t(`types.${id}` as "types.All") : id);

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
              {typeKey(category)}
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
        {filtered.length === 1 ? t("countOne", { count: filtered.length }) : t("countMany", { count: filtered.length })}
        {active !== "All" ? t("countFiltered", { category: typeKey(active) }) : ""}
        {trimmedQuery ? t("countSearch", { query }) : (active === "All" ? t("countAll") : "")}
      </p>
      {filtered.length === 0 ? (
        <p className="filter-count">{t("countNone")}</p>
      ) : (
        <div className="simien-photo-grid simien-photo-grid--3">
          {filtered.map((place) => (
            <Link className="simien-photo-card dest-card" href={place.path} locale={place.locale} key={place.slug}>
              <div className="simien-photo-card__image">
                {place.image && <Image src={place.image} alt={place.imageAlt} fill sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw" />}
                <span className="simien-photo-card__shade" />
                <div className="simien-photo-card__overlay">
                  <p className="simien-photo-card__eyebrow">{place.location.split(";")[0]}</p>
                  <h2>{place.name}</h2>
                </div>
              </div>
              <div className="simien-photo-card__body">
                <p>{place.overview[0] ?? ""}</p>
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
      )}
    </div>
  );
}
