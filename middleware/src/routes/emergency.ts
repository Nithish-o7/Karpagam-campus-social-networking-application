import { Router } from 'express';
import { triggerEmergency } from '../controllers/emergencyController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

// Phase 13 — Critical Emergency Trigger (Protected by JWT)
router.post('/', requireAuth, triggerEmergency);

export default router;
