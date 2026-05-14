import 'dotenv/config';
import { PrismaClient } from '../generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

declare global {
  // Prevents multiple Prisma instances during hot reloads in development
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

/**
 * Prisma v7 + pg adapter.
 *
 * Uses the direct TCP postgres:// connection via @prisma/adapter-pg.
 * This is compatible with the Prisma embedded dev server (prisma dev)
 * and any standard PostgreSQL instance.
 */
function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL!;

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: (process.env.NODE_ENV === 'development'
      ? ['error', 'warn']
      : ['error']) as ('query' | 'info' | 'warn' | 'error')[],
  });
}

export const prisma: PrismaClient =
  global.__prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}

export default prisma;
