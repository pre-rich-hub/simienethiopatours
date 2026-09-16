"use client";

import { ArrowRight, Check, LoaderCircle } from "@/components/Icon";
import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { site } from "@/lib/site";
import { planningOptions } from "@/lib/experiences";
import { isHoneypotFilled, parseInquiry } from "@/lib/inquiry-schema";
import { Button } from "@/components/ui/button";

type FormState = "idle" | "sending" | "success" | "email" | "validation" | "rateLimited";

export function InquiryForm({
  compact = false,
  initialExperience = "",
  initialMessage = "",
}: {
  compact?: boolean;
  initialExperience?: string;
  initialMessage?: string;
}) {
  const t = useTranslations("inquiry");
  const [state, setState] = useState<FormState>("idle");
  const [experience, setExperience] = useState(initialExperience);
  const [statusMessage, setStatusMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage("");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    const parsed = parseInquiry(data);
    if (!parsed.success) {
      setState("validation");
      setStatusMessage(t("validationError"));
      return;
    }

    // Never call the API for honeypot fills; pretend success.
    if (isHoneypotFilled(parsed.data)) {
      setState("success");
      form.reset();
      return;
    }

    setState("sending");

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (response.status === 429) {
        setState("rateLimited");
        setStatusMessage(t("rateLimited"));
        return;
      }

      if (response.status === 400) {
        setState("validation");
        setStatusMessage(t("validationError"));
        return;
      }

      const result = await response.json();
      if (result.delivery === "contact" || result.delivery === "webhook") {
        setState("success");
        form.reset();
        return;
      }
    } catch {
      // The email fallback below works even when the optional webhook is absent.
    }

    const experienceId = String(data.experience || "");
    const experienceKey = `experiences.${experienceId}` as Parameters<typeof t>[0];
    const experienceLabel =
      (experienceId && t.has(experienceKey) ? t(experienceKey) : "") || t("mailtoPleaseAdvise");

    const subject = encodeURIComponent(`Journey inquiry from ${String(data.name || "a traveler")}`);
    const body = encodeURIComponent([
      `Name: ${data.name || ""}`,
      `Email: ${data.email || ""}`,
      `Travel window: ${data.dates || t("mailtoNotDecided")}`,
      `Group size: ${data.group || t("mailtoNotSpecified")}`,
      `Time in Simien: ${data.duration || t("mailtoNotSure")}`,
      `Interests: ${data.interests || ""}`,
      `Experience: ${experienceLabel}`,
      `Accommodation preference: ${data.accommodation || t("mailtoPleaseAdvise")}`,
      `Nights in Gondar: ${data.gondarNights || t("mailtoNotDecided")}`,
      `Nights in Simien: ${data.simienNights || t("mailtoNotDecided")}`,
      `Accommodation budget: ${data.budget || t("mailtoNotSpecified")}`,
      "",
      String(data.message || t("mailtoDefaultMessage")),
    ].join("\n"));
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setState("email");
  }

  return (
    <form method="post" className={`inquiry-form relative ${compact ? "inquiry-form--compact" : ""}`} onSubmit={submit}>
      {/* Honeypot: leave empty. Hidden from assistive tech and keyboard. */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor={`company-${compact}`}>Company</label>
        <input
          id={`company-${compact}`}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>
      {!compact && <div className="form-field form-field--wide">
        <label htmlFor="experience">{t("experience")}</label>
        <select id="experience" name="experience" value={experience} onChange={(event) => setExperience(event.target.value)}>
          <option value="">{t("experienceExplore")}</option>
          {planningOptions.map((option) => {
            const key = `experiences.${option.id}` as Parameters<typeof t>[0];
            return (
              <option key={option.id} value={option.id}>
                {t(key)}
              </option>
            );
          })}
        </select>
      </div>}
      <div className="form-field">
        <label htmlFor={`name-${compact}`}>{t("name")}</label>
        <input id={`name-${compact}`} name="name" autoComplete="name" required placeholder={t("namePlaceholder")} />
      </div>
      <div className="form-field">
        <label htmlFor={`email-${compact}`}>{t("email")}</label>
        <input id={`email-${compact}`} type="email" name="email" autoComplete="email" required placeholder={t("emailPlaceholder")} />
      </div>
      {!compact && <>
        <div className="form-field">
          <label htmlFor="dates">{t("dates")}</label>
          <input id="dates" name="dates" placeholder={t("datesPlaceholder")} />
        </div>
        <div className="form-field">
          <label htmlFor="group">{t("group")}</label>
          <select id="group" name="group" defaultValue="">
            <option value="" disabled>{t("groupPlaceholder")}</option>
            <option value="solo">{t("groupSolo")}</option>
            <option value="two">{t("groupTwo")}</option>
            <option value="three-four">{t("groupThreeFour")}</option>
            <option value="five-ten">{t("groupFiveTen")}</option>
            <option value="more">{t("groupMore")}</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="duration">{t("duration")}</label>
          <select id="duration" name="duration" defaultValue="">
            <option value="" disabled>{t("durationPlaceholder")}</option>
            <option value="1">{t("duration1")}</option>
            <option value="2">{t("duration2")}</option>
            <option value="3">{t("duration3")}</option>
            <option value="4">{t("duration4")}</option>
            <option value="5">{t("duration5")}</option>
            <option value="6">{t("duration6")}</option>
            <option value="10">{t("duration10")}</option>
            <option value="unsure">{t("durationUnsure")}</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="interests">{t("interests")}</label>
          <select id="interests" name="interests" defaultValue="">
            <option value="" disabled>{t("interestsPlaceholder")}</option>
            <option value="scenery">{t("interestScenery")}</option>
            <option value="wildlife">{t("interestWildlife")}</option>
            <option value="photography">{t("interestPhotography")}</option>
            <option value="ras-dashen">{t("interestRasDashen")}</option>
            <option value="heritage">{t("interestHeritage")}</option>
            <option value="food">{t("interestFood")}</option>
            <option value="festivals">{t("interestFestivals")}</option>
            <option value="running">{t("interestRunning")}</option>
            <option value="stay">{t("interestStay")}</option>
            <option value="everything">{t("interestEverything")}</option>
          </select>
        </div>
        <div className="form-field form-field--wide">
          <label htmlFor="accommodation">{t("accommodation")}</label>
          <select id="accommodation" name="accommodation" defaultValue="">
            <option value="">{t("accommodationAdvise")}</option>
            <option value="high">{t("accommodationHigh")}</option>
            <option value="mid">{t("accommodationMid")}</option>
            <option value="budget">{t("accommodationBudget")}</option>
            <option value="camping">{t("accommodationCamping")}</option>
            <option value="mix">{t("accommodationMix")}</option>
          </select>
        </div>
        {experience === "accommodation" && <>
          <p className="form-context">{t("stayContext")}</p>
          <div className="form-field"><label htmlFor="gondar-nights">{t("gondarNights")}</label><input id="gondar-nights" name="gondarNights" type="number" min="0" max="60" placeholder={t("nightsPlaceholder")} /></div>
          <div className="form-field"><label htmlFor="simien-nights">{t("simienNights")}</label><input id="simien-nights" name="simienNights" type="number" min="0" max="60" placeholder={t("nightsPlaceholder")} /></div>
          <div className="form-field form-field--wide"><label htmlFor="stay-budget">{t("budget")}</label><input id="stay-budget" name="budget" maxLength={200} placeholder={t("budgetPlaceholder")} /></div>
        </>}
      </>}
      <div className={`form-field form-field--wide ${compact ? "form-field--compact-message" : ""}`}>
        <label htmlFor={`message-${compact}`}>{t("message")}</label>
        <textarea id={`message-${compact}`} name="message" rows={compact ? 3 : 5} defaultValue={initialMessage} placeholder={t("messagePlaceholder")} />
      </div>
      <p className="form-consent form-field--wide text-[12px] leading-[1.6] text-[var(--stone)]">
        {t.rich("consent", {
          privacy: (chunks) => <Link href="/privacy" className="underline underline-offset-2">{chunks}</Link>,
        })}
      </p>
      <div className="form-submit form-field--wide">
        <Button variant="ctaCopper" size="cta" type="submit" disabled={state === "sending"}>
          {state === "sending" ? <><LoaderCircle className="spin" /> {t("sending")}</> : state === "success" ? <><Check /> {t("sent")}</> : <>{t("submit")} <ArrowRight /></>}
        </Button>
        {(state === "validation" || state === "rateLimited") && statusMessage ? (
          <p role="alert" className="form-status-error">{statusMessage}</p>
        ) : (
          <p role="status">{state === "email" ? t("emailOpened") : <>{t("preferChat")} <a href={site.whatsapp} target="_blank" rel="noreferrer">{t("messageWhatsApp")}</a></>}</p>
        )}
      </div>
    </form>
  );
}
