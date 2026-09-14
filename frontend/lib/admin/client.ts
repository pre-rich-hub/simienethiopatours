import { adminToast } from "@/lib/admin/toast";

const LOGIN_PATH = "/admin/login";

function parseError(res: Response): Promise<string> {
  return res
    .json()
    .catch(() => ({}))
    .then((body) => body?.message || `Request failed (${res.status})`);
}

function redirectToLogin(expired: boolean) {
  if (typeof window === "undefined") return;
  if (window.location.pathname === LOGIN_PATH) return;
  window.location.href = expired ? `${LOGIN_PATH}?expired=1` : LOGIN_PATH;
}

/**
 * Authenticated read wrapper for the admin API.
 * Calls are same-origin: next.config.ts rewrites /api/:path* to the backend,
 * so the httpOnly admin_session cookie is set on and sent to this origin.
 * On 401: redirects to login (session expired) unless redirectOn401 is false.
 * On non-ok: parses { message } and throws.
 * On ok: parses body.data and returns it.
 */
export async function adminRequestClient<T = unknown>(
  path: string,
  init?: RequestInit & { redirectOn401?: boolean },
): Promise<T | null> {
  const { redirectOn401 = true, ...fetchInit } = init ?? {};
  const url = path;
  const res = await fetch(url, {
    ...fetchInit,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...fetchInit.headers,
    },
  });

  if (res.status === 401) {
    if (redirectOn401) {
      redirectToLogin(true);
      return null;
    }
    return null;
  }

  if (!res.ok) {
    throw new Error(await parseError(res));
  }

  const body = await res.json();
  if (body.warning) adminToast("error", body.warning);
  return (body?.data ?? body) as T;
}

/**
 * Authenticated mutation wrapper (POST/PUT/DELETE) for the admin API.
 * Accepts either a JSON payload or FormData (file uploads).
 * Same-origin via the /api/:path* rewrite, so the admin_session cookie is sent.
 * On 401: sends the user to /admin/login?expired=1.
 * On non-ok: throws with the server's { message } when present.
 * On ok: returns body.data (or the whole body when data is absent).
 */
export async function adminMutate<T = unknown>(
  path: string,
  options: {
    method: "POST" | "PUT" | "DELETE";
    json?: unknown;
    formData?: FormData;
  },
): Promise<T | null> {
  const url = path;
  const isForm = options.formData !== undefined;
  const res = await fetch(url, {
    method: options.method,
    credentials: "include",
    body: isForm ? options.formData : options.json !== undefined ? JSON.stringify(options.json) : undefined,
    headers: isForm
      ? { Accept: "application/json" }
      : { Accept: "application/json", "Content-Type": "application/json" },
  });

  if (res.status === 401) {
    redirectToLogin(true);
    return null;
  }

  if (!res.ok) {
    throw new Error(await parseError(res));
  }

  const body = await res.json();
  if (body.warning) adminToast("error", body.warning);
  return (body?.data ?? body) as T;
}