import { describe, expect, it, vi } from "vitest";
import { CatalogueFetchError, fetchCatalogue } from "./catalogue-contract/public-catalogue-fetch";
import snapshot from "./generated/catalogue.json";

describe("fetchCatalogue resilience", () => {
  it("falls back path: 404 throws with allowFallback instead of empty catalogue", async () => {
    const fetcher = vi.fn(async () => new Response(null, { status: 404 }));
    await expect(fetchCatalogue(fetcher as unknown as typeof fetch)).rejects.toMatchObject({
      kind: "service",
      allowFallback: true,
    } satisfies Partial<CatalogueFetchError>);
  });

  it("rejects an empty destinations payload so the snapshot can be used", async () => {
    const fetcher = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            status: "ok",
            data: { schemaVersion: 1, tours: [], destinations: [], posts: [] },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
    );
    await expect(fetchCatalogue(fetcher as unknown as typeof fetch)).rejects.toMatchObject({
      kind: "invalid",
      allowFallback: true,
    });
  });

  it("accepts a normal catalogue and normalizes northern → explore", async () => {
    const fetcher = vi.fn(
      async () =>
        new Response(JSON.stringify({ status: "ok", data: snapshot.catalogue }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
    );
    const catalogue = await fetchCatalogue(fetcher as unknown as typeof fetch);
    const explore = catalogue.destinations.filter((d) => d.locale === "en" && d.area === "explore");
    expect(explore.length).toBeGreaterThan(0);
    expect(catalogue.destinations.some((d) => d.area === "northern")).toBe(false);
  });
});
