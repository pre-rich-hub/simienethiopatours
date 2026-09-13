import { HttpError } from "../../middleware/error.middleware.js";
import { env } from "../../config/env.js";
import { CatalogContextBuilder, getCatalogContext } from "./context-builder.js";
import { estimateTokens, type HandoffType } from "./gating.js";
import { createProvider } from "./provider.client.js";
import { buildProviderMessages } from "./conversation.js";
import { buildSystemPrompt } from "./prompt.js";
import {
  addSessionTokens,
  atomicallyIncrementDailyUsage,
  createMessage,
  getOrCreateSession,
  getUsageState,
  incrementCounters,
  loadHistoryTail,
  type UsageState,
} from "./session-store.js";
import {
  createAbortLease,
  createInFlightGuard,
  DAILY_LIMIT_REPLY,
  SESSION_LIMIT_REPLY,
} from "./session-gating.js";

export { buildProviderMessages } from "./conversation.js";
export { buildSystemPrompt, ASSISTANT_RULES } from "./prompt.js";
export {
  createAbortLease,
  createInFlightGuard,
  DAILY_LIMIT_REPLY,
  SESSION_LIMIT_REPLY,
} from "./session-gating.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ChatResult = {
  sessionId: string;
  messageId: number | null;
  resumed: boolean;
  handoff: HandoffType;
  politeText: string | null;
  stream: AsyncIterable<{ text: string }> | null;
  abort: () => void;
};

type RunChatInput = {
  sessionId?: string;
  message: string;
  ipHash: string;
};

// ---------------------------------------------------------------------------
// Usage state (for SSE done events and admin endpoints)
// ---------------------------------------------------------------------------

export async function loadUsage(sessionId: string): Promise<UsageState> {
  return getUsageState(sessionId, dateKey());
}

// ---------------------------------------------------------------------------
// In-flight guard (process-local; unit-tested via createInFlightGuard)
// ---------------------------------------------------------------------------

const inFlight = createInFlightGuard();

// ---------------------------------------------------------------------------
// Run chat
// ---------------------------------------------------------------------------

export async function runChat(input: RunChatInput): Promise<ChatResult> {
  const { session, resumed } = await getOrCreateSession(
    input.sessionId,
    input.ipHash,
  );
  const sessionId = session.id;

  if (!inFlight.tryAcquire(sessionId)) {
    throw new HttpError(409, "A request for this session is already in progress");
  }
  const guardTimer = setTimeout(
    () => inFlight.release(sessionId),
    env.ASSISTANT_STREAM_TIMEOUT_MS * 2 + 10000,
  );
  guardTimer.unref?.();

  const release = (): void => {
    clearTimeout(guardTimer);
    inFlight.release(sessionId);
  };

  try {
    const withinSessionCap = await incrementCounters(sessionId);
    if (!withinSessionCap) {
      const tokenCount = estimateTokens(SESSION_LIMIT_REPLY);
      const message = await createMessage(
        sessionId,
        "system",
        SESSION_LIMIT_REPLY,
        tokenCount,
      );
      release();
      return {
        sessionId,
        messageId: message.id,
        resumed,
        handoff: "limit",
        politeText: SESSION_LIMIT_REPLY,
        stream: null,
        abort: () => undefined,
      };
    }

    const userMessageTokenCount = estimateTokens(input.message);
    const reservation = userMessageTokenCount + env.ASSISTANT_MAX_OUTPUT_TOKENS;
    const daily = await atomicallyIncrementDailyUsage(dateKey(), reservation);
    if (!daily.reserved) {
      const tokenCount = estimateTokens(DAILY_LIMIT_REPLY);
      const message = await createMessage(
        sessionId,
        "system",
        DAILY_LIMIT_REPLY,
        tokenCount,
      );
      release();
      return {
        sessionId,
        messageId: message.id,
        resumed,
        handoff: "limit",
        politeText: DAILY_LIMIT_REPLY,
        stream: null,
        abort: () => undefined,
      };
    }

    // Load prior turns before persisting this message so the newest user
    // turn is not duplicated in provider input (history + trailing append).
    const [historyTail, catalog] = await Promise.all([
      loadHistoryTail(sessionId, env.ASSISTANT_MAX_HISTORY_MESSAGES),
      getCatalogContext(new CatalogContextBuilder()),
    ]);

    const userMessage = await createMessage(
      sessionId,
      "user",
      input.message,
      userMessageTokenCount,
    );

    const system = buildSystemPrompt(catalog);
    const messages = buildProviderMessages(historyTail, input.message);

    const provider = createProvider();
    const abortLease = createAbortLease(env.ASSISTANT_STREAM_TIMEOUT_MS);

    let assistantText = "";

    const stream = (async function* () {
      try {
        for await (const delta of provider.streamChat({
          system,
          messages,
          maxOutputTokens: env.ASSISTANT_MAX_OUTPUT_TOKENS,
          signal: abortLease.signal,
        })) {
          assistantText += delta.text;
          yield delta;
        }
      } finally {
        abortLease.dispose();
        release();
        if (assistantText.length > 0) {
          await createMessage(
            sessionId,
            "assistant",
            assistantText,
            estimateTokens(assistantText),
          ).catch(() => undefined);
          await addSessionTokens(
            sessionId,
            userMessageTokenCount + estimateTokens(assistantText),
          ).catch(() => undefined);
        }
      }
    })();

    return {
      sessionId,
      messageId: userMessage.id,
      resumed,
      handoff: "none",
      politeText: null,
      stream,
      abort: () => abortLease.abort(),
    };
  } catch (error) {
    release();
    throw error;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function dateKey(): string {
  const now = new Date();
  const padded = (value: number): string => String(value).padStart(2, "0");
  return `${now.getUTCFullYear()}-${padded(now.getUTCMonth() + 1)}-${padded(now.getUTCDate())}`;
}
