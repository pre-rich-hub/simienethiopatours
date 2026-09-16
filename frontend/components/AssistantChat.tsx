"use client";

import { Link, useRouter } from "@/i18n/navigation";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useTranslations } from "next-intl";
import { X } from "@/components/Icon";
import { site } from "@/lib/site";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "error";
  text: string;
  incomplete?: boolean;
};

type ErrorKind =
  | "disabled"
  | "rateLimited"
  | "quota"
  | "stream"
  | "validation"
  | "conflict"
  | "unavailable";
type Availability = "ready" | "disabled" | "quota";

type SsePayload = {
  text?: unknown;
  handoff?: { type?: unknown };
};

type JsonPayload = { status?: unknown; message?: unknown; data?: { text?: unknown } };

function classifyStatus(status: number): ErrorKind {
  if (status === 503) return "disabled";
  if (status === 429) return "rateLimited";
  if (status === 400 || status === 422) return "validation";
  if (status === 409) return "conflict";
  return "unavailable";
}

// Reads a POST /api/v1/assistant SSE stream: events are "event: meta|delta|done|error"
// followed by a "data: {...}" line and a blank line separator.
async function readSseStream(
  body: ReadableStream<Uint8Array>,
  onDelta: (text: string) => void,
  onDone: (handoff: "none" | "limit") => void,
  onError: () => void,
): Promise<void> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const handleBlock = (block: string) => {
    let event = "";
    let data = "";
    for (const line of block.split("\n")) {
      if (line.startsWith("event:")) event = line.slice(6).trim();
      else if (line.startsWith("data:")) data = line.slice(5).trim();
    }
    if (!data) return;
    let payload: SsePayload;
    try {
      payload = JSON.parse(data) as SsePayload;
    } catch {
      return;
    }
    if (event === "delta" && typeof payload.text === "string") {
      onDelta(payload.text);
    } else if (event === "done") {
      onDone(payload.handoff?.type === "limit" ? "limit" : "none");
    } else if (event === "error") {
      onError();
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");
    const blocks = buffer.split("\n\n");
    buffer = blocks.pop() ?? "";
    for (const block of blocks) {
      if (block.trim()) handleBlock(block);
    }
  }
  if (buffer.trim()) handleBlock(buffer);
}

function ErrorLinks({
  whatsapp,
  email,
}: {
  whatsapp: string;
  email: string;
}) {
  return (
    <div className="assistant-chat__error-links">
      <a href={site.whatsapp} target="_blank" rel="noreferrer">{whatsapp}</a>
      <a href={`mailto:${site.email}`}>{email}</a>
    </div>
  );
}

const PLAN_HANDOFFS = [
  { journey: "simien-classic", labelKey: "planChipDays3", messageKey: "planMessageDays3" },
  { journey: "simien-essential", labelKey: "planChipDays4", messageKey: "planMessageDays4" },
  { journey: "ras-dashen", labelKey: "planChipSummit", messageKey: "planMessageSummit" },
  { journey: "custom", labelKey: "planChipCustom", messageKey: "planMessageCustom" },
] as const;

