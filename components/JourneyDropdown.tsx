"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown } from "@/components/Icon";
import { journeys } from "@/lib/site";

const featuredJourneys = journeys.slice(1, 4);

export function JourneyDropdown() {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const focusFirstRef = useRef(false);

  function clearTimer() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  }

  function close() {
    clearTimer();
    focusFirstRef.current = false;
    setExpanded(false);
  }

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    if (!expanded) return;

    if (focusFirstRef.current) {
      rootRef.current?.querySelector<HTMLAnchorElement>(".journey-menu a")?.focus({ preventScroll: true });
      focusFirstRef.current = false;
    }

    const dismissOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) close();
    };
    const dismissOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      close();
      triggerRef.current?.focus({ preventScroll: true });
    };
    const mobile = window.matchMedia("(max-width: 1100px)");
    const dismissOnMobile = () => { if (mobile.matches) close(); };

    document.addEventListener("pointerdown", dismissOutside);
    document.addEventListener("keydown", dismissOnEscape);
    mobile.addEventListener("change", dismissOnMobile);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside);
      document.removeEventListener("keydown", dismissOnEscape);
      mobile.removeEventListener("change", dismissOnMobile);
    };
  }, [expanded]);

  return (
    <div
      ref={rootRef}
      className="journeys-dropdown"
      data-open={expanded}
      onPointerEnter={(event) => {
        if (event.pointerType !== "mouse") return;
        clearTimer();
        timerRef.current = setTimeout(() => setExpanded(true), 120);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "mouse") return;
        clearTimer();
        if (!rootRef.current?.contains(document.activeElement)) timerRef.current = setTimeout(close, 200);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) close();
      }}
    >
      <button
        ref={triggerRef}
        className="desktop-nav__trigger"
        type="button"
        aria-expanded={expanded}
        aria-controls="journey-menu"
        aria-current={pathname.startsWith("/treks") ? "page" : undefined}
        onClick={() => { clearTimer(); setExpanded((value) => !value); }}
        onKeyDown={(event) => {
          if (event.key !== "ArrowDown") return;
          event.preventDefault();
          clearTimer();
          if (expanded) {
            rootRef.current?.querySelector<HTMLAnchorElement>(".journey-menu a")?.focus({ preventScroll: true });
          } else {
            focusFirstRef.current = true;
            setExpanded(true);
          }
        }}
      >
        Journeys <ChevronDown size={12} />
      </button>

      <div
        className="journey-menu"
        id="journey-menu"
        aria-label="Explore our journeys"
        aria-hidden={!expanded}
        inert={!expanded}
        onClick={(event) => {
          if (event.target instanceof Element && event.target.closest("a")) close();
        }}
      >
        <div className="journey-menu__inner shell">
          <div className="journey-menu__intro">
            <p className="eyebrow eyebrow--copper">Signature journeys</p>
            <h2>Find your way<br /><em>into Simien.</em></h2>
            <p className="journey-menu__description">From a first mountain trek to a summit journey, find a starting point for your time, curiosity and pace.</p>
            <Link className="text-link" href="/treks">Explore all journeys <ArrowUpRight /></Link>
            <div className="journey-menu__extra">
              <Link href="/treks/10-day-simien-ras-dashen">10-day Simien & Ras Dashen expedition ↗</Link>
              <Link href="/treks/5-day-gondar-simien">5-day Royal City & Mountain Adventure ↗</Link>
              <Link href="/treks/gondar-heritage-simien">5-day Gondar, Heritage & Simien ↗</Link>
              <Link href="/beyond-the-trail">Beyond the trail: all experiences ↗</Link>
            </div>
          </div>

          <div className="journey-menu__cards">
            {featuredJourneys.map((journey) => (
              <Link className="journey-menu-card" href={journey.href} key={journey.slug}>
                <div className="journey-menu-card__image">
                  <Image src={journey.image} alt="" fill sizes="(min-width: 1440px) 280px, 22vw" />
                  <span>{journey.duration}</span>
                </div>
                <h3>{journey.title}</h3>
                <p className="journey-menu-card__style">{journey.style} · Private</p>
                <p className="journey-menu-card__summary">{journey.summary}</p>
                <div className="journey-menu-card__footer"><span>Explore journey</span><ArrowUpRight size={16} /></div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
