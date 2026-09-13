import { describe, expect, it } from "vitest";
import { canPublishTranslation, fallbackLocaleStatus } from "./localization.js";

describe("translation publication rules", () => {
  it("only exposes reviewed or published content, with English fallback metadata", () => {
    expect(canPublishTranslation("missing", "fr")).toBe(false);
    expect(canPublishTranslation("reviewed", "en")).toBe(true);
    expect(canPublishTranslation("draft", "fr")).toBe(false);
    expect(fallbackLocaleStatus("fr", "missing")).toEqual({ locale: "fr", status: "missing", fallbackLocale: "en", visible: false });
  });
});
