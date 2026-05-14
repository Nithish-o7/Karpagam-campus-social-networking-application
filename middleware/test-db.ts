import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

async function test() {
  const connectionString = process.env.DATABASE_URL;
  console.log('Testing connection to:', connectionString);
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    await prisma.$connect();
    console.log('✅ Connected to database');
    const count = await prisma.user.count();
    console.log('User count:', count);
    await prisma.$disconnect();
  } catch (err) {
    console.error('❌ Failed to connect:', err);
    process.exit(1);
  }
}

test();
