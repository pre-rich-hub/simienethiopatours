/**
 * Exportable session concurrency + abort helpers for unit tests and runChat.
 */

export const SESSION_LIMIT_REPLY =
  "You've reached the message limit for this conversation. " +
  "Please start a new chat or come back later.";

export const DAILY_LIMIT_REPLY =
  "I've hit the daily question limit. " +
  "Please come back tomorrow, or reach out via the contact form.";

export type InFlightGuard = {
  tryAcquire(sessionId: string): boolean;
  release(sessionId: string): void;
  has(sessionId: string): boolean;
  clear(): void;
};

/** Concurrent request guard — one in-flight stream per session. */
export function createInFlightGuard(): InFlightGuard {
  const inFlight = new Map<string, true>();
  return {
    tryAcquire(sessionId: string): boolean {
      if (inFlight.has(sessionId)) return false;
      inFlight.set(sessionId, true);
      return true;
    },
    release(sessionId: string): void {
      inFlight.delete(sessionId);
    },
    has(sessionId: string): boolean {
      return inFlight.has(sessionId);
    },
    clear(): void {
      inFlight.clear();
    },
  };
}

export type AbortLease = {
  signal: AbortSignal;
  abort: () => void;
  dispose: () => void;
};

/**
 * AbortController + optional timeout. `dispose` clears the timer and is safe to call twice.
 */
export function createAbortLease(timeoutMs: number): AbortLease {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  timer.unref?.();
  let disposed = false;
  const dispose = (): void => {
    if (disposed) return;
    disposed = true;
    clearTimeout(timer);
  };
  return {
    signal: controller.signal,
    abort: () => {
      controller.abort();
      dispose();
    },
    dispose,
  };
}
