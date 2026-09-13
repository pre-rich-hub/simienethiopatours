"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight, Check } from "@/components/Icon";
import { site } from "@/lib/site";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type NewsletterStatus = "idle" | "sending" | "submitted" | "error" | "unavailable";

export function NewsletterForm() {
  const t = useTranslations("newsletter");
  const [status, setStatus] = useState<NewsletterStatus>("idle");
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

      let payload: {
        status?: string;
        message?: string;
        data?: { alreadySubscribed?: boolean };
      } | null = null;
      try {
        payload = await response.json();
      } catch {
        payload = null;
      }

      const alreadySubscribed =
        payload?.data?.alreadySubscribed === true ||
        /already subscribed/i.test(String(payload?.message || ""));

      if (response.ok || alreadySubscribed) {
        setStatus("submitted");
        form.reset();
        return;
      }

      setStatus("error");
      setError(t("error"));
    } catch {
      setStatus("unavailable");
      setError("");
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
      <p className="newsletter-form__consent">
        {t.rich("consent", {
          privacy: (chunks) => (
            <Link href="/privacy" className="underline underline-offset-2">
              {chunks}
            </Link>
          ),
        })}
      </p>
      {status === "unavailable" && (
        <p className="newsletter-form__error" role="alert">
          {t.rich("unavailable", {
            email: (chunks) => (
              <a href={`mailto:${site.email}?subject=${encodeURIComponent("Newsletter signup")}`}>
                {chunks}
              </a>
            ),
          })}
        </p>
      )}
      {status === "error" && error && (
        <p className="newsletter-form__error" role="alert">{error}</p>
      )}
    </div>
  );
}
