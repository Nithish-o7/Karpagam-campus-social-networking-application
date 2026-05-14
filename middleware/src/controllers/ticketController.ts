/**
 * KCE Connect — Ticket Controller (Phase 11.1: Stabilisation + Hybrid Caching)
 *
 * Architecture:
 *  - POST /api/tickets  → Submits to ServiceNow (live), then caches result in PostgreSQL.
 *  - GET  /api/tickets  → Fetches LIVE from ServiceNow. On success, refreshes local cache.
 *                         On SNOW failure, falls back to cached tickets so the UI isn't blank.
 *  - GET  /api/tickets/:id → Same live-first, cache-fallback pattern.
 *
 * Logging:
 *  - Every SNOW request logs the full URL, payload shape, and response status.
 *  - Every error logs the Axios error code, SNOW error body, and HTTP status returned.
 *  - Submission failures log the exact payload sent so you can trace the issue immediately.
 */
import { Request, Response } from 'express';
import axios, { AxiosError } from 'axios';
import dotenv from 'dotenv';
import prisma from '../db/prisma';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

dotenv.config();

import { 
  SNOW_TABLE_NAME, 
  SNOW_API_PATH, 
  getSnowCredentials, 
  logSnowError 
} from '../config/snow';

interface CreateTicketBody {
  requestType?: string;  // Optional — derived from JWT role if not provided
  phoneNumber:  string;
  category:     string;
  block:        string;
  room?:        string;
  description:  string;
}

/* ── State code → human label ────────────────────────────────── */
const STATE_MAP: Record<string, string> = {
  '1':  'Open',
  '2':  'In Progress',
  '3':  'On Hold',
  '6':  'Resolved',
  '7':  'Closed',
  '-5': 'Pending',
};

/* ── Category mapper ─────────────────────────────────────────── */
const CATEGORY_MAP: Record<string, string> = {
  'Wifi Issues':        'Wifi issues',
  'Lab Issues':         'Lab',
  'Electricity Issues': 'Electricity Issue',
  'Hostel Issues':      'Hostel',
  'Transport Issues':   'Transport',
  'Classroom Issues':   'Classroom',
};





/* ── Ensure & cache user in Postgres ─────────────────────────── */
async function ensureUser(name: string, requestType: string): Promise<string> {
  const rollNumber = name.replace(/\s+/g, '').toLowerCase().slice(0, 50);
  await prisma.user.upsert({
    where:  { rollNumber },
    update: { name },
    create: {
      name,
      rollNumber,
      email:      `${rollNumber}@kce.ac.in`,
      role:       requestType.toLowerCase() || 'student',
      department: 'Karpagam College of Engineering',
    },
  });
  return rollNumber;
}

/* ── Cache a ticket in Postgres ──────────────────────────────── */
async function cacheTicket(params: {
  sysId:         string;
  number:        string;
  status:        string;
  stateCode:     string;
  category:      string;
  description:   string;
  userRollNumber: string;
  snowCreatedAt?: string;
}): Promise<void> {
  try {
    await prisma.cachedTicket.upsert({
      where: { sysId: params.sysId },
      update: {
        status:      params.status,
        stateCode:   params.stateCode,
        category:    params.category,
        description: params.description,
      },
      create: {
        sysId:          params.sysId,
        number:         params.number,
        status:         params.status,
        stateCode:      params.stateCode,
        category:       params.category,
        description:    params.description,
        userRollNumber: params.userRollNumber,
        snowCreatedAt:  params.snowCreatedAt ? new Date(params.snowCreatedAt) : undefined,
      },
    });
    console.log(`🗃️  Cached ticket ${params.number} (${params.sysId}) for user ${params.userRollNumber}`);
  } catch (cacheErr: any) {
    // Cache failure is non-fatal — log and continue
    console.warn(`⚠️  Failed to cache ticket ${params.number}:`, cacheErr.message);
  }
}

/* ══════════════════════════════════════════════════════════════
 * POST /api/tickets — Submit new campus issue to ServiceNow
 * ══════════════════════════════════════════════════════════════ */
