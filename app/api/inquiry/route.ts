import { NextResponse } from "next/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    message: String(body.message || "").slice(0, 3000),
    submittedAt: new Date().toISOString(),
  };

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json({ delivery: "email", message: "Continue in your email app." });
  }

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(safePayload),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error("Webhook rejected inquiry");
    return NextResponse.json({ delivery: "webhook" });
  } catch {
    return NextResponse.json({ delivery: "email", message: "Continue in your email app." });
  }
}
