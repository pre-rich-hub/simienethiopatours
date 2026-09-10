"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ArrowUpRight, X } from "@/components/Icon";
import { site } from "@/lib/site";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "error";
  text: string;
};

type SsePayload = { text?: unknown };

// Shape of the non-streaming JSON fallback: { status, message, data: { text } }
type JsonPayload = { status?: unknown; message?: unknown; data?: { text?: unknown } };

// Reads a POST /api/v1/assistant SSE stream: events are "event: meta|delta|done|error"
// followed by a "data: {...}" line and a blank line separator.
async function readSseStream(
  body: ReadableStream<Uint8Array>,
  onDelta: (text: string) => void,
  onDone: () => void,
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
      onDone();
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

export function AssistantChat({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);

  const sessionIdRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  // Controllers whose abort was intentional (Start over, panel close, unmount).
  // The catch for that request consults this set before deciding to show an error.
  const intentionalAbortRef = useRef<Set<AbortController>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  // Focus the input when the panel opens.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

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

  const pushError = () => {
    setMessages((prev) => {
      const next = prev.slice();
      const last = next[next.length - 1];
      // Drop a trailing empty assistant placeholder so failures do not leave an
      // empty pill behind the error bubble.
      if (last && last.role === "assistant" && last.text === "") next.pop();
      next.push({
        id: crypto.randomUUID(),
        role: "error",
        text: "The assistant is temporarily unavailable. Reach us directly:",
      });
      return next;
    });
  };

  const handleSend = async (event: FormEvent) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || streaming) return;

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

      if (!response.ok || !response.body) {
        pushError();
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
          pushError();
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
          () => undefined,
          () => pushError(),
        );
        return;
      }

      pushError();
    } catch {
      if (intentionalAbortRef.current.delete(controller)) {
        // Intentional abort (Start over, panel close, unmount): drop the
        // half-finished reply instead of showing an error.
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      } else {
        pushError();
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const handleStartOver = () => {
    abortInFlight();
    sessionIdRef.current = crypto.randomUUID();
    setMessages([]);
    setInput("");
    setStreaming(false);
  };

  return (
    <div
      className={`floating-contact__panel assistant-chat ${open ? "is-open" : ""}`}
      role="dialog"
      aria-label="Ask about Gondar and Simien tours"
      aria-hidden={!open}
      inert={!open}
    >
      <header className="assistant-chat__header">
        <div>
          <h2 className="assistant-chat__title">Ask about the tours</h2>
          <p className="assistant-chat__subtitle">
            Instant answers from our catalog. A real person replies within a day for the rest.
          </p>
        </div>
        <button type="button" className="assistant-chat__close" onClick={onClose} aria-label="Close AI chat">
          <X size={16} />
        </button>
      </header>

      <div className="assistant-chat__thread" ref={threadRef} role="log" aria-live="polite" aria-label="Chat messages">
        {messages.length === 0 ? (
          <div className="assistant-chat__message assistant-chat__message--assistant">
            Hello! I can answer questions about our treks, Simien Mountains destinations and travel planning. What would you like to know?
          </div>
        ) : (
          messages.map((message, index) => {
            if (message.role === "error") {
              return (
                <div key={message.id} className="assistant-chat__message assistant-chat__message--error" role="alert">
                  <p>{message.text}</p>
                  <div className="assistant-chat__error-links">
                    <a href={site.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
                    <a href={`mailto:${site.email}`}>Email</a>
                  </div>
                </div>
              );
            }
            return (
              <div
                key={message.id}
                className={`assistant-chat__message assistant-chat__message--${message.role}`}
              >
                {message.text ||
                  (message.role === "assistant" &&
                    streaming &&
                    index === messages.length - 1
                      ? "…"
                      : "")}
              </div>
            );
          })
        )}
      </div>

      <div className="assistant-chat__toolbar">
        <button type="button" className="assistant-chat__reset" onClick={handleStartOver}>
          Start over
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
          placeholder="Ask about our treks…"
          disabled={streaming}
          aria-label="Ask about the tours"
        />
        <button type="submit" className="assistant-chat__send" disabled={streaming || !input.trim()}>
          Send
        </button>
      </form>

      <footer className="assistant-chat__footer">
        <span>Prefer a person?</span>
        <a href={site.whatsapp} target="_blank" rel="noreferrer" onClick={onClose}>
          <span>WhatsApp</span><ArrowUpRight size={12} />
        </a>
        <span aria-hidden="true">·</span>
        <a href={`mailto:${site.email}`} onClick={onClose}>
          <span>Email</span><ArrowUpRight size={12} />
        </a>
        <span aria-hidden="true">·</span>
        <Link href="/plan" onClick={onClose}>
          <span>Plan your journey</span><ArrowUpRight size={12} />
        </Link>
      </footer>
    </div>
  );
}