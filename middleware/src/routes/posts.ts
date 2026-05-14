import { Router } from 'express';
import { getPosts, createPost, likePost, getComments, addComment, votePoll } from '../controllers/postController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.get('/',                   requireAuth, getPosts as any);
router.post('/',                  requireAuth, createPost as any);
router.post('/:id/like',          requireAuth, likePost as any);
router.get('/:id/comments',       getComments as any);
router.post('/:id/comment',       requireAuth, addComment as any);
router.post('/:id/poll-vote',     requireAuth, votePoll as any);

// Status ping
router.get('/status', (_req, res) => {
  res.json({ module: 'posts', status: 'active', backend: 'PostgreSQL (Prisma)', version: 'v14' });
});

export default router;
