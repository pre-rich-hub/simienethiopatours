"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, Check } from "@/components/Icon";

export function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "submitted">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitted");
  }

  if (status === "submitted") {
    return (
      <p className="newsletter-form__success">
        <Check size={15} /> Thank you — you&rsquo;re on the list.
      </p>
    );
  }

  return (
    <form className="newsletter-form" onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        placeholder="Your email address"
        aria-label="Email address"
        autoComplete="email"
        required
      />
      <button type="submit" aria-label="Subscribe">
        Subscribe <ArrowUpRight size={16} />
      </button>
    </form>
  );
}
