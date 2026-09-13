import { describe, expect, it, vi } from "vitest";
import { fetchCatalogue } from "./public-catalogue-fetch.js";
const empty = { schemaVersion: 1, tours: [], destinations: [], posts: [] };
const response = (status: number, body?: unknown) => vi.fn(async () => new Response(JSON.stringify(body), { status })) as unknown as typeof fetch;
describe("catalogue fetch outcomes", () => {
  it("treats an intentionally empty catalogue and authoritative 404 as empty success", async () => {
    expect(await fetchCatalogue(response(200, { status: "ok", data: empty }))).toEqual(empty);
    expect(await fetchCatalogue(response(404))).toEqual(empty);
  });
  it.each([500, 502, 503])("allows approved fallback for service failure %s", async status => {
    await expect(fetchCatalogue(response(status))).rejects.toMatchObject({ kind: "service", allowFallback: true });
  });
  it.each([401, 403, 429])("does not hide request rejection %s behind fallback content", async status => {
    await expect(fetchCatalogue(response(status))).rejects.toMatchObject({ kind: "rejected", allowFallback: false });
  });
  it("distinguishes invalid content from network failure", async () => {
    await expect(fetchCatalogue(response(200, { status: "ok", data: {} }))).rejects.toMatchObject({ kind: "invalid" });
    await expect(fetchCatalogue(vi.fn(async () => { throw new Error("Network"); }) as typeof fetch)).rejects.toMatchObject({ kind: "network", allowFallback: true });
  });
  it("applies a one-second request deadline and no independent HTTP cache", async () => {
    const fetcher = response(200, { status: "ok", data: empty });
    await fetchCatalogue(fetcher);
    expect(fetcher).toHaveBeenCalledWith(expect.stringMatching(/\/api\/v1\/catalogue$/), expect.objectContaining({ cache: "no-store", signal: expect.any(AbortSignal) }));
  });
});
