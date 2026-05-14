/**
 * KCE Connect — Database Module (Phase 11.1)
 *
 * Primary ORM: Prisma Client (src/db/prisma.ts)
 *
 * The raw pg Pool is intentionally disabled when DATABASE_URL uses the
 * prisma+postgres:// protocol (Prisma local dev server), because that protocol
 * is not compatible with the standard pg driver — it requires the Prisma proxy.
 *
 * For production with a real postgresql:// URL, you can re-enable the pool below.
 */
import 'dotenv/config';

const dbUrl = process.env.DATABASE_URL ?? '';
const isPrismaProtocol = dbUrl.startsWith('prisma+postgres://');

/**
 * health check stub — always passes when using Prisma protocol.
 * When using a direct postgresql:// URL, this would do a real TCP check.
 */
export async function checkDBHealth(): Promise<void> {
  if (isPrismaProtocol) {
    console.log('🗃️  DB health check skipped (using Prisma protocol — health managed by Prisma client).');
    return;
  }
  // For direct Postgres connections, a real pg pool would be used here.
  console.log('🗃️  DB configured for direct PostgreSQL connection.');
}

/**
 * Stub for raw SQL queries — use Prisma for all queries in this project.
 * If raw SQL is needed for a specific edge case, import pg Pool from here.
 */
export async function query<T = any>(
  _sql: string,
  _params: any[] = []
): Promise<{ rows: T[]; rowCount: number | null }> {
  throw new Error(
    'Raw pg queries are not supported with prisma+postgres:// protocol. Use Prisma client instead.'
  );
}
