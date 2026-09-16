"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { MessageCircle, X } from "@/components/Icon";
import { site } from "@/lib/site";

const AssistantChat = dynamic(
  () => import("@/components/AssistantChat").then((mod) => mod.AssistantChat),
  { ssr: false },
);

function WhatsappIcon() {
  return <svg viewBox="0 0 32 32" aria-hidden="true" className="size-7 max-[720px]:size-[25px]">
    <path fill="currentColor" d="M16.02 4C9.4 4 4 9.37 4 15.98c0 2.15.57 4.16 1.56 5.9L4 28l6.3-1.53a12 12 0 0 0 5.72 1.45h.01c6.62 0 12.01-5.37 12.01-11.98C28.04 9.37 22.65 4 16.02 4Zm0 21.8h-.01a9.9 9.9 0 0 1-5.05-1.39l-.36-.21-3.74.91 1-3.65-.24-.37a9.83 9.83 0 0 1-1.5-5.11c0-5.44 4.44-9.87 9.9-9.87 2.64 0 5.13 1.03 6.99 2.9a9.78 9.78 0 0 1 2.9 6.98c0 5.45-4.44 9.81-9.89 9.81Zm5.42-7.36c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.24-.46-2.36-1.46-.87-.78-1.46-1.73-1.63-2.03-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.75-.71 2-1.4.25-.68.25-1.27.17-1.4-.07-.13-.27-.2-.57-.35Z" />
  </svg>;
}

const fabClass = "grid size-[58px] place-items-center rounded-full border-2 border-[rgba(250,248,241,.85)] text-white shadow-[0_4px_12px_rgba(23,25,22,.18),0_18px_40px_rgba(23,25,22,.28)] transition-transform hover:-translate-y-[3px] hover:scale-[1.045] hover:shadow-[0_6px_16px_rgba(23,25,22,.22),0_26px_52px_rgba(23,25,22,.34)] max-[720px]:size-[52px]";

export function FloatingContact() {
  const t = useTranslations("cta");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const dismissOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false);
    };
    const dismissOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      toggleRef.current?.focus({ preventScroll: true });
    };
    document.addEventListener("pointerdown", dismissOutside);
    document.addEventListener("keydown", dismissOnEscape);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside);
      document.removeEventListener("keydown", dismissOnEscape);
    };
  }, [open]);

  // Lift and shrink the mobile sheet when the software keyboard covers the visual viewport.
  useEffect(() => {
    if (!open) return;
    const root = rootRef.current;
    const viewport = window.visualViewport;
    if (!root || !viewport) return;

    const syncViewport = () => {
      const keyboardInset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      root.style.setProperty("--keyboard-inset", `${Math.round(keyboardInset)}px`);
      root.style.setProperty("--floating-vvh", `${Math.round(viewport.height)}px`);
    };

    syncViewport();
    viewport.addEventListener("resize", syncViewport);
    viewport.addEventListener("scroll", syncViewport);
    return () => {
      viewport.removeEventListener("resize", syncViewport);
      viewport.removeEventListener("scroll", syncViewport);
      root.style.removeProperty("--keyboard-inset");
      root.style.removeProperty("--floating-vvh");
    };
  }, [open]);

  return (
    <div ref={rootRef} className="floating-contact">
      {open ? <AssistantChat open onClose={() => setOpen(false)} /> : null}

      <a
        className={`${fabClass} bg-[#25d366]`}
        href={site.whatsapp}
        target="_blank"
        rel="noreferrer"
        aria-label={t("chatOnWhatsApp", { phone: site.phoneDisplay })}
      >
        <WhatsappIcon />
      </a>

      <button
        ref={toggleRef}
        type="button"
        className={`${fabClass} bg-ink`}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={open ? t("closeAiChat") : t("openAiChat")}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