function PlanHandoffs({ onClose }: { onClose: () => void }) {
  const t = useTranslations("chat");
  const router = useRouter();
  return (
    <div className="assistant-chat__handoffs" role="group" aria-label={t("planHandoffs")}>
      <p className="assistant-chat__handoffs-label">{t("planHandoffs")}</p>
      <div className="assistant-chat__chips">
        {PLAN_HANDOFFS.map((chip) => {
          const message = t(chip.messageKey);
          const href = { pathname: "/plan", query: { journey: chip.journey, message } } as const;
          return (
            <Link
              key={chip.journey}
              href={href}
              className="assistant-chat__chip"
              onClick={(event) => {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
                event.preventDefault();
                router.push(href);
                onClose();
              }}
            >
              {t(chip.labelKey)}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function AssistantChat({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations("chat");
  const tCta = useTranslations("cta");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [availability, setAvailability] = useState<Availability>("ready");

  const sessionIdRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  // Controllers whose abort was intentional (Start over, panel close, unmount).
  // The catch for that request consults this set before deciding to show an error.
  const intentionalAbortRef = useRef<Set<AbortController>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const locked = streaming || availability !== "ready";

  const errorText = (kind: ErrorKind) => {
    if (kind === "disabled") return t("disabled");
    if (kind === "rateLimited") return t("rateLimited");
    if (kind === "quota") return t("quota");
    if (kind === "stream") return t("streamError");
    if (kind === "validation") return t("validation");
    if (kind === "conflict") return t("conflict");
    return t("unavailable");
  };

  // Desktop only: focusing on a phone opens the keyboard and covers the sheet.
  useEffect(() => {
    if (!open || availability !== "ready") return;
    if (window.matchMedia("(max-width: 720px)").matches) return;
    inputRef.current?.focus();
  }, [open, availability]);

  // Abort the in-flight request, marking it intentional so its catch does not
  // surface an error. No-op when nothing is in flight.
  const abortInFlight = () => {
    const controller = abortRef.current;
    if (!controller) return;
    intentionalAbortRef.current.add(controller);
    controller.abort();
  };

  // Abort an in-flight stream when the panel closes or the component unmounts.
  useEffect(() => {
    if (!open) abortInFlight();
  }, [open]);
  useEffect(() => () => abortInFlight(), []);

  // Keep the newest message in view.
  useEffect(() => {
    const thread = threadRef.current;
    if (thread) thread.scrollTop = thread.scrollHeight;
  }, [messages, streaming]);

  /** Mark or clear a partial assistant reply so it never looks like a finished answer. */
  const failAssistant = (assistantId: string, kind: ErrorKind) => {
    if (kind === "disabled") setAvailability("disabled");
    if (kind === "quota") setAvailability("quota");
    setMessages((prev) => {
      const next = prev
        .map((message) => {
          if (message.id !== assistantId) return message;
          if (message.text === "") return null;
          return { ...message, incomplete: true };
        })
        .filter((message): message is ChatMessage => message != null);
      next.push({
        id: crypto.randomUUID(),
        role: "error",
        text: errorText(kind),
      });
      return next;
    });
  };

  const handleSend = async (event: FormEvent) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || locked) return;

    await sendMessage(text);
  };

  const sendMessage = async (text: string) => {
    if (!text || locked) return;

    if (!sessionIdRef.current) sessionIdRef.current = crypto.randomUUID();
    const controller = new AbortController();
    abortRef.current = controller;
    const assistantId = crypto.randomUUID();

    setInput("");
    setStreaming(true);
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", text },
      { id: assistantId, role: "assistant", text: "" },
    ]);

    try {
      const response = await fetch(`${API_BASE}/api/v1/assistant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionId: sessionIdRef.current }),
        signal: controller.signal,
      });

      if (!response.ok) {
        failAssistant(assistantId, classifyStatus(response.status));
        return;
      }

      if (!response.body) {
        failAssistant(assistantId, "unavailable");
        return;
      }

      const contentType = response.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        // Non-streaming fallback: { status, message, data: { text } }
        const body = (await response.json()) as JsonPayload;
        const reply = body?.data?.text;
        if (typeof reply === "string" && reply.length > 0) {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, text: reply } : m)),
          );
        } else {
          failAssistant(assistantId, "unavailable");
        }
        return;
      }

      if (contentType.includes("text/event-stream")) {
        await readSseStream(
          response.body,
          (delta) => {
            setMessages((prev) =>
              prev.map((m) => (m.id === assistantId ? { ...m, text: m.text + delta } : m)),
            );
          },
          (handoff) => {
            if (handoff === "limit") {
              // Limit reply was streamed as a complete polite message — do not mark it incomplete.
              setAvailability("quota");
              setMessages((prev) => [
                ...prev,
                {
                  id: crypto.randomUUID(),
                  role: "error",
                  text: errorText("quota"),
                },
              ]);
            }
          },
          () => failAssistant(assistantId, "stream"),
        );
        return;
      }

      failAssistant(assistantId, "unavailable");
    } catch {
      if (intentionalAbortRef.current.delete(controller)) {
        // Intentional abort (Start over, panel close, unmount): drop the
        // half-finished reply instead of showing an error.
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      } else {
        failAssistant(assistantId, "unavailable");
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const handleChipClick = (text: string) => {
    sendMessage(text);
  };

  const handleStartOver = () => {
    abortInFlight();
    sessionIdRef.current = crypto.randomUUID();
    setMessages([]);
    setInput("");
    setStreaming(false);
    setAvailability("ready");
  };

  return (
    <div
      className={`floating-contact__panel assistant-chat ${open ? "is-open" : ""}`}
      role="dialog"
      aria-modal="false"
      aria-label={t("dialog")}
      aria-hidden={!open}
      inert={!open}
    >
      <header className="assistant-chat__header">
        <div>
          <h2 className="assistant-chat__title">{t("title")}</h2>
          <p className="assistant-chat__subtitle">
            {availability === "disabled" ? t("disabledSubtitle") : availability === "quota" ? t("quotaSubtitle") : t("subtitle")}
          </p>
        </div>
        <button type="button" className="assistant-chat__close" onClick={onClose} aria-label={tCta("closeAiChat")}>
          <X size={16} />
        </button>
      </header>

      <div className="assistant-chat__thread" ref={threadRef} role="log" aria-live="polite" aria-label={t("messages")}>
        {messages.length === 0 ? (
          <>
            <div className="assistant-chat__message assistant-chat__message--assistant">
              {t("greeting")}
            </div>
            <div className="assistant-chat__chips" role="group" aria-label={t("suggestions")}>
              {[
                t("chipDays"),
                t("chipWildlife"),
                t("chipSummit"),
                t("chipPack"),
              ].map((label) => (
                <button
                  key={label}
                  type="button"
                  className="assistant-chat__chip"
                  onClick={() => handleChipClick(label)}
                  disabled={locked}
                >
                  {label}
                </button>
              ))}
            </div>
            <PlanHandoffs onClose={onClose} />
          </>
        ) : (
          messages.map((message, index) => {
            if (message.role === "error") {
              return (
                <div key={message.id} className="assistant-chat__message assistant-chat__message--error" role="alert">
                  <p>{message.text}</p>
                  <ErrorLinks whatsapp={tCta("whatsapp")} email={t("email")} />
                </div>
              );
            }
            const pending = message.role === "assistant" && message.text === "" && streaming && index === messages.length - 1;
            return (
              <div
                key={message.id}
                className={`assistant-chat__message assistant-chat__message--${message.role}${pending ? " assistant-chat__message--pending" : ""}${message.incomplete ? " assistant-chat__message--incomplete" : ""}`}
                aria-busy={pending || undefined}
              >
                {pending ? (
                  <span className="assistant-chat__thinking">
                    <span className="assistant-chat__dot" aria-hidden="true" />
                    <span className="assistant-chat__dot" aria-hidden="true" />
                    <span className="assistant-chat__dot" aria-hidden="true" />
                    <span className="sr-only">{t("thinking")}</span>
                  </span>
                ) : (
                  <>
                    {message.text}
                    {message.incomplete ? (
                      <p className="assistant-chat__incomplete-note">{t("incomplete")}</p>
                    ) : null}
                  </>
                )}
              </div>
            );
          })
        )}
        {messages.length > 0 ? <PlanHandoffs onClose={onClose} /> : null}
      </div>

      <div className="assistant-chat__toolbar">
        <button type="button" className="assistant-chat__reset" onClick={handleStartOver}>
          {t("startOver")}
        </button>
      </div>

      <form className="assistant-chat__composer" onSubmit={handleSend}>
        <input
          ref={inputRef}
          className="assistant-chat__input"
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          maxLength={2000}
          placeholder={availability === "ready" ? t("placeholder") : t("placeholderUnavailable")}
          disabled={locked}
          aria-label={t("inputAria")}
        />
        <button type="submit" className="assistant-chat__send" disabled={locked || !input.trim()}>
          {streaming ? t("sending") : t("send")}
        </button>
      </form>
    </div>
  );
}
