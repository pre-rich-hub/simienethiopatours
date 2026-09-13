import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createAbortLease,
  createInFlightGuard,
  DAILY_LIMIT_REPLY,
  SESSION_LIMIT_REPLY,
} from "./session-gating.js";
import {
  classifyHandoff,
  dailyCapReached,
  sessionCapReached,
} from "./gating.js";

describe("session shape constants", () => {
  it("exposes stable session and daily limit reply copy", () => {
    expect(SESSION_LIMIT_REPLY).toMatch(/message limit/i);
    expect(SESSION_LIMIT_REPLY).toMatch(/new chat|come back/i);
    expect(DAILY_LIMIT_REPLY).toMatch(/daily question limit/i);
    expect(DAILY_LIMIT_REPLY).toMatch(/contact form|tomorrow/i);
  });
});

describe("createInFlightGuard", () => {
  it("allows the first acquire and rejects concurrent same-session acquires (409 path)", () => {
    const guard = createInFlightGuard();
    expect(guard.tryAcquire("sess-a")).toBe(true);
    expect(guard.has("sess-a")).toBe(true);
    expect(guard.tryAcquire("sess-a")).toBe(false);
    expect(guard.tryAcquire("sess-b")).toBe(true);
    guard.release("sess-a");
    expect(guard.has("sess-a")).toBe(false);
    expect(guard.tryAcquire("sess-a")).toBe(true);
  });

  it("clear removes all in-flight entries", () => {
    const guard = createInFlightGuard();
    guard.tryAcquire("x");
    guard.tryAcquire("y");
    guard.clear();
    expect(guard.has("x")).toBe(false);
    expect(guard.tryAcquire("x")).toBe(true);
  });
});

describe("createAbortLease", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("aborts on timeout and dispose clears the timer without throwing", () => {
    vi.useFakeTimers();
    const lease = createAbortLease(1000);
    expect(lease.signal.aborted).toBe(false);
    vi.advanceTimersByTime(1000);
    expect(lease.signal.aborted).toBe(true);
    expect(() => lease.dispose()).not.toThrow();
    expect(() => lease.dispose()).not.toThrow();
  });

  it("abort() aborts immediately and cleans up the timer", () => {
    vi.useFakeTimers();
    const lease = createAbortLease(60_000);
    lease.abort();
    expect(lease.signal.aborted).toBe(true);
    vi.advanceTimersByTime(60_000);
    // Already aborted; no double-fire side effects expected.
    expect(lease.signal.aborted).toBe(true);
  });
});

describe("session and daily caps", () => {
  it("sessionCapReached when message or token ceiling is hit", () => {
    expect(sessionCapReached(0, 0)).toBe(false);
    expect(sessionCapReached(10_000, 0)).toBe(true);
    expect(sessionCapReached(0, 10_000_000)).toBe(true);
  });

  it("dailyCapReached and classifyHandoff return limit handoff", () => {
    expect(dailyCapReached(0)).toBe(false);
    expect(dailyCapReached(10_000_000)).toBe(true);
    expect(
      classifyHandoff({ messageCount: 10_000, tokenCount: 0 }, 0),
    ).toBe("limit");
    expect(
      classifyHandoff({ messageCount: 0, tokenCount: 0 }, 10_000_000),
    ).toBe("limit");
    expect(classifyHandoff({ messageCount: 0, tokenCount: 0 }, 0)).toBe("none");
  });
});
