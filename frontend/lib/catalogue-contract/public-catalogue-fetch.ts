import { publicCatalogueSchema, type PublicCatalogue } from "./public-catalogue.schema.ts";

export class CatalogueFetchError extends Error {
  constructor(
    public kind: "network" | "service" | "invalid" | "rejected",
    public allowFallback: boolean,
  ) {
    super(`Catalogue ${kind}`);
  }
}

/** Cold API starts often exceed 1s on serverless; keep fallback for real outages. */
const CATALOGUE_TIMEOUT_MS = 5_000;

function assertUsableCatalogue(catalogue: PublicCatalogue): PublicCatalogue {
  if (catalogue.destinations.length === 0) {
    throw new CatalogueFetchError("invalid", true);
  }
  return catalogue;
}

export async function fetchCatalogue(fetcher: typeof fetch = fetch): Promise<PublicCatalogue> {
  const origin = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(
    /\/$/,
    "",
  );
  let response: Response;
  try {
    response = await fetcher(`${origin}/api/v1/catalogue`, {
      cache: "no-store",
      signal: AbortSignal.timeout(CATALOGUE_TIMEOUT_MS),
    });
  } catch {
    throw new CatalogueFetchError("network", true);
  }
  // Never treat missing catalogue as an empty success — fall back to the exported snapshot.
  if (response.status === 404) throw new CatalogueFetchError("service", true);
  if (!response.ok) {
    throw new CatalogueFetchError(response.status >= 500 ? "service" : "rejected", response.status >= 500);
  }
  try {
    const body = await response.json();
    if (body.status !== "ok") throw new Error("Envelope");
    return assertUsableCatalogue(publicCatalogueSchema.parse(body.data));
  } catch (error) {
    if (error instanceof CatalogueFetchError) throw error;
    throw new CatalogueFetchError("invalid", true);
  }
}
