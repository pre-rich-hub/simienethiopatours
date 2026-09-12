/**
 * Server-side structured logs. Hosting (Vercel, etc.) already captures
 * console.error. Optional ERROR_WEBHOOK_URL gets the same JSON — never
 * NEXT_PUBLIC_. Do not put emails, names, or inquiry bodies in `extra`.
 */

export const LOG_SCOPES = [
  "inquiry-contacts",
  "inquiry-webhook",
  "locale-error",
  "admin-error",
  "global-error",
  "app-error",
] as const;

export type LogScope = (typeof LOG_SCOPES)[number];

export function isLogScope(value: string): value is LogScope {
  return (LOG_SCOPES as readonly string[]).includes(value);
}

type Extra = Record<string, string | number | boolean | undefined>;

function payload(level: "error" | "warn", scope: string, message: string, extra?: Extra) {
  return {
    level,
    scope,
    message: message.slice(0, 500),
    ...extra,
  };
}

function asMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export function logWarn(scope: LogScope, error: unknown, extra?: Extra) {
  console.warn("[gst]", JSON.stringify(payload("warn", scope, asMessage(error), extra)));
}

export function logError(scope: LogScope, error: unknown, extra?: Extra) {
  const digest =
    error && typeof error === "object" && "digest" in error
      ? String((error as { digest?: string }).digest || "")
      : "";
  const body = payload("error", scope, asMessage(error), {
    ...extra,
    digest: digest.slice(0, 80) || extra?.digest,
  });
  console.error("[gst]", JSON.stringify(body));
  void notify(body);
}

async function notify(body: object) {
  const url = process.env.ERROR_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(4000),
    });
  } catch {
    // Never throw from the logger.
  }
}
