import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
export async function POST(request: Request) {
  const secret = process.env.CATALOGUE_REVALIDATE_SECRET;
  const supplied = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;
  if (!secret || Buffer.byteLength(supplied) !== Buffer.byteLength(expected) || !timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  revalidateTag("catalogue", { expire: 0 });
  return Response.json({ revalidated: true });
}
