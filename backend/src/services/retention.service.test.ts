import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  contactDeleteMany: vi.fn(),
  chatSessionDeleteMany: vi.fn(),
  transaction: vi.fn(),
}));

vi.mock("../config/database.js", () => ({
  prisma: {
    contact: { deleteMany: mocks.contactDeleteMany },
    chatSession: { deleteMany: mocks.chatSessionDeleteMany },
    $transaction: mocks.transaction,
  },
}));

vi.mock("../config/env.js", () => ({
  env: {
    CONTACT_RETENTION_DAYS: 730,
    ASSISTANT_RETENTION_DAYS: 30,
  },
}));

vi.mock("../config/pino.js", () => ({
  logger: { info: vi.fn(), error: vi.fn() },
}));

import { purgeExpiredData, retentionCutoffs } from "./retention.service.js";

describe("retention cleanup", () => {
  const now = new Date("2026-09-12T12:00:00.000Z");

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.contactDeleteMany.mockResolvedValue({ count: 2 });
    mocks.chatSessionDeleteMany.mockResolvedValue({ count: 3 });
    mocks.transaction.mockImplementation(async (operations: Promise<unknown>[]) =>
      Promise.all(operations),
    );
  });

  it("calculates the configured exclusive cutoffs", () => {
    const cutoffs = retentionCutoffs(now, 730, 30);
    expect(cutoffs.contacts.toISOString()).toBe("2024-09-12T12:00:00.000Z");
    expect(cutoffs.assistantSessions.toISOString()).toBe("2026-08-13T12:00:00.000Z");
  });

  it("deletes only contacts and inactive assistant sessions older than their cutoffs", async () => {
    await expect(purgeExpiredData(now)).resolves.toEqual({
      contactsDeleted: 2,
      assistantSessionsDeleted: 3,
    });

    expect(mocks.contactDeleteMany).toHaveBeenCalledWith({
      where: { createdAt: { lt: new Date("2024-09-12T12:00:00.000Z") } },
    });
    expect(mocks.chatSessionDeleteMany).toHaveBeenCalledWith({
      where: { updatedAt: { lt: new Date("2026-08-13T12:00:00.000Z") } },
    });
    expect(mocks.transaction).toHaveBeenCalledTimes(1);
  });

  it("is safe to run again when no expired rows remain", async () => {
    mocks.contactDeleteMany.mockResolvedValue({ count: 0 });
    mocks.chatSessionDeleteMany.mockResolvedValue({ count: 0 });

    await expect(purgeExpiredData(now)).resolves.toEqual({
      contactsDeleted: 0,
      assistantSessionsDeleted: 0,
    });
  });
});
