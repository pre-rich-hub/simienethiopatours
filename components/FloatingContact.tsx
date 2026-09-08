"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, MessageCircle, X } from "@/components/Icon";
import { site } from "@/lib/site";

function WhatsappIcon() {
  return <svg viewBox="0 0 32 32" aria-hidden="true" className="floating-contact__whatsapp-icon">
    <path fill="currentColor" d="M16.02 4C9.4 4 4 9.37 4 15.98c0 2.15.57 4.16 1.56 5.9L4 28l6.3-1.53a12 12 0 0 0 5.72 1.45h.01c6.62 0 12.01-5.37 12.01-11.98C28.04 9.37 22.65 4 16.02 4Zm0 21.8h-.01a9.9 9.9 0 0 1-5.05-1.39l-.36-.21-3.74.91 1-3.65-.24-.37a9.83 9.83 0 0 1-1.5-5.11c0-5.44 4.44-9.87 9.9-9.87 2.64 0 5.13 1.03 6.99 2.9a9.78 9.78 0 0 1 2.9 6.98c0 5.45-4.44 9.81-9.89 9.81Zm5.42-7.36c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.24-.46-2.36-1.46-.87-.78-1.46-1.73-1.63-2.03-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.75-.71 2-1.4.25-.68.25-1.27.17-1.4-.07-.13-.27-.2-.57-.35Z" />
  </svg>;
}

export function FloatingContact() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const dismissOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false);
    };
    const dismissOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", dismissOutside);
    document.addEventListener("keydown", dismissOnEscape);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside);
      document.removeEventListener("keydown", dismissOnEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="floating-contact">
      <div className={`floating-contact__panel ${open ? "is-open" : ""}`} role="dialog" aria-label="Contact options" aria-hidden={!open} inert={!open}>
        <div className="floating-contact__panel-header">
          <span>Start a conversation</span>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close contact options"><X size={16} /></button>
        </div>
        <p>Tevan and the local team usually reply within a day.</p>
        <div className="floating-contact__links">
          <a href={site.whatsapp} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
            <span>WhatsApp {site.phoneDisplay}</span><ArrowUpRight size={14} />
          </a>
          <Link href="/plan" onClick={() => setOpen(false)}>
            <span>Plan your journey</span><ArrowUpRight size={14} />
          </Link>
          <a href={`mailto:${site.email}`} onClick={() => setOpen(false)}>
            <span>Email us</span><ArrowUpRight size={14} />
          </a>
        </div>
      </div>

      <a
        className="floating-contact__button floating-contact__button--whatsapp"
        href={site.whatsapp}
        target="_blank"
        rel="noreferrer"
        aria-label={`Chat on WhatsApp: ${site.phoneDisplay}`}
      >
        <WhatsappIcon />
      </a>

      <button
        type="button"
        className="floating-contact__button floating-contact__button--chat"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={open ? "Close contact options" : "Open contact options"}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
