import { GoogleGenAI } from "@google/genai";
import { OpenAI } from "openai";
import { env } from "../../config/env.js";

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

export type ChatTurn = { role: "user" | "assistant"; content: string };

export type ChatStreamRequest = {
  system: string;
  messages: ChatTurn[];
  maxOutputTokens: number;
  signal: AbortSignal;
};

// ---------------------------------------------------------------------------
// Provider interface — implement for new LLM backends
// ---------------------------------------------------------------------------

export interface ChatProvider {
  streamChat(req: ChatStreamRequest): AsyncIterable<{ text: string }>;
}

// ---------------------------------------------------------------------------
// OpenAI
// ---------------------------------------------------------------------------

export class OpenAIProvider implements ChatProvider {
  private client: OpenAI | undefined;

  constructor(private opts: { apiKey?: string; baseURL?: string } = {}) {}

  private getClient(): OpenAI {
    if (!this.client) {
      this.client = new OpenAI({
        apiKey: this.opts.apiKey ?? env.OPENAI_API_KEY,
        baseURL: this.opts.baseURL || undefined,
      });
    }
    return this.client;
  }

  async *streamChat(req: ChatStreamRequest): AsyncIterable<{ text: string }> {
    const stream = await this.getClient().chat.completions.create(
      {
        model: env.ASSISTANT_MODEL,
        messages: [{ role: "system", content: req.system }, ...req.messages],
        max_completion_tokens: req.maxOutputTokens,
        stream: true,
      },
      { signal: req.signal },
    );
    for await (const chunk of stream) {
      const text = chunk.choices?.[0]?.delta?.content;
      if (text) yield { text };
    }
  }
}

// ---------------------------------------------------------------------------
// Gemini
// ---------------------------------------------------------------------------

export class GeminiProvider implements ChatProvider {
  private client: GoogleGenAI | undefined;

  private getClient(): GoogleGenAI {
    if (!this.client) this.client = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
    return this.client;
  }

  async *streamChat(req: ChatStreamRequest): AsyncIterable<{ text: string }> {
    const stream = await this.getClient().models.generateContentStream({
      model: env.ASSISTANT_MODEL,
      contents: req.messages.map((message) => ({
        role: message.role,
        parts: [{ text: message.content }],
      })),
      config: {
        systemInstruction: req.system,
        maxOutputTokens: req.maxOutputTokens,
        abortSignal: req.signal,
      },
    });
    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) yield { text };
    }
  }
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function createProvider(): ChatProvider {
  switch (env.ASSISTANT_PROVIDER) {
    case "openai":
      return new OpenAIProvider({ apiKey: env.OPENAI_API_KEY, baseURL: env.OPENAI_BASE_URL || undefined });
    case "groq":
      return new OpenAIProvider({ apiKey: env.GROQ_API_KEY, baseURL: "https://api.groq.com/openai/v1" });
    case "gemini":
      return new GeminiProvider();
    default:
      throw new Error(`Unsupported assistant provider: ${env.ASSISTANT_PROVIDER}`);
  }
}
