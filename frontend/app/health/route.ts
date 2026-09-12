import { NextResponse } from "next/server";

/** Cheap frontend probe. Public pages stay up if the CMS API is down — this does not call the backend. */
export async function GET() {
  return NextResponse.json(
    { ok: true, service: "frontend" },
    {
      headers: {
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex",
      },
    },
  );
}
