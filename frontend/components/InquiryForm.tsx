"use client";

import { ArrowRight, Check, LoaderCircle } from "@/components/Icon";
import { FormEvent, useState } from "react";
import { site } from "@/lib/site";
import { planningOptions } from "@/lib/experiences";
import { Button } from "@/components/ui/button";

type FormState = "idle" | "sending" | "success" | "email";

export function InquiryForm({ compact = false, initialExperience = "" }: { compact?: boolean; initialExperience?: string }) {
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
      if (result.delivery === "webhook") {
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
    <form className={`inquiry-form ${compact ? "inquiry-form--compact" : ""}`} onSubmit={submit}>
      {!compact && <div className="form-field form-field--wide">
        <label htmlFor="experience">Which experience interests you?</label>
        <select id="experience" name="experience" value={experience} onChange={(event) => setExperience(event.target.value)}>
          <option value="">I’m exploring — help me choose</option>
          {planningOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
        </select>
      </div>}
      <div className="form-field">
        <label htmlFor={`name-${compact}`}>Your name</label>
        <input id={`name-${compact}`} name="name" autoComplete="name" required placeholder="How should we address you?" />
      </div>
      <div className="form-field">
        <label htmlFor={`email-${compact}`}>Email address</label>
        <input id={`email-${compact}`} type="email" name="email" autoComplete="email" required placeholder="you@example.com" />
      </div>
      {!compact && <>
        <div className="form-field">
          <label htmlFor="dates">Travel window</label>
          <input id="dates" name="dates" placeholder="Month, dates, or still flexible" />
        </div>
        <div className="form-field">
          <label htmlFor="group">Travelers</label>
          <select id="group" name="group" defaultValue="">
            <option value="" disabled>Select group size</option>
            <option>Solo traveler</option><option>2 travelers</option><option>3–4 travelers</option><option>5–10 travelers</option><option>More than 10</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="duration">Time for Simien</label>
          <select id="duration" name="duration" defaultValue="">
            <option value="" disabled>Choose what feels possible</option>
            <option>1 day</option><option>2 days</option><option>3 days</option><option>4 days</option><option>5 days</option><option>6 days</option><option>10 days</option><option>I am not sure</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="interests">Main interest</label>
          <select id="interests" name="interests" defaultValue="">
            <option value="" disabled>What brings you to the mountains?</option>
            <option>Scenery and walking</option><option>Wildlife</option><option>Photography</option><option>Ras Dashen</option><option>Gondar and heritage</option><option>Food, coffee and local life</option><option>Festivals and holidays</option><option>Running and countryside</option><option>Accommodation and transport</option><option>A little of everything</option>
          </select>
        </div>
        <div className="form-field form-field--wide">
          <label htmlFor="accommodation">Preferred accommodation</label>
          <select id="accommodation" name="accommodation" defaultValue="">
            <option value="">Please advise for my journey</option><option>Higher-comfort hotel or lodge</option><option>Mid-range hotel</option><option>Guesthouse or budget stay</option><option>Camping</option><option>A mix of hotel and camping</option>
          </select>
        </div>
        {experience === "accommodation" && <>
          <p className="form-context">Share the nights you have in mind. We’ll connect your stays with the trekking route and arrival plans.</p>
          <div className="form-field"><label htmlFor="gondar-nights">Nights in Gondar</label><input id="gondar-nights" name="gondarNights" type="number" min="0" max="60" placeholder="Still flexible" /></div>
          <div className="form-field"><label htmlFor="simien-nights">Nights in Simien</label><input id="simien-nights" name="simienNights" type="number" min="0" max="60" placeholder="Still flexible" /></div>
          <div className="form-field form-field--wide"><label htmlFor="stay-budget">Accommodation budget</label><input id="stay-budget" name="budget" maxLength={200} placeholder="Your preferred range, currency and whether per night or total" /></div>
        </>}
      </>}
      <div className={`form-field form-field--wide ${compact ? "form-field--compact-message" : ""}`}>
        <label htmlFor={`message-${compact}`}>What are you imagining?</label>
        <textarea id={`message-${compact}`} name="message" rows={compact ? 3 : 5} placeholder="Tell Tevan what you want to see, what you enjoy, and anything you are unsure about." />
      </div>
      <div className="form-submit form-field--wide">
        <Button variant="ctaCopper" size="cta" type="submit" disabled={state === "sending"}>
          {state === "sending" ? <><LoaderCircle className="spin" /> Preparing email</> : state === "success" ? <><Check /> Inquiry sent</> : <>Send my inquiry <ArrowRight /></>}
        </Button>
        <p role="status">{state === "email" ? "Your email app should now open with your journey details." : <>Prefer a conversation? <a href={site.whatsapp} target="_blank" rel="noreferrer">Message us on WhatsApp.</a></>}</p>
      </div>
    </form>
  );
}
