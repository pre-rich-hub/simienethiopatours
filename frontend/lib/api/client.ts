/**
 * Server-side safe fetch helper for the backend API.
 *
 * - Never throws. Returns null on any failure (network, timeout, non-200).
 * - Uses an AbortController timeout so a dead backend does not stall SSR.
 * - Prefers the server-only API_URL env var, falls back to NEXT_PUBLIC_API_URL,
 *   then http://localhost:5000.
 * - Not marked "use client" — import only from server components, route
 *   handlers, or server-side lib modules.
 */

const API_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

const TIMEOUT_MS = 3_000;

type ApiResponse<T> = { status: string; data: T };

export async function fetchUrl<T>(path: string): Promise<T | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const response = await fetch(`${API_URL}${path}`, {
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timer);
    if (!response.ok) return null;
    const body: unknown = await response.json();
    if (
      typeof body === "object" &&
      body !== null &&
      "status" in body &&
      (body as ApiResponse<T>).status === "ok"
    ) {
      return (body as ApiResponse<T>).data;
    }
    return null;
  } catch {
    return null;
  }
}
