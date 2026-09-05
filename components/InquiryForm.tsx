"use client";

import { ArrowRight, Check, LoaderCircle } from "@/components/Icon";
import { FormEvent, useState } from "react";
import { site } from "@/lib/site";

type FormState = "idle" | "sending" | "success" | "email";

export function InquiryForm({ compact = false }: { compact?: boolean }) {
  const [state, setState] = useState<FormState>("idle");

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
      "",
      String(data.message || "Please help me plan my journey."),
    ].join("\n"));
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setState("email");
  }

  return (
    <form className={`inquiry-form ${compact ? "inquiry-form--compact" : ""}`} onSubmit={submit}>
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
            <option>1 day</option><option>3 days</option><option>4 days</option><option>6 days</option><option>10 days</option><option>I am not sure</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="interests">Main interest</label>
          <select id="interests" name="interests" defaultValue="">
            <option value="" disabled>What brings you to the mountains?</option>
            <option>Scenery and walking</option><option>Wildlife</option><option>Photography</option><option>Ras Dashen</option><option>Gondar and heritage</option><option>A little of everything</option>
          </select>
        </div>
      </>}
      <div className={`form-field form-field--wide ${compact ? "form-field--compact-message" : ""}`}>
        <label htmlFor={`message-${compact}`}>What are you imagining?</label>
        <textarea id={`message-${compact}`} name="message" rows={compact ? 3 : 5} placeholder="Tell Tevan what you want to see, what you enjoy, and anything you are unsure about." />
      </div>
      <div className="form-submit form-field--wide">
        <button className="button button--copper" type="submit" disabled={state === "sending"}>
          {state === "sending" ? <><LoaderCircle className="spin" /> Preparing email</> : state === "success" ? <><Check /> Inquiry sent</> : <>Send my inquiry <ArrowRight /></>}
        </button>
        <p>{state === "email" ? "Your email app should now open with your journey details." : <>Prefer a conversation? <a href={site.whatsapp} target="_blank" rel="noreferrer">Message us on WhatsApp.</a></>}</p>
      </div>
    </form>
  );
}
