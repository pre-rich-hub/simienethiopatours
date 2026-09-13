import { describe, expect, it } from "vitest";
import { isHoneypotFilled, parseInquiry } from "@/lib/inquiry-schema";

describe("inquiry-schema", () => {
  it("accepts a minimal valid inquiry", () => {
    const result = parseInquiry({
      name: "Tevan",
      email: "traveler@example.com",
      message: "Looking for a 4-day classic.",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Tevan");
      expect(result.data.company).toBe("");
    }
  });

  it("rejects missing name or invalid email", () => {
    expect(parseInquiry({ name: "", email: "traveler@example.com" }).success).toBe(false);
    expect(parseInquiry({ name: "Tevan", email: "not-an-email" }).success).toBe(false);
  });

  it("detects honeypot fills", () => {
    expect(isHoneypotFilled({ company: "" })).toBe(false);
    expect(isHoneypotFilled({ company: "Acme Bot Co" })).toBe(true);
  });
});
