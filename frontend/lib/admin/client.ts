const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
 * Sends credentials so the httpOnly admin_session cookie is included.
 * That cookie is SameSite=Lax: it is sent when the API is same-site
 * (localhost ports, or a subdomain of the public host). See docs/environments.md.
 * On 401: redirects to login (session expired) unless redirectOn401 is false.
 * On non-ok: parses { message } and throws.
 * On ok: parses body.data and returns it.
 */
export async function adminRequestClient<T = unknown>(
  path: string,
  init?: RequestInit & { redirectOn401?: boolean },
): Promise<T | null> {
  const { redirectOn401 = true, ...fetchInit } = init ?? {};
  const url = `${API_BASE}${path}`;
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
  return (body?.data ?? body) as T;
}

/**
 * Authenticated mutation wrapper (POST/PUT/DELETE) for the admin API.
 * Accepts either a JSON payload or FormData (file uploads).
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
  const url = `${API_BASE}${path}`;
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
  return (body?.data ?? body) as T;
}
