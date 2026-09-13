import { prisma } from "../config/database.js";
import { env } from "../config/env.js";
import { logger } from "../config/pino.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const OPPORTUNISTIC_SWEEP_INTERVAL_MS = 60 * 60 * 1000;

let lastSweepAttempt = 0;

export type RetentionCutoffs = {
  contacts: Date;
  assistantSessions: Date;
};

export type RetentionResult = {
  contactsDeleted: number;
  assistantSessionsDeleted: number;
};

export function retentionCutoffs(
  now = new Date(),
  contactDays = env.CONTACT_RETENTION_DAYS,
  assistantDays = env.ASSISTANT_RETENTION_DAYS,
): RetentionCutoffs {
  return {
    contacts: new Date(now.getTime() - contactDays * DAY_MS),
    assistantSessions: new Date(now.getTime() - assistantDays * DAY_MS),
  };
}

/**
 * Deletes expired public-form and assistant data. Deleting ChatSession rows
 * also removes their ChatMessage rows through the Prisma cascade relation.
 */
export async function purgeExpiredData(now = new Date()): Promise<RetentionResult> {
  const cutoffs = retentionCutoffs(now);
  const [contacts, assistantSessions] = await prisma.$transaction([
    prisma.contact.deleteMany({
      where: { createdAt: { lt: cutoffs.contacts } },
    }),
    prisma.chatSession.deleteMany({
      where: { updatedAt: { lt: cutoffs.assistantSessions } },
    }),
  ]);

  return {
    contactsDeleted: contacts.count,
    assistantSessionsDeleted: assistantSessions.count,
  };
}

/**
 * Serverless-safe fallback: public writes may request a sweep, but at most one
 * attempt is started per warm process per hour. Failures never block a user
 * request and never log personal data.
 */
export function requestRetentionSweep(now = new Date()): void {
  if (now.getTime() - lastSweepAttempt < OPPORTUNISTIC_SWEEP_INTERVAL_MS) return;
  lastSweepAttempt = now.getTime();

  void purgeExpiredData(now)
    .then((result) => {
      logger.info(result, "Retention cleanup complete");
    })
    .catch((error) => {
      logger.error({ err: error }, "Retention cleanup failed");
    });
}
