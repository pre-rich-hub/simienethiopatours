import { NextResponse } from "next/server";
import { isLogScope, logError } from "@/lib/log";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const scope = String(body.scope || "");
  if (!isLogScope(scope)) {
    return NextResponse.json({ error: "Unknown scope." }, { status: 400 });
  }

  const message = String(body.message || "Client error").slice(0, 500);
  const digest = String(body.digest || "").slice(0, 80);

  logError(scope, message, digest ? { digest } : undefined);
  return NextResponse.json({ ok: true });
}
