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
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const links = [
  { href: "/simien-mountains", label: "Simien" },
  { href: "/treks", label: "Journeys" },
  { href: "/gondar", label: "Gondar" },
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
      { href: "/plan", label: "Plan nights in Gondar & Simien" },
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
      { href: "/gondar", label: "Gondar: festivals, food & local life" },
      { href: "/treks/ras-dashen-challenge", label: "Ras Dashen: Ethiopia's highest mountain" },
      { href: "/treks/10-day-simien-ras-dashen", label: "10-day Simien & Ras Dashen expedition" },
      { href: "/treks/gondar-heritage-simien", label: "5-day Gondar, Heritage & Simien" },
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
      { href: "/gondar#experiences", label: "Gondar experiences" },
      { href: "/treks/5-day-gondar-simien", label: "5-day Royal City & Mountain Adventure" },
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

  const compact = light || scrolled;

  return (
    <>
      <header
        className={cn(
          "site-header fixed inset-x-0 top-0 z-[60] border-b border-transparent text-white transition-[height,background-color,color,border-color,box-shadow] duration-500",
          compact ? "h-[72px] bg-ivory/94 text-ink shadow-[0_4px_24px_rgba(23,25,22,.035)] backdrop-blur-[18px] border-[rgba(23,25,22,.09)]" : "h-[88px] max-[720px]:h-[72px]",
          light && "site-header--light",
          scrolled && "is-scrolled",
        )}
      >
        <div className="mx-auto flex h-full w-[min(1440px,calc(100vw-72px))] items-center justify-between max-[720px]:w-[calc(100vw-34px)]">
          <BrandMark onDark={!light && !scrolled} />
          <nav className="desktop-nav ml-auto mr-[clamp(30px,3vw,52px)] hidden h-full items-center gap-[clamp(18px,2vw,34px)] min-[1101px]:flex" aria-label="Primary navigation">
            {links.map((link) => (
              megaMenus[link.href]
                ? <NavMegaMenu key={link.href} {...megaMenus[link.href]} />
                : <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined}>{link.label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-[18px]">
            <div className="max-[1100px]:hidden">
              <LanguageSwitcher />
            </div>
            <Link className={cn(buttonVariants({ variant: "ctaCopper", size: "ctaSm" }), "max-[1100px]:hidden max-[720px]:w-auto")} href="/plan">
              Plan with Tevan <ArrowUpRight size={15} />
            </Link>
          </div>
          <button
            ref={menuButtonRef}
            className="hidden size-11 border-0 bg-transparent p-2.5 text-inherit max-[1100px]:grid max-[1100px]:place-items-center"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-haspopup="dialog"
          >
            <Menu />
          </button>
        </div>
      </header>
      <dialog
        ref={menuRef}
        id="mobile-menu"
        className={cn("mobile-menu", open && "is-open")}
        aria-label="Site navigation"
        onCancel={(event) => { event.preventDefault(); setOpen(false); }}
      >
        <div className="mobile-menu__top">
          <BrandMark />
          <button className="grid size-11 place-items-center border-0 bg-transparent p-2.5 text-ink" onClick={() => setOpen(false)} aria-label="Close menu" autoFocus><X /></button>
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
          <Link className={buttonVariants({ variant: "ctaDark", size: "cta" })} href="/plan" onClick={() => setOpen(false)}>Plan your journey</Link>
          <a className="text-link" href={site.whatsapp} target="_blank" rel="noreferrer">WhatsApp {site.phoneDisplay}<ArrowUpRight /></a>
        </div>
      </dialog>
    </>
  );
}
