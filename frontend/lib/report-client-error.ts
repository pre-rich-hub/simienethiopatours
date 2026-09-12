/** Browser errors → console + POST /api/log (server console / optional webhook). */

export function reportClientError(
  scope: "locale-error" | "admin-error" | "global-error" | "app-error",
  error: Error & { digest?: string },
) {
  console.error("[gst]", scope, error.message, error.digest);
  void fetch("/api/log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      scope,
      message: error.message.slice(0, 500),
      digest: error.digest,
    }),
  }).catch(() => {});
}
