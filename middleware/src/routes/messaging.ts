import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware';
import * as messagingController from '../controllers/messagingController';

const router = Router();

router.get('/conversations', requireAuth, messagingController.getConversations);
router.get('/:id', requireAuth, messagingController.getMessages);
router.post('/start', requireAuth, messagingController.startConversation);
router.post('/:id', requireAuth, messagingController.sendMessage);

export default router;
