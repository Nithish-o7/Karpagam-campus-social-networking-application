// ============================================================
// Prisma Config (Prisma v7)
// Uses the direct TCP postgres:// URL for migrate/push commands.
// The pg adapter is configured in src/db/prisma.ts for runtime.
// ============================================================
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "ts-node --transpile-only prisma/seed.ts",
  },
  datasource: {
    // Use direct TCP URL for CLI commands (migrate, push, studio)
    url: process.env["DIRECT_DATABASE_URL"] ?? process.env["DATABASE_URL"],
  },
});
