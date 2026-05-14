import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { initSocket } from './sockets/socket';

import authRoutes      from './routes/auth';
import postRoutes      from './routes/posts';
import ticketRoutes    from './routes/tickets';
import emergencyRoutes from './routes/emergency';
import campusRoutes    from './routes/campus';
import messagingRoutes from './routes/messaging';
import groupRoutes     from './routes/groups';
import jobRoutes       from './routes/jobs';
import resourceRoutes  from './routes/resources';
import { Router }      from 'express';
import { search }      from './controllers/searchController';
import { requireAuth } from './middleware/authMiddleware';
import prisma from './db/prisma';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3001;

// ── Middleware ────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_ORIGIN,
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, cb) => {
    // Allow curl/Postman (no origin) and any listed origin
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

// ── Health Check (includes live DB status) ──────────────────
let dbReady = false;
app.get('/health', async (_req, res) => {
  let dbStatus = 'connected';
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbReady = true;
  } catch {
    dbStatus = 'unavailable';
    dbReady  = false;
  }
  res.status(dbReady ? 200 : 503).json({
    status:    dbReady ? 'OK' : 'DEGRADED',
    service:   'KCE Connect Middleware',
    database:  dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/posts',     postRoutes);
app.use('/api/tickets',   ticketRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/campus',    campusRoutes);
app.use('/api/messaging', messagingRoutes);
app.use('/api/groups',    groupRoutes);
app.use('/api/jobs',      jobRoutes);
app.use('/api/resources', resourceRoutes);
// Global search
const searchRouter = Router();
searchRouter.get('/', requireAuth as any, search as any);
app.use('/api/search', searchRouter);
app.use('/api/messages', messagingRoutes); // legacy alias kept for compatibility


// ── Global Error Handler ──────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Error]', err.message);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// ── Boot ─────────────────────────────────────────────────────
async function main() {
  // Initialize Sockets
  initSocket(httpServer);

  // Attempt DB connection — log outcome but never crash the HTTP server.
  try {
    await prisma.$connect();
    dbReady = true;
    console.log('🗃️  PostgreSQL via Prisma connected successfully.');
  } catch (err: any) {
    console.error('\n❌ [STARTUP] Could not connect to PostgreSQL!');
    console.error('   Error  :', err.message);
    console.error('   Code   :', err.code ?? 'N/A');
    console.error('   Action : Check DATABASE_URL in .env and ensure Postgres is running.');
    console.error('   Hint   : Run  npx prisma migrate dev  to create the schema.\n');
    // Do NOT exit — allow the server to start so /health and SNOW routes still work.
  }

  httpServer.listen(PORT, () => {
    console.log(`\n🚀 KCE Connect Middleware (Real-time) running on http://localhost:${PORT}`);
    console.log(`   ENV      : ${process.env.NODE_ENV || 'development'}`);
    console.log(`   DATABASE : ${dbReady ? '✅ connected' : '⚠️  NOT connected — fix DATABASE_URL'}`);
    console.log(`   SNOW     : ${process.env.SNOW_INSTANCE_URL || '⚠️  NOT CONFIGURED'}\n`);
  });
}

main();

export default app;
// TS Cache Refresh Nudge: Thu May 14 19:26:44 IST 2026
