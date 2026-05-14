import { Router } from 'express';
import { getJobs, createJob } from '../controllers/jobsController';
import { requireAuth } from '../middleware/authMiddleware';
const router = Router();
router.get('/',    requireAuth, getJobs as any);
router.post('/',   requireAuth, createJob as any);
export default router;
