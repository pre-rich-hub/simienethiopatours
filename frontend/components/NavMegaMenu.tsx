"use client";

import Image from "@/components/Image";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown } from "@/components/Icon";

export type NavMegaMenuCard = {
  locale?: "en" | "es" | "de" | "fr";
  imageAlt?: string;
  slug: string;
  href: string;
  tag: string;
  title: string;
  style: string;
  summary: string;
  image: string;
};

export type NavMegaMenuProps = {
  id: string;
  label: string;
  matchPath: string;
  eyebrow: string;
  heading: React.ReactNode;
  description: string;
  exploreHref: string;
  exploreLabel: string;
  extraLinks: { href: string; label: string }[];
  cards: NavMegaMenuCard[];
};

export function NavMegaMenu({ id, label, matchPath, eyebrow, heading, description, exploreHref, exploreLabel, extraLinks, cards }: NavMegaMenuProps) {
  const t = useTranslations("nav");
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const focusFirstRef = useRef(false);
  const menuId = `${id}-menu`;

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

  // Attached natively (not via JSX onPointerEnter/onPointerLeave): React's synthetic
  // pointer enter/leave delegation can miss the transition when the pointer moves in
  // coarse jumps instead of a dense continuous path — which is how touchscreen hover
  // simulation tends to behave, unlike a physical mouse. Native listeners on the DOM
  // node itself fire reliably regardless.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    function handlePointerEnter(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      clearTimer();
      timerRef.current = setTimeout(() => setExpanded(true), 120);
    }

    function handlePointerLeave(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      clearTimer();
      if (!root!.contains(document.activeElement)) timerRef.current = setTimeout(close, 200);
    }

    root.addEventListener("pointerenter", handlePointerEnter);
    root.addEventListener("pointerleave", handlePointerLeave);
    return () => {
      root.removeEventListener("pointerenter", handlePointerEnter);
      root.removeEventListener("pointerleave", handlePointerLeave);
    };
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
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) close();
      }}
    >
      <span className="desktop-nav__trigger" aria-expanded={expanded} aria-current={pathname === matchPath || pathname.startsWith(`${matchPath}/`) ? "page" : undefined}>
        <Link href={matchPath} onClick={close}>{label}</Link>
        <button
          ref={triggerRef}
          type="button"
          aria-label={t("exploreMenu", { label })}
          aria-haspopup="true"
          aria-expanded={expanded}
          aria-controls={menuId}
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
          <ChevronDown size={12} />
        </button>
      </span>

      <div
        className="journey-menu"
        id={menuId}
        aria-label={t("exploreNamed", { name: label })}
        aria-hidden={!expanded}
        inert={!expanded}
        onClick={(event) => {
          if (event.target instanceof Element && event.target.closest("a")) close();
        }}
      >
        <div className="journey-menu__inner shell">
          <div className="journey-menu__intro">
            <p className="eyebrow eyebrow--copper">{eyebrow}</p>
            <h2>{heading}</h2>
            <p className="journey-menu__description">{description}</p>
            <Link className="text-link" href={exploreHref}>{exploreLabel} <ArrowUpRight /></Link>
            <div className="journey-menu__extra">
              {extraLinks.map((link) => <Link key={link.href} href={link.href}>{link.label} ↗</Link>)}
            </div>
          </div>

          <div className="journey-menu__cards">
            {cards.map((card) => (
              <Link className="journey-menu-card" href={card.href} locale={card.locale} key={card.slug}>
                {card.image ? <div className="journey-menu-card__image">
                  {card.image && <Image src={card.image} alt={card.imageAlt ?? ""} fill sizes="(min-width: 1440px) 280px, 22vw" />}
                  <span>{card.tag}</span>
                </div> : <p className="eyebrow eyebrow--copper">{card.tag}</p>}
                <h3>{card.title}</h3>
                <p className="journey-menu-card__style">{card.style}</p>
                <p className="journey-menu-card__summary">{card.summary}</p>
                <div className="journey-menu-card__footer"><span>{t("explore")}</span><ArrowUpRight size={16} /></div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
