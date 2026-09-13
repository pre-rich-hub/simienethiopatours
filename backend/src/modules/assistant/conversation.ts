import type { ChatTurn } from "./provider.client.js";

/**
 * Build provider chat turns from prior history plus the newest user message.
 * Callers must load history before persisting the newest user message so it
 * is not present twice (once in the tail, once as the trailing append).
 */
export function buildProviderMessages(
  historyTail: ChatTurn[],
  latestUserMessage: string,
): ChatTurn[] {
  return [
    ...historyTail.map((turn) =>
      turn.role === "user"
        ? { role: "user" as const, content: `<user>\n${turn.content}\n</user>` }
        : turn,
    ),
    { role: "user", content: `<user>\n${latestUserMessage}\n</user>` },
  ];
}
