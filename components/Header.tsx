"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "@/components/Icon";
import { useEffect, useRef, useState } from "react";
import { BrandMark } from "./BrandMark";
import { JourneyDropdown } from "./JourneyDropdown";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { site } from "@/lib/site";

const links = [
  { href: "/simien-mountains", label: "Simien" },
  { href: "/treks", label: "Journeys" },
  { href: "/gondar", label: "Gondar" },
  { href: "/beyond-the-trail", label: "Experiences" },
  { href: "/about", label: "Our story" },
  { href: "/gallery", label: "Gallery" },
];

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
              link.href === "/treks"
                ? <JourneyDropdown key={link.href} />
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
          <a href={site.whatsapp} target="_blank" rel="noreferrer">WhatsApp {site.phoneDisplay}</a>
        </div>
      </dialog>
    </>
  );
}
