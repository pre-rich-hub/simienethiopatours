import { describe, expect, it } from "vitest";
import { tourContentSchema, tourDaySchema } from "./tour-content.js";

describe("canonical tour content contract", () => {
  it("accepts grouped day labels and timed stages", () => {
    const day = tourDaySchema.parse({
      title: "Festival days", subtitle: "Gondar", dayLabel: "1–3",
      paragraphs: ["Arrival and ceremonies."],
      stages: [{ label: "Morning", body: "Local guide briefing." }],
    });
    expect(day.dayLabel).toBe("1–3");
    expect(day.stages).toHaveLength(1);
  });

  it("rejects empty editorial items and unsafe related links", () => {
    expect(() => tourDaySchema.parse({ title: "", paragraphs: [] })).toThrow();
    expect(() => tourContentSchema.shape.related.parse([{ title: "x", body: "y", href: "javascript:alert(1)" }])).toThrow();
  });
});