export const createTicket = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  // ── Extract user identity from JWT (set by requireAuth middleware) ──
  const jwtUser = req.user;
  if (!jwtUser) {
    res.status(401).json({ success: false, message: 'Authentication required to submit a ticket.' });
    return;
  }

  const { phoneNumber, category, block, room, description } = req.body as CreateTicketBody;

  // Derive requestType from user role if not explicitly provided
  const requestType = (req.body.requestType as string | undefined) || jwtUser.role || 'student';

  // Pull identity fields from the JWT — no manual input needed
  const nameFromJwt = jwtUser.name;

  // 1. Validation
  const requiredFields = { phoneNumber, category, block, description };
  const missingFields  = Object.entries(requiredFields)
    .filter(([, v]) => !v || String(v).trim() === '')
    .map(([k]) => k);

  if (missingFields.length > 0) {
    console.warn(`⚠️  [POST /api/tickets] Validation failed — missing: ${missingFields.join(', ')}`);
    res.status(400).json({
      success: false,
      message: `Missing required fields: ${missingFields.join(', ')}`,
      error:   'VALIDATION_ERROR',
    });
    return;
  }

  // 2. SNOW credentials
  const creds = getSnowCredentials();
  if (!creds) {
    res.status(500).json({
      success: false,
      message: 'Middleware is not configured with ServiceNow credentials.',
    });
    return;
  }

  const { snowUrl, authHeader } = creds;

  // 3. Ensure user exists in local DB (non-blocking)
  let userRollNumber = jwtUser.rollNumber || nameFromJwt.replace(/\s+/g, '').toLowerCase().slice(0, 50);
  try {
    userRollNumber = await ensureUser(nameFromJwt, requestType);
  } catch (dbErr: any) {
    console.warn(`⚠️  User sync to Postgres failed (non-fatal): ${dbErr.message}`);
  }

  // 4. Build SNOW payload — name comes from JWT, not body
  const snowPayload = {
    request_typ0:      requestType,
    name:              nameFromJwt,
    phone_number:      phoneNumber,
    service_category:  CATEGORY_MAP[category] || 'Wifi issues',
    short_description: `[KCE Connect] ${category} at ${block}`,
    block:             block,
    room:              room || '',
    description:       description,
  };

  console.log(`\n📡 [POST /api/tickets] Submitting to ServiceNow...`);
  console.log(`   URL     : ${snowUrl}${SNOW_API_PATH}`);
  console.log(`   Payload : ${JSON.stringify(snowPayload, null, 2)}`);

  try {
    const response = await axios.post(`${snowUrl}${SNOW_API_PATH}`, snowPayload, {
      headers: {
        Authorization:  `Basic ${authHeader}`,
        Accept:         'application/json',
        'Content-Type': 'application/json',
      },
      timeout: 20_000, // 20 s (SNOW dev instances can be slow)
    });

    const { number, sys_id, state, service_category, sys_created_on } = response.data.result;
    console.log(`✅ [POST /api/tickets] Ticket ${number} created (sys_id: ${sys_id})`);

    // 5. Cache the new ticket in Postgres (non-blocking)
    await cacheTicket({
      sysId:          sys_id,
      number,
      status:         STATE_MAP[state] ?? `State ${state}`,
      stateCode:      state,
      category:       service_category || category,
      description:    snowPayload.short_description,
      userRollNumber,
      snowCreatedAt:  sys_created_on,
    });

    // 6. Update user's snowTicketRef with latest ticket number
    try {
      await prisma.user.update({
        where:  { rollNumber: userRollNumber },
        data:   { snowTicketRef: number },
      });
    } catch (_) {
      // Non-fatal — user ref update is best-effort
    }

    res.status(201).json({
      success:    true,
      incidentId: number,
      sys_id,
      message: `Success! Ticket ${number} has been created in ServiceNow.`,
      meta: {
        assignedTo:        'Campus IT Support Group',
        estimatedResponse: 'Within 24 Hours',
        category:          category,
        location:          `${block}${room ? ` / ${room}` : ''}`,
        createdAt:         new Date().toISOString(),
        snowUrl:           `${snowUrl}/nav_to.do?uri=${SNOW_TABLE_NAME}.do?sys_id=${sys_id}`,
      },
    });

  } catch (error: any) {
    logSnowError('POST /api/tickets', error);

    const isTimeout = error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT';
    const httpStatus = error.response?.status || (isTimeout ? 504 : 502);
    const snowMsg    = error.response?.data?.error?.message || error.message;

    res.status(httpStatus).json({
      success: false,
      message: isTimeout
        ? 'ServiceNow is taking too long to respond. Please try again in a moment.'
        : 'Failed to submit ticket to ServiceNow.',
      error:   snowMsg,
      hint:    'Check the middleware terminal for the full payload and SNOW error details.',
    });
  }
};

