/**
 * Creates or updates the single admin account. Reads credentials from
 * ADMIN_EMAIL / ADMIN_PASSWORD env vars, falling back to defaults only when
 * the env vars are empty (local development with EMAIL_ENABLED=false).
 *
 * The fallback credentials exist for local bootstrapping only — do not ship
 * them in .env or commit real passwords.
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { env } from "../src/config/env.js";

const prisma = new PrismaClient();

async function main() {
  const email = env.ADMIN_EMAIL || "admin@simienethiopatours.com";
  const password = env.ADMIN_PASSWORD || "admin123456";

  const existing = await prisma.admin.findFirst({ where: { email } });
  const passwordHash = await bcrypt.hash(password, 12);
  const data = { email, name: "Admin", passwordHash };

  if (existing) {
    await prisma.admin.update({ where: { id: existing.id }, data });
    console.log(`Admin updated: ${email}`);
  } else {
    await prisma.admin.create({ data });
    console.log(`Admin created: ${email}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());