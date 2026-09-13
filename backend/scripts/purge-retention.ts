import "dotenv/config";
import { prisma } from "../src/config/database.js";
import { purgeExpiredData } from "../src/services/retention.service.js";

async function main(): Promise<void> {
  const result = await purgeExpiredData();
  console.log(
    `Retention cleanup complete: ${result.contactsDeleted} contacts and ` +
      `${result.assistantSessionsDeleted} assistant sessions deleted.`,
  );
}

main()
  .catch((error) => {
    console.error("Retention cleanup failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
