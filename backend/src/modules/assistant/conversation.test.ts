import { describe, expect, it } from "vitest";
import { buildProviderMessages } from "./conversation.js";
import {
  ASSISTANT_EVAL_SET,
  EVAL_CATEGORIES,
  EVAL_LOCALES,
  type EvalCategory,
  type EvalLocale,
} from "./eval-set.js";
import { ASSISTANT_RULES, buildSystemPrompt } from "./prompt.js";

describe("buildProviderMessages", () => {
  it("wraps prior user turns and appends the newest message once", () => {
    const messages = buildProviderMessages(
      [
        { role: "user", content: "first question" },
        { role: "assistant", content: "first answer" },
      ],
      "second question",
    );

    expect(messages).toEqual([
      { role: "user", content: "<user>\nfirst question\n</user>" },
      { role: "assistant", content: "first answer" },
      { role: "user", content: "<user>\nsecond question\n</user>" },
    ]);
  });

  it("does not duplicate the newest user message when history already ends with it", () => {
    // Callers must load history before createMessage; this documents the contract:
    // historyTail must omit the message being appended.
    const newest = "already saved?";
    const messages = buildProviderMessages([], newest);
    expect(messages.filter((turn) => turn.role === "user")).toHaveLength(1);
    expect(messages[0]?.content).toBe(`<user>\n${newest}\n</user>`);
  });

  it("preserves assistant turns without user wrappers", () => {
    const messages = buildProviderMessages(
      [{ role: "assistant", content: "prior" }],
      "next",
    );
    expect(messages[0]).toEqual({ role: "assistant", content: "prior" });
    expect(messages[1]?.content).toContain("<user>");
  });

  it("supports a resumed multi-turn session shape", () => {
    const history = [
      { role: "user" as const, content: "q1" },
      { role: "assistant" as const, content: "a1" },
      { role: "user" as const, content: "q2" },
      { role: "assistant" as const, content: "a2" },
    ];
    const messages = buildProviderMessages(history, "q3");
    expect(messages).toHaveLength(5);
    expect(messages.filter((m) => m.role === "user")).toHaveLength(3);
    expect(messages.at(-1)?.content).toBe("<user>\nq3\n</user>");
  });
});

describe("assistant eval set", () => {
  it("covers every required category and locale at least once", () => {
    const categories = new Set(ASSISTANT_EVAL_SET.map((c) => c.category));
    const locales = new Set(ASSISTANT_EVAL_SET.map((c) => c.locale));
    for (const category of EVAL_CATEGORIES) {
      expect(categories.has(category as EvalCategory)).toBe(true);
    }
    for (const locale of EVAL_LOCALES) {
      expect(locales.has(locale as EvalLocale)).toBe(true);
    }
  });

  it("has stable ids, non-empty questions, and forbidden invent-price behaviors on unsafe/booking cases", () => {
    const ids = new Set<string>();
    for (const entry of ASSISTANT_EVAL_SET) {
      expect(entry.id).toMatch(/^[a-z0-9-]+$/);
      expect(ids.has(entry.id)).toBe(false);
      ids.add(entry.id);
      expect(entry.question.trim().length).toBeGreaterThan(8);
      expect(entry.expectedBehaviors.length).toBeGreaterThan(0);
      expect(entry.forbiddenBehaviors.length).toBeGreaterThan(0);
      if (entry.category === "unsafe" || entry.category === "booking") {
        expect(
          entry.forbiddenBehaviors.some((b) => /price|payment|reservation|availability|summit/i.test(b)),
        ).toBe(true);
      }
    }
  });

  it("includes a routes case that requires listing all matching catalogue tours", () => {
    const multiMatch = ASSISTANT_EVAL_SET.filter(
      (entry) =>
        entry.category === "routes" &&
        entry.expectedBehaviors.some((b) =>
          /list(s|ing)?\s+all\s+matching|lists matching published|omits a matching/i.test(b),
        ),
    );
    expect(multiMatch.length).toBeGreaterThan(0);
    expect(
      multiMatch.some((entry) =>
        entry.forbiddenBehaviors.some((b) => /omit/i.test(b)),
      ) ||
        multiMatch.some((entry) =>
          entry.expectedBehaviors.some((b) => /all matching/i.test(b)),
        ),
    ).toBe(true);
  });
});

describe("assistant system prompt rules", () => {
  it("forbids inventing prices and other unsafe claims", () => {
    const joined = ASSISTANT_RULES.join("\n").toLowerCase();
    expect(joined).toMatch(/never invent prices/);
    expect(joined).toMatch(/availability/);
    expect(joined).toMatch(/wildlife sightings/);
    expect(joined).toMatch(/summit success/);
    expect(joined).toMatch(/never confirm bookings/);

    const prompt = buildSystemPrompt({
      sections: ["## Tour packages\ntourName: Demo"],
      tokenEstimate: 10,
      builtAt: new Date(),
      truncated: false,
      locale: "en",
    });
    expect(prompt).toContain("<catalog>");
    expect(prompt).toContain("Demo");
    expect(prompt.toLowerCase()).toContain("never invent prices");
  });

  it("requires listing ALL matching catalogue entries when tours or destinations are requested", () => {
    const joined = ASSISTANT_RULES.join("\n");
    expect(joined).toMatch(/list ALL matching catalog entries/i);
    expect(joined).toMatch(/Completeness beats brevity/i);
    expect(joined).toMatch(/omits a matching catalog entry is a failure/i);

    const prompt = buildSystemPrompt({
      sections: ["## Tour packages\ntourName: A\ntourName: B"],
      tokenEstimate: 10,
      builtAt: new Date(),
      truncated: false,
      locale: "en",
    });
    expect(prompt).toMatch(/list ALL matching catalog entries/i);
  });
});
