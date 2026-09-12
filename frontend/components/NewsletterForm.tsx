"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRight, Check } from "@/components/Icon";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function NewsletterForm() {
  const t = useTranslations("newsletter");
  const [status, setStatus] = useState<"idle" | "sending" | "submitted" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = String(new FormData(form).get("email") || "").trim();
    if (!email) return;

    setStatus("sending");
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/v1/subscribers`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email }),
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) throw new Error("Subscribe failed");
      setStatus("submitted");
      form.reset();
    } catch {
      setStatus("error");
      setError(t("error"));
    }
  }

  if (status === "submitted") {
    return (
      <p className="newsletter-form__success">
        <Check size={15} /> {t("success")}
      </p>
    );
  }

  return (
    <div className="newsletter-form-wrap">
      <form className="newsletter-form" onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        placeholder={t("placeholder")}
        aria-label={t("emailAria")}
        autoComplete="email"
        required
        disabled={status === "sending"}
      />
      <button type="submit" aria-label={t("subscribe")} disabled={status === "sending"}>
        {status === "sending" ? t("sending") : <>{t("subscribe")} <ArrowUpRight size={16} /></>}
      </button>
      </form>
      {status === "error" && (
        <p className="newsletter-form__error" role="alert">{error}</p>
      )}
    </div>
  );
}
