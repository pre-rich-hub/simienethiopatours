import { describe, expect, it, vi } from "vitest";

const { mediaDelete, mediaCreate } = vi.hoisted(() => ({
  mediaDelete: vi.fn(),
  mediaCreate: vi.fn(),
}));

vi.mock("../../config/database.js", () => ({
  prisma: {
    mediaAsset: {
      create: mediaCreate,
      delete: mediaDelete,
    },
  },
}));

import { DatabaseStorageProvider } from "./database.js";

describe("DatabaseStorageProvider", () => {
  const provider = new DatabaseStorageProvider();

  it("save persists bytes and returns a media URL", async () => {
    mediaCreate.mockResolvedValueOnce({ id: "0f8fad5b-d9cb-469f-a165-70867728950e" });

    const result = await provider.save(
      { buffer: Buffer.from("img"), originalname: "photo.jpg", mimetype: "image/jpeg" },
      "tour",
    );

    expect(mediaCreate).toHaveBeenCalledOnce();
    const data = mediaCreate.mock.calls[0][0].data as any;
    expect(data.content).toBeInstanceOf(Uint8Array);
    expect(data.mimeType).toBe("image/jpeg");
    expect(data.size).toBe(3);

    expect(result.storedPath).toBe("0f8fad5b-d9cb-469f-a165-70867728950e");
    expect(result.url).toBe("/api/v1/media/0f8fad5b-d9cb-469f-a165-70867728950e");
  });

  it("getUrl prefixes the media path", () => {
    const id = "0f8fad5b-d9cb-469f-a165-70867728950e";
    expect(provider.getUrl(id)).toBe(`/api/v1/media/${id}`);
  });

  it("delete accepts ids, relative URLs and absolute URLs; ignores junk", async () => {
    mediaDelete.mockResolvedValue({});

    const id = "0f8fad5b-d9cb-469f-a165-70867728950e";
    await provider.delete(id);
    await provider.delete(`/api/v1/media/${id}`);
    await provider.delete(`api/v1/media/${id}`);
    await provider.delete(`https://api.example.com/api/v1/media/${id}`);
    expect(mediaDelete).toHaveBeenCalledTimes(4);
    expect(mediaDelete).toHaveBeenLastCalledWith({ where: { id } });

    mediaDelete.mockClear();
    await provider.delete("assets/images/tours/TOUR-1.jpg");
    await provider.delete("not-a-uuid");
    expect(mediaDelete).not.toHaveBeenCalled();
  });
});