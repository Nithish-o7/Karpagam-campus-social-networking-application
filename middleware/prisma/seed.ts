/**
 * KCE Connect — Prisma Seed Script (Phase 11: Database Hardening)
 *
 * Populates the PostgreSQL database with realistic KCE campus data
 * for development and staging environments.
 *
 * Run via:  npx prisma db seed
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL!,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting KCE Connect seed...\n');

  // ── Seed Users ──────────────────────────────────────────────
  const faculty = await prisma.user.upsert({
    where: { rollNumber: 'FAC-ECE-001' },
    update: {},
    create: {
      name: 'Dr. Priya Ramasamy',
      email: 'priya.ramasamy@kce.ac.in',
      rollNumber: 'FAC-ECE-001',
      role: 'faculty',
      department: 'Electronics & Communication Engineering',
      snowTicketRef: null,
    },
  });

  const student = await prisma.user.upsert({
    where: { rollNumber: '20CST042' },
    update: {},
    create: {
      name: 'Nithish Kanna',
      email: 'nithishkanna@kce.ac.in',
      rollNumber: '20CST042',
      role: 'student',
      department: 'Computer Science and Technology',
      snowTicketRef: 'TASK0010042',
    },
  });

  const alumni = await prisma.user.upsert({
    where: { rollNumber: '19IT019' },
    update: {},
    create: {
      name: 'Kavitha Sundaram',
      email: 'kavitha.sundaram@kce.ac.in',
      rollNumber: '19IT019',
      role: 'alumni',
      department: 'Information Technology (2019 Batch)',
      snowTicketRef: null,
    },
  });

  console.log(`✅ Users seeded: ${faculty.name}, ${student.name}, ${alumni.name}`);

  // ── Seed Posts ──────────────────────────────────────────────
  await prisma.post.createMany({
    data: [
      {
        authorId: faculty.id,
        content:
          '📢 Attention CST students! The Internal Assessment 2 results have been uploaded to the portal. Please check your scores and meet your faculty advisor if you have any concerns before the deadline this Friday.\n\nAll the best for your semester exams! 💪',
        hashtags: '#KCE,#Assessment,#StudentPortal',
        likesCount: 87,
        commentsCount: 14,
        timestamp: new Date(Date.now() - 1000 * 60 * 28),
      },
      {
        authorId: student.id,
        content:
          "Just finished setting up our final-year project demo environment! 🚀 We're building an IoT-based smart irrigation system for the campus garden. Presenting at the National Tech Fest next week — wish us luck! 🌱\n\n#FinalYearProject #KCE #IoT",
        hashtags: '#FinalYearProject,#KCE,#IoT',
        likesCount: 124,
        commentsCount: 23,
        timestamp: new Date(Date.now() - 1000 * 60 * 75),
      },
      {
        authorId: alumni.id,
        content:
          "Coming back to the KCE campus after 3 years! The new lab block looks incredible. So proud to be a Karpagamian 🎓❤️\n\nFor juniors: placement season is starting soon. Start your DSA prep NOW. Don't wait. Trust me.",
        hashtags: '#Alumni,#KCE,#Placements',
        likesCount: 203,
        commentsCount: 41,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      },
    ],
    skipDuplicates: true,
  });


  console.log('✅ Posts seeded: 3 campus posts.');
  console.log('\n🎉 Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
