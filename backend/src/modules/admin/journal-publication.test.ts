import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Request, Response, NextFunction } from "express";

const state = vi.hoisted(() => ({ posts: [] as Array<Record<string, any>>, invalidations: vi.fn() }));
vi.mock("../../config/database.js", () => ({ prisma: { blog: {
  create: vi.fn(async ({ data }: any) => { const row = { id: state.posts.length + 1, category: null, updatedAt: new Date(), ...data }; state.posts.push(row); return row; }),
  findUnique: vi.fn(async ({ where }: any) => state.posts.find(p => p.id === where.id)),
  update: vi.fn(async ({ where, data }: any) => { const row = state.posts.find(p => p.id === where.id)!; Object.assign(row, data, { updatedAt: new Date() }); return row; }),
  delete: vi.fn(async ({ where }: any) => { state.posts = state.posts.filter(p => p.id !== where.id); }),
  findMany: vi.fn(async ({ where }: any) => state.posts.filter(p => !where || p.isPublished && p.publishedAt)),
  findFirst: vi.fn(async ({ where }: any) => state.posts.find(p => p.slug === where.slug && p.isPublished && p.publishedAt)),
} } }));
vi.mock("../../config/env.js", () => ({ env: {}, isProduction: false }));
vi.mock("../../middleware/auth.middleware.js", () => ({ requireAdminAuth: (_req: Request, _res: Response, next: NextFunction) => next() }));
vi.mock("../../middleware/upload.middleware.js", () => ({ uploadFor: () => ({ single: () => (_req: Request, _res: Response, next: NextFunction) => next() }), storedPathForFile: () => "", urlForFile: () => "" }));
vi.mock("../../services/email.service.js", () => ({ sendEmail: vi.fn() }));
vi.mock("../assistant/context-builder.js", () => ({ invalidateCatalogContext: state.invalidations }));
import { adminRouter } from "./admin.routes.js";
import { blogRouter } from "../blog/blog.routes.js";

function call(router: typeof adminRouter, method: string, url: string, body: unknown = {}) {
  return new Promise<{ status: number; body: any }>((resolve, reject) => {
    const req = { method, url, originalUrl: url, path: url, headers: {}, body, params: {}, query: {} } as unknown as Request;
    const res = { statusCode: 200, set: vi.fn(), setHeader: vi.fn(), getHeader: vi.fn(), status(this: Response, code: number) { this.statusCode = code; return this; }, json(this: Response, value: unknown) { resolve({ status: this.statusCode, body: value }); return this; } } as unknown as Response;
    router(req, res, (error?: any) => { if (error) resolve({ status: error.statusCode ?? error.status ?? 500, body: { message: error.message } }); else reject(new Error("No matching route")); });
  });
}
beforeEach(() => {
  state.posts = []; state.invalidations.mockClear();
  vi.stubEnv("CATALOGUE_REVALIDATE_URL", "https://frontend.invalid/api/revalidate");
  vi.stubEnv("CATALOGUE_REVALIDATE_SECRET", "test-only-secret");
  vi.stubGlobal("fetch", vi.fn(async () => new globalThis.Response("{}", { status: 200 })));
});
describe("journal admin/public lifecycle", () => {
  it("creates a draft, publishes, renames without changing URL, unpublishes, and deletes", async () => {
    const created = await call(adminRouter, "POST", "/blog", { blogTitle: "Field story", blogDescription: "Description", content: "An article.", author: "Test author", isPublished: false });
    expect(created.status).toBe(200);
    expect((await call(blogRouter, "GET", "/")).body.data).toEqual([]);
    const id = created.body.data.id;
    await call(adminRouter, "PUT", `/blog/${id}`, { isPublished: true });
    expect((await call(blogRouter, "GET", "/slug/field-story")).status).toBe(200);
    await call(adminRouter, "PUT", `/blog/${id}`, { blogTitle: "Revised story" });
    const renamed = await call(blogRouter, "GET", "/slug/field-story");
    expect(renamed.body.data.blogTitle).toBe("Revised story");
    expect(state.posts[0].publishedAt).toBeInstanceOf(Date);
    await call(adminRouter, "PUT", `/blog/${id}`, { isPublished: false });
    expect((await call(blogRouter, "GET", "/slug/field-story")).status).toBe(404);
    await call(adminRouter, "DELETE", `/blog/${id}`);
    expect(state.posts).toEqual([]);
    expect(state.invalidations).toHaveBeenCalledTimes(5);
    expect(fetch).toHaveBeenCalledWith("https://frontend.invalid/api/revalidate", expect.objectContaining({ method: "POST", headers: { Authorization: "Bearer test-only-secret" } }));
  });
  it("rejects incomplete publication and retains saved drafts", async () => {
    const result = await call(adminRouter, "POST", "/blog", { blogTitle: "Incomplete", isPublished: true });
    expect(result.status).toBe(400);
    expect(state.posts).toHaveLength(0);
    expect(state.invalidations).not.toHaveBeenCalled();
  });
  it("returns a warning when cache invalidation fails without losing the saved record", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("offline"); }));
    const result = await call(adminRouter, "POST", "/blog", { blogTitle: "Saved draft" });
    expect(result.status).toBe(200);
    expect(result.body.warning).toContain("Saved");
    expect(state.posts).toHaveLength(1);
  });
});
