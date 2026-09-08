"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe } from "@/components/Icon";

const languages = [
  { code: "en", short: "EN", label: "English", native: "English" },
  { code: "es", short: "ES", label: "Spanish", native: "Español" },
  { code: "de", short: "DE", label: "German", native: "Deutsch" },
  { code: "fr", short: "FR", label: "French", native: "Français" },
] as const;

export function LanguageSwitcher({ mobile = false }: { mobile?: boolean }) {
  const [open, setOpen] = useState(false);
  const [pageUrl, setPageUrl] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setPageUrl(window.location.href);
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

  function languageUrl(code: string) {
    if (code === "en") return pageUrl || pathname;
    const url = pageUrl || `https://gondarsimientours.com${pathname}`;
    return `https://translate.google.com/translate?sl=en&tl=${code}&u=${encodeURIComponent(url)}`;
  }

  return <div ref={rootRef} className={`language-switcher ${mobile ? "language-switcher--mobile" : ""}`} data-open={open}>
    <button
      ref={triggerRef}
      type="button"
      className="language-switcher__trigger"
      aria-label="Choose language"
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
      <span>{mobile ? "Choose language" : "EN"}</span>
      <ChevronDown size={12} />
    </button>
    <div className="language-switcher__menu" id={mobile ? "mobile-language-menu" : "header-language-menu"} aria-hidden={!open} inert={!open}>
      <p>Language</p>
      {languages.map((language) => <a
        key={language.code}
        href={languageUrl(language.code)}
        hrefLang={language.code}
        lang={language.code}
        onClick={() => setOpen(false)}
      >
        <span><b>{language.short}</b><span>{language.native}<small>{language.label}</small></span></span>
        {language.code === "en" && <Check size={15} />}
      </a>)}
      <small className="language-switcher__note">Translations are provided automatically.</small>
    </div>
  </div>;
}
