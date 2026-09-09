import { env } from "../../config/env.js";

export type HandoffType = "none" | "limit";

export function sessionCapReached(
  messageCount: number,
  tokenCount: number,
): boolean {
  return (
    messageCount >= env.ASSISTANT_MAX_MESSAGES ||
    tokenCount >= env.ASSISTANT_MAX_SESSION_TOKENS
  );
}

export function dailyCapReached(tokenCount: number): boolean {
  return tokenCount >= env.ASSISTANT_MAX_DAILY_TOKENS;
}

export function classifyHandoff(
  session: { messageCount: number; tokenCount: number },
  dailyTokenCount: number,
): HandoffType {
  if (sessionCapReached(session.messageCount, session.tokenCount)) return "limit";
  if (dailyCapReached(dailyTokenCount)) return "limit";
  return "none";
}

export function estimateTokens(text: string): number {
  return Math.max(1, Math.ceil(text.length / 4));
}
