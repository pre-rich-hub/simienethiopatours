import { app } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/database.js";
import { logger } from "./config/pino.js";

const isVercel = Boolean(process.env.VERCEL);

if (!isVercel) {
  const server = app.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, "Backend API listening");
  });

  async function shutdown() {
    logger.info("Shutting down...");
    await prisma.$disconnect();
    server.close(() => process.exit(0));
  }

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

export default app;
