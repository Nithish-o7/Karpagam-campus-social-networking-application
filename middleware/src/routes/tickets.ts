import { Router } from 'express';
import { createTicket, getUserTickets, getTicketById } from '../controllers/ticketController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

/**
 * Ticket Routes — KCE Connect ↔ ServiceNow Bridge (Phase 12: Auth-protected)
 *
 * POST /api/tickets     — Submit new campus issue (requires JWT auth)
 * GET  /api/tickets     — Fetch all ticket history (live + cache fallback)
 * GET  /api/tickets/:id — Get single ticket status
 */

// Health check
router.get('/status', (_req, res) => {
  res.json({ module: 'tickets', status: 'active', auth: 'POST route requires JWT' });
});

// Auth-protected routes — user identity comes from the JWT
router.post('/',    requireAuth, createTicket as any);
router.get('/',     requireAuth, getUserTickets as any);
router.get('/:id',  requireAuth, getTicketById as any);

export default router;
