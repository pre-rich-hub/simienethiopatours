import { app } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/database.js";
import { logger } from "./config/pino.js";
import { requestRetentionSweep } from "./services/retention.service.js";

const isVercel = Boolean(process.env.VERCEL);
const RETENTION_SWEEP_INTERVAL_MS = 24 * 60 * 60 * 1000;

if (!isVercel) {
  const server = app.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, "Backend API listening");
  });

  const runRetentionSweep = () => requestRetentionSweep();
  runRetentionSweep();
  const retentionTimer = setInterval(runRetentionSweep, RETENTION_SWEEP_INTERVAL_MS);
  retentionTimer.unref();

  async function shutdown() {
    logger.info("Shutting down...");
    clearInterval(retentionTimer);
    await prisma.$disconnect();
    server.close(() => process.exit(0));
  }

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

export default app;