/* ══════════════════════════════════════════════════════════════
 * GET /api/tickets — List tickets (live SNOW + cache fallback)
 * ══════════════════════════════════════════════════════════════ */
const SYSPARM_FIELDS = [
  'sys_id', 'number', 'service_category', 'short_description',
  'state', 'sys_created_on', 'name', 'request_typ0', 'phone_number', 'description',
].join(',');

export const getUserTickets = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const jwtUser = req.user;
  if (!jwtUser) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const creds = getSnowCredentials();

  // If no credentials, fall straight through to cache
  if (creds) {
    const { snowUrl, authHeader } = creds;
    try {
      console.log(`\n📋 [GET /api/tickets] Fetching from ServiceNow for user ${jwtUser.name}...`);

      const response = await axios.get(`${snowUrl}${SNOW_API_PATH}`, {
        headers: { Authorization: `Basic ${authHeader}`, Accept: 'application/json' },
        params: {
          sysparm_fields:          SYSPARM_FIELDS,
          sysparm_query:           `name=${jwtUser.name}`, // Live tracking for logged-in user
          sysparm_limit:           50,
          sysparm_order_by:        'sys_created_on',
          sysparm_order_direction: 'desc',
        },
        timeout: 20_000,
      });

      const records: any[] = response.data.result || [];
      console.log(`✅ [GET /api/tickets] Got ${records.length} tickets from ServiceNow.`);

      const tickets = records.map((r) => ({
        sys_id:      r.sys_id,
        number:      r.number,
        category:    r.service_category || 'General',
        description: r.short_description || r.description || '—',
        state:       STATE_MAP[r.state] ?? `State ${r.state}`,
        stateCode:   r.state,
        createdAt:   r.sys_created_on,
        name:        r.name,
        requestType: r.request_typ0,
        source:      'live' as const,
      }));

      // Refresh cache in background (non-awaited so response is fast)
      void refreshTicketCache(records).catch((e) =>
        console.warn('⚠️  Background cache refresh failed:', e.message)
      );

      res.json({ success: true, total: tickets.length, tickets });
      return;

    } catch (error: any) {
      logSnowError('GET /api/tickets', error);
      console.warn('⚠️  ServiceNow unavailable — falling back to cached tickets.');
    }
  }

  // FALLBACK: serve from local Postgres cache
  try {
    const cached = await prisma.cachedTicket.findMany({
      where:   { userRollNumber: jwtUser.rollNumber },
      orderBy: { snowCreatedAt: 'desc' },
      take: 50,
    });

    const tickets = cached.map((c) => ({
      sys_id:      c.sysId,
      number:      c.number,
      category:    c.category || 'General',
      description: c.description || '—',
      state:       c.status,
      stateCode:   c.stateCode,
      createdAt:   c.snowCreatedAt?.toISOString(),
      source:      'cache' as const,
    }));

    console.log(`🗄️  Serving ${tickets.length} cached tickets.`);
    res.json({
      success: true,
      total:   tickets.length,
      tickets,
      warning: 'ServiceNow is currently unreachable. Showing last known ticket data.',
    });

  } catch (dbErr: any) {
    console.error('❌ [GET /api/tickets] Cache fallback also failed:', dbErr.message);
    res.status(503).json({
      success: false,
      message: 'Unable to retrieve tickets — both ServiceNow and the local cache are unavailable.',
    });
  }
};

