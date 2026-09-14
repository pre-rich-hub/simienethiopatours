"use client";

import Image from "@/components/Image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Compass, Mountain } from "@/components/Icon";
import type { HomeClarityCollection } from "@/lib/home-cards";
import { cardBlurb } from "@/lib/card-blurb";
import { buttonVariants } from "@/components/ui/button";

type ClarityCopy = Record<string, { label: string }>;

export function DurationSelector({ collections: homeClarityCollections }: { collections: readonly HomeClarityCollection[] }) {
  const t = useTranslations("cta");
  const tNav = useTranslations("nav");
  const tHome = useTranslations("home");
  const tBooking = useTranslations("booking");
  const tGondar = useTranslations("gondarExperiences");
  const clarity = tHome.raw("clarity" as never) as ClarityCopy;
  const [active, setActive] = useState(0);
  const collection = homeClarityCollections[active];
  const collectionCopy = clarity[collection.id];
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tabs = tabsRef.current;
    const selected = tabs?.querySelector<HTMLElement>("[aria-selected='true']");
    if (!tabs || !selected || tabs.scrollWidth <= tabs.clientWidth) return;

    tabs.scrollTo({
      left: selected.offsetLeft - tabs.offsetLeft - (tabs.clientWidth - selected.offsetWidth) / 2,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }, [active]);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();

    const next = event.key === "Home"
      ? 0
      : event.key === "End"
        ? homeClarityCollections.length - 1
        : (index + (event.key === "ArrowRight" ? 1 : -1) + homeClarityCollections.length) % homeClarityCollections.length;

    setActive(next);
    document.getElementById(`journey-tab-${homeClarityCollections[next].id}`)?.focus({ preventScroll: true });
  }

  return (
    <div className="journey-discovery">
      <div ref={tabsRef} className="journey-discovery__tabs" role="tablist" aria-label={tHome("clarityAria")}>
        {homeClarityCollections.map((item, index) => (
          <button
            type="button"
            id={`journey-tab-${item.id}`}
            key={item.id}
            className={index === active ? "is-active" : ""}
            onClick={() => setActive(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            role="tab"
            aria-selected={index === active}
            aria-controls="journey-collection-panel"
            tabIndex={index === active ? 0 : -1}
          >
            {clarity[item.id]?.label ?? item.label}
          </button>
        ))}
      </div>

      <div
        className="journey-discovery__stage"
        id="journey-collection-panel"
        role="tabpanel"
        aria-labelledby={`journey-tab-${collection.id}`}
        tabIndex={0}
        key={collection.id}
      >
        <div className="journey-discovery__grid">
          {collection.cards.map((card, cardIndex) => {
            const summary = cardBlurb(card.summary, 130);
            return (
              <article className="journey-choice-card" key={card.title}>
                <Link className="journey-choice-card__image" href={card.href} locale={card.locale} aria-label={tNav("exploreNamed", { name: card.title })}>
                  {card.image && <Image
                    src={card.image}
                    alt={card.imageAlt}
                    fill
                    sizes="(max-width: 720px) 82vw, (max-width: 1000px) 340px, 31vw"
                  />}
                  <span className="journey-choice-card__duration">{card.duration || collectionCopy?.label || collection.label}</span>
                  <span className="journey-choice-card__number">0{cardIndex + 1}</span>
                  <div className="journey-choice-card__title">
                    {card.style ? <span>{card.style}</span> : null}
                    <h3>{card.title}</h3>
                  </div>
                </Link>
                <div className="journey-choice-card__body">
                  <p>{summary}</p>
                  {(card.difficulty || card.fit) && (
                    <div className="journey-choice-card__facts">
                      {card.difficulty ? (
                        <div>
                          <Mountain />
                          <span><small>{tBooking("difficulty")}</small><b>{card.difficulty}</b></span>
                        </div>
                      ) : null}
                      {card.fit ? (
                        <div>
                          <Compass />
                          <span><small>{tGondar("bestFor")}</small><b>{card.fit}</b></span>
                        </div>
                      ) : null}
                    </div>
                  )}
                  <Link className="journey-choice-card__link" href={card.href} locale={card.locale}>
                    {t("exploreJourney")} <ArrowRight />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="journey-discovery__action">
        <Link className={buttonVariants({ variant: "ctaDark", size: "cta" })} href="/treks">{t("viewAllJourneys")} <ArrowUpRight /></Link>
      </div>
    </div>
  );
}
