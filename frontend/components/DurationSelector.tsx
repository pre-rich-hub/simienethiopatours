"use client";

import Image from "next/image";
import Link from "next/link";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Compass, Mountain } from "@/components/Icon";
import { journeys as bundledJourneys } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";

type JourneyOption = {
  slug: string;
  href: string;
  title: string;
  image: string;
  duration: string;
  style: string;
  difficulty: string;
  summary: string;
  fit: string;
};

const collections = [
  { id: "first-encounters", label: "First Encounters", journeys: [0, 1, 2] },
  { id: "signature-treks", label: "Signature Treks", journeys: [1, 2, 3] },
  { id: "summit-and-beyond", label: "Summit & Beyond", journeys: [2, 3, 4] },
] as const;

export function DurationSelector({ tours }: { tours?: JourneyOption[] }) {
  // Use server-provided tours when available, fall back to bundled site.ts data.
  const items: readonly JourneyOption[] = tours && tours.length > 0
    ? tours
    : bundledJourneys.map((j) => ({
        slug: j.href.replace("/treks/", ""),
        href: j.href,
        title: j.title,
        image: j.image,
        duration: j.duration,
        style: j.style,
        difficulty: j.difficulty,
        summary: j.summary,
        fit: j.fit,
      }));

  const [active, setActive] = useState(1);
  const collection = collections[active];
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
        ? collections.length - 1
        : (index + (event.key === "ArrowRight" ? 1 : -1) + collections.length) % collections.length;

    setActive(next);
    document.getElementById(`journey-tab-${collections[next].id}`)?.focus({ preventScroll: true });
  }

  return (
    <div className="journey-discovery">
      <div ref={tabsRef} className="journey-discovery__tabs" role="tablist" aria-label="Explore journey collections">
        {collections.map((item, index) => (
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
          {collection.journeys.map((journeyIndex, cardIndex) => {
            const journey = items[journeyIndex];
            if (!journey) return null;

            return (
              <article className="journey-choice-card" key={journey.slug}>
                <Link className="journey-choice-card__image" href={journey.href} aria-label={`Explore ${journey.title}`}>
                  <Image
                    src={journey.image}
                    alt={`Simien Mountains landscape featured in ${journey.title}`}
                    fill
                    sizes="(max-width: 720px) 82vw, (max-width: 1000px) 340px, 31vw"
                  />
                  <span className="journey-choice-card__duration">{journey.duration}</span>
                  <span className="journey-choice-card__number">0{cardIndex + 1}</span>
                  <div className="journey-choice-card__title">
                    <span>{journey.style}</span>
                    <h3>{journey.title}</h3>
                  </div>
                </Link>
                <div className="journey-choice-card__body">
                  <p>{journey.summary}</p>
                  <div className="journey-choice-card__facts">
                    <div>
                      <Mountain />
                      <span><small>Difficulty</small><b>{journey.difficulty}</b></span>
                    </div>
                    <div>
                      <Compass />
                      <span><small>Best for</small><b>{journey.fit}</b></span>
                    </div>
                  </div>
                  <Link className="journey-choice-card__link" href={journey.href}>
                    Explore journey <ArrowRight />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="journey-discovery__action">
        <Link className={buttonVariants({ variant: "ctaDark", size: "cta" })} href="/treks">View all journeys <ArrowUpRight /></Link>
      </div>
    </div>
  );
}
