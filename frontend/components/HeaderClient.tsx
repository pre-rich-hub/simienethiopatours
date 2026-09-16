"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { Menu, X, ArrowUpRight } from "@/components/Icon";
import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { BrandMark } from "./BrandMark";
import { NavMegaMenu } from "./NavMegaMenu";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { site } from "@/lib/site";
import type { NavMegaMenuCard } from "./NavMegaMenu";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const links = [
  { href: "/simien-mountains", key: "simien" },
  { href: "/treks", key: "journeys" },
  { href: "/gondar", key: "gondar" },
  { href: "/explore-ethiopia", key: "northern" },
  { href: "/about", key: "ourStory" },
  { href: "/gallery", key: "gallery" },
] as const;

export function HeaderClient({ light = false, simienMenuCards, gondarMenuCards, journeyMenuCards, publishedPaths }: { light?: boolean; simienMenuCards: NavMegaMenuCard[]; gondarMenuCards: NavMegaMenuCard[]; journeyMenuCards: NavMegaMenuCard[]; publishedPaths: string[] }) {
  const t = useTranslations("nav");
  const e = useTranslations("ethiopia");
  const tCommon = useTranslations("common");
  const tCta = useTranslations("cta");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDialogElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const richHeading = {
    br: () => <br />,
    em: (chunks: ReactNode) => <em>{chunks}</em>,
  };

  const megaMenus: Record<string, ComponentProps<typeof NavMegaMenu>> = {
    "/simien-mountains": {
      id: "simien-menu",
      label: t("simien"),
      matchPath: "/simien-mountains",
      eyebrow: t("simienMenu.eyebrow"),
      heading: t.rich("simienMenu.heading", richHeading),
      description: t("simienMenu.description"),
      exploreHref: "/simien-mountains",
      exploreLabel: t("simienMenu.explore"),
      extraLinks: [],
      cards: simienMenuCards,
    },
    "/treks": {
      id: "journeys-menu",
      label: t("journeys"),
      matchPath: "/treks",
      eyebrow: t("journeysMenu.eyebrow"),
      heading: t.rich("journeysMenu.heading", richHeading),
      description: t("journeysMenu.description"),
      exploreHref: "/treks",
      exploreLabel: t("journeysMenu.explore"),
      extraLinks: [],
      cards: journeyMenuCards,
    },
    "/explore-ethiopia": {
      id: "ethiopia-menu", label: e("explore"), matchPath: "/explore-ethiopia",
      eyebrow: e("destinations"), heading: e("explore"), description: e("exploreLead"),
      exploreHref: "/explore-ethiopia", exploreLabel: e("explore"), extraLinks: [],
      cards: [
        { slug: "historic", href: "/explore-ethiopia#historic", title: e("historic"), summary: e("historicLead"), image: "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789465910/Northern-Ethiopia.jpg", imageAlt: "Northern Ethiopia highland and historic landscapes" },
        { slug: "extensions", href: "/explore-ethiopia#extensions", title: e("extensions"), summary: e("extensionsLead"), image: "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789465909/Gheralta.jpg", imageAlt: "Gheralta sandstone cliffs and rock churches in Tigray" },
        { slug: "southern", href: "/southern-ethiopia", title: e("southern"), summary: e("southernLead"), image: "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789465911/outhern-Ethiopia-Journey.jpg", imageAlt: "Southern Ethiopia landscapes and road journey" },
      ].map(card => ({...card, tag: e("destinations"), style: ""})),
    },
    "/gondar": {
      id: "gondar-menu",
      label: t("gondar"),
      matchPath: "/gondar",
      eyebrow: t("gondarMenu.eyebrow"),
      heading: t.rich("gondarMenu.heading", richHeading),
      description: t("gondarMenu.description"),
      exploreHref: "/gondar",
      exploreLabel: t("gondarMenu.explore"),
      extraLinks: [],
      cards: gondarMenuCards,
    },
  };

  for (const menu of Object.values(megaMenus)) {
    menu.extraLinks = menu.extraLinks.filter(link => !/^\/(treks|gondar|simien-mountains)\//.test(link.href) || publishedPaths.includes(link.href));
  }

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
          <BrandMark onDark={!light && !scrolled} label={tCommon("homeAria")} />
          <nav className="desktop-nav ml-auto mr-[clamp(30px,3vw,52px)] hidden h-full items-center gap-[clamp(18px,2vw,34px)] min-[1101px]:flex" aria-label={tCommon("primaryNav")}>
            {links.map((link) => (
              megaMenus[link.href]
                ? <NavMegaMenu key={link.href} {...megaMenus[link.href]} />
                : <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined}>{t(link.key)}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-[18px]">
            <div className="max-[1100px]:hidden">
              <LanguageSwitcher />
            </div>
            <Link className={cn(buttonVariants({ variant: "ctaCopper", size: "ctaSm" }), "max-[1100px]:hidden max-[720px]:w-auto")} href="/plan">
              {tCta("planWithTevan")} <ArrowUpRight size={15} />
            </Link>
          </div>
          <button
            ref={menuButtonRef}
            className="mobile-menu-trigger hidden max-[1100px]:grid max-[1100px]:place-items-center"
            onClick={() => setOpen(true)}
            aria-label={tCommon("openMenu")}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-haspopup="dialog"
            data-open={open || undefined}
          >
            <Menu size={19} />
          </button>
        </div>
      </header>
      <dialog
        ref={menuRef}
        id="mobile-menu"
        className={cn("mobile-menu", open && "is-open")}
        aria-label={tCommon("siteNav")}
        onCancel={(event) => { event.preventDefault(); setOpen(false); }}
      >
        <div className="mobile-menu__top">
          <BrandMark onDark label={tCommon("homeAria")} />
          <button className="mobile-menu__close" onClick={() => setOpen(false)} aria-label={tCommon("closeMenu")} autoFocus><X size={17} /></button>
        </div>
        <nav aria-label={tCommon("mobileNav")}>
          {links.map((link, index) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} aria-current={pathname === link.href || pathname.startsWith(`${link.href}/`) ? "page" : undefined}>
              <span>0{index + 1}</span>{t(link.key)}<ArrowUpRight />
            </Link>
          ))}

        </nav>
        <div className="mobile-menu__contact">
          <LanguageSwitcher mobile />
          <p>{t("mobileLead")}</p>
          <Link className={buttonVariants({ variant: "ctaCopper", size: "cta" })} href="/plan" onClick={() => setOpen(false)}>{tCta("planYourJourney")}</Link>
          <a className="text-link" href={site.whatsapp} target="_blank" rel="noreferrer">{tCta("whatsappWithPhone", { phone: site.phoneDisplay })}<ArrowUpRight /></a>
        </div>
      </dialog>
    </>
  );
}
