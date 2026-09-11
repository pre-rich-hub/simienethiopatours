"use client";

import Image from "next/image";
import Link from "next/link";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight } from "@/components/Icon";
import { homeClarityCollections } from "@/lib/home-cards";
import { buttonVariants } from "@/components/ui/button";

export function DurationSelector() {
  const [active, setActive] = useState(0);
  const collection = homeClarityCollections[active];
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
      <div ref={tabsRef} className="journey-discovery__tabs" role="tablist" aria-label="Choose a journey by time, interest or effort">
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
            {item.label}
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
          {collection.cards.map((card, cardIndex) => (
            <article className="journey-choice-card" key={card.title}>
              <Link className="journey-choice-card__image" href={card.href} aria-label={`Explore ${card.title}`}>
                <Image
                  src={card.image}
                  alt={card.imageAlt}
                  fill
                  sizes="(max-width: 720px) 82vw, (max-width: 1000px) 340px, 31vw"
                />
                <span className="journey-choice-card__duration">{collection.label}</span>
                <span className="journey-choice-card__number">0{cardIndex + 1}</span>
                <div className="journey-choice-card__title">
                  <h3>{card.title}</h3>
                </div>
              </Link>
              <div className="journey-choice-card__body">
                <p>{card.summary}</p>
                <Link className="journey-choice-card__link" href={card.href}>
                  Explore journey <ArrowRight />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="journey-discovery__action">
        <Link className={buttonVariants({ variant: "ctaDark", size: "cta" })} href="/treks">View all journeys <ArrowUpRight /></Link>
      </div>
    </div>
  );
}
