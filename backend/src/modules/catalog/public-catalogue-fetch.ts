import { publicCatalogueSchema, type PublicCatalogue } from "./public-catalogue.schema.ts";
export class CatalogueFetchError extends Error {
  constructor(public kind: "network" | "service" | "invalid" | "rejected", public allowFallback: boolean) { super(`Catalogue ${kind}`); }
}
export async function fetchCatalogue(fetcher: typeof fetch = fetch): Promise<PublicCatalogue> {
  const origin = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
  let response: Response;
  try { response = await fetcher(`${origin}/api/v1/catalogue`, { cache: "no-store", signal: AbortSignal.timeout(1000) }); }
  catch { throw new CatalogueFetchError("network", true); }
  if (response.status === 404) return { schemaVersion: 1, tours: [], destinations: [], posts: [] };
  if (!response.ok) throw new CatalogueFetchError(response.status >= 500 ? "service" : "rejected", response.status >= 500);
  try {
    const body = await response.json();
    if (body.status !== "ok") throw new Error("Envelope");
    return publicCatalogueSchema.parse(body.data);
  } catch { throw new CatalogueFetchError("invalid", true); }
}
