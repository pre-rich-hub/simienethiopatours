import { NextResponse } from "next/server";
import { planningOptions } from "@/lib/experiences";
import { logError, logWarn } from "@/lib/log";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function composeMessage(payload: {
  dates: string;
  group: string;
  duration: string;
  interests: string;
  experience: string;
  accommodation: string;
  gondarNights: string;
  simienNights: string;
  budget: string;
  message: string;
}) {
  const lines = [
    payload.experience && `Experience: ${planningOptions.find((option) => option.id === payload.experience)?.label || payload.experience}`,
    payload.dates && `Travel window: ${payload.dates}`,
    payload.group && `Group size: ${payload.group}`,
    payload.duration && `Time in Simien: ${payload.duration}`,
    payload.interests && `Interests: ${payload.interests}`,
    payload.accommodation && `Accommodation: ${payload.accommodation}`,
    payload.gondarNights && `Nights in Gondar: ${payload.gondarNights}`,
    payload.simienNights && `Nights in Simien: ${payload.simienNights}`,
    payload.budget && `Accommodation budget: ${payload.budget}`,
  ].filter(Boolean);

  const body = payload.message || "Please help me plan my journey.";
  if (lines.length === 0) return body;
  return `${lines.join("\n")}\n\n${body}`;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = String(body.name || "").trim().slice(0, 120);
  const email = String(body.email || "").trim().slice(0, 200);
  if (!name || !emailPattern.test(email)) {
    return NextResponse.json({ error: "Please include a valid name and email." }, { status: 400 });
  }

  const safePayload = {
    name,
    email,
    dates: String(body.dates || "").slice(0, 200),
    group: String(body.group || "").slice(0, 80),
    duration: String(body.duration || "").slice(0, 80),
    interests: String(body.interests || "").slice(0, 160),
    experience: String(body.experience || "").slice(0, 120),
    accommodation: String(body.accommodation || "").slice(0, 120),
    gondarNights: String(body.gondarNights || "").slice(0, 8),
    simienNights: String(body.simienNights || "").slice(0, 8),
    budget: String(body.budget || "").slice(0, 200),
    message: String(body.message || "").slice(0, 3000),
    submittedAt: new Date().toISOString(),
  };

  const composedMessage = composeMessage(safePayload);

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
        body: JSON.stringify({ ...safePayload, message: composedMessage }),
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
