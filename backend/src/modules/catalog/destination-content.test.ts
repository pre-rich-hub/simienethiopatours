import { describe, expect, it } from "vitest";
import { destinationContentSchema } from "./destination-content.js";

describe("destination content contract", () => {
  it("accepts a complete published destination", () => {
    const destination = destinationContentSchema.parse({
      slug: "sankaber", destinationName: "Sankaber", area: "simien", type: "camp",
      location: "Simien Mountains", alsoKnownAs: [], heroTitle: "Sankaber",
      heroAccent: "the classic start.", overview: ["A mountain camp."],
      highlights: ["Escarpment views"], thingsToDo: ["Trekking"], imageUrl: "/images/sankaber.jpg",
      imageAlt: "Sankaber", sourceReferences: ["https://example.com/source"],
      isPublished: true, sortOrder: 1, tourIds: [2],
    });
    expect(destination.area).toBe("simien");
  });

  it("rejects unsupported areas and non-http source references", () => {
    expect(() => destinationContentSchema.parse({
      slug: "test", destinationName: "Test", area: "unknown", type: "other",
      location: null, alsoKnownAs: [], heroTitle: null, heroAccent: null,
      overview: [], highlights: [], thingsToDo: [], imageUrl: null, imageAlt: null,
      sourceReferences: ["javascript:bad"], isPublished: true, sortOrder: 0, tourIds: [],
    })).toThrow();
  });
});
