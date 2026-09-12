"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe } from "@/components/Icon";
import type { AppLocale } from "@/i18n/routing";

const languages = [
  { code: "en", short: "EN", label: "English", native: "English" },
  { code: "es", short: "ES", label: "Spanish", native: "Español" },
  { code: "de", short: "DE", label: "German", native: "Deutsch" },
  { code: "fr", short: "FR", label: "French", native: "Français" },
] as const satisfies ReadonlyArray<{
  code: AppLocale;
  short: string;
  label: string;
  native: string;
}>;

export function LanguageSwitcher({ mobile = false }: { mobile?: boolean }) {
  const t = useTranslations("language");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const current = languages.find((language) => language.code === locale) ?? languages[0];
  const href = search ? `${pathname}${search}` : pathname;

  useEffect(() => {
    setSearch(window.location.search);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus({ preventScroll: true });
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return <div ref={rootRef} className={`language-switcher ${mobile ? "language-switcher--mobile" : ""}`} data-open={open}>
    <button
      ref={triggerRef}
      type="button"
      className="language-switcher__trigger"
      aria-label={t("choose")}
      aria-haspopup="true"
      aria-expanded={open}
      aria-controls={mobile ? "mobile-language-menu" : "header-language-menu"}
      onClick={() => setOpen((value) => !value)}
      onKeyDown={(event) => {
        if (event.key !== "ArrowDown") return;
        event.preventDefault();
        setOpen(true);
        requestAnimationFrame(() => rootRef.current?.querySelector<HTMLAnchorElement>(".language-switcher__menu a")?.focus());
      }}
    >
      <Globe size={16} />
      <span>{mobile ? t("choose") : current.short}</span>
      <ChevronDown size={12} />
    </button>
    <div className="language-switcher__menu" id={mobile ? "mobile-language-menu" : "header-language-menu"} aria-hidden={!open} inert={!open}>
      <p>{t("label")}</p>
      {languages.map((language) => {
        const active = language.code === locale;
        return <Link
          key={language.code}
          className={active ? "is-active" : undefined}
          href={href}
          locale={language.code}
          replace
          hrefLang={language.code}
          lang={language.code}
          aria-current={active ? "true" : undefined}
          onClick={() => {
            if (active) setOpen(false);
          }}
        >
          <span><b>{language.short}</b><span>{language.native}<small>{language.label}</small></span></span>
          {active && <Check size={15} />}
        </Link>;
      })}
      <small className="language-switcher__note">{t("note")}</small>
    </div>
  </div>;
}
