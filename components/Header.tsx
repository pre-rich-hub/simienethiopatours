"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "@/components/Icon";
import { useEffect, useRef, useState } from "react";
import { BrandMark } from "./BrandMark";
import { NavMegaMenu } from "./NavMegaMenu";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { site } from "@/lib/site";
import { gondarMenuCards, journeyMenuCards, simienMenuCards } from "@/lib/nav-menus";

const links = [
  { href: "/simien-mountains", label: "Simien" },
  { href: "/treks", label: "Journeys" },
  { href: "/gondar", label: "Gondar" },
  { href: "/beyond-the-trail", label: "Experiences" },
  { href: "/about", label: "Our story" },
  { href: "/gallery", label: "Gallery" },
];

const megaMenus: Record<string, React.ComponentProps<typeof NavMegaMenu>> = {
  "/simien-mountains": {
    id: "simien-menu",
    label: "Simien",
    matchPath: "/simien-mountains",
    eyebrow: "The Simien Mountains",
    heading: <>Life above<br /><em>the clouds.</em></>,
    description: "UNESCO-listed escarpments, geladas and Walia ibex — explore Ethiopia's wild highland frontier at your own pace.",
    exploreHref: "/simien-mountains",
    exploreLabel: "Explore the Simien Mountains",
    extraLinks: [
      { href: "/treks", label: "Choose a Simien trek" },
      { href: "/where-to-stay-gondar-simien", label: "Where to stay: Gondar & Simien" },
      { href: "/whats-included", label: "What's included on every journey" },
      { href: "/gondar", label: "Gondar: the royal city" },
    ],
    cards: simienMenuCards,
  },
  "/treks": {
    id: "journeys-menu",
    label: "Journeys",
    matchPath: "/treks",
    eyebrow: "Signature journeys",
    heading: <>Find your way<br /><em>into Simien.</em></>,
    description: "From a first mountain trek to a summit journey, find a starting point for your time, curiosity and pace.",
    exploreHref: "/treks",
    exploreLabel: "Explore all journeys",
    extraLinks: [
      { href: "/ras-dashen", label: "Ras Dashen: Ethiopia's highest mountain" },
      { href: "/treks/10-day-simien-ras-dashen", label: "10-day Simien & Ras Dashen expedition" },
      { href: "/treks/gondar-heritage-simien", label: "5-day Gondar, Heritage & Simien" },
      { href: "/whats-included", label: "What's included on every journey" },
    ],
    cards: journeyMenuCards,
  },
  "/gondar": {
    id: "gondar-menu",
    label: "Gondar",
    matchPath: "/gondar",
    eyebrow: "The royal city",
    heading: <>History, food<br /><em>and everyday life.</em></>,
    description: "Castles, coffee, markets and the people who call Gondar home — an introduction shaped around your interests.",
    exploreHref: "/gondar",
    exploreLabel: "Explore Gondar",
    extraLinks: [
      { href: "/where-to-stay-gondar-simien", label: "Where to stay: Gondar & Simien" },
      { href: "/festival-journeys", label: "Festivals & holiday journeys" },
      { href: "/treks/5-day-gondar-simien", label: "5-day Royal City & Mountain Adventure" },
      { href: "/beyond-the-trail", label: "Beyond the trail: all experiences" },
    ],
    cards: gondarMenuCards,
  },
};

export function Header({ light = false }: { light?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDialogElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const menu = menuRef.current;
    if (!open || !menu) return;

    const previousOverflow = document.body.style.overflow;
    menu.showModal();
    document.body.style.overflow = "hidden";

    const desktop = window.matchMedia("(min-width: 1101px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);

    return () => {
      desktop.removeEventListener("change", closeOnDesktop);
      document.body.style.overflow = previousOverflow;
      menu.close();
      if (!desktop.matches) menuButtonRef.current?.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <>
      <header className={`site-header ${light ? "site-header--light" : ""} ${scrolled ? "is-scrolled" : ""}`}>
        <div className="site-header__inner">
          <BrandMark onDark={!light && !scrolled} />
          <nav className="desktop-nav" aria-label="Primary navigation">
            {links.map((link) => (
              megaMenus[link.href]
                ? <NavMegaMenu key={link.href} {...megaMenus[link.href]} />
                : <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined}>{link.label}</Link>
            ))}
          </nav>
          <div className="header-actions">
            <LanguageSwitcher />
            <Link className="button button--small button--copper" href="/plan">
              Plan with Tevan <ArrowUpRight size={15} />
            </Link>
          </div>
          <button ref={menuButtonRef} className="menu-button" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} aria-controls="mobile-menu" aria-haspopup="dialog">
            <Menu />
          </button>
        </div>
      </header>
      <dialog
        ref={menuRef}
        id="mobile-menu"
        className={`mobile-menu ${open ? "is-open" : ""}`}
        aria-label="Site navigation"
        onCancel={(event) => { event.preventDefault(); setOpen(false); }}
      >
        <div className="mobile-menu__top">
          <BrandMark />
          <button className="menu-button menu-button--dark" onClick={() => setOpen(false)} aria-label="Close menu" autoFocus><X /></button>
        </div>
        <nav aria-label="Mobile navigation">
          {links.map((link, index) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} aria-current={pathname === link.href ? "page" : undefined}>
              <span>0{index + 1}</span>{link.label}<ArrowUpRight />
            </Link>
          ))}
        </nav>
        <div className="mobile-menu__contact">
          <LanguageSwitcher mobile />
          <p>Start with a simple question. Tevan and the local team will help shape the rest.</p>
          <Link className="button button--dark" href="/plan" onClick={() => setOpen(false)}>Plan your journey</Link>
          <a className="text-link" href={site.whatsapp} target="_blank" rel="noreferrer">WhatsApp {site.phoneDisplay}<ArrowUpRight /></a>
        </div>
      </dialog>
    </>
  );
}
