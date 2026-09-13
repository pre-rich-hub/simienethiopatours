import { describe, expect, it, vi } from "vitest";

vi.mock("@vercel/blob", () => ({
  put: vi.fn(),
  del: vi.fn(),
}));

// Lazy import after mock is in place.
import { VercelBlobStorageProvider } from "./blob.js";
import { del, put } from "@vercel/blob";

function mockPut(blobUrl: string) {
  // The SDK returns a Blob object; the provider only reads `.url`.
  vi.mocked(put).mockResolvedValueOnce({ url: blobUrl } as any);
}

const PROD_URL =
  "https://1234.public.blob.vercel-storage.com/tour/abc.jpg";

describe("VercelBlobStorageProvider", () => {
  const provider = new VercelBlobStorageProvider();

  it("save posts to blob and returns a public URL", async () => {
    mockPut(PROD_URL);
    vi.mocked(del).mockResolvedValue();

    const result = await provider.save(
      { buffer: Buffer.from("img"), originalname: "photo.jpg", mimetype: "image/jpeg" },
      "tour",
    );

    expect(put).toHaveBeenCalledOnce();
    const [key, body, opts] = vi.mocked(put).mock.calls[0] as any;
    expect(key).toMatch(/^tour\/\d+-\d+\.jpg$/);
    expect(body).toBeInstanceOf(Buffer);
    expect(opts.access).toBe("public");

    expect(result.url).toBe(PROD_URL);
    expect(result.storedPath).toBe(PROD_URL);
  });

  it("getUrl is an identity function", () => {
    expect(provider.getUrl(PROD_URL)).toBe(PROD_URL);
  });

  it("delete calls del only for blob URLs", async () => {
    vi.mocked(del).mockResolvedValue();

    await provider.delete("assets/images/tours/TOUR-1.jpg"); // relative → no-op
    expect(del).not.toHaveBeenCalled();

    await provider.delete("https://example.com/image.jpg");   // external → no-op
    expect(del).not.toHaveBeenCalled();

    await provider.delete(PROD_URL);                          // blob URL → delete
    expect(del).toHaveBeenCalledOnce();
    expect(del).toHaveBeenCalledWith(PROD_URL);
  });
});