/* ── Background helper: upsert all fetched tickets into cache  */
async function refreshTicketCache(records: any[]): Promise<void> {
  for (const r of records) {
    if (!r.sys_id || !r.number || !r.name) continue;
    const userRollNumber = r.name.replace(/\s+/g, '').toLowerCase().slice(0, 50);

    // Ensure user row exists before creating FK reference
    await prisma.user.upsert({
      where:  { rollNumber: userRollNumber },
      update: {},
      create: {
        name:       r.name,
        rollNumber: userRollNumber,
        email:      `${userRollNumber}@kce.ac.in`,
        role:       r.request_typ0?.toLowerCase() || 'student',
        department: 'Karpagam College of Engineering',
      },
    });

    await cacheTicket({
      sysId:          r.sys_id,
      number:         r.number,
      status:         STATE_MAP[r.state] ?? `State ${r.state}`,
      stateCode:      r.state,
      category:       r.service_category || 'General',
      description:    r.short_description || r.description || '',
      userRollNumber,
      snowCreatedAt:  r.sys_created_on,
    });
  }
  console.log(`🗃️  Cache refresh complete: ${records.length} tickets synced.`);
}

/* ══════════════════════════════════════════════════════════════
 * GET /api/tickets/:id — Single ticket (live + cache fallback)
 * ══════════════════════════════════════════════════════════════ */
export const getTicketById = async (req: Request, res: Response): Promise<void> => {
  const creds = getSnowCredentials();
  const { id } = req.params;

  if (creds) {
    const { snowUrl, authHeader } = creds;
    try {
      const query = id.startsWith('KSR') ? `numberSTARTSWITH${id}` : `sys_id=${id}`;

      const response = await axios.get(`${snowUrl}${SNOW_API_PATH}`, {
        headers: { Authorization: `Basic ${authHeader}`, Accept: 'application/json' },
        params:  { sysparm_query: query, sysparm_limit: 1 },
        timeout: 20_000,
      });

      const records: any[] = response.data.result || [];
      if (records.length === 0) {
        res.status(404).json({ success: false, message: `Ticket ${id} not found.` });
        return;
      }

      const r = records[0];
      res.json({
        success: true,
        ticket: {
          sys_id:      r.sys_id,
          number:      r.number,
          category:    r.service_category || 'General',
          description: r.short_description || r.description || '—',
          state:       STATE_MAP[r.state] ?? `State ${r.state}`,
          stateCode:   r.state,
          createdAt:   r.sys_created_on,
          name:        r.name,
          requestType: r.request_typ0,
          source:      'live',
        },
      });
      return;

    } catch (error: any) {
      logSnowError(`GET /api/tickets/${id}`, error);
      console.warn(`⚠️  Falling back to cached data for ticket ${id}`);
    }
  }

  // FALLBACK: try cache
  try {
    const cached = await prisma.cachedTicket.findFirst({
      where: {
        OR: [
          { sysId: id },
          { number: id },
        ],
      },
    });

    if (!cached) {
      res.status(404).json({ success: false, message: `Ticket ${id} not found.` });
      return;
    }

    res.json({
      success: true,
      ticket: {
        sys_id:      cached.sysId,
        number:      cached.number,
        category:    cached.category || 'General',
        description: cached.description || '—',
        state:       cached.status,
        stateCode:   cached.stateCode,
        createdAt:   cached.snowCreatedAt?.toISOString(),
        source:      'cache',
      },
      warning: 'Showing cached data — ServiceNow may be unreachable.',
    });

  } catch (dbErr: any) {
    console.error(`❌ [GET /api/tickets/${id}] Cache lookup failed:`, dbErr.message);
    res.status(503).json({ success: false, message: 'Unable to retrieve ticket.' });
  }
};
