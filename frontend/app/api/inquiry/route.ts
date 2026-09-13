import { NextResponse } from "next/server";
import { planningOptions } from "@/lib/experiences";
import {
  ACCOMMODATION_IDS,
  DURATION_IDS,
  GROUP_IDS,
  INTEREST_IDS,
  isHoneypotFilled,
  parseInquiry,
  type InquiryInput,
} from "@/lib/inquiry-schema";
import { logError, logWarn } from "@/lib/log";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/** Stable form IDs → English labels for the operator inbox (never locale UI copy). */
const GROUP_LABELS: Record<(typeof GROUP_IDS)[number], string> = {
  solo: "Solo traveler",
  two: "2 travelers",
  "three-four": "3–4 travelers",
  "five-ten": "5–10 travelers",
  more: "More than 10",
};

const DURATION_LABELS: Record<(typeof DURATION_IDS)[number], string> = {
  "1": "1 day",
  "2": "2 days",
  "3": "3 days",
  "4": "4 days",
  "5": "5 days",
  "6": "6 days",
  "10": "10 days",
  unsure: "I am not sure",
};

const INTEREST_LABELS: Record<(typeof INTEREST_IDS)[number], string> = {
  scenery: "Scenery and walking",
  wildlife: "Wildlife",
  photography: "Photography",
  "ras-dashen": "Ras Dashen",
  heritage: "Gondar and heritage",
  food: "Food, coffee and local life",
  festivals: "Festivals and holidays",
  running: "Running and countryside",
  stay: "Accommodation and transport",
  everything: "A little of everything",
};

const ACCOMMODATION_LABELS: Record<(typeof ACCOMMODATION_IDS)[number], string> = {
  high: "Higher-comfort hotel or lodge",
  mid: "Mid-range hotel",
  budget: "Guesthouse or budget stay",
  camping: "Camping",
  mix: "A mix of hotel and camping",
};

function label(map: Record<string, string>, value: string) {
  return map[value] || value;
}

function composeMessage(payload: InquiryInput) {
  const experienceLabel =
    planningOptions.find((option) => option.id === payload.experience)?.label || payload.experience;

  const lines = [
    payload.experience && `Experience: ${experienceLabel}`,
    payload.dates && `Travel window: ${payload.dates}`,
    payload.group && `Group size: ${label(GROUP_LABELS, payload.group)}`,
    payload.duration && `Time in Simien: ${label(DURATION_LABELS, payload.duration)}`,
    payload.interests && `Interests: ${label(INTEREST_LABELS, payload.interests)}`,
    payload.accommodation && `Accommodation: ${label(ACCOMMODATION_LABELS, payload.accommodation)}`,
    payload.gondarNights && `Nights in Gondar: ${payload.gondarNights}`,
    payload.simienNights && `Nights in Simien: ${payload.simienNights}`,
    payload.budget && `Accommodation budget: ${payload.budget}`,
  ].filter(Boolean);

  const body = payload.message || "Please help me plan my journey.";
  if (lines.length === 0) return body;
  return `${lines.join("\n")}\n\n${body}`;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = parseInquiry(body);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const first =
      Object.values(fieldErrors).flat().find((message) => Boolean(message)) ||
      "Please check your details and try again.";
    return NextResponse.json({ error: first, errors: fieldErrors }, { status: 400 });
  }

  const safePayload = parsed.data;

  // Silent success for bots that fill the honeypot — do not store or notify.
  if (isHoneypotFilled(safePayload)) {
    return NextResponse.json({ delivery: "contact" });
  }

  const { name, email } = safePayload;
  const composedMessage = composeMessage(safePayload);
  const submittedAt = new Date().toISOString();

  try {
    const response = await fetch(`${API_BASE}/api/v1/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ name, email, message: composedMessage }),
      signal: AbortSignal.timeout(8000),
    });
    if (response.ok) {
      return NextResponse.json({ delivery: "contact" });
    }
    if (response.status === 429) {
      return NextResponse.json(
        { error: "Too many inquiries. Please wait a few minutes and try again." },
        { status: 429 },
      );
    }
    logWarn("inquiry-contacts", `contacts API ${response.status}`);
  } catch (error) {
    logWarn("inquiry-contacts", error);
  }

  // Server-only. Do not expose as NEXT_PUBLIC_CONTACT_WEBHOOK_URL.
  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    try {
      const response = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: safePayload.name,
          email: safePayload.email,
          dates: safePayload.dates,
          group: safePayload.group,
          duration: safePayload.duration,
          interests: safePayload.interests,
          experience: safePayload.experience,
          accommodation: safePayload.accommodation,
          gondarNights: safePayload.gondarNights,
          simienNights: safePayload.simienNights,
          budget: safePayload.budget,
          message: composedMessage,
          submittedAt,
        }),
        signal: AbortSignal.timeout(8000),
      });
      if (response.ok) {
        return NextResponse.json({ delivery: "webhook" });
      }
      logError("inquiry-webhook", `webhook ${response.status}`);
    } catch (error) {
      logError("inquiry-webhook", error);
    }
  }

  return NextResponse.json({ delivery: "email", message: "Continue in your email app." });
}
