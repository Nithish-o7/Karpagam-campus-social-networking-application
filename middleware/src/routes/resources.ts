import { Router } from 'express';
import { getResources, createResource, upvoteResource } from '../controllers/resourcesController';
import { requireAuth } from '../middleware/authMiddleware';
const router = Router();
router.get('/',              requireAuth, getResources as any);
router.post('/',             requireAuth, createResource as any);
router.post('/:id/upvote',  requireAuth, upvoteResource as any);
export default router;
