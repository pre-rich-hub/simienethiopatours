"use client";

import { ArrowRight, Check, LoaderCircle } from "@/components/Icon";
import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { site } from "@/lib/site";
import { planningOptions } from "@/lib/experiences";
import { Button } from "@/components/ui/button";

type FormState = "idle" | "sending" | "success" | "email";

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

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.delivery === "contact" || result.delivery === "webhook") {
        setState("success");
        form.reset();
        return;
      }
    } catch {
      // The email fallback below works even when the optional webhook is absent.
    }

    const subject = encodeURIComponent(`Journey inquiry from ${String(data.name || "a traveler")}`);
    const body = encodeURIComponent([
      `Name: ${data.name || ""}`,
      `Email: ${data.email || ""}`,
      `Travel window: ${data.dates || "Not decided"}`,
      `Group size: ${data.group || "Not specified"}`,
      `Time in Simien: ${data.duration || "Not sure"}`,
      `Interests: ${data.interests || ""}`,
      `Experience: ${planningOptions.find((option) => option.id === data.experience)?.label || "Please advise"}`,
      `Accommodation preference: ${data.accommodation || "Please advise"}`,
      `Nights in Gondar: ${data.gondarNights || "Not decided"}`,
      `Nights in Simien: ${data.simienNights || "Not decided"}`,
      `Accommodation budget: ${data.budget || "Not specified"}`,
      "",
      String(data.message || "Please help me plan my journey."),
    ].join("\n"));
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setState("email");
  }

  return (
    <form method="post" className={`inquiry-form ${compact ? "inquiry-form--compact" : ""}`} onSubmit={submit}>
      {!compact && <div className="form-field form-field--wide">
        <label htmlFor="experience">{t("experience")}</label>
        <select id="experience" name="experience" value={experience} onChange={(event) => setExperience(event.target.value)}>
          <option value="">{t("experienceExplore")}</option>
          {planningOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
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
            <option value="Solo traveler">{t("groupSolo")}</option>
            <option value="2 travelers">{t("groupTwo")}</option>
            <option value="3–4 travelers">{t("groupThreeFour")}</option>
            <option value="5–10 travelers">{t("groupFiveTen")}</option>
            <option value="More than 10">{t("groupMore")}</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="duration">{t("duration")}</label>
          <select id="duration" name="duration" defaultValue="">
            <option value="" disabled>{t("durationPlaceholder")}</option>
            <option value="1 day">{t("duration1")}</option>
            <option value="2 days">{t("duration2")}</option>
            <option value="3 days">{t("duration3")}</option>
            <option value="4 days">{t("duration4")}</option>
            <option value="5 days">{t("duration5")}</option>
            <option value="6 days">{t("duration6")}</option>
            <option value="10 days">{t("duration10")}</option>
            <option value="I am not sure">{t("durationUnsure")}</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="interests">{t("interests")}</label>
          <select id="interests" name="interests" defaultValue="">
            <option value="" disabled>{t("interestsPlaceholder")}</option>
            <option value="Scenery and walking">{t("interestScenery")}</option>
            <option value="Wildlife">{t("interestWildlife")}</option>
            <option value="Photography">{t("interestPhotography")}</option>
            <option value="Ras Dashen">{t("interestRasDashen")}</option>
            <option value="Gondar and heritage">{t("interestHeritage")}</option>
            <option value="Food, coffee and local life">{t("interestFood")}</option>
            <option value="Festivals and holidays">{t("interestFestivals")}</option>
            <option value="Running and countryside">{t("interestRunning")}</option>
            <option value="Accommodation and transport">{t("interestStay")}</option>
            <option value="A little of everything">{t("interestEverything")}</option>
          </select>
        </div>
        <div className="form-field form-field--wide">
          <label htmlFor="accommodation">{t("accommodation")}</label>
          <select id="accommodation" name="accommodation" defaultValue="">
            <option value="">{t("accommodationAdvise")}</option>
            <option value="Higher-comfort hotel or lodge">{t("accommodationHigh")}</option>
            <option value="Mid-range hotel">{t("accommodationMid")}</option>
            <option value="Guesthouse or budget stay">{t("accommodationBudget")}</option>
            <option value="Camping">{t("accommodationCamping")}</option>
            <option value="A mix of hotel and camping">{t("accommodationMix")}</option>
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
      <div className="form-submit form-field--wide">
        <Button variant="ctaCopper" size="cta" type="submit" disabled={state === "sending"}>
          {state === "sending" ? <><LoaderCircle className="spin" /> {t("sending")}</> : state === "success" ? <><Check /> {t("sent")}</> : <>{t("submit")} <ArrowRight /></>}
        </Button>
        <p role="status">{state === "email" ? t("emailOpened") : <>{t("preferChat")} <a href={site.whatsapp} target="_blank" rel="noreferrer">{t("messageWhatsApp")}</a></>}</p>
      </div>
    </form>
  );
}